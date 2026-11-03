import Stripe from "stripe";
import { PRICING, priceLookupKey, type BillingPlan } from "../src/shared/pricing";

const key = process.env.STRIPE_SECRET_KEY ?? "";
if (!/^(sk|rk)_test_/.test(key)) throw new Error("Provide a sandbox STRIPE_SECRET_KEY.");
const stripe = new Stripe(key);

async function main() {
  const priceIds: string[] = [];
  const products = await stripe.products.list({ ids: [PRICING.productId] });
  if (!products.data.length) {
    await stripe.products.create({ id: PRICING.productId, name: PRICING.productName, metadata: { application: "swecompanion" } });
  }
  for (const plan of ["monthly", "yearly"] as BillingPlan[]) {
    const expected = PRICING[plan];
    const lookupKey = priceLookupKey(plan);
    const prices = await stripe.prices.list({ lookup_keys: [lookupKey], limit: 1 });
    const existing = prices.data[0];
    if (existing) {
      if (!existing.active || existing.livemode || existing.product !== PRICING.productId ||
        existing.unit_amount !== expected.amount || existing.currency !== PRICING.currency ||
        existing.recurring?.interval !== expected.interval || existing.recurring.interval_count !== 1) {
        throw new Error(`Unexpected catalog price for ${plan}; inspect it before continuing.`);
      }
      console.log(`${plan}: ${existing.id} (unchanged)`);
      priceIds.push(existing.id);
      continue;
    }
    const price = await stripe.prices.create({
      product: PRICING.productId, currency: PRICING.currency, unit_amount: expected.amount,
      recurring: { interval: expected.interval }, lookup_key: lookupKey, nickname: `${PRICING.productName} ${expected.label}`,
    }, { idempotencyKey: `price:${lookupKey}` });
    console.log(`${plan}: ${price.id}`);
    priceIds.push(price.id);
  }
  await stripe.products.update(PRICING.productId, { name: PRICING.productName, default_price: priceIds[0] });
  const configuration = process.env.STRIPE_PORTAL_CONFIGURATION_ID;
  if (configuration) {
    await stripe.billingPortal.configurations.update(configuration, {
      features: { subscription_update: {
        enabled: true, default_allowed_updates: ["price"], proration_behavior: "always_invoice",
        products: [{ product: PRICING.productId, prices: priceIds }],
      } },
    });
    console.log("Portal plan choices updated.");
  }
}

main().catch(() => { console.error("Catalog sync failed. Check sandbox credentials and configuration."); process.exitCode = 1; });

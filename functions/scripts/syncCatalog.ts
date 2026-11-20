import Stripe from "stripe";
import { BILLING_PLANS, PRICING, priceLookupKey } from "../src/shared/pricing";
import { matchesCatalogPrice, portalFeatures } from "../src/catalog";

const key = process.env.STRIPE_SECRET_KEY ?? "";
if (!/^(sk|rk)_test_/.test(key)) throw new Error("Provide a sandbox STRIPE_SECRET_KEY.");
const stripe = new Stripe(key);

async function main() {
  const priceIds: string[] = [];
  const products = await stripe.products.list({ ids: [PRICING.productId] });
  if (!products.data.length) {
    await stripe.products.create({ id: PRICING.productId, name: PRICING.productName, metadata: { application: "swecompanion" } });
  }
  for (const plan of BILLING_PLANS) {
    const expected = PRICING[plan];
    const lookupKey = priceLookupKey(plan);
    const prices = await stripe.prices.list({ lookup_keys: [lookupKey], limit: 1 });
    const existing = prices.data[0];
    if (existing) {
      if (!matchesCatalogPrice(existing, plan)) throw new Error(`Unexpected catalog price for ${plan}; inspect it before continuing.`);
      console.log(`${plan}: ${existing.id} (unchanged)`);
      priceIds.push(existing.id);
      continue;
    }
    const price = await stripe.prices.create({
      product: PRICING.productId, currency: PRICING.currency, unit_amount: expected.amount,
      ...(plan === "monthly" ? { recurring: { interval: PRICING.monthly.interval } } : {}),
      lookup_key: lookupKey, nickname: `${PRICING.productName} — ${expected.label}`,
    }, { idempotencyKey: `price:${lookupKey}` });
    console.log(`${plan}: ${price.id}`);
    priceIds.push(price.id);
  }
  await stripe.products.update(PRICING.productId, { name: PRICING.productName, default_price: priceIds[0] });
  const configuration = process.env.STRIPE_PORTAL_CONFIGURATION_ID;
  if (configuration) {
    await stripe.billingPortal.configurations.update(configuration, {
      features: portalFeatures,
    });
    console.log("Portal plan switching disabled; cancellation and payment management remain available.");
  }
  // Retire old purchase prices without changing any existing customer's agreed subscription.
  for await (const price of stripe.prices.list({ product: PRICING.productId, active: true, limit: 100 })) {
    if (!priceIds.includes(price.id)) await stripe.prices.update(price.id, { active: false });
  }
  // Retired annual/monthly prices must not remain purchasable through previously opened Checkout links.
  for await (const session of stripe.checkout.sessions.list({ status: "open", limit: 100 })) {
    const items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
    if (items.data.some((item) => item.price?.product === PRICING.productId && !priceIds.includes(item.price.id))) {
      await stripe.checkout.sessions.expire(session.id);
    }
  }
}

main().catch(() => { console.error("Catalog sync failed. Check sandbox credentials and configuration."); process.exitCode = 1; });

import Stripe from "stripe";
import { BILLING_PLANS, PRICING, priceLookupKey, productIdForPlan } from "../src/shared/pricing";
import { matchesCatalogPrice, portalFeatures, productDescriptionForPlan } from "../src/catalog";

const key = process.env.STRIPE_SECRET_KEY ?? "";
if (!/^(sk|rk)_test_/.test(key)) throw new Error("Provide a sandbox STRIPE_SECRET_KEY.");
const stripe = new Stripe(key);

async function main() {
  const priceIds: string[] = [];
  for (const plan of BILLING_PLANS) {
    const id = productIdForPlan(plan);
    const name = plan === "threeMonthPass" ? PRICING.threeMonthPass.productName : PRICING.productName;
    const description = productDescriptionForPlan(plan);
    const products = await stripe.products.list({ ids: [id] });
    if (!products.data.length) {
      await stripe.products.create({ id, name, description, images: [PRICING.productImageUrl], metadata: { application: "swecompanion" } });
    } else {
      await stripe.products.update(id, { name, description, images: [PRICING.productImageUrl] });
    }
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
      product: productIdForPlan(plan), currency: PRICING.currency, unit_amount: expected.amount,
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
  // Prepare the new catalog before deployment without breaking Checkout on the old backend.
  if (process.argv.includes("--prepare")) {
    console.log("New catalog prepared; previous purchase prices and links retained until backend deployment.");
    return;
  }
  // Retire old purchase prices without changing any existing customer's agreed subscription.
  for (const product of BILLING_PLANS.map(productIdForPlan)) {
    for await (const price of stripe.prices.list({ product, active: true, limit: 100 })) {
      if (!priceIds.includes(price.id)) await stripe.prices.update(price.id, { active: false });
    }
  }
  // Retired annual/monthly prices must not remain purchasable through previously opened Checkout links.
  for await (const session of stripe.checkout.sessions.list({ status: "open", limit: 100 })) {
    const items = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
    if (items.data.some((item) => BILLING_PLANS.some((plan) => item.price?.product === productIdForPlan(plan)) && !priceIds.includes(item.price!.id))) {
      await stripe.checkout.sessions.expire(session.id);
    }
  }
}

main().catch(() => { console.error("Catalog sync failed. Check sandbox credentials and configuration."); process.exitCode = 1; });

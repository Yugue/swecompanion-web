/** Isolated Stripe sandbox verification. Does not change the published catalog or portal configuration. */
import assert from "node:assert/strict";
import Stripe from "stripe";
import { checkoutPlanOptions, portalFeatures } from "../src/catalog";
import { addCalendarMonths } from "../src/passes";
import { PRICING } from "../src/shared/pricing";
import { hasPaidIntroduction, subscriptionSummary } from "../src/subscriptions";

const key = process.env.STRIPE_SECRET_KEY ?? "";
if (!/^(sk|rk)_test_/.test(key)) throw new Error("A sandbox STRIPE_SECRET_KEY is required.");
const stripe = new Stripe(key, { timeout: 15_000 });
const priceIds: string[] = [];
let clockId: string | undefined;
let configurationId: string | undefined;
let checkoutId: string | undefined;

async function waitForClock() {
  for (let attempt = 0; attempt < 60; attempt++) {
    const clock = await stripe.testHelpers.testClocks.retrieve(clockId!);
    if (clock.status === "ready") return;
    if (clock.status === "internal_failure") throw new Error("Test clock failed.");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error("Test clock did not settle.");
}

async function main() {
  const now = Math.floor(Date.now() / 1000);
  const clock = await stripe.testHelpers.testClocks.create({ frozen_time: now, name: "Three-month renewal verification" });
  clockId = clock.id;
  const customer = await stripe.customers.create({ test_clock: clock.id, name: "Temporary billing verification" });
  const method = await stripe.paymentMethods.attach("pm_card_visa", { customer: customer.id });
  await stripe.customers.update(customer.id, { invoice_settings: { default_payment_method: method.id } });
  for (const plan of ["monthly", "threeMonthPass"] as const) {
    const price = await stripe.prices.create({ product: PRICING.productId, currency: PRICING.currency,
      unit_amount: PRICING[plan].amount, ...(plan === "monthly" ? { recurring: { interval: "month" } } : {}),
      nickname: "Temporary renewal verification" });
    priceIds.push(price.id);
  }
  const options = checkoutPlanOptions("threeMonthPass", "verification", priceIds[1], priceIds[0], now);
  // Exercise the real Checkout request shape without changing existing Checkout links.
  const checkout = await stripe.checkout.sessions.create({ ...options, customer: customer.id,
    payment_method_types: ["card"], success_url: "https://swecompanion.web.app/account?checkout=success",
    cancel_url: "https://swecompanion.web.app/account?checkout=canceled" });
  checkoutId = checkout.id;
  assert.equal(checkout.mode, "subscription");
  assert.equal(checkout.amount_total, PRICING.threeMonthPass.amount);
  const configuration = await stripe.billingPortal.configurations.create({
    features: portalFeatures as Stripe.BillingPortal.ConfigurationCreateParams.Features,
    business_profile: { headline: "Temporary renewal verification" },
  });
  configurationId = configuration.id;
  assert.equal(configuration.features.subscription_cancel.enabled, true);
  assert.equal(configuration.features.subscription_cancel.mode, "at_period_end");
  const end = addCalendarMonths(now, 3);
  const createSubscription = async () => {
    const created = await stripe.subscriptions.create({ customer: customer.id,
      items: [{ price: priceIds[0] }], add_invoice_items: [{ price: priceIds[1], quantity: 1 }],
      trial_end: end + 86400, metadata: options.subscription_data!.metadata,
      default_payment_method: method.id, expand: ["latest_invoice"],
    });
    assert.equal(hasPaidIntroduction(created), true);
    return stripe.subscriptions.update(created.id, { trial_end: end, proration_behavior: "none",
      metadata: { introductoryEnd: String(end) }, expand: ["latest_invoice"] });
  };
  const canceled = await createSubscription();
  assert.equal(hasPaidIntroduction(canceled), true);
  const portal = await stripe.billingPortal.sessions.create({ customer: customer.id, configuration: configuration.id,
    return_url: "https://swecompanion.web.app/account", flow_data: { type: "subscription_cancel",
      subscription_cancel: { subscription: canceled.id } } });
  assert.ok(portal.url);
  const stopped = await stripe.subscriptions.update(canceled.id, { cancel_at_period_end: true, expand: ["latest_invoice"] });
  assert.equal(stopped.trial_end, end);
  assert.equal(subscriptionSummary([stopped]).subscribed, true);
  assert.equal(subscriptionSummary([stopped]).cancelAtPeriodEnd, true);
  const renewing = await createSubscription();
  assert.equal(hasPaidIntroduction(renewing), true);
  assert.equal(subscriptionSummary([renewing]).amount, 34900);
  // Monthly subscriptions limit each advance to two intervals.
  await stripe.testHelpers.testClocks.advance(clock.id, { frozen_time: addCalendarMonths(now, 1) });
  await waitForClock();
  await stripe.testHelpers.testClocks.advance(clock.id, { frozen_time: end });
  await waitForClock();
  // Stripe creates the renewal invoice at the boundary and collects it about an hour later.
  await stripe.testHelpers.testClocks.advance(clock.id, { frozen_time: end + 7200 });
  await waitForClock();
  const ended = await stripe.subscriptions.retrieve(canceled.id, { expand: ["latest_invoice"] });
  assert.equal(ended.status, "canceled");
  assert.equal(subscriptionSummary([ended]).subscribed, false);
  const renewed = await stripe.subscriptions.retrieve(renewing.id, { expand: ["latest_invoice"] });
  assert.equal(renewed.status, "active");
  const invoice = renewed.latest_invoice as Stripe.Invoice;
  assert.equal(invoice.status, "paid");
  assert.equal(invoice.amount_paid, 14900);
  assert.equal(subscriptionSummary([renewed]).plan, "monthly");
  assert.equal(subscriptionSummary([renewed]).amount, 14900);
  const canceledInvoices = await stripe.invoices.list({ subscription: canceled.id });
  assert.equal(canceledInvoices.data.filter((item) => item.amount_paid > 0).length, 1);
  console.log("Verified: $349 upfront; portal cancellation available; canceled access ends at three months without renewal; continuing subscription pays $149 monthly.");
}

async function run() {
  try { await main(); }
  catch (error) {
    // Avoid raw provider errors, which can contain request credentials and customer data.
    console.error("Sandbox verification failed:", error instanceof assert.AssertionError ? error.message :
      error instanceof Stripe.errors.StripeError ? `${error.type}: ${error.message}` : error instanceof Error ? error.message : "Unknown error");
    process.exitCode = 1;
  } finally {
    if (checkoutId) await stripe.checkout.sessions.expire(checkoutId);
    if (clockId) await stripe.testHelpers.testClocks.del(clockId);
    if (configurationId) await stripe.billingPortal.configurations.update(configurationId, { active: false });
    for (const id of priceIds) await stripe.prices.update(id, { active: false });
  }
}

void run();

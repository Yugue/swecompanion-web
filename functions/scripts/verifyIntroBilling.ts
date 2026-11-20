/** Isolated Stripe sandbox verification. Does not change the published catalog or portal configuration. */
import assert from "node:assert/strict";
import Stripe from "stripe";
import { checkoutPlanOptions, portalFeatures } from "../src/catalog";
import { addCalendarMonths, paidPass } from "../src/passes";
import { ensurePaidRenewal } from "../src/renewals";
import { PRICING } from "../src/shared/pricing";
import { hasPaidIntroduction, subscriptionSummary } from "../src/subscriptions";

const key = process.env.STRIPE_SECRET_KEY ?? "";
if (!/^(sk|rk)_test_/.test(key)) throw new Error("A sandbox STRIPE_SECRET_KEY is required.");
const stripe = new Stripe(key, { timeout: 15_000 });
const priceIds: string[] = [];
const checkoutIds: string[] = [];
let clockId: string | undefined;
let configurationId: string | undefined;
let productId: string | undefined;

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
  const clock = await stripe.testHelpers.testClocks.create({ frozen_time: now, name: "Paid three-month renewal verification" });
  clockId = clock.id;
  const product = await stripe.products.create({ name: PRICING.threeMonthPass.productName });
  productId = product.id;
  for (const plan of ["monthly", "threeMonthPass"] as const) {
    const price = await stripe.prices.create({ product: plan === "monthly" ? PRICING.productId : product.id,
      currency: PRICING.currency, unit_amount: PRICING[plan].amount,
      ...(plan === "monthly" ? { recurring: { interval: "month" } } : {}), nickname: "Temporary renewal verification" });
    priceIds.push(price.id);
  }
  const configuration = await stripe.billingPortal.configurations.create({
    features: portalFeatures as Stripe.BillingPortal.ConfigurationCreateParams.Features,
    business_profile: { headline: "Temporary renewal verification" },
  });
  configurationId = configuration.id;
  assert.equal(configuration.features.subscription_cancel.enabled, true);
  assert.equal(configuration.features.subscription_cancel.mode, "at_period_end");

  async function purchase() {
    const customer = await stripe.customers.create({ test_clock: clock.id, name: "Temporary billing verification" });
    const options = checkoutPlanOptions("threeMonthPass", "verification", priceIds[1], priceIds[0]);
    const checkout = await stripe.checkout.sessions.create({ ...options, customer: customer.id, client_reference_id: "verification",
      payment_method_types: ["card"], success_url: "https://www.swecompanion.com/account?checkout=success",
      cancel_url: "https://www.swecompanion.com/account?checkout=canceled" });
    checkoutIds.push(checkout.id);
    assert.equal(checkout.mode, "payment");
    assert.equal(checkout.amount_total, 34900);
    assert.equal(checkout.subscription, null);
    const items = await stripe.checkout.sessions.listLineItems(checkout.id, { expand: ["data.price.product"] });
    assert.equal(items.data.length, 1);
    assert.equal((items.data[0].price!.product as Stripe.Product).name, PRICING.threeMonthPass.productName);
    assert.equal(items.data[0].price!.recurring, null);
    // Exercise actual saved-card payments and the production renewal handler. Hosted card entry remains a browser check.
    const intent = await stripe.paymentIntents.create({ customer: customer.id, amount: 34900, currency: "usd",
      payment_method: "pm_card_visa", payment_method_types: ["card"], setup_future_usage: "off_session",
      confirm: true, expand: ["latest_charge"] });
    const paidSession = { ...checkout, status: "complete", payment_status: "paid", payment_intent: intent.id } as Stripe.Checkout.Session;
    const pass = paidPass({ checkoutId: checkout.id, priceId: priceIds[1], customerId: customer.id, uid: "verification",
      amount: 34900, currency: "usd", months: 3 }, paidSession, items.data, intent.latest_charge as Stripe.Charge);
    assert.ok(pass);
    const subscriptions = await ensurePaidRenewal(stripe, "verification", customer.id, pass, paidSession, [], now);
    const subscription = subscriptions[0];
    assert.ok(hasPaidIntroduction(subscription, pass));
    const again = await ensurePaidRenewal(stripe, "verification", customer.id, pass, paidSession, subscriptions, now);
    assert.equal(again.length, 1);
    assert.equal(again[0].id, subscription.id);
    assert.equal(subscriptionSummary(subscriptions, pass).amount, 34900);
    assert.equal(subscriptionSummary(subscriptions, pass).renewalAmount, 14900);
    assert.equal(subscription.trial_end, addCalendarMonths(pass.startsAt, 3));
    return { customer, subscription, pass, paidSession };
  }
  const canceled = await purchase();
  const portal = await stripe.billingPortal.sessions.create({ customer: canceled.customer.id, configuration: configuration.id,
    return_url: "https://www.swecompanion.com/account", flow_data: { type: "subscription_cancel",
      subscription_cancel: { subscription: canceled.subscription.id } } });
  assert.ok(portal.url);
  const stopped = await stripe.subscriptions.update(canceled.subscription.id, { cancel_at_period_end: true });
  assert.equal(subscriptionSummary([stopped], canceled.pass).subscribed, true);
  assert.equal(subscriptionSummary([stopped], canceled.pass).cancelAtPeriodEnd, true);
  const renewing = await purchase();
  const end = renewing.pass.expiresAt;
  await stripe.testHelpers.testClocks.advance(clock.id, { frozen_time: addCalendarMonths(now, 1) });
  await waitForClock();
  await stripe.testHelpers.testClocks.advance(clock.id, { frozen_time: addCalendarMonths(now, 2) });
  await waitForClock();
  await stripe.testHelpers.testClocks.advance(clock.id, { frozen_time: end });
  await waitForClock();
  await stripe.testHelpers.testClocks.advance(clock.id, { frozen_time: end + 7200 });
  await waitForClock();
  const ended = await stripe.subscriptions.retrieve(stopped.id);
  assert.equal(ended.status, "canceled");
  const replay = await ensurePaidRenewal(stripe, "verification", canceled.customer.id, canceled.pass, canceled.paidSession, [ended], end + 7200);
  assert.equal(replay[0].id, stopped.id);
  assert.equal(replay[0].status, "canceled");
  const renewed = await stripe.subscriptions.retrieve(renewing.subscription.id, { expand: ["latest_invoice"] });
  assert.equal(renewed.status, "active");
  const invoice = renewed.latest_invoice as Stripe.Invoice;
  assert.equal(invoice.status, "paid");
  assert.equal(invoice.amount_paid, 14900);
  assert.equal(subscriptionSummary([renewed], renewing.pass).plan, "monthly");
  const canceledInvoices = await stripe.invoices.list({ subscription: stopped.id });
  assert.equal(canceledInvoices.data.filter((item) => item.amount_paid > 0).length, 0);
  const charges = await stripe.charges.list({ customer: canceled.customer.id });
  assert.equal(charges.data.filter((charge) => charge.paid).length, 1);
  console.log("Verified: one paid three-month PRO introductory purchase item, no Checkout trial; saved-card $149 monthly renewal after three calendar months; portal cancellation and no duplicate renewals.");
}

async function run() {
  try { await main(); }
  catch (error) {
    console.error("Sandbox verification failed:", error instanceof assert.AssertionError ? error.message :
      error instanceof Stripe.errors.StripeError ? `${error.type}: ${error.message}` : error instanceof Error ? error.message : "Unknown error");
    process.exitCode = 1;
  } finally {
    for (const id of checkoutIds) await stripe.checkout.sessions.expire(id);
    if (clockId) await stripe.testHelpers.testClocks.del(clockId);
    if (configurationId) await stripe.billingPortal.configurations.update(configurationId, { active: false });
    for (const id of priceIds) await stripe.prices.update(id, { active: false });
    if (productId) await stripe.products.update(productId, { active: false });
  }
}

void run();

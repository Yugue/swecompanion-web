import assert from "node:assert/strict";
import { test } from "node:test";
import type Stripe from "stripe";
import { addCalendarMonths, paidPass, passSummary, type PassPurchase } from "../src/passes";
import { checkoutPlanOptions, matchesCatalogPrice, portalFeatures } from "../src/catalog";
import { BILLING_PLANS, PRICING, isBillingPlan, priceLookupKey } from "../src/shared/pricing";

const paidAt = Date.UTC(2026, 10, 16, 14, 25) / 1000;
function fixture() {
  const purchase: PassPurchase = {
    checkoutId: "cs_pass", customerId: "cus_owner", uid: "owner", priceId: "price_pass",
    amount: PRICING.threeMonthPass.amount, currency: "usd", months: PRICING.threeMonthPass.months,
  };
  const session = {
    id: purchase.checkoutId, mode: "payment", livemode: false, status: "complete", payment_status: "paid",
    customer: purchase.customerId, client_reference_id: purchase.uid, metadata: { plan: "threeMonthPass" },
    amount_total: purchase.amount, currency: purchase.currency, payment_intent: "pi_pass",
  } as unknown as Stripe.Checkout.Session;
  const items = [{ quantity: 1, price: { id: purchase.priceId, recurring: null } }] as Stripe.LineItem[];
  const charge = {
    id: "ch_pass", livemode: false, paid: true, status: "succeeded", payment_intent: "pi_pass", customer: purchase.customerId,
    amount: purchase.amount, currency: purchase.currency, created: paidAt, refunded: false, disputed: false,
  } as Stripe.Charge;
  return { purchase, session, items, charge };
}

test("only $149 monthly and $349 introductory subscriptions are purchasable", () => {
  assert.deepEqual(BILLING_PLANS, ["monthly", "threeMonthPass"]);
  assert.equal(PRICING.monthly.amount, 14900);
  assert.equal(PRICING.threeMonthPass.amount, 34900);
  assert.equal(PRICING.threeMonthPass.mode, "subscription");
  assert.equal(isBillingPlan("yearly"), false);
  assert.equal(isBillingPlan("threeMonthPass"), true);
  assert.notEqual(priceLookupKey("monthly"), priceLookupKey("threeMonthPass"));
});

test("catalog rejects recurring pass prices and old monthly amounts", () => {
  const price = {
    active: true, livemode: false, product: PRICING.productId, currency: "usd",
    unit_amount: PRICING.threeMonthPass.amount, type: "one_time", recurring: null,
  } as Stripe.Price;
  assert.equal(matchesCatalogPrice(price, "threeMonthPass"), true);
  assert.equal(matchesCatalogPrice({ ...price, type: "recurring", recurring: { interval: "month", interval_count: 3 } } as Stripe.Price, "threeMonthPass"), false);
  assert.equal(matchesCatalogPrice({ ...price, unit_amount: 29900, type: "recurring", recurring: { interval: "month", interval_count: 1 } } as Stripe.Price, "monthly"), false);
  assert.equal(matchesCatalogPrice({ ...price, unit_amount: 14900, type: "recurring", recurring: { interval: "month", interval_count: 1 } } as Stripe.Price, "monthly"), true);
  assert.equal(matchesCatalogPrice({ ...price, livemode: true }, "threeMonthPass"), false);
});

test("paid pass starts at payment, expires at exactly three calendar months, and never renews", () => {
  const { purchase, session, items, charge } = fixture();
  const pass = paidPass(purchase, session, items, charge)!;
  assert.equal(pass.startsAt, paidAt);
  assert.equal(pass.expiresAt, Date.UTC(2027, 1, 16, 14, 25) / 1000);
  assert.equal(passSummary(pass, pass.expiresAt - 1).subscribed, true);
  assert.equal(passSummary(pass, pass.expiresAt).subscribed, false);
  assert.equal(passSummary(pass, pass.startsAt - 1).subscribed, false);
  assert.equal(passSummary(pass, paidAt).cancelAtPeriodEnd, true);
  assert.equal(passSummary(pass, paidAt).billingCycleAnchor, paidAt);
});

test("calendar-month expiry clamps month ends and handles leap years", () => {
  assert.equal(addCalendarMonths(Date.UTC(2026, 0, 31, 12) / 1000, 3), Date.UTC(2026, 3, 30, 12) / 1000);
  assert.equal(addCalendarMonths(Date.UTC(2027, 10, 30, 12) / 1000, 3), Date.UTC(2028, 1, 29, 12) / 1000);
});

test("replayed fulfillment never extends or reactivates an expired pass", () => {
  const { purchase, session, items, charge } = fixture();
  const first = paidPass(purchase, session, items, charge)!;
  const replay = paidPass(purchase, session, items, charge)!;
  assert.deepEqual(replay, first);
  assert.equal(passSummary(replay, first.expiresAt + 1).subscribed, false);
});

test("unpaid, wrong-owner, stale-checkout, wrong-amount and live sessions cannot grant access", () => {
  const { purchase, session, items, charge } = fixture();
  for (const changes of [
    { payment_status: "unpaid" }, { status: "open" }, { customer: "cus_attacker" }, { client_reference_id: "attacker" },
    { id: "cs_old" }, { amount_total: 1 }, { currency: "cad" }, { livemode: true }, { mode: "subscription" },
  ]) assert.equal(paidPass(purchase, { ...session, ...changes } as Stripe.Checkout.Session, items, charge), null);
  assert.equal(paidPass(purchase, session, [{ ...items[0], price: { ...items[0].price!, id: "price_other" } }], charge), null);
  assert.equal(paidPass(purchase, session, [{ ...items[0], quantity: 2 }], charge), null);
  assert.equal(paidPass(purchase, session, [...items, ...items], charge), null);
  assert.equal(paidPass(purchase, session, items, null), null);
  assert.equal(paidPass(purchase, session, items, { ...charge, payment_intent: "pi_other" }), null);
  assert.equal(paidPass(purchase, session, items, { ...charge, paid: false }), null);
});

test("refunded or disputed payments revoke access without changing expiry", () => {
  const { purchase, session, items, charge } = fixture();
  for (const changes of [{ refunded: true }, { disputed: true }]) {
    const pass = paidPass(purchase, session, items, { ...charge, ...changes })!;
    assert.equal(passSummary(pass, paidAt).subscribed, false);
    assert.equal(pass.expiresAt, addCalendarMonths(paidAt, 3));
  }
});

test("intro Checkout charges upfront once and defers a cancellable monthly subscription", () => {
  const intro = checkoutPlanOptions("threeMonthPass", "owner", "price_intro", "price_monthly", paidAt);
  assert.equal(intro.mode, "subscription");
  assert.deepEqual(intro.line_items, [{ price: "price_intro", quantity: 1 }, { price: "price_monthly", quantity: 1 }]);
  assert.equal(intro.subscription_data?.trial_period_days, 92);
  assert.equal(intro.subscription_data?.metadata?.introductoryOffer, "three_month_monthly_v1");
  assert.equal(intro.subscription_data?.metadata?.upfrontAmount, "34900");
  assert.equal(intro.payment_method_collection, "always");
  assert.match(intro.custom_text?.submit?.message ?? "", /149.*month until canceled/);
  const monthly = checkoutPlanOptions("monthly", "owner", "price_monthly", "price_monthly");
  assert.equal(monthly.mode, "subscription");
  assert.deepEqual(monthly.line_items, [{ price: "price_monthly", quantity: 1 }]);
  assert.equal(monthly.subscription_data?.trial_period_days, undefined);
});

test("portal allows cancellation at the paid period end and prevents plan switching", () => {
  assert.deepEqual(portalFeatures.subscription_cancel, { enabled: true, mode: "at_period_end", proration_behavior: "none" });
  assert.equal(portalFeatures.subscription_update?.enabled, false);
  assert.equal(portalFeatures.payment_method_update?.enabled, true);
});

test("new introductory checkout uses a different price key from legacy nonrenewing passes", () => {
  assert.notEqual(priceLookupKey("threeMonthPass"), "swecompanion_pro_threeMonthPass_usd_34900");
});

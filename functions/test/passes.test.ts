import assert from "node:assert/strict";
import { test } from "node:test";
import type Stripe from "stripe";
import { addCalendarMonths, paidPass, passSummary, type PassPurchase } from "../src/passes";
import { checkoutPlanOptions, matchesCatalogPrice } from "../src/catalog";
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

test("only $149 monthly and $349 nonrecurring three-month passes are purchasable", () => {
  assert.deepEqual(BILLING_PLANS, ["monthly", "threeMonthPass"]);
  assert.equal(PRICING.monthly.amount, 14900);
  assert.equal(PRICING.threeMonthPass.amount, 34900);
  assert.equal(PRICING.threeMonthPass.mode, "payment");
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

test("pass Checkout is a single payment with an invoice and no subscription", () => {
  const pass = checkoutPlanOptions("threeMonthPass", "owner");
  assert.equal(pass.mode, "payment");
  assert.equal(pass.subscription_data, undefined);
  assert.equal(pass.invoice_creation?.enabled, true);
  const monthly = checkoutPlanOptions("monthly", "owner");
  assert.equal(monthly.mode, "subscription");
  assert.equal(monthly.payment_intent_data, undefined);
});

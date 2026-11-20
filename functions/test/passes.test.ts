import assert from "node:assert/strict";
import { test } from "node:test";
import type Stripe from "stripe";
import { addCalendarMonths, paidPass, passSummary, type PassPurchase } from "../src/passes";
import { checkoutPlanOptions, matchesCatalogPrice, portalFeatures } from "../src/catalog";
import { BILLING_PLANS, PRICING, isBillingPlan, priceLookupKey } from "../src/shared/pricing";
import { BUSINESS } from "../src/shared/business";

const paidAt = Date.UTC(2026, 10, 16, 14, 25) / 1000;
function fixture() {
  const purchase: PassPurchase = {
    checkoutId: "cs_pass", customerId: "cus_owner", uid: "owner", priceId: "price_pass",
    amount: PRICING.threeMonthPass.amount, currency: "usd", months: PRICING.threeMonthPass.months,
  };
  const session = {
    id: purchase.checkoutId, mode: "payment", livemode: false, status: "complete", payment_status: "paid",
    customer: purchase.customerId, client_reference_id: purchase.uid, metadata: { plan: "threeMonthPass" },
    amount_subtotal: purchase.amount, total_details: { amount_discount: 0, amount_tax: 0, amount_shipping: 0 },
    amount_total: purchase.amount, currency: purchase.currency, payment_intent: "pi_pass",
  } as unknown as Stripe.Checkout.Session;
  const items = [{ quantity: 1, amount_subtotal: purchase.amount, amount_total: purchase.amount, amount_discount: 0, amount_tax: 0, currency: purchase.currency,
    price: { id: purchase.priceId, recurring: null, unit_amount: purchase.amount, currency: purchase.currency } }] as Stripe.LineItem[];
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
  assert.equal(PRICING.threeMonthPass.mode, "payment");
  assert.equal(isBillingPlan("yearly"), false);
  assert.equal(isBillingPlan("threeMonthPass"), true);
  assert.notEqual(priceLookupKey("monthly"), priceLookupKey("threeMonthPass"));
});

test("catalog rejects recurring pass prices and old monthly amounts", () => {
  const price = {
    active: true, livemode: false, product: PRICING.threeMonthPass.productId, currency: "usd",
    unit_amount: PRICING.threeMonthPass.amount, type: "one_time", recurring: null,
  } as Stripe.Price;
  assert.equal(matchesCatalogPrice(price, "threeMonthPass"), true);
  assert.equal(matchesCatalogPrice({ ...price, type: "recurring", recurring: { interval: "month", interval_count: 3 } } as Stripe.Price, "threeMonthPass"), false);
  assert.equal(matchesCatalogPrice({ ...price, product: PRICING.productId, unit_amount: 29900, type: "recurring", recurring: { interval: "month", interval_count: 1 } } as Stripe.Price, "monthly"), false);
  assert.equal(matchesCatalogPrice({ ...price, product: PRICING.productId, unit_amount: 14900, type: "recurring", recurring: { interval: "month", interval_count: 1 } } as Stripe.Price, "monthly"), true);
  assert.equal(matchesCatalogPrice({ ...price, product: PRICING.productId }, "threeMonthPass"), false);
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

test("Stripe discounts change the paid amount while the locked price and subtotal remain required", () => {
  const { purchase, session, items, charge } = fixture();
  const discount = 3490;
  const total = purchase.amount - discount;
  const discounted = { ...session, amount_total: total, total_details: { ...session.total_details!, amount_discount: discount } };
  const lines = [{ ...items[0], amount_total: total, amount_discount: discount }];
  const pass = paidPass(purchase, discounted, lines, { ...charge, amount: total })!;
  assert.equal(pass.amount, 31410);
  assert.equal(pass.expiresAt, addCalendarMonths(paidAt, 3));
  assert.equal(paidPass(purchase, discounted, items, { ...charge, amount: total }), null);
  assert.equal(paidPass(purchase, discounted, lines, charge), null);
  assert.equal(paidPass(purchase, { ...discounted, amount_subtotal: total }, lines, { ...charge, amount: total }), null);
  assert.equal(paidPass(purchase, { ...discounted, total_details: { ...discounted.total_details, amount_discount: -1 } }, lines, { ...charge, amount: total }), null);
});

test("Adaptive Pricing presentment does not replace the verified integration-currency totals", () => {
  const { purchase, session, items, charge } = fixture();
  const presentment_details = { presentment_amount: 50000, presentment_currency: "cad" };
  assert.ok(paidPass(purchase, { ...session, presentment_details }, items, { ...charge, presentment_details }));
  assert.equal(paidPass(purchase, { ...session, amount_total: 50000, currency: "cad", presentment_details }, items, charge), null);
});

test("100% discounts require a matching paid zero-total invoice and cannot manufacture a paid charge", () => {
  const { purchase, session, items } = fixture();
  const invoice = { id: "in_free", customer: purchase.customerId, livemode: false, status: "paid", amount_paid: 0,
    total: 0, currency: "usd", status_transitions: { paid_at: paidAt } } as Stripe.Invoice;
  const discounted = { ...session, payment_status: "no_payment_required" as const, amount_total: 0, payment_intent: null, invoice,
    total_details: { ...session.total_details!, amount_discount: purchase.amount } };
  const lines = [{ ...items[0], amount_total: 0, amount_discount: purchase.amount }];
  const pass = paidPass(purchase, discounted, lines, null)!;
  assert.equal(pass.amount, 0);
  assert.equal(pass.startsAt, paidAt);
  assert.ok(paidPass(purchase, { ...discounted, payment_status: "paid" }, lines, null));
  assert.equal(paidPass(purchase, { ...discounted, invoice: null }, lines, null), null);
  assert.equal(paidPass(purchase, { ...discounted, invoice: { ...invoice, customer: "cus_other" } }, lines, null), null);
  assert.equal(paidPass(purchase, { ...discounted, payment_status: "unpaid" }, lines, null), null);
});

test("intro Checkout has one paid item and no free-trial line, while disclosing monthly renewal", () => {
  const intro = checkoutPlanOptions("threeMonthPass", "owner", "price_intro", "price_monthly");
  assert.equal(intro.mode, "payment");
  assert.deepEqual(intro.line_items, [{ price: "price_intro", quantity: 1 }]);
  assert.equal(intro.subscription_data, undefined);
  assert.equal(intro.payment_intent_data?.setup_future_usage, "off_session");
  assert.equal(intro.invoice_creation?.enabled, true);
  assert.equal(intro.metadata?.monthlyPrice, "price_monthly");
  assert.equal(PRICING.threeMonthPass.productName, "SWECompanion PRO 3-month membership");
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
  assert.notEqual(priceLookupKey("threeMonthPass"), "swecompanion_pro_threeMonthPass_usd_34900_monthly_14900_renewal_v1");
});

test("both plans display the business name and production-domain legal, refund and support links", () => {
  for (const plan of BILLING_PLANS) {
    const options = checkoutPlanOptions(plan, "owner", "price_plan", "price_monthly");
    assert.equal(options.branding_settings?.display_name, "SWECompanion");
    assert.equal(options.branding_settings?.background_color, "#ffffff");
    assert.equal(options.branding_settings?.icon?.type, "url");
    assert.equal(options.allow_promotion_codes, true);
    assert.equal(options.adaptive_pricing?.enabled, true);
    const message = options.custom_text?.after_submit?.message ?? "";
    for (const path of ["/terms", "/privacy", "/refund-policy", "/contact"]) {
      assert.ok(message.includes(`${BUSINESS.siteUrl}${path}`), `${plan}: ${path}`);
    }
    assert.match(message, /support@swecompanion\.com/);
    assert.match(message, /case-by-case.*approval is not guaranteed/);
    assert.doesNotMatch(message, /swecompanion\.web\.app/);
    assert.ok(message.length <= 1200);
  }
});

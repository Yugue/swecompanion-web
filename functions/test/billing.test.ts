import assert from "node:assert/strict";
import { test } from "node:test";
import type Stripe from "stripe";
import { hasPaidIntroduction, subscriptionSummary } from "../src/subscriptions";
import { PRICING } from "../src/shared/pricing";
import { authErrorMessage } from "../../src/lib/authErrors";

function subscription(overrides: Partial<Stripe.Subscription> = {}): Stripe.Subscription {
  return {
    id: "sub_test", created: 100, livemode: false, status: "active", cancel_at_period_end: false,
    items: { data: [{ current_period_end: 200, price: {
      product: PRICING.productId, currency: PRICING.currency, unit_amount: PRICING.monthly.amount,
      recurring: { interval: "month" },
    } }] },
    ...overrides,
  } as Stripe.Subscription;
}

test("paid active subscriptions grant access", () => {
  assert.equal(subscriptionSummary([subscription()]).subscribed, true);
});

test("monthly and legacy annual subscriptions retain their original billing anchor", () => {
  for (const interval of ["month", "year"] as const) {
    const value = subscription({ billing_cycle_anchor: 123 });
    value.items.data[0].price.recurring!.interval = interval;
    const result = subscriptionSummary([value]);
    assert.equal(result.billingCycleAnchor, 123);
    assert.equal(result.plan, interval === "year" ? "yearly" : "monthly");
  }
  assert.equal(subscriptionSummary([subscription()]).billingCycleAnchor, 100);
  assert.equal(subscriptionSummary([]).billingCycleAnchor, null);
});

test("canceling renewal preserves access through the paid period", () => {
  const result = subscriptionSummary([subscription({ cancel_at_period_end: true })]);
  assert.equal(result.subscribed, true);
  assert.equal(result.status, "active");
  assert.equal(result.cancelAtPeriodEnd, true);
});

test("cancellation, failed payments, incomplete checkout, and pauses do not grant access", () => {
  for (const status of ["canceled", "past_due", "unpaid", "incomplete", "incomplete_expired", "paused", "trialing"] as const) {
    assert.equal(subscriptionSummary([subscription({ status })]).subscribed, false, status);
  }
});

test("portal cancellation with an explicit end timestamp preserves access until it takes effect", () => {
  const result = subscriptionSummary([subscription({ cancel_at: 200, cancel_at_period_end: false })]);
  assert.equal(result.subscribed, true);
  assert.equal(result.cancelAtPeriodEnd, true);
});

test("an older canceled subscription cannot revoke a current active subscription", () => {
  const result = subscriptionSummary([subscription({ status: "canceled", created: 500 }), subscription()]);
  assert.equal(result.subscribed, true);
});

test("unrelated products and live-mode subscriptions cannot unlock sandbox access", () => {
  const unrelated = subscription();
  unrelated.items.data[0].price.product = "some_other_product";
  assert.equal(subscriptionSummary([unrelated]).subscribed, false);
  assert.equal(subscriptionSummary([subscription({ livemode: true })]).subscribed, false);
});

test("an expanded product is recognized and an empty history is free", () => {
  const expanded = subscription();
  expanded.items.data[0].price.product = { id: PRICING.productId } as Stripe.Product;
  assert.equal(subscriptionSummary([expanded]).subscribed, true);
  assert.equal(subscriptionSummary([]).status, "none");
});

test("invalid email and password failures have exactly the same public message", () => {
  const expected = "Incorrect email or password.";
  for (const code of ["auth/invalid-email", "auth/wrong-password", "auth/invalid-credential", "auth/user-not-found", "auth/user-disabled"]) {
    assert.equal(authErrorMessage({ code }), expected);
  }
});

test("provider details and stack traces never become public messages", () => {
  const failure = { code: "unknown", message: "Firebase Stripe internal diagnostic", stack: "secret stack trace" };
  for (const mode of ["signin", "signup", "reset", "password"] as const) {
    assert.doesNotMatch(authErrorMessage(failure, mode) ?? "", /Firebase|Stripe|diagnostic|stack/i);
  }
});

function introduction(): Stripe.Subscription {
  const value = subscription({ status: "trialing", trial_start: 100, trial_end: 1000, billing_cycle_anchor: 1000,
    customer: "cus_intro", metadata: { introductoryOffer: "three_month_monthly_v1", upfrontPrice: "price_intro",
      upfrontAmount: "34900", upfrontCurrency: "usd" } });
  value.latest_invoice = {
    id: "in_intro", livemode: false, status: "paid", billing_reason: "subscription_create", customer: "cus_intro",
    amount_paid: 34900, currency: "usd", parent: { subscription_details: { subscription: value.id } },
    lines: { has_more: false, data: [{ amount: 34900, quantity: 1, pricing: { price_details: { price: "price_intro" } } }] },
  } as Stripe.Invoice;
  return value;
}

test("a paid introduction grants three-month access with a monthly renewal amount and original usage anchor", () => {
  const result = subscriptionSummary([introduction()]);
  assert.equal(result.subscribed, true);
  assert.equal(result.plan, "threeMonthPass");
  assert.equal(result.amount, 34900);
  assert.equal(result.renewalAmount, 14900);
  assert.equal(result.currentPeriodEnd, 1000);
  assert.equal(result.billingCycleAnchor, 100);
  assert.equal(result.cancelAtPeriodEnd, false);
});

test("canceling monthly renewal during the introduction retains paid access", () => {
  const value = introduction();
  value.cancel_at_period_end = true;
  value.cancel_at = 1000;
  const result = subscriptionSummary([value]);
  assert.equal(result.subscribed, true);
  assert.equal(result.currentPeriodEnd, 1000);
  assert.equal(result.cancelAtPeriodEnd, true);
  value.status = "canceled";
  assert.equal(subscriptionSummary([value]).subscribed, false);
});

test("unpaid, zero-cost, wrong-owner and mismatched introductory invoices fail closed", () => {
  for (const changes of [{ status: "open" }, { amount_paid: 0 }, { customer: "cus_other" }, { livemode: true },
    { amount_paid: 1 }, { currency: "cad" }, { billing_reason: "subscription_cycle" }, { parent: null }]) {
    const value = introduction();
    value.latest_invoice = { ...(value.latest_invoice as Stripe.Invoice), ...changes } as Stripe.Invoice;
    assert.equal(hasPaidIntroduction(value), false, JSON.stringify(changes));
    assert.equal(subscriptionSummary([value]).subscribed, false);
  }
  const value = introduction();
  value.latest_invoice = "in_not_expanded";
  assert.equal(subscriptionSummary([value]).subscribed, false);
  value.latest_invoice = null;
  assert.equal(subscriptionSummary([value]).subscribed, false);
  value.latest_invoice = introduction().latest_invoice;
  (value.latest_invoice as Stripe.Invoice).lines.data[0].pricing!.price_details!.price = "price_other";
  assert.equal(subscriptionSummary([value]).subscribed, false);
});

test("after introduction, only the regular monthly amount is shown and failed renewal revokes access", () => {
  const value = introduction();
  value.status = "active";
  value.items.data[0].current_period_end = 2000;
  const result = subscriptionSummary([value]);
  assert.equal(result.plan, "monthly");
  assert.equal(result.amount, 14900);
  assert.equal(result.renewalAmount, undefined);
  assert.equal(result.currentPeriodEnd, 2000);
  assert.equal(result.billingCycleAnchor, 100);
  value.status = "past_due";
  assert.equal(subscriptionSummary([value]).subscribed, false);
});

test("a newer canceled subscription cannot hide a paid introduction", () => {
  assert.equal(subscriptionSummary([subscription({ status: "canceled", created: 500 }), introduction()]).subscribed, true);
});

import assert from "node:assert/strict";
import { test } from "node:test";
import type Stripe from "stripe";
import { subscriptionSummary } from "../src/subscriptions";
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

test("both plans publish the trusted original billing anchor for monthly usage windows", () => {
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

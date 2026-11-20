import assert from "node:assert/strict";
import { test } from "node:test";
import type Stripe from "stripe";
import { PAID_INTRODUCTION } from "../src/catalog";
import { ensurePaidRenewal } from "../src/renewals";
import { addCalendarMonths, type PassEntitlement } from "../src/passes";
import { hasPaidIntroduction, subscriptionSummary } from "../src/subscriptions";
import { PRICING } from "../src/shared/pricing";

function fixture() {
  const startsAt = Date.UTC(2026, 10, 30, 12) / 1000;
  const pass: PassEntitlement = { checkoutId: "cs_paid", customerId: "cus_owner", startsAt,
    expiresAt: addCalendarMonths(startsAt, 3), amount: 34900, currency: "usd", revoked: false };
  const session = { id: pass.checkoutId, payment_intent: "pi_paid",
    metadata: { introductoryOffer: PAID_INTRODUCTION, monthlyPrice: "price_monthly" } } as unknown as Stripe.Checkout.Session;
  const intent = { status: "succeeded", customer: "cus_owner", payment_method: "pm_saved", setup_future_usage: "off_session" };
  const requests: Stripe.SubscriptionCreateParams[] = [];
  const cancellations: string[] = [];
  let renewal: Stripe.Subscription;
  const stripe = {
    paymentIntents: { retrieve: async () => intent },
    subscriptions: {
      create: async (params: Stripe.SubscriptionCreateParams, options: Stripe.RequestOptions) => {
        assert.equal(options.idempotencyKey, `paid-renewal:${pass.checkoutId}`);
        requests.push(params);
        renewal = { id: "sub_renewal", status: "trialing", created: startsAt + 60, customer: params.customer,
          trial_end: params.trial_end, metadata: params.metadata, livemode: false,
          items: { data: [{ current_period_end: pass.expiresAt,
            price: { product: PRICING.productId, unit_amount: 14900, currency: "usd", recurring: { interval: "month" } } }] } } as Stripe.Subscription;
        return renewal;
      },
      cancel: async (id: string) => { cancellations.push(id); return { ...renewal, id, status: "canceled" }; },
    },
  } as unknown as Stripe;
  const ensure = (subscriptions: Stripe.Subscription[] = [], now = startsAt + 120) =>
    ensurePaidRenewal(stripe, "owner", "cus_owner", pass, session, subscriptions, now);
  return { pass, session, intent, requests, cancellations, ensure };
}

test("verified upfront purchase creates exactly one monthly renewal at three calendar months from payment", async () => {
  const { pass, requests, ensure } = fixture();
  const subscriptions = await ensure();
  assert.equal(requests.length, 1);
  assert.deepEqual(requests[0].items, [{ price: "price_monthly", quantity: 1 }]);
  assert.equal(requests[0].default_payment_method, "pm_saved");
  assert.equal(requests[0].trial_end, Date.UTC(2027, 1, 28, 12) / 1000);
  assert.equal(hasPaidIntroduction(subscriptions[0], pass), true);
  const summary = subscriptionSummary(subscriptions, pass);
  assert.equal(summary.subscribed, true);
  assert.equal(summary.amount, 34900);
  assert.equal(summary.renewalAmount, 14900);
  assert.equal(summary.plan, "threeMonthPass");
  assert.equal(summary.billingCycleAnchor, pass.startsAt);
  assert.equal(summary.currentPeriodEnd, pass.expiresAt);
  await ensure(subscriptions);
  assert.equal(requests.length, 1);
  subscriptions[0].status = "canceled";
  await ensure(subscriptions);
  assert.equal(requests.length, 1, "canceled renewals are never recreated, even beyond Stripe's idempotency window");
});

test("a verified 100% discounted introduction retains access and cancels renewal without a payment method", async () => {
  const { pass, session, requests, ensure } = fixture();
  pass.amount = 0;
  session.payment_intent = null;
  const [subscription] = await ensure();
  assert.equal(requests[0].default_payment_method, undefined);
  assert.deepEqual(requests[0].trial_settings, { end_behavior: { missing_payment_method: "cancel" } });
  assert.equal(subscriptionSummary([subscription], pass).subscribed, true);
  assert.equal(subscriptionSummary([subscription], pass).amount, 0);
});

test("renewal deferral alone cannot grant access without the matching verified upfront payment", async () => {
  const { pass, ensure } = fixture();
  const [subscription] = await ensure();
  assert.equal(subscriptionSummary([subscription]).subscribed, false);
  for (const changes of [{ revoked: true }, { checkoutId: "cs_other" }, { customerId: "cus_other" },
    { customerId: undefined }, { startsAt: pass.startsAt + 1 },
    { expiresAt: pass.expiresAt + 1 }, { amount: 1 }, { currency: "cad" }]) {
    assert.equal(subscriptionSummary([subscription], { ...pass, ...changes }).subscribed, false);
  }
  subscription.status = "active";
  assert.equal(subscriptionSummary([subscription], pass).plan, "monthly");
  assert.equal(subscriptionSummary([subscription], pass).amount, 14900);
});

test("legacy passes, refunded payments and expired purchases never create new renewals", async () => {
  const { pass, session, requests, ensure } = fixture();
  session.metadata!.introductoryOffer = "";
  assert.deepEqual(await ensure(), []);
  session.metadata!.introductoryOffer = PAID_INTRODUCTION;
  pass.revoked = true;
  assert.deepEqual(await ensure(), []);
  pass.revoked = false;
  assert.deepEqual(await ensure([], pass.expiresAt), []);
  assert.equal(requests.length, 0);
});

test("refund or dispute during the paid period cancels future renewal and revokes access", async () => {
  const { pass, cancellations, ensure } = fixture();
  const subscriptions = await ensure();
  pass.revoked = true;
  const result = await ensure(subscriptions);
  assert.deepEqual(cancellations, ["sub_renewal"]);
  assert.equal(result[0].status, "canceled");
  assert.equal(subscriptionSummary(result, pass).subscribed, false);
});

test("renewal rejects another customer's card, unsuccessful payment and unsaved payment methods", async () => {
  for (const changes of [{ customer: "cus_other" }, { status: "processing" }, { setup_future_usage: "on_session" }, { payment_method: "" }]) {
    const { intent, requests, ensure } = fixture();
    Object.assign(intent, changes);
    await assert.rejects(ensure(), /Invalid renewal payment method/);
    assert.equal(requests.length, 0);
  }
});

test("a paid purchase cannot create a second subscription alongside an existing nonterminal subscription", async () => {
  const { requests, ensure } = fixture();
  const [existing] = await ensure();
  existing.metadata = {};
  await assert.rejects(ensure([existing]), /Conflicting renewal/);
  assert.equal(requests.length, 1);
});

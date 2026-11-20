import type Stripe from "stripe";
import { PAID_INTRODUCTION } from "./catalog";
import type { PassEntitlement } from "./passes";
import { PRICING, formatPrice } from "./shared/pricing";
import { isOurSubscription } from "./subscriptions";

/** Called under the account lock, only after verifying the Checkout, line item and charge. */
export async function ensurePaidRenewal(
  stripe: Stripe, uid: string, customerId: string, pass: PassEntitlement,
  session: Stripe.Checkout.Session, subscriptions: Stripe.Subscription[], now = Date.now() / 1000,
): Promise<Stripe.Subscription[]> {
  if (session.metadata?.introductoryOffer !== PAID_INTRODUCTION) return subscriptions;
  if (session.id !== pass.checkoutId || pass.customerId !== customerId) throw new Error("Paid checkout mismatch");
  const existing = subscriptions.find((subscription) =>
    subscription.metadata?.introductoryOffer === PAID_INTRODUCTION && subscription.metadata.paidCheckoutId === pass.checkoutId);
  // Search Stripe history as well as using an idempotency key: canceled renewals must never be recreated.
  if (existing) {
    if (pass.revoked && existing.status === "trialing") {
      const canceled = await stripe.subscriptions.cancel(existing.id);
      return subscriptions.map((subscription) => subscription.id === canceled.id ? canceled : subscription);
    }
    return subscriptions;
  }
  if (pass.revoked || pass.expiresAt <= now) return subscriptions;
  if (subscriptions.some((subscription) => isOurSubscription(subscription) &&
    !["canceled", "incomplete_expired"].includes(subscription.status))) throw new Error("Conflicting renewal");
  const monthlyPrice = session.metadata.monthlyPrice;
  const intentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
  if (!monthlyPrice || (!intentId && pass.amount !== 0)) throw new Error("Missing renewal payment details");
  let method: string | undefined;
  if (intentId) {
    const intent = await stripe.paymentIntents.retrieve(intentId);
    const owner = typeof intent.customer === "string" ? intent.customer : intent.customer?.id;
    method = typeof intent.payment_method === "string" ? intent.payment_method : intent.payment_method?.id;
    if (intent.status !== "succeeded" || owner !== customerId || !method || intent.setup_future_usage !== "off_session") {
      throw new Error("Invalid renewal payment method");
    }
  }
  // Fully discounted purchases have no PaymentIntent/card. Keep their three-month access;
  // Stripe cancels the deferred renewal if no payment method is added by the end.
  const renewal = await stripe.subscriptions.create({
    customer: customerId, items: [{ price: monthlyPrice, quantity: 1 }], default_payment_method: method,
    // Internal billing deferral only. Checkout itself is a paid purchase with no trial row.
    trial_end: pass.expiresAt, trial_settings: { end_behavior: { missing_payment_method: "cancel" } },
    metadata: { firebaseUID: uid, application: "swecompanion", plan: "threeMonthPass",
      introductoryOffer: PAID_INTRODUCTION, paidCheckoutId: pass.checkoutId,
      upfrontAmount: String(pass.amount), upfrontCurrency: pass.currency,
      introductoryEnd: String(pass.expiresAt), accessStart: String(pass.startsAt) },
    description: `${PRICING.threeMonthPass.productName} paid upfront; ${formatPrice(PRICING.monthly.amount)}/month after the paid period until canceled.`,
    expand: ["latest_invoice"],
  }, { idempotencyKey: `paid-renewal:${pass.checkoutId}` });
  return [...subscriptions, renewal];
}

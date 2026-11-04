import type Stripe from "stripe";
import type { SubscriptionSummary } from "./shared/billing";
import { PRICING } from "./shared/pricing";

export function isOurSubscription(subscription: Stripe.Subscription): boolean {
  return !subscription.livemode && subscription.items.data.some(
    (item) => item.price.product === PRICING.productId ||
      (typeof item.price.product === "object" && item.price.product.id === PRICING.productId),
  );
}

/** Keep paid access until cancellation actually takes effect. Failed payments fail closed. */
export function subscriptionSummary(subscriptions: Stripe.Subscription[]): Omit<SubscriptionSummary, "claimsVersion"> {
  const relevant = subscriptions.filter(isOurSubscription).sort((a, b) => {
    const activeDifference = Number(b.status === "active") - Number(a.status === "active");
    return activeDifference || b.created - a.created;
  });
  const subscription = relevant[0];
  const item = subscription?.items.data.find((candidate) => {
    const product = candidate.price.product;
    return (typeof product === "string" ? product : product.id) === PRICING.productId;
  });
  return {
    subscribed: subscription?.status === "active",
    status: subscription?.status ?? "none",
    plan: item?.price.recurring?.interval === "year" ? "yearly" : item ? "monthly" : null,
    currentPeriodEnd: item?.current_period_end ?? null,
    billingCycleAnchor: subscription?.billing_cycle_anchor ?? subscription?.created ?? null,
    cancelAtPeriodEnd: Boolean(subscription?.cancel_at_period_end || subscription?.cancel_at),
    amount: item?.price.unit_amount ?? null,
    currency: item?.price.currency ?? null,
  };
}

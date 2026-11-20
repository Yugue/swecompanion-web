import type Stripe from "stripe";
import type { SubscriptionSummary } from "./shared/billing";
import { PRICING } from "./shared/pricing";
import { PAID_INTRODUCTION } from "./catalog";
import type { PassEntitlement } from "./passes";

export function isIntroSubscription(subscription: Stripe.Subscription): boolean {
  return ["three_month_monthly_v1", PAID_INTRODUCTION].includes(subscription.metadata?.introductoryOffer);
}

/** A trial status alone never proves the upfront three-month charge was paid. */
export function hasPaidIntroduction(subscription: Stripe.Subscription, pass?: PassEntitlement | null): boolean {
  if (!isIntroSubscription(subscription)) return false;
  if (subscription.metadata.introductoryOffer === PAID_INTRODUCTION) {
    const customer = typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id;
    return Boolean(customer && pass && !pass.revoked && pass.customerId === customer &&
      pass.checkoutId === subscription.metadata.paidCheckoutId && pass.expiresAt === subscription.trial_end &&
      pass.startsAt === Number(subscription.metadata.accessStart) &&
      pass.amount === Number(subscription.metadata.upfrontAmount) && pass.currency === subscription.metadata.upfrontCurrency);
  }
  const invoice = subscription.latest_invoice;
  if (!invoice || typeof invoice === "string") return false;
  const owner = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
  const customer = typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id;
  const parent = invoice.parent?.subscription_details?.subscription;
  const subscriptionId = typeof parent === "string" ? parent : parent?.id;
  const amount = Number(subscription.metadata.upfrontAmount);
  return !invoice.livemode && invoice.status === "paid" && invoice.billing_reason === "subscription_create" &&
    Boolean(customer) && owner === customer && subscriptionId === subscription.id &&
    Number.isSafeInteger(amount) && amount > 0 && invoice.amount_paid === amount &&
    invoice.currency === subscription.metadata.upfrontCurrency && !invoice.lines.has_more &&
    invoice.lines.data.some((line) => line.pricing?.price_details?.price === subscription.metadata.upfrontPrice &&
      line.amount === amount && line.quantity === 1);
}

function hasAccess(subscription: Stripe.Subscription, pass?: PassEntitlement | null): boolean {
  return subscription.status === "active" || (subscription.status === "trialing" && hasPaidIntroduction(subscription, pass));
}

export function isOurSubscription(subscription: Stripe.Subscription): boolean {
  return !subscription.livemode && subscription.items.data.some(
    (item) => item.price.product === PRICING.productId ||
      (typeof item.price.product === "object" && item.price.product.id === PRICING.productId),
  );
}

/** Keep paid access until cancellation actually takes effect. Failed payments fail closed. */
export function subscriptionSummary(subscriptions: Stripe.Subscription[], pass?: PassEntitlement | null): Omit<SubscriptionSummary, "claimsVersion"> {
  const relevant = subscriptions.filter(isOurSubscription).sort((a, b) => {
    const activeDifference = Number(hasAccess(b, pass)) - Number(hasAccess(a, pass));
    return activeDifference || b.created - a.created;
  });
  const subscription = relevant[0];
  const item = subscription?.items.data.find((candidate) => {
    const product = candidate.price.product;
    return (typeof product === "string" ? product : product.id) === PRICING.productId;
  });
  const introductory = subscription?.status === "trialing" && isIntroSubscription(subscription);
  const periodEnd = introductory ? subscription.trial_end : item?.current_period_end;
  return {
    subscribed: subscription ? hasAccess(subscription, pass) : false,
    status: subscription?.status ?? "none",
    plan: introductory ? "threeMonthPass" : item?.price.recurring?.interval === "year" ? "yearly" : item ? "monthly" : null,
    currentPeriodEnd: periodEnd && subscription?.cancel_at ? Math.min(periodEnd, subscription.cancel_at) : periodEnd ?? null,
    billingCycleAnchor: subscription?.metadata?.introductoryOffer === PAID_INTRODUCTION
      ? Number(subscription.metadata.accessStart) || subscription.created
      : subscription && isIntroSubscription(subscription) ? subscription.created : subscription?.billing_cycle_anchor ?? subscription?.created ?? null,
    cancelAtPeriodEnd: Boolean(subscription?.cancel_at_period_end || subscription?.cancel_at),
    amount: introductory ? (Number.isFinite(Number(subscription.metadata.upfrontAmount)) ? Number(subscription.metadata.upfrontAmount) : null) : item?.price.unit_amount ?? null,
    ...(introductory && item?.price.unit_amount !== null && item?.price.unit_amount !== undefined ? { renewalAmount: item.price.unit_amount } : {}),
    currency: item?.price.currency ?? null,
  };
}

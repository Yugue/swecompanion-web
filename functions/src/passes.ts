import type Stripe from "stripe";
import type { SubscriptionSummary } from "./shared/billing";

export interface PassEntitlement {
  checkoutId: string;
  startsAt: number;
  expiresAt: number;
  amount: number;
  currency: string;
  revoked: boolean;
}

export interface PassPurchase {
  checkoutId: string;
  customerId: string;
  uid: string;
  priceId: string;
  amount: number;
  currency: string;
  months: number;
}

/** Calendar months, clamped to the last day when the target month is shorter. */
export function addCalendarMonths(seconds: number, months: number): number {
  const date = new Date(seconds * 1000);
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(day, lastDay));
  return Math.floor(date.getTime() / 1000);
}

/** Inputs come from Stripe and a server-owned checkout record, never browser fields. */
export function paidPass(
  purchase: PassPurchase, session: Stripe.Checkout.Session, items: Stripe.LineItem[], charge: Stripe.Charge | null,
): PassEntitlement | null {
  const customer = typeof session.customer === "string" ? session.customer : session.customer?.id;
  const item = items[0];
  const intent = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
  const chargeIntent = typeof charge?.payment_intent === "string" ? charge.payment_intent : charge?.payment_intent?.id;
  const chargeCustomer = typeof charge?.customer === "string" ? charge.customer : charge?.customer?.id;
  if (session.id !== purchase.checkoutId || session.mode !== "payment" || session.livemode ||
    session.status !== "complete" || session.payment_status !== "paid" || customer !== purchase.customerId ||
    session.client_reference_id !== purchase.uid || session.metadata?.plan !== "threeMonthPass" ||
    items.length !== 1 || item.quantity !== 1 || item.price?.id !== purchase.priceId || item.price.recurring ||
    session.amount_total !== purchase.amount || session.currency !== purchase.currency ||
    !charge || charge.livemode || !charge.paid || charge.status !== "succeeded" ||
    !intent || chargeIntent !== intent || chargeCustomer !== purchase.customerId ||
    charge.amount !== purchase.amount || charge.currency !== purchase.currency ||
    !Number.isFinite(charge.created) || purchase.months !== 3) return null;
  return {
    checkoutId: session.id, startsAt: charge.created, expiresAt: addCalendarMonths(charge.created, purchase.months),
    amount: purchase.amount, currency: purchase.currency, revoked: charge.refunded || charge.disputed,
  };
}

export function passSummary(pass: PassEntitlement, now = Date.now() / 1000): Omit<SubscriptionSummary, "claimsVersion"> {
  const subscribed = !pass.revoked && pass.startsAt <= now && pass.expiresAt > now;
  return {
    subscribed, status: subscribed ? "active" : "canceled", plan: "threeMonthPass",
    currentPeriodEnd: pass.expiresAt, billingCycleAnchor: pass.startsAt,
    cancelAtPeriodEnd: true, amount: pass.amount, currency: pass.currency,
  };
}

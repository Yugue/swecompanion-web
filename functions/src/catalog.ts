import type Stripe from "stripe";
import { PRICING, formatPrice, type BillingPlan } from "./shared/pricing";
import { addCalendarMonths } from "./passes";

export function matchesCatalogPrice(price: Stripe.Price | undefined, plan: BillingPlan): price is Stripe.Price {
  const expected = PRICING[plan];
  if (!price || !price.active || price.livemode || price.product !== PRICING.productId ||
    price.unit_amount !== expected.amount || price.currency !== PRICING.currency) return false;
  return plan === "monthly"
    ? price.type === "recurring" && price.recurring?.interval === PRICING.monthly.interval && price.recurring.interval_count === 1
    : price.type === "one_time" && price.recurring === null;
}

/** One upfront invoice item plus a deferred monthly subscription, visible in the portal immediately. */
export function checkoutPlanOptions(plan: BillingPlan, uid: string, priceId: string, monthlyPriceId: string,
  now = Math.floor(Date.now() / 1000)): Pick<Stripe.Checkout.SessionCreateParams,
  "mode" | "subscription_data" | "line_items" | "payment_method_collection" | "custom_text"> {
  const metadata = { firebaseUID: uid, application: "swecompanion", plan };
  return plan === "monthly"
    ? { mode: "subscription", subscription_data: { metadata }, line_items: [{ price: priceId, quantity: 1 }] }
    : {
      mode: "subscription", payment_method_collection: "always",
      line_items: [{ price: priceId, quantity: 1 }, { price: monthlyPriceId, quantity: 1 }],
      subscription_data: {
        metadata: { ...metadata, introductoryOffer: "three_month_monthly_v1", upfrontPrice: priceId,
          upfrontAmount: String(PRICING.threeMonthPass.amount), upfrontCurrency: PRICING.currency },
        // Checkout accepts days; reconciliation aligns the end to three calendar months from subscription creation.
        trial_period_days: (addCalendarMonths(now, 3) - now) / 86400,
        trial_settings: { end_behavior: { missing_payment_method: "cancel" } },
        description: `${formatPrice(PRICING.threeMonthPass.amount)} for the first three months, then ${formatPrice(PRICING.monthly.amount)}/month until canceled.`,
      },
      custom_text: { submit: { message: `${formatPrice(PRICING.threeMonthPass.amount)} USD upfront for your first three months, then ${formatPrice(PRICING.monthly.amount)} USD/month until canceled. Cancel renewal anytime through Manage plan; access continues through the paid period.` } },
    };
}

export const portalFeatures: Stripe.BillingPortal.ConfigurationUpdateParams.Features = {
  subscription_update: { enabled: false },
  subscription_cancel: { enabled: true, mode: "at_period_end", proration_behavior: "none" },
  payment_method_update: { enabled: true },
  invoice_history: { enabled: true },
};

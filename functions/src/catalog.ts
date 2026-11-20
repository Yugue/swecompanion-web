import type Stripe from "stripe";
import { PRICING, formatPrice, productIdForPlan, type BillingPlan } from "./shared/pricing";
import { BUSINESS, CHECKOUT_TRUST_MESSAGE } from "./shared/business";

export const PAID_INTRODUCTION = "three_month_paid_checkout_v2";

/** Keep catalog synchronization aligned with the customer-facing Dashboard descriptions. */
export function productDescriptionForPlan(plan: BillingPlan): string {
  return plan === "threeMonthPass"
    ? "3-month PRO membership"
    : "Monthly PRO membership";
}

export function matchesCatalogPrice(price: Stripe.Price | undefined, plan: BillingPlan): price is Stripe.Price {
  const expected = PRICING[plan];
  if (!price || !price.active || price.livemode || price.product !== productIdForPlan(plan) ||
    price.unit_amount !== expected.amount || price.currency !== PRICING.currency) return false;
  return plan === "monthly"
    ? price.type === "recurring" && price.recurring?.interval === PRICING.monthly.interval && price.recurring.interval_count === 1
    : price.type === "one_time" && price.recurring === null;
}

/** Collect the paid three-month purchase as one item; renewal is created only after verified payment. */
export function checkoutPlanOptions(plan: BillingPlan, uid: string, priceId: string, monthlyPriceId: string): Pick<Stripe.Checkout.SessionCreateParams,
  "mode" | "subscription_data" | "line_items" | "payment_intent_data" | "invoice_creation" | "metadata" | "custom_text" | "branding_settings" | "allow_promotion_codes" | "adaptive_pricing"> {
  const metadata = { firebaseUID: uid, application: "swecompanion", plan };
  const trust = {
    allow_promotion_codes: true,
    adaptive_pricing: { enabled: true },
    branding_settings: { display_name: BUSINESS.name, background_color: "#ffffff", button_color: "#007ae5",
      icon: { type: "url" as const, url: PRICING.productImageUrl } },
    custom_text: { after_submit: { message: CHECKOUT_TRUST_MESSAGE } },
  };
  return plan === "monthly"
    ? { ...trust, mode: "subscription", metadata, subscription_data: { metadata }, line_items: [{ price: priceId, quantity: 1 }] }
    : {
      ...trust, mode: "payment", line_items: [{ price: priceId, quantity: 1 }],
      metadata: { ...metadata, introductoryOffer: PAID_INTRODUCTION, monthlyPrice: monthlyPriceId },
      invoice_creation: { enabled: true },
      payment_intent_data: {
        setup_future_usage: "off_session", metadata,
        description: `${PRICING.threeMonthPass.productName}: ${formatPrice(PRICING.threeMonthPass.amount)}, then ${formatPrice(PRICING.monthly.amount)}/month until canceled.`,
      },
      custom_text: { ...trust.custom_text, submit: { message: `3 months of PRO, then ${formatPrice(PRICING.monthly.amount)} USD/month until canceled. Cancel renewal in Manage plan.` } },
    };
}

export const portalFeatures: Stripe.BillingPortal.ConfigurationUpdateParams.Features = {
  subscription_update: { enabled: false },
  subscription_cancel: { enabled: true, mode: "at_period_end", proration_behavior: "none" },
  payment_method_update: { enabled: true },
  invoice_history: { enabled: true },
};

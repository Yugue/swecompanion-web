import type Stripe from "stripe";
import { PRICING, type BillingPlan } from "./shared/pricing";

export function matchesCatalogPrice(price: Stripe.Price | undefined, plan: BillingPlan): price is Stripe.Price {
  const expected = PRICING[plan];
  if (!price || !price.active || price.livemode || price.product !== PRICING.productId ||
    price.unit_amount !== expected.amount || price.currency !== PRICING.currency) return false;
  return expected.mode === "subscription"
    ? price.type === "recurring" && price.recurring?.interval === expected.interval && price.recurring.interval_count === 1
    : price.type === "one_time" && price.recurring === null;
}

/** Pass Checkout must never create a recurring subscription. */
export function checkoutPlanOptions(plan: BillingPlan, uid: string): Pick<Stripe.Checkout.SessionCreateParams,
  "mode" | "subscription_data" | "invoice_creation" | "payment_intent_data" | "custom_text"> {
  const metadata = { firebaseUID: uid, application: "swecompanion", plan };
  return plan === "monthly"
    ? { mode: PRICING[plan].mode, subscription_data: { metadata } }
    : {
      mode: PRICING[plan].mode, invoice_creation: { enabled: true }, payment_intent_data: { metadata },
      custom_text: { submit: { message: "One payment for three calendar months of Pro. No automatic renewal." } },
    };
}

/** The only pricing definition. Imported by the website, functions, and catalog sync. */
export const PRICING = {
  productImageUrl: "https://swecompanion.web.app/favicon_io/android-chrome-512x512.png",
  productName: "SWECompanion PRO subscription",
  productId: "swecompanion_pro",
  currency: "usd",
  monthly: { amount: 14_900, mode: "subscription", interval: "month", months: 1, label: "Pro monthly" },
  threeMonthPass: { amount: 34_900, mode: "payment", months: 3, label: "Three-month Pro",
    productId: "swecompanion_pro_three_months", productName: "SWECompanion PRO 3-month membership" },
} as const;

export const BILLING_PLANS = ["monthly", "threeMonthPass"] as const;
export type BillingPlan = typeof BILLING_PLANS[number];
/** Existing annual purchases remain readable, but cannot be bought or selected again. */
export type MembershipPlan = BillingPlan | "yearly";

export function isBillingPlan(value: unknown): value is BillingPlan {
  return BILLING_PLANS.some((plan) => plan === value);
}

export function priceLookupKey(plan: BillingPlan): string {
  return `swecompanion_pro_${plan}_${PRICING.currency}_${PRICING[plan].amount}${plan === "threeMonthPass" ? `_monthly_${PRICING.monthly.amount}_paid_renewal_v2` : ""}`;
}

export function productIdForPlan(plan: BillingPlan): string {
  return plan === "threeMonthPass" ? PRICING.threeMonthPass.productId : PRICING.productId;
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: PRICING.currency,
    maximumFractionDigits: amount % 100 === 0 ? 0 : 2,
  }).format(amount / 100);
}

export const PASS_SAVINGS_PERCENT = Math.round(
  (1 - PRICING.threeMonthPass.amount / (PRICING.monthly.amount * PRICING.threeMonthPass.months)) * 100,
);

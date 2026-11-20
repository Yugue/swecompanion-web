/** The only pricing definition. Imported by the website, functions, and catalog sync. */
export const PRICING = {
  productName: "SWECompanion Pro",
  productId: "swecompanion_pro",
  currency: "usd",
  monthly: { amount: 14_900, mode: "subscription", interval: "month", months: 1, label: "Pro monthly" },
  threeMonthPass: { amount: 34_900, mode: "subscription", months: 3, label: "Three-month Pro" },
} as const;

export const BILLING_PLANS = ["monthly", "threeMonthPass"] as const;
export type BillingPlan = typeof BILLING_PLANS[number];
/** Existing annual purchases remain readable, but cannot be bought or selected again. */
export type MembershipPlan = BillingPlan | "yearly";

export function isBillingPlan(value: unknown): value is BillingPlan {
  return BILLING_PLANS.some((plan) => plan === value);
}

export function priceLookupKey(plan: BillingPlan): string {
  return `swecompanion_pro_${plan}_${PRICING.currency}_${PRICING[plan].amount}${plan === "threeMonthPass" ? `_monthly_${PRICING.monthly.amount}_renewal_v1` : ""}`;
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

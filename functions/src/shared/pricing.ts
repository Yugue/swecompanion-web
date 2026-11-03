/** The only pricing definition. Imported by the website, functions, and catalog sync. */
export const PRICING = {
  productName: "SWECompanion Pro",
  productId: "swecompanion_pro",
  currency: "usd",
  monthly: { amount: 29_900, interval: "month", months: 1, label: "Monthly" },
  yearly: { amount: 298_800, interval: "year", months: 12, label: "Yearly" },
} as const;

export type BillingPlan = "monthly" | "yearly";

export function isBillingPlan(value: unknown): value is BillingPlan {
  return value === "monthly" || value === "yearly";
}

export function priceLookupKey(plan: BillingPlan): string {
  return `swecompanion_pro_${plan}_${PRICING.currency}_${PRICING[plan].amount}`;
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: PRICING.currency,
    maximumFractionDigits: amount % 100 === 0 ? 0 : 2,
  }).format(amount / 100);
}

export const ANNUAL_SAVINGS_PERCENT = Math.round(
  (1 - PRICING.yearly.amount / (PRICING.monthly.amount * 12)) * 100,
);

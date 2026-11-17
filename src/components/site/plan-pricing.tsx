"use client";

import { cn } from "@/lib/utils";
import { BILLING_PLANS, PASS_SAVINGS_PERCENT, PRICING, formatPrice, type BillingPlan } from "@shared/pricing";

export function BillingPeriodToggle({ plan, onPlanChange }: {
  plan: BillingPlan;
  onPlanChange: (plan: BillingPlan) => void;
}) {
  return <div role="group" aria-label="Choose a Pro plan" className="flex flex-wrap justify-center gap-2">
    {BILLING_PLANS.map((option) => <button key={option} type="button" aria-pressed={plan === option}
      onClick={() => onPlanChange(option)}
      className={cn("flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        plan === option ? "border-brand-blue bg-brand-blue/10 text-brand-blue" : "border-border bg-card text-muted-foreground")}>
      {PRICING[option].label}{option === "threeMonthPass" && <PassSavingsBadge />}
    </button>)}
  </div>;
}

export function PassSavingsBadge() {
  return <span className="rounded-full border border-border bg-card px-2 py-0.5 font-mono text-xs text-signal">
    save {PASS_SAVINGS_PERCENT}%
  </span>;
}

export function ProPrice({ plan }: { plan: BillingPlan }) {
  return <>
    <div className="mt-4 flex items-baseline gap-1.5">
      <span className="text-4xl font-medium tracking-tight">{formatPrice(PRICING[plan].amount)}</span>
      <span className="text-sm text-muted-foreground">{plan === "monthly" ? "/ month" : "one-time"}</span>
    </div>
    <p className="mt-2 text-xs text-muted-foreground">
      {plan === "monthly" ? "Billed monthly in USD. Cancel anytime." : "Three months of Pro. No renewal or further charges."}
    </p>
  </>;
}

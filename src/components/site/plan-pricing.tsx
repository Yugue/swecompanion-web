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

export function MostPopularBadge() {
  return <span className="rounded-full bg-brand-blue px-2.5 py-1 font-mono text-[10px] tracking-wide text-primary-foreground uppercase">
    Most popular
  </span>;
}

export function PassSavingsBadge() {
  return <span className="rounded-full border border-border bg-card px-2 py-0.5 font-mono text-xs text-signal">
    save {PASS_SAVINGS_PERCENT}%
  </span>;
}

export function ProPrice({ plan }: { plan: BillingPlan }) {
  return <><div className="mt-4 flex items-baseline gap-1.5">
    <span className="text-4xl font-medium tracking-tight">{formatPrice(PRICING[plan].amount)}</span>
    <span className="text-sm text-muted-foreground">{plan === "monthly" ? "/ month" : "for 3 months"}</span>
    {plan === "threeMonthPass" && <span className="ml-auto shrink-0"><PassSavingsBadge /></span>}
  </div>
    <p className="mt-3 text-sm text-muted-foreground">{plan === "threeMonthPass"
      ? `Then ${formatPrice(PRICING.monthly.amount)} USD/month until canceled. Cancel renewal anytime.`
      : "Renews monthly until canceled. Cancel anytime."}</p>
  </>;
}

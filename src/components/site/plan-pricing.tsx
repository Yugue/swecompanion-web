"use client";

import { cn } from "@/lib/utils";
import { ANNUAL_SAVINGS_PERCENT, PRICING, formatPrice } from "@shared/pricing";

export function BillingPeriodToggle({
  annual,
  onAnnualChange,
}: {
  annual: boolean;
  onAnnualChange: (annual: boolean) => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <span className={cn("text-sm", !annual ? "text-foreground" : "text-muted-foreground")}>
        Monthly
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={annual}
        aria-label="Toggle annual billing"
        onClick={() => onAnnualChange(!annual)}
        className={cn(
          "relative h-7 w-12 rounded-full border border-border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          annual ? "bg-signal/15" : "bg-muted",
        )}
      >
        <span className={cn(
          "absolute top-1/2 size-5 -translate-y-1/2 rounded-full bg-foreground transition-all",
          annual ? "left-[calc(100%-1.375rem)]" : "left-1",
        )} />
      </button>
      <span className={cn("flex items-center gap-2 text-sm", annual ? "text-foreground" : "text-muted-foreground")}>
        Annual
        <AnnualSavingsBadge />
      </span>
    </div>
  );
}

export function AnnualSavingsBadge() {
  return (
    <span className="rounded-full border border-border bg-card px-2 py-0.5 font-mono text-xs text-signal">
      save {ANNUAL_SAVINGS_PERCENT}%
    </span>
  );
}

export function ProPrice({ annual }: { annual: boolean }) {
  const monthlyPrice = annual ? PRICING.yearly.amount / PRICING.yearly.months : PRICING.monthly.amount;

  return (
    <>
      <div className="mt-4 flex items-baseline gap-1.5">
        <span className="text-4xl font-medium tracking-tight">{formatPrice(monthlyPrice)}</span>
        <span className="text-sm text-muted-foreground">/ month</span>
      </div>
      {annual && (
        <p className="mt-2 text-xs text-muted-foreground">
          Billed annually at {formatPrice(PRICING.yearly.amount)} USD. Cancel anytime.
        </p>
      )}
    </>
  );
}

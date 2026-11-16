"use client";

import { useRef, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { ArrowRight, X } from "lucide-react";
import { AnnualSavingsBadge, ProPrice } from "@/components/site/plan-pricing";
import { Button } from "@/components/ui/button";
import { billingErrorMessage, startCheckout } from "@/lib/billing";
import { PRICING, type BillingPlan } from "@shared/pricing";

const plans = [
  { plan: "monthly", label: "Monthly" },
  { plan: "yearly", label: "Annual" },
] as const;

export function SubscribeDialog({ disabled }: { disabled: boolean }) {
  const portalContainer = useRef<HTMLDivElement>(null);
  const [pendingPlan, setPendingPlan] = useState<BillingPlan | null>(null);
  const busy = pendingPlan !== null;
  const [error, setError] = useState<string | null>(null);

  async function checkout(plan: BillingPlan) {
    setPendingPlan(plan);
    setError(null);
    try {
      await startCheckout(plan);
    } catch (error) {
      setError(billingErrorMessage(error));
    } finally {
      setPendingPlan(null);
    }
  }

  return (
    <Dialog.Root onOpenChange={(open, event) => {
      if (!open && busy) event.cancel();
      if (open) setError(null);
    }}>
      <Dialog.Trigger disabled={disabled} render={<Button className="h-11" />}>
        Subscribe
      </Dialog.Trigger>
      {/* Keep the portal inside the site theme so the popup inherits its colors and fonts. */}
      <div ref={portalContainer} className="contents" />
      <Dialog.Portal container={portalContainer}>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-2xl -translate-1/2 overflow-y-auto rounded-2xl border border-border bg-card p-5 text-foreground shadow-xl sm:p-6">
          <Dialog.Close
            render={<Button variant="ghost" size="icon" className="absolute top-4 right-4" />}
            aria-label="Close"
            disabled={busy}
          >
            <X className="size-4" />
          </Dialog.Close>
          <Dialog.Title className="pr-8 text-xl font-medium">Subscribe to {PRICING.productName}</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-muted-foreground">
            Choose monthly or annual billing.
          </Dialog.Description>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {plans.map(({ plan, label }) => (
              <div key={plan} className="relative flex flex-col overflow-hidden rounded-xl border border-brand-blue/30 bg-card p-5 ring-1 ring-brand-blue/10">
                <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-brand-blue to-brand-cyan" />
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-mono text-xs tracking-widest text-brand-blue uppercase">{label}</h3>
                  {plan === "yearly" && <AnnualSavingsBadge />}
                </div>
                <ProPrice annual={plan === "yearly"} />
                <div className="mt-auto pt-4">
                  <Button className="h-11 w-full" disabled={busy} onClick={() => void checkout(plan)}>
                    {pendingPlan === plan ? "Opening checkout…" : `Choose ${label.toLowerCase()}`}
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Prices in USD. Renews automatically until canceled.</p>
          {error && <p role="alert" className="mt-3 text-sm text-accent-red">{error}</p>}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

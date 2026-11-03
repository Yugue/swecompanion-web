"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthProvider";
import { startCheckout, billingErrorMessage } from "@/lib/billing";
import type { BillingPlan } from "@shared/pricing";
import { SignInDialog } from "./SignInDialog";

export function UpgradeButton({ plan, className }: { plan: BillingPlan; className?: string }) {
  const { user, subscribed, loading } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setBusy(true); setError(null);
    try { await startCheckout(plan); }
    catch (error) { setError(billingErrorMessage(error)); setBusy(false); }
  }

  if (subscribed) return <Button className={className} render={<Link href="/account">Manage subscription <ArrowRight className="size-4" /></Link>} />;
  return <>
    <Button className={className} disabled={loading || busy} onClick={() => user ? void checkout() : setDialogOpen(true)}>
      {busy ? "Opening checkout…" : "Upgrade to Pro"}<ArrowRight className="size-4" />
    </Button>
    {error && <p role="alert" className="mt-3 text-sm text-accent-red">{error} <Link href="/account" className="underline">View account</Link></p>}
    {dialogOpen && createPortal(<SignInDialog initialMode="signup" onClose={() => setDialogOpen(false)} onAuthenticated={() => void checkout()} />, document.body)}
  </>;
}

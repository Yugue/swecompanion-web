"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthProvider";
import { startCheckout, billingErrorMessage } from "@/lib/billing";
import type { BillingPlan } from "@shared/pricing";
import { authPageHref } from "@/lib/authNavigation";

export function UpgradeButton({ plan, className }: { plan: BillingPlan; className?: string }) {
  const { user, subscribed, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setBusy(true); setError(null);
    try { await startCheckout(plan); }
    catch (error) { setError(billingErrorMessage(error)); setBusy(false); }
  }

  if (subscribed) return <Button className={className} render={<Link href="/account">Manage subscription <ArrowRight className="size-4" /></Link>} />;
  if (!user) return <Button className={className} disabled={loading} render={<Link href={authPageHref("/signup", `/account?upgrade=${plan}`)}>Upgrade to Pro<ArrowRight className="size-4" /></Link>} />;
  return <>
    <Button className={className} disabled={loading || busy} onClick={() => void checkout()}>
      {busy ? "Opening checkout…" : "Upgrade to Pro"}<ArrowRight className="size-4" />
    </Button>
    {error && <p role="alert" className="mt-3 text-sm text-accent-red">{error} <Link href="/account" className="underline">View account</Link></p>}
  </>;
}

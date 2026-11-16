"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthProvider";
import { SubscribeDialog } from "@/components/account/SubscribeDialog";
import type { BillingPlan } from "@shared/pricing";
import { authPageHref } from "@/lib/authNavigation";

export function UpgradeButton({ plan, className }: { plan: BillingPlan; className?: string }) {
  const { user, subscribed, loading } = useAuth();

  if (subscribed) return <Button className={className} render={<Link href="/account">Manage subscription <ArrowRight className="size-4" /></Link>} />;
  if (!user) return <Button className={className} disabled={loading} render={<Link href={authPageHref("/signup", `/account?upgrade=${plan}`)}>Upgrade to Pro<ArrowRight className="size-4" /></Link>} />;
  return <SubscribeDialog disabled={loading} className={className} label="Upgrade to Pro" />;
}

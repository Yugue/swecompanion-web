"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthProvider";
import type { BillingPlan } from "@shared/pricing";
import { authPageHref } from "@/lib/authNavigation";
import { cn } from "@/lib/utils";

export function UpgradeButton({ plan, className, arrowClassName }: { plan: BillingPlan; className?: string; arrowClassName?: string }) {
  const { user, subscribed, loading } = useAuth();

  if (subscribed) return <Button className={className} render={<Link href="/account">Manage subscription <ArrowRight className={cn("size-4", arrowClassName)} aria-hidden /></Link>} />;
  const accountHref = `/account?upgrade=${plan}`;
  return <Button className={className} disabled={loading} render={<Link href={user ? accountHref : authPageHref("/signup", accountHref)}>Upgrade to Pro<ArrowRight className={cn("size-4", arrowClassName)} aria-hidden /></Link>} />;
}

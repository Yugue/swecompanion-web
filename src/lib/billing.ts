"use client";

import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";
import type { BillingPlan } from "@shared/pricing";
import type { InvoicePage, SubscriptionSummary } from "@shared/billing";

export const refreshSubscription = async () => (
  await httpsCallable<void, SubscriptionSummary | null>(functions, "refreshSubscription")()
).data;

export const getInvoices = async (cursor?: string) => (
  await httpsCallable<{ cursor?: string }, InvoicePage>(functions, "listInvoices")({ ...(cursor ? { cursor } : {}) })
).data;

async function redirect(name: "createCheckout" | "createBillingPortal", data: { plan?: BillingPlan }) {
  const input = { ...data, returnOrigin: window.location.origin };
  const result = await httpsCallable<typeof input, { url: string }>(functions, name)(input);
  const url = new URL(result.data.url);
  const expectedHost = name === "createCheckout" ? "checkout.stripe.com" : "billing.stripe.com";
  if (url.protocol !== "https:" || url.hostname !== expectedHost) throw new Error("Invalid redirect");
  window.location.assign(url.href);
}

export const startCheckout = (plan: BillingPlan) => redirect("createCheckout", { plan });
export const openBillingPortal = () => redirect("createBillingPortal", {});

export function billingErrorMessage(error: unknown): string {
  const code = (error as { code?: string } | null)?.code;
  if (code === "functions/unauthenticated") return "Please sign in again to continue.";
  if (code === "functions/already-exists") return "You already have a subscription. Manage it in your account.";
  if (code === "functions/aborted") return "Your account is updating. Please try again shortly.";
  return "Unable to complete this request. Please try again.";
}

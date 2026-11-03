import type { BillingPlan } from "./pricing";

export interface SubscriptionSummary {
  subscribed: boolean;
  status: "none" | "active" | "past_due" | "canceled" | "incomplete" | "unpaid" | "paused" | "trialing" | "incomplete_expired";
  plan: BillingPlan | null;
  currentPeriodEnd: number | null;
  cancelAtPeriodEnd: boolean;
  amount: number | null;
  currency: string | null;
  claimsVersion: string;
}

export interface InvoiceSummary {
  id: string;
  number: string | null;
  created: number;
  amount: number;
  currency: string;
  status: string;
  url: string | null;
  pdf: string | null;
}

export interface InvoicePage {
  invoices: InvoiceSummary[];
  hasMore: boolean;
}

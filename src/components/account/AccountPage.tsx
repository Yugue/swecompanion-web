"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { doc, onSnapshot } from "firebase/firestore";
import { ArrowLeft, ArrowUpRight, CreditCard, FileText, LockKeyhole } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import { db } from "@/lib/firebase";
import { billingErrorMessage, getInvoices, openBillingPortal, refreshSubscription, startCheckout } from "@/lib/billing";
import { AccountMenu } from "@/components/auth/AccountMenu";
import { UpgradeButton } from "@/components/auth/UpgradeButton";
import { Wordmark } from "@/components/site/wordmark";
import { Button } from "@/components/ui/button";
import { ChangePassword } from "./ChangePassword";
import { PRICING, formatPrice, isBillingPlan } from "@shared/pricing";
import type { InvoiceSummary, SubscriptionSummary } from "@shared/billing";

const date = (seconds: number) => new Date(seconds * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const money = (amount: number, currency: string) => new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount / 100);

export function AccountPage() {
  const { user, loading } = useAuth();
  return <>
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="SWECompanion home"><Wordmark /></Link><AccountMenu />
      </div>
    </header>
    <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Back to home</Link>
      <h1 className="mt-8 text-3xl font-medium tracking-tight sm:text-4xl">Your account</h1>
      <p className="mt-3 text-sm text-muted-foreground">Your membership, billing history, and sign-in settings.</p>
      {loading ? <p role="status" className="mt-10 text-sm text-muted-foreground">Loading your account…</p> : user ? <AccountDetails key={user.uid} uid={user.uid} /> :
        <section className="mt-10 rounded-2xl border border-border bg-card p-8">
          <h2 className="text-lg font-medium">Everything in one place</h2>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to manage your membership and view invoices.</p>
          <Button className="mt-6 h-11" render={<Link href="/login">Sign in or create an account</Link>} />
        </section>}
    </main>
  </>;
}

function AccountDetails({ uid }: { uid: string }) {
  const { user, refreshClaims } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [checkout, setCheckout] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  const [invoiceLoading, setInvoiceLoading] = useState(true);
  const [invoiceError, setInvoiceError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const loadInvoices = useCallback(async (cursor?: string) => {
    setInvoiceLoading(true); setInvoiceError(null);
    try {
      const page = await getInvoices(cursor);
      setInvoices((previous) => cursor ? [...previous, ...page.invoices] : page.invoices);
      setHasMore(page.hasMore);
    } catch { setInvoiceError("Unable to load your invoices. Please try again."); }
    finally { setInvoiceLoading(false); }
  }, []);

  useEffect(() => {
    let disposed = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const search = new URLSearchParams(window.location.search);
    const returnedCheckout = search.get("checkout");
    const upgradePlan = search.get("upgrade");
    const unsubscribe = onSnapshot(doc(db, "billing", uid), (snapshot) => {
      setSubscription(snapshot.exists() ? snapshot.data() as SubscriptionSummary : null);
      setLoading(false);
    }, () => { setLoading(false); setError("Unable to load your membership. Please try again."); });

    async function sync(attempt = 0) {
      try {
        const result = await refreshSubscription();
        if (disposed) return;
        setSubscription(result); setLoading(false); setError(null); setCheckout(returnedCheckout);
        if (isBillingPlan(upgradePlan)) {
          window.history.replaceState(null, "", "/account");
          if (!result?.subscribed) {
            setBusy(true);
            await startCheckout(upgradePlan);
          }
          setBusy(false);
        }
        if (result?.subscribed) {
          await refreshClaims();
          if (!disposed) void loadInvoices();
        } else if (returnedCheckout === "success" && attempt < 7) {
          timer = setTimeout(() => void sync(attempt + 1), 2000);
        }
      } catch (error) {
        if (disposed) return;
        setBusy(false);
        if ((error as { code?: string }).code === "functions/aborted" && attempt < 7) timer = setTimeout(() => void sync(attempt + 1), 2000);
        else { setLoading(false); setError(billingErrorMessage(error)); }
      }
    }
    void sync();
    // Initial state already shows loading; update state only after the request settles.
    void getInvoices().then((page) => {
      if (disposed) return;
      setInvoices(page.invoices); setHasMore(page.hasMore); setInvoiceLoading(false);
    }).catch(() => {
      if (!disposed) { setInvoiceError("Unable to load your invoices. Please try again."); setInvoiceLoading(false); }
    });
    return () => { disposed = true; clearTimeout(timer); unsubscribe(); };
  }, [uid, refreshClaims, loadInvoices]);

  async function manage() {
    setBusy(true); setError(null);
    try { await openBillingPortal(); }
    catch (error) { setError(billingErrorMessage(error)); }
    finally { setBusy(false); }
  }

  return <div className="mt-10 space-y-6">
    {checkout === "success" && <p role="status" className="rounded-xl border border-brand-blue/20 bg-brand-blue/5 p-4 text-sm">
      {subscription?.subscribed ? "You’re on Pro. Your membership is active." : "We’re confirming your payment. Your membership will update when confirmation arrives."}
    </p>}
    <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="flex items-center gap-2 text-xs font-medium tracking-widest text-muted-foreground uppercase"><CreditCard className="size-4" />Membership</p>
          <h2 className="mt-4 text-2xl font-medium">{subscription?.subscribed ? "SWECompanion Pro" : "Free Account"}</h2>
          <p className="mt-2 break-all text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>
      {subscription?.plan && <p className="mt-6 text-sm">
        {subscription.amount !== null ? money(subscription.amount, subscription.currency ?? PRICING.currency) : formatPrice(PRICING[subscription.plan].amount)} {subscription.currency?.toUpperCase()} / {subscription.plan === "yearly" ? "year" : "month"}
      </p>}
      {subscription?.status === "canceled" && <p className="mt-2 text-sm text-muted-foreground">Your subscription has ended. You can upgrade again at any time.</p>}
      {subscription?.currentPeriodEnd && subscription.status !== "canceled" && <p className="mt-2 text-sm text-muted-foreground">
        {subscription.cancelAtPeriodEnd ? "Your subscription stays active until " : subscription.subscribed ? "Renews on " : "Billing period ends "}{date(subscription.currentPeriodEnd)}.
        {subscription.cancelAtPeriodEnd && " You won’t be charged again."}
      </p>}
      {error && <p role="alert" className="mt-4 text-sm text-accent-red">{error} <button type="button" onClick={() => window.location.reload()} className="underline">Retry</button></p>}
      {!loading && <div className="mt-6 flex flex-wrap gap-3">
        {subscription && subscription.status !== "none" && <Button variant="outline" className="h-11" disabled={busy} onClick={() => void manage()}>
          {busy ? "Opening…" : "Manage subscription & payment method"}<ArrowUpRight className="size-4" />
        </Button>}
        {(!subscription || ["none", "canceled", "incomplete_expired"].includes(subscription.status)) && <>
          <UpgradeButton plan="monthly" className="h-11" />
          <Link href="/#pricing" className="inline-flex h-11 items-center text-sm text-muted-foreground underline underline-offset-4">Compare monthly &amp; yearly billing</Link>
        </>}
      </div>}
    </section>
    <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 className="flex items-center gap-2 text-lg font-medium"><FileText className="size-5 text-muted-foreground" />Invoice history</h2>
      <p className="mt-2 text-sm text-muted-foreground">View past payments and download your invoices.</p>
      {invoices.length > 0 && <div className="mt-6 overflow-x-auto"><table className="w-full min-w-[440px] text-left text-sm">
        <thead><tr className="border-b border-border text-xs text-muted-foreground"><th className="py-3 font-medium">Date / invoice</th><th className="py-3 font-medium">Amount</th><th className="py-3 font-medium">Status</th><th className="py-3 text-right font-medium">Receipt</th></tr></thead>
        <tbody>{invoices.map((invoice) => <tr key={invoice.id} className="border-b border-border last:border-0">
          <td className="py-4">{date(invoice.created)}<span className="mt-1 block text-xs text-muted-foreground">{invoice.number}</span></td>
          <td className="py-4">{money(invoice.amount, invoice.currency)}</td><td className="py-4 capitalize">{invoice.status}</td>
          <td className="py-4 text-right"><div className="flex justify-end gap-3">
            {invoice.url && <a href={invoice.url} target="_blank" rel="noopener noreferrer" className="text-brand-blue underline underline-offset-4">View<span className="sr-only"> invoice {invoice.number}</span></a>}
            {invoice.pdf && <a href={invoice.pdf} target="_blank" rel="noopener noreferrer" className="text-brand-blue underline underline-offset-4">PDF<span className="sr-only"> invoice {invoice.number}</span></a>}
          </div></td>
        </tr>)}</tbody>
      </table></div>}
      {invoiceLoading && <p role="status" className="mt-6 text-sm text-muted-foreground">Loading invoices…</p>}
      {!invoiceLoading && !invoiceError && !invoices.length && <p className="mt-6 rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">Your invoices will appear here after your first payment.</p>}
      {invoiceError && <p role="alert" className="mt-6 text-sm text-accent-red">{invoiceError} <button type="button" onClick={() => void loadInvoices()} className="underline">Retry</button></p>}
      {hasMore && <Button variant="outline" className="mt-4" disabled={invoiceLoading} onClick={() => void loadInvoices(invoices.at(-1)?.id)}>Load older invoices</Button>}
    </section>
    <section className="rounded-2xl border border-border bg-card p-6 sm:p-8">
      <h2 className="mb-6 flex items-center gap-2 text-lg font-medium"><LockKeyhole className="size-5 text-muted-foreground" />Sign-in &amp; security</h2>
      <ChangePassword />
    </section>
  </div>;
}

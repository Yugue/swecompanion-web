import Link from "next/link";
import type { ReactNode } from "react";
import { BUSINESS } from "@/lib/business";
import { Wordmark } from "./wordmark";

export function PolicyPage({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <div className="min-h-screen bg-background text-foreground">
    <header className="border-b border-border">
      <nav aria-label="Policy navigation" className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-5 px-5 py-5 md:px-8">
        <Link href="/" aria-label="SWECompanion home"><Wordmark /></Link>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <Link href="/terms" className="hover:text-foreground">Terms</Link>
          <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link href="/refund-policy" className="hover:text-foreground">Refunds</Link>
          <Link href="/contact" className="hover:text-foreground">Contact</Link>
        </div>
      </nav>
    </header>
    <main className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
      <article>
        <p className="text-xs font-medium tracking-widest text-brand-blue uppercase">{BUSINESS.name}</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight">{title}</h1>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">{description}</p>
        <p className="mt-4 text-xs text-muted-foreground">Last updated {BUSINESS.policyDate}</p>
        <div className="mt-10 space-y-8">{children}</div>
      </article>
    </main>
    <footer className="border-t border-border px-5 py-6 text-center text-sm text-muted-foreground">
      {BUSINESS.name} · {BUSINESS.location} · <a className="underline underline-offset-4" href={`mailto:${BUSINESS.supportEmail}`}>{BUSINESS.supportEmail}</a>
    </footer>
  </div>;
}

export function PolicySection({ title, id, children }: { title: string; id?: string; children: ReactNode }) {
  return <section id={id} className="scroll-mt-6">
    <h2 className="mb-3 text-xl font-medium tracking-tight">{title}</h2>
    <div className="space-y-3 text-sm leading-7 text-muted-foreground [&_a]:text-brand-blue [&_a]:underline [&_a]:underline-offset-4">{children}</div>
  </section>;
}

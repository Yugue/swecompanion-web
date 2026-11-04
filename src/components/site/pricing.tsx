'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import { useState } from 'react'
import { Container, SectionHeading } from './primitives'
import { PRICING, ANNUAL_SAVINGS_PERCENT, formatPrice } from '@shared/pricing'
import { UpgradeButton } from '@/components/auth/UpgradeButton'

const features = [
  'AI-powered problem reads & solutions',
  'Debug and improve your own code',
  'System-design diagram critiques',
  'Invisible to share, capture & recording',
  'Global shortcut & instant overlay',
  'Priority model — fastest, most accurate answers',
]

export function Pricing() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="pricing" className="scroll-mt-16 border-b border-border py-20 md:py-28">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Pricing"
          title="Download free. Subscribe when it earns its place."
          description="Install and try the companion on your own machine at no cost. Unlock Pro features with a single subscription — cancel anytime."
        />

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <span
            className={cn(
              'text-sm',
              !annual ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            Monthly
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={annual}
            aria-label="Toggle annual billing"
            onClick={() => setAnnual((v) => !v)}
            className={cn(
              'relative h-7 w-12 rounded-full border border-border transition-colors',
              annual ? 'bg-signal/15' : 'bg-muted',
            )}
          >
            <span
              className={cn(
                'absolute top-1/2 size-5 -translate-y-1/2 rounded-full bg-foreground transition-all',
                annual ? 'left-[calc(100%-1.375rem)]' : 'left-1',
              )}
            />
          </button>
          <span
            className={cn(
              'flex items-center gap-2 text-sm',
              annual ? 'text-foreground' : 'text-muted-foreground',
            )}
          >
            Annual
            <span className="rounded-full border border-border bg-card px-2 py-0.5 font-mono text-xs text-signal">
              save {ANNUAL_SAVINGS_PERCENT}%
            </span>
          </span>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 lg:grid-cols-[1fr_1.1fr]">
          {/* Free tier */}
          <div className="flex flex-col rounded-xl border border-border bg-card p-7">
            <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              Free
            </p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-medium tracking-tight">$0</span>
              <span className="text-sm text-muted-foreground">to download</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The full app, installed and running on your Mac. See the overlay
              disappear from a real screen share before you pay a cent.
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {[
                'Install the macOS app',
                'Try the invisibility on your own share',
                'Sample solutions to see the quality',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
            <Button
              variant="outline"
              className="mt-7 h-11 w-full"
              render={<a href="#download">Download for macOS</a>}
            />
          </div>

          {/* Pro tier */}
          <div className="relative flex flex-col rounded-xl border border-brand-blue/30 bg-card p-7 shadow-[0_12px_40px_-12px_var(--brand-blue)] ring-1 ring-brand-blue/10">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-1 rounded-t-xl"
              style={{
                background:
                  'linear-gradient(90deg, var(--brand-blue), var(--brand-cyan))',
              }}
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-mono text-xs tracking-widest text-brand-blue uppercase">
                Pro membership
              </p>
              <span className="rounded-full bg-brand-blue px-2.5 py-1 font-mono text-[10px] tracking-wide text-primary-foreground uppercase">
                Most popular
              </span>
            </div>
            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-4xl font-medium tracking-tight">
                {formatPrice(annual ? PRICING.yearly.amount / PRICING.yearly.months : PRICING.monthly.amount)}
              </span>
              <span className="text-sm text-muted-foreground">/ month</span>
            </div>
            {annual && (
              <p className="mt-2 text-xs text-muted-foreground">
                Billed annually at {formatPrice(PRICING.yearly.amount)} USD. Cancel anytime.
              </p>
            )}
            <div className="mt-4 rounded-lg border border-brand-blue/20 bg-brand-blue/5 p-3">
              <p className="text-sm font-medium text-brand-blue">
                An investment worth every dollar.
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground">
                One strong interview can change your compensation by tens of
                thousands a year. Pro is priced for the moment it matters most.
              </p>
            </div>
            <ul className="mt-6 flex-1 space-y-3">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-signal" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-muted-foreground">Prices in USD. Renews automatically until canceled.</p>
            <UpgradeButton plan={annual ? 'yearly' : 'monthly'} className="mt-4 h-11 w-full" />
          </div>
        </div>
      </Container>
    </section>
  )
}

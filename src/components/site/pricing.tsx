'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Container, SectionHeading } from './primitives'
import { MostPopularBadge, ProPrice } from './plan-pricing'
import { UpgradeButton } from '@/components/auth/UpgradeButton'
import { BILLING_PLANS } from '@shared/pricing'
import styles from './hero.module.css'

const features = [
  'Unlimited access to coding, system design, and ML system design',
  'Invisible on screen shares in Meet, Zoom, and more',
  'Undetectable on HackerRank, CodeSignal, and other interview platforms',
  'Clean, optimal solutions with clear, concise explanations',
  'Fine-tuned for natural, interview-ready answers',
]

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-16 border-b border-border py-20 md:py-28">
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Pricing"
          title="Your next offer starts here."
        />

        <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Free tier */}
          <div className="flex flex-col rounded-xl border border-border bg-card p-7">
            <p className="min-h-7 font-mono text-xs tracking-widest text-muted-foreground uppercase">
              Free
            </p>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-medium tracking-tight">$0</span>
            </div>
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
              className={cn('mt-7 h-11 w-full gap-2.5 text-foreground', styles.downloadCta, styles.downloadCtaOutline)}
              render={<a href="#download">Download for free<ArrowRight className={cn('size-4', styles.downloadArrow)} aria-hidden /></a>}
            />
          </div>

          {BILLING_PLANS.map((plan) => (
            <div key={plan} className="relative flex flex-col rounded-xl border border-brand-blue/30 bg-card p-7 shadow-[0_12px_40px_-12px_var(--brand-blue)] ring-1 ring-brand-blue/10">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-1 rounded-t-xl"
                style={{
                  background:
                    'linear-gradient(90deg, var(--brand-blue), var(--brand-cyan))',
                }}
              />
              <div className="flex min-h-7 flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-xs tracking-widest text-brand-blue uppercase">
                  {plan === 'monthly' ? 'Monthly Pro' : 'Three-month Pro'}
                </p>
                {plan === 'threeMonthPass' && <MostPopularBadge />}
              </div>
              <ProPrice plan={plan} />
              <ul className="mt-6 flex-1 space-y-3">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-signal" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <UpgradeButton plan={plan} className={cn('mt-7 h-11 w-full gap-2.5 text-white', styles.downloadCta)} arrowClassName={styles.downloadArrow} />
              <p className="mt-3 text-center text-xs text-muted-foreground">Secure Stripe checkout · Cancel anytime</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}

'use client'

import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Container, SectionHeading } from './primitives'
import { PRICING, formatPrice } from '@shared/pricing'

const faqs = [
  {
    q: 'Is it really invisible on a screen share?',
    a: 'The native overlay requests restricted window sharing. Capture behavior varies by macOS version and sharing app, so verify your setup with the free app before relying on it. The landing-page animation illustrates the intended behavior.',
  },
  {
    q: 'Do I need a subscription to download it?',
    a: 'No. Download the app free, explore the bundled example answers, and test screen-share behavior on your own Mac. Pro unlocks AI-powered solutions for your own problems.',
  },
  {
    q: 'What does Pro cost?',
    a: `Pro is ${formatPrice(PRICING.monthly.amount)} USD per month, renewing until canceled. Or pay ${formatPrice(PRICING.threeMonthPass.amount)} USD once for three months of Pro, with no automatic renewal. Both include the same Pro features and monthly usage limits.`,
  },
  {
    q: 'What kinds of problems does it handle?',
    a: 'Coding problems, debugging and optimization, system design, and ML system design. Coding answers include the approach, code, and complexity. Design answers include the key decisions and a rendered architecture diagram.',
  },
  {
    q: 'Does it type or move my cursor?',
    a: 'Never. It does not inject keystrokes or move your cursor. Answers appear only in an overlay that you read and dismiss yourself.',
  },
  {
    q: 'Which macOS versions are supported?',
    a: 'macOS 13 (Ventura) and later, on both Apple Silicon and Intel Macs.',
  },
]

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="scroll-mt-16 border-b border-border py-20 md:py-28">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <SectionHeading eyebrow="FAQ" title="Answers, before you ask." />

          <div className="overflow-hidden rounded-xl border border-border bg-card">
            {faqs.map((item, i) => {
              const isOpen = open === i
              return (
                <div
                  key={item.q}
                  className={i !== faqs.length - 1 ? 'border-b border-border' : ''}
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-medium">{item.q}</span>
                    <Plus
                      className={cn(
                        'size-4 shrink-0 text-muted-foreground transition-transform duration-200',
                        isOpen && 'rotate-45',
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      'grid transition-all duration-200',
                      isOpen
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0',
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Container>
    </section>
  )
}

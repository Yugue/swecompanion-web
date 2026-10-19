'use client'

import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Container, SectionHeading } from './primitives'

const faqs = [
  {
    q: 'Is it really invisible on a screen share?',
    a: 'Yes. The overlay renders on a compositing layer that is excluded from the capture stream at the OS level — so it never appears in screen sharing, screenshots, or recordings. You can verify it yourself for free before subscribing.',
  },
  {
    q: 'Do I need a subscription to download it?',
    a: 'No. The app is free to download and install. You can open it, run it, and confirm the invisibility on your own machine. A Pro subscription unlocks unlimited use of the solutions.',
  },
  {
    q: 'What does the subscription cost?',
    a: 'Pro is $299 per month, or $249 per month billed annually. You can cancel anytime, and the app keeps working through the end of your billing period.',
  },
  {
    q: 'What kinds of problems does it handle?',
    a: 'Data-structure and algorithm problems, debugging your own code, and system-design questions — including reviewing architecture diagrams for bottlenecks and scaling gaps.',
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

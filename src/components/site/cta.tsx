import { Button } from '@/components/ui/button'
import { ArrowRight, Check } from 'lucide-react'
import { Container } from './primitives'

export function Cta() {
  return (
    <section id="download" className="scroll-mt-16 py-20 md:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-2xl border border-border bg-muted px-6 py-16 text-center md:px-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 55% 70% at 50% 0%, color-mix(in oklch, var(--brand-blue) 14%, transparent) 0%, transparent 68%)',
            }}
          />
          <div className="relative mx-auto max-w-xl">
            <h2 className="text-balance text-3xl font-medium tracking-tight text-foreground md:text-4xl">
              Install it free. See it vanish for yourself.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
              Download the macOS app, run your own screen share, and watch the
              overlay disappear. Subscribe only when you are convinced.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="h-11 bg-brand-blue px-5 text-base text-white hover:bg-brand-blue/90"
                render={
                  <a href="#top">
                    Download for macOS
                    <ArrowRight className="size-4" />
                  </a>
                }
              />
              <Button
                size="lg"
                variant="outline"
                className="h-11 px-5 text-base"
                render={<a href="#pricing">See pricing</a>}
              />
            </div>

            <ul className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {['Free to download', 'No card to try', 'Cancel anytime'].map(
                (item) => (
                  <li key={item} className="flex items-center gap-1.5">
                    <Check className="size-3.5 text-brand-blue" />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  )
}

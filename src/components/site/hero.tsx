import { ArrowRight, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Container } from './primitives'
import { ProductDemo } from './product-demo'
import styles from './hero.module.css'

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-border">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(ellipse 70% 45% at 50% 0%, color-mix(in oklch, var(--brand-blue) 9%, transparent), transparent 80%)',
      }} />
      <Container className="relative max-w-7xl pb-12 pt-12 sm:pb-16 sm:pt-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center lg:max-w-none">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-blue/15 bg-card/80 px-3 py-1.5 text-xs text-muted-foreground">
            <EyeOff className="size-3.5 text-brand-blue" aria-hidden />
            Invisible on screen shares, across all meeting apps
          </span>
          <h1 className="mt-5 text-balance text-[clamp(2.3rem,5.2vw,4.25rem)] font-medium leading-[1.08] tracking-[-0.045em] lg:whitespace-nowrap">
            Undetectable AI<br className="lg:hidden" />{' '}
            for SWE interviews
          </h1>
          <p className="mt-5 w-[calc(100vw-24px)] max-w-xl text-pretty text-[clamp(9px,2.65vw,14px)] leading-relaxed text-muted-foreground sm:w-auto sm:text-lg">
            SWECompanion reads your screen and solves or debugs coding and
            system design problems in real time with clean, optimal solutions.
          </p>
          <div className="mt-7 flex flex-col items-center gap-3">
            <Button size="lg" className={cn('h-12 gap-5 rounded-lg px-5 text-white', styles.downloadCta)} render={
              <a href="#download">Download for macOS <ArrowRight className={cn('size-4', styles.downloadArrow)} aria-hidden /></a>
            } />
            <p className="text-sm font-medium text-muted-foreground">No card required</p>
          </div>
        </div>
        <div className="mt-10 sm:mt-12"><ProductDemo /></div>
      </Container>
    </section>
  )
}

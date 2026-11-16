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
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-blue/15 bg-card/80 px-3 py-1.5 text-xs text-muted-foreground">
            <EyeOff className="size-3.5 text-brand-blue" aria-hidden />
            Your private interview companion
          </span>
          <h1 className="mt-5 text-balance text-[clamp(2.3rem,5.2vw,4.25rem)] font-medium leading-[1.08] tracking-[-0.045em]">
            Undetectable AI<br />
            for SWE interviews
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            SWECompanion reads your screen and solves or debugs coding and
            system design problems in real time with clean, optimal solutions.
          </p>
          <div className="mt-7 flex flex-col items-center gap-3">
            <Button size="lg" className={cn('h-12 gap-5 rounded-lg px-5 text-white', styles.downloadCta)} render={
              <a href="#download">Download for macOS <ArrowRight className={cn('size-4', styles.downloadArrow)} aria-hidden /></a>
            } />
            <p className="text-base font-medium text-muted-foreground">No card required</p>
          </div>
        </div>
        <div className="mt-10 sm:mt-12"><ProductDemo /></div>
      </Container>
    </section>
  )
}

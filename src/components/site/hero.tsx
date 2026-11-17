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
      <Container className="relative max-w-[1536px] pb-12 pt-12 sm:pb-16 sm:pt-16">
        <div className={styles.heroGrid}>
        <div className={styles.heroCopy}>
          <span className="inline-flex items-center gap-2 rounded-full border border-brand-blue/15 bg-card/80 px-3 py-1.5 text-xs leading-relaxed text-muted-foreground">
            <EyeOff className="size-3.5 text-brand-blue" aria-hidden />
            Invisible on screen shares, across all meeting apps
          </span>
          <h1 className={cn("mt-5 text-balance font-medium leading-[1.08] tracking-[-0.045em]", styles.heroTitle)}>
            Undetectable AI<br />{' '}
            for SWE interviews
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            SWECompanion reads your screen and solves or debugs coding and
            system design problems in real time with clean, optimal solutions.
          </p>
          <div className={cn("mt-7 flex flex-col gap-3", styles.heroActions)}>
            <Button size="lg" className={cn('h-12 gap-5 rounded-lg px-5 text-white', styles.downloadCta)} render={
              <a href="#download">Download for macOS <ArrowRight className={cn('size-4', styles.downloadArrow)} aria-hidden /></a>
            } />
            <p className="text-sm font-medium text-muted-foreground">No card required</p>
          </div>
        </div>
        <div className={styles.heroPreview}><ProductDemo /></div>
        </div>
      </Container>
    </section>
  )
}

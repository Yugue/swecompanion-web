import { ArrowRight, Eye, MonitorDown, Sparkles } from 'lucide-react'
import { Container, Keycap, SectionHeading } from './primitives'

const steps = [
  {
    step: '01',
    title: 'Download & open',
    body: 'A single macOS app. No browser extension, no plugin, no configuration to fight with. Open it once and it settles quietly into the background, ready whenever you need it.',
    link: 'Download for macOS',
    visual: (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
          <MonitorDown className="size-5 text-brand-blue" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              SWECompanion.dmg
            </p>
            <p className="font-mono text-xs text-muted-foreground">24 MB · macOS 13+</p>
          </div>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[86%] rounded-full bg-brand-blue" />
        </div>
      </div>
    ),
  },
  {
    step: '02',
    title: 'Summon it with a shortcut',
    body: 'When a problem is on your screen, press the shortcut. The companion reads what is in view — a prompt, a code editor, a whiteboard — and starts thinking immediately.',
    link: 'See the shortcut',
    visual: (
      <div className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-6 py-8">
        <Keycap>⌘</Keycap>
        <Keycap>⇧</Keycap>
        <Keycap>Space</Keycap>
      </div>
    ),
  },
  {
    step: '03',
    title: 'Read the concise answer',
    body: 'The approach, complexity, and clean code appear in a compact overlay — no essays, no filler. Just what you need to move forward, rendered on a layer only you can see.',
    link: 'View a sample answer',
    visual: (
      <div className="overflow-hidden rounded-lg border border-border bg-brand-navy p-4">
        <p className="font-mono text-xs text-muted-foreground">Approach · O(n) time · O(n) space</p>
        <p className="mt-2 font-mono text-xs leading-relaxed text-white/90">
          <span className="text-brand-cyan">for</span> i, x <span className="text-brand-cyan">in</span> enumerate(nums):
          <br />
          {'  '}
          <span className="text-brand-cyan">if</span> target - x <span className="text-brand-cyan">in</span> seen:
          <br />
          {'    '}
          <span className="text-brand-teal">return</span> [seen[target - x], i]
        </p>
      </div>
    ),
  },
  {
    step: '04',
    title: 'Stay invisible the whole time',
    body: 'Screen shares, recordings, and screenshots never see the overlay. It never appears in the Dock or the app switcher, and it never types a single synthetic keystroke on your behalf.',
    link: 'How undetectability works',
    visual: (
      <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
        <Eye className="size-5 text-signal" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">Screen shared · Zoom</p>
          <p className="font-mono text-xs text-signal">Companion not detected</p>
        </div>
        <Sparkles className="size-4 shrink-0 text-muted-foreground" />
      </div>
    ),
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-16 border-b border-border py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="From stuck to solved, one shortcut away."
        />

        <div className="mt-16 flex flex-col gap-20 md:mt-24 md:gap-28">
          {steps.map((s, i) => {
            const reversed = i % 2 === 1
            return (
              <div
                key={s.step}
                className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16"
              >
                <div
                  className={`flex flex-col gap-4 ${
                    reversed ? 'md:order-2' : 'md:order-1'
                  }`}
                >
                  <span className="font-mono text-sm text-brand-blue">{s.step}</span>
                  <h3 className="text-2xl font-medium tracking-tight text-foreground md:text-3xl">
                    {s.title}
                  </h3>
                  <p className="max-w-md text-pretty leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                  <a
                    href="#"
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue transition-colors hover:text-brand-blue/80"
                  >
                    {s.link}
                    <ArrowRight className="size-3.5" />
                  </a>
                </div>
                <div
                  className={`relative flex items-center justify-center ${
                    reversed ? 'md:order-1' : 'md:order-2'
                  }`}
                >
                  <div className="w-full max-w-sm">{s.visual}</div>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}

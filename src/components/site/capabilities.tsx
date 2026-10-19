import { cn } from '@/lib/utils'
import { Bug, ScanLine, ShieldCheck, Workflow, Zap } from 'lucide-react'
import { Container, SectionHeading } from './primitives'

const items = [
  {
    icon: ScanLine,
    title: 'Reads the problem on your screen',
    body: 'No copy-paste. The companion captures the prompt in view — LeetCode, a doc, or a whiteboard image — and understands it in context.',
    className: 'md:col-span-3',
    tint: 'text-brand-blue',
  },
  {
    icon: Zap,
    title: 'Concise, optimal solutions',
    body: 'Not a wall of text. You get the approach, the complexity, and clean code — the way a strong engineer would explain it.',
    className: 'md:col-span-3',
    tint: 'text-signal',
  },
  {
    icon: Bug,
    title: 'Debugs your existing code',
    body: 'Paste or point it at your draft. It finds the root cause and returns the smallest correct fix.',
    className: 'md:col-span-2',
    tint: 'text-brand-cyan',
  },
  {
    icon: Workflow,
    title: 'Critiques system-design diagrams',
    body: 'Reviews your architecture for bottlenecks, single points of failure, and the scaling questions you missed.',
    className: 'md:col-span-2',
    tint: 'text-brand-blue',
  },
  {
    icon: ShieldCheck,
    title: 'Invisible by design',
    body: 'Every answer appears only for you — never in the capture stream.',
    className: 'md:col-span-2',
    tint: 'text-signal',
  },
]

export function Capabilities() {
  return (
    <section id="features" className="scroll-mt-16 border-b border-border py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="What it does"
          title="Everything you need in the moment — nothing they can see."
          description="Four focused capabilities, each tuned for speed and clarity under pressure."
        />

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-6">
          {items.map((item) => (
            <article
              key={item.title}
              className={cn(
                'group flex flex-col justify-between rounded-xl border border-border bg-card p-6 transition-colors hover:border-foreground/20',
                item.className,
              )}
            >
              <div
                className={cn(
                  'flex size-9 items-center justify-center rounded-md border border-border bg-accent',
                  item.tint,
                )}
              >
                <item.icon className="size-4.5" />
              </div>
              <div className="mt-8">
                <h3 className="text-base font-medium tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  )
}

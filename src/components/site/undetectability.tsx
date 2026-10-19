import { Check } from 'lucide-react'
import { Container } from './primitives'

const specs = [
  {
    label: 'Screen sharing',
    detail: 'Excluded from Zoom, Meet, Teams, and Slack share streams.',
    status: 'Invisible',
  },
  {
    label: 'Screen capture',
    detail: 'Absent from screenshots and full-screen grabs at the OS layer.',
    status: 'Invisible',
  },
  {
    label: 'Screen recording',
    detail: 'Never written into recorded video, local or cloud.',
    status: 'Invisible',
  },
  {
    label: 'Window switchers',
    detail: 'No entry in the Dock, Mission Control, or ⌘-Tab.',
    status: 'Hidden',
  },
  {
    label: 'Keystrokes',
    detail: 'No synthetic typing — nothing appears in your editor or logs.',
    status: 'Silent',
  },
  {
    label: 'Your view only',
    detail: 'The overlay renders on a layer only your display composites.',
    status: 'Yours',
  },
]

export function Undetectability() {
  return (
    <section className="border-y border-border bg-muted/40 py-20 md:py-28">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="flex flex-col gap-4">
            <span className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-brand-blue uppercase">
              <span aria-hidden className="size-1.5 rounded-full bg-brand-blue" />
              Undetectable
            </span>
            <h2 className="text-balance text-3xl font-medium tracking-tight text-foreground md:text-4xl">
              Built to leave no trace.
            </h2>
            <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground">
              Undetectability is not a setting — it is the architecture. Here is
              exactly what every capture surface receives from the companion.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card">
            {specs.map((s, i) => (
              <div
                key={s.label}
                className={`flex items-center gap-4 px-5 py-4 ${
                  i !== specs.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full border border-brand-blue/30 bg-brand-blue/10 text-brand-blue">
                  <Check className="size-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{s.label}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{s.detail}</p>
                </div>
                <span className="shrink-0 font-mono text-xs tracking-wide text-brand-blue">
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

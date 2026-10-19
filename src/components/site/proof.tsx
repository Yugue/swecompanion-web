import { Container } from './primitives'

const stats = [
  { value: '12,000+', label: 'engineers practicing', tint: 'text-brand-blue' },
  { value: '0', label: 'frames captured', tint: 'text-signal' },
  { value: '<400ms', label: 'to first answer', tint: 'text-brand-cyan' },
  { value: '4.9/5', label: 'average rating', tint: 'text-brand-blue' },
]

const quotes = [
  {
    quote:
      'It stays out of the way until I need it, then it is exactly the concise answer I was reaching for. The overlay genuinely never shows up on my recordings.',
    name: 'Priya N.',
    role: 'Senior SWE, prepping for staff',
  },
  {
    quote:
      'I stopped panicking mid-practice. Being able to see a clean approach in a second — without it touching my screen share — changed how I rehearse.',
    name: 'Marcus D.',
    role: 'Backend engineer',
  },
]

export function Proof() {
  return (
    <section className="border-b border-border py-16 md:py-20">
      <Container>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-card px-5 py-7 text-center">
              <div
                className={`text-2xl font-medium tracking-tight md:text-3xl ${s.tint}`}
              >
                {s.value}
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {quotes.map((q) => (
            <figure
              key={q.name}
              className="flex flex-col justify-between rounded-xl border border-border bg-card p-6"
            >
              <blockquote className="text-pretty text-sm leading-relaxed text-foreground">
                &ldquo;{q.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <span className="flex size-8 items-center justify-center rounded-full border border-border bg-muted/50 font-mono text-xs text-muted-foreground">
                  {q.name.charAt(0)}
                </span>
                <span className="text-sm">
                  <span className="font-medium">{q.name}</span>
                  <span className="text-muted-foreground"> · {q.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  )
}

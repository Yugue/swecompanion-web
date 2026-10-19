import { Container } from './primitives'
import { Wordmark } from './wordmark'

const groups = [
  {
    title: 'Product',
    links: ['Demo', 'Features', 'How it works', 'Pricing'],
  },
  {
    title: 'Resources',
    links: ['FAQ', 'Changelog', 'System requirements', 'Support'],
  },
  {
    title: 'Company',
    links: ['About', 'Privacy', 'Terms', 'Contact'],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <Container>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="col-span-2 md:col-span-1">
            <Wordmark />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A quiet companion for interview prep. Concise answers, on your
              screen only.
            </p>
          </div>
          {groups.map((g) => (
            <div key={g.title}>
              <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
                {g.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {g.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#top"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} SWECompanion. A portfolio project.</p>
          <p className="font-mono">Built for practice · not affiliated with any employer</p>
        </div>
      </Container>
    </footer>
  )
}

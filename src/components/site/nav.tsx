'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Wordmark } from './wordmark'

const links = [
  { label: 'Demo', href: '#demo' },
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Free guides', href: '/coding' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md transition-colors',
        scrolled ? 'border-b border-border' : 'border-b border-transparent',
      )}
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-5 md:px-8">
        <a href="#top" className="flex items-center gap-2" aria-label="SWECompanion home">
          <Wordmark />
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" render={<a href="#pricing">Sign in</a>} />
          <Button size="sm" render={<a href="#download">Download for macOS</a>} />
        </div>

        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-md border border-border text-foreground md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-5 py-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <Button
              className="mt-2 w-full"
              size="sm"
              render={<a href="#download" onClick={() => setOpen(false)}>Download for macOS</a>}
            />
          </div>
        </div>
      ) : null}
    </header>
  )
}

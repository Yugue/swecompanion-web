'use client'

import { Button } from '@/components/ui/button'
import { AccountMenu } from '@/components/auth/AccountMenu'
import { ProductMark } from '@/components/ProductMark'
import Link from 'next/link'
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
      <div className="mx-auto flex w-full max-w-[1440px] items-center gap-2 px-3 py-2 md:gap-3 md:px-8 md:py-3">
        <a href="#top" className="flex shrink-0 items-center gap-2" aria-label="SWECompanion home">
          <span className="sm:hidden"><ProductMark size={30} /></span>
          <Wordmark className="hidden sm:flex" />
        </a>

        <nav className="hidden items-center gap-1 min-[1440px]:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-1.5 text-sm whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <Button
          variant="outline"
          size="sm"
          className="ml-auto h-9 px-2 sm:px-3 min-[1440px]:ml-2"
          render={
            <Link href="/coding" aria-label="Interview Prep Guides">
              <span className="whitespace-nowrap md:hidden">Interview Prep</span>
              <span className="hidden whitespace-nowrap md:inline">Interview Prep Guides</span>
            </Link>
          }
        />

        <div className="flex shrink-0 items-center gap-2 min-[1440px]:ml-auto">
          <AccountMenu
            signInLabel="Login"
            signInClassName="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-primary-foreground hover:bg-primary/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          />
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-md border border-border text-foreground min-[1440px]:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-border bg-background min-[1440px]:hidden">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-1 px-5 py-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  )
}

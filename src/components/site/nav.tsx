'use client'

import { Button } from '@/components/ui/button'
import { AccountMenu } from '@/components/auth/AccountMenu'
import { ProductMark } from '@/components/ProductMark'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { Wordmark } from './wordmark'

const links = [
  { label: 'How it works', href: '#how' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Help', href: '#faq' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

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
      <div className="mx-auto flex w-full max-w-[1440px] items-center gap-1 px-2 py-2 sm:gap-2 sm:px-3 md:gap-2 md:px-5 md:py-3 lg:gap-3 lg:px-8">
        <a href="#top" className="flex shrink-0 items-center gap-2" aria-label="SWECompanion home">
          <span className="lg:hidden"><ProductMark size={30} /></span>
          <Wordmark className="hidden lg:flex" />
        </a>

        <nav className="hidden items-center gap-0 md:flex lg:gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-2 py-1.5 text-sm lg:px-3 whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <Button
          variant="outline"
          size="sm"
          className="h-9 shrink-0 px-1.5 text-xs sm:px-3 sm:text-[0.8rem]"
          render={
            <Link href="/coding" aria-label="Interview Prep Guides">
              <span className="whitespace-nowrap">Interview Prep Guides</span>
            </Link>
          }
        />

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <Button
            size="sm"
            className="h-9 bg-brand-blue px-2 text-xs text-white hover:bg-brand-blue/90 sm:px-3 sm:text-[0.8rem]"
            render={<Link href="/signup">Try for free</Link>}
          />
          <AccountMenu
            signInLabel="Login"
            signInClassName="inline-flex h-9 items-center justify-center rounded-md bg-transparent px-2 text-xs text-foreground hover:bg-muted hover:brightness-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:px-3 sm:text-sm"
          />
        </div>
      </div>

    </header>
  )
}

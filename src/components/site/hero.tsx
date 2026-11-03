'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowRight, EyeOff, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Container } from './primitives'

type TabId = 'leetcode' | 'debug' | 'system'

const tabs: { id: TabId; label: string; problem: string; prompt: string }[] = [
  { id: 'leetcode', label: 'LeetCode', problem: 'Two Sum II — sorted input', prompt: 'Find two numbers in a sorted array that add up to the target. Use constant extra space.' },
  { id: 'debug', label: 'Debug my code', problem: 'Off-by-one in binary search', prompt: 'The target exists, but binary search returns no match. Find and fix the boundary error.' },
  { id: 'system', label: 'System design', problem: 'Design a URL shortener', prompt: 'Design a service that creates short links and redirects users reliably at scale.' },
]

const panels: Record<
  TabId,
  { title: string; lines: { t: string; dim?: boolean }[]; footer: string }
> = {
  leetcode: {
    title: 'Optimal — two pointers · O(n) time · O(1) space',
    lines: [
      { t: 'Since the array is sorted, walk from both ends.', dim: true },
      { t: 'l, r = 0, len(nums) - 1' },
      { t: 'while l < r:' },
      { t: '    s = nums[l] + nums[r]' },
      { t: '    if s == target: return [l + 1, r + 1]' },
      { t: '    if s < target: l += 1' },
      { t: '    else: r -= 1' },
    ],
    footer: 'Beats sorting or hashing — no extra space needed.',
  },
  debug: {
    title: 'Root cause — loop bound excludes the last index',
    lines: [
      { t: 'Your `hi = len(nums) - 1` but the loop uses `hi`.', dim: true },
      { t: '- while lo < hi:      # misses hi' },
      { t: '+ while lo <= hi:     # inclusive' },
      { t: '      mid = (lo + hi) // 2' },
      { t: '      if nums[mid] == t: return mid' },
      { t: '      elif nums[mid] < t: lo = mid + 1' },
      { t: '      else: hi = mid - 1' },
    ],
    footer: 'One-character fix — verified against the failing case.',
  },
  system: {
    title: 'Approach — 7-char key · base62 · read-heavy',
    lines: [
      { t: 'Encode an auto-increment id in base62 (~57B keys).', dim: true },
      { t: 'Write:  id -> base62(id) -> store {key, url}' },
      { t: 'Read:   key -> lookup -> 301 redirect' },
      { t: 'Cache:  LRU in front of the KV store (99% reads)' },
      { t: 'Scale:  stateless app tier + sharded KV by key' },
      { t: 'Bonus:  bloom filter to reject unknown keys fast' },
    ],
    footer: 'Covers hashing collisions, caching, and the read/write split.',
  },
}

export function Hero() {
  const [active, setActive] = useState<TabId>('leetcode')
  const [hasSelectedTab, setHasSelectedTab] = useState(false)

  useEffect(() => {
    if (hasSelectedTab) return

    const interval = window.setInterval(() => {
      setActive((current) => {
        const index = tabs.findIndex((tab) => tab.id === current)
        return tabs[(index + 1) % tabs.length].id
      })
    }, 5000)

    return () => window.clearInterval(interval)
  }, [hasSelectedTab])

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-border"
    >
      {/* subtle blue wash from the top only */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% -10%, color-mix(in oklch, var(--brand-blue) 12%, transparent) 0%, transparent 70%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage:
            'radial-gradient(ellipse 70% 55% at 50% 0%, black 10%, transparent 68%)',
        }}
      />

      <Container className="relative grid max-w-7xl gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-12 lg:py-24">
        <div className="mx-auto flex min-w-0 max-w-xl flex-col items-center text-center lg:items-start lg:text-left">
          <span className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-brand-blue/15 bg-brand-blue/5 px-3 py-1.5 text-xs text-muted-foreground">
            <span className="size-1.5 shrink-0 rounded-full bg-brand-blue" />
            Invisible to screen share, capture &amp; recording
          </span>

          <h1 className="text-balance text-4xl font-medium leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-[clamp(2.5rem,3.5vw,3.25rem)]">
            Undetectable AI<br className="hidden lg:block" />{' '}
            for SWE interviews
          </h1>

          <p className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground">
            SWECompanion reads your screen and solves or debugs coding and
            system design problems in real time with clean, optimal solutions.
          </p>

          <div className="mt-8">
            <Button
              size="lg"
              className="h-auto min-h-14 gap-7 rounded-xl bg-brand-blue px-5 py-3 text-white shadow-sm hover:bg-brand-blue/90"
              render={
                <a href="#download">
                  <span className="flex flex-col items-start gap-0.5 text-left">
                    <span className="text-sm font-semibold leading-5">Download for macOS</span>
                    <span className="text-xs font-normal leading-4 text-white/80">Try for free</span>
                  </span>
                  <ArrowRight className="size-4" aria-hidden="true" />
                </a>
              }
            />
          </div>
        </div>

        <div className="min-w-0 space-y-4">
          <div className="mx-auto w-full max-w-md">
            <div role="tablist" aria-label="Choose a problem type" className="grid grid-cols-3 gap-1 rounded-lg border border-border bg-card p-1 shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  id={`demo-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={active === tab.id}
                  aria-controls={`demo-panel-${tab.id}`}
                  onClick={() => {
                    setHasSelectedTab(true)
                    setActive(tab.id)
                  }}
                  className={cn(
                    'rounded-md px-2 py-2 text-xs font-medium transition-colors sm:text-sm',
                    active === tab.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-background hover:text-foreground',
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="min-w-0 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_16px_60px_-24px_color-mix(in_oklch,var(--brand-blue)_25%,transparent)]">
            <div className="flex items-center justify-between gap-3 border-b border-border bg-muted/40 px-4 py-3 sm:px-5">
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="size-2.5 rounded-full border border-border bg-background" />
                <span className="size-2.5 rounded-full border border-border bg-background" />
                <span className="size-2.5 rounded-full border border-border bg-background" />
              </span>
              <span className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
                <span className="size-1.5 rounded-full bg-destructive" />
                Zoom · screen shared
              </span>
            </div>

            {/* Overlap panels so the preview height stays stable as the demo rotates. */}
            <div className="grid">
              {tabs.map((tab) => {
                const panel = panels[tab.id]
                const isActive = active === tab.id
                return (
                  <div
                    key={tab.id}
                    id={`demo-panel-${tab.id}`}
                    role="tabpanel"
                    aria-labelledby={`demo-tab-${tab.id}`}
                    aria-hidden={!isActive}
                    inert={!isActive}
                    className={cn('col-start-1 row-start-1 min-w-0', !isActive && 'invisible pointer-events-none')}
                  >
                    <div className="border-b border-border bg-muted/15 px-4 py-4 sm:px-5">
                      <p className="font-mono text-xs text-muted-foreground">problem.md</p>
                      <h3 className="mt-1.5 text-base font-medium tracking-tight text-foreground">{tab.problem}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{tab.prompt}</p>
                    </div>

                    <div className="px-4 py-5 sm:px-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-signal">
                          <Sparkles className="size-3.5" />
                          SWECompanion
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[10px] text-muted-foreground">
                          <EyeOff className="size-3" />
                          Hidden from screen share
                        </span>
                      </div>
                      <p className="mt-3 text-sm font-medium leading-relaxed">{panel.title}</p>
                      <pre className="mt-3 whitespace-pre-wrap break-words rounded-lg border border-brand-navy bg-brand-navy p-3 font-mono text-[12px] leading-relaxed text-brand-navy-foreground [overflow-wrap:anywhere] sm:p-4">
                        <code>
                          {panel.lines.map((line, i) => (
                            <span key={i} className={cn('block', line.dim && 'text-brand-cyan/80')}>
                              {line.t}
                            </span>
                          ))}
                        </code>
                      </pre>
                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{panel.footer}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

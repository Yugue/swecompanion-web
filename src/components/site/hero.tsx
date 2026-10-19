'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowRight, BadgeCheck, EyeOff, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Container } from './primitives'

type TabId = 'leetcode' | 'debug' | 'system'

const tabs: { id: TabId; label: string; problem: string }[] = [
  { id: 'leetcode', label: 'LeetCode', problem: 'Two Sum II — sorted input' },
  { id: 'debug', label: 'Debug my code', problem: 'Off-by-one in binary search' },
  { id: 'system', label: 'System design', problem: 'Design a URL shortener' },
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
  const panel = panels[active]

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

      <Container className="relative py-20 md:py-28">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 font-mono text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-brand-blue" />
            Invisible to screen share, capture &amp; recording
          </span>

          <h1 className="text-balance text-4xl font-medium leading-[1.05] tracking-tight text-foreground md:text-6xl">
            Ace the SWE interview. Leave no trace.
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            SWECompanion is the invisible interview copilot for software
            engineers — it reads the problem on your screen and hands you a
            clear, optimal solution in seconds, invisible to screen share,
            capture, and recording.
          </p>

          <p className="mt-5 inline-flex items-center gap-2 text-sm text-foreground">
            <BadgeCheck className="size-4 shrink-0 text-brand-blue" />
            <span>
              Battle-tested by our own team — we used it to land offers at{" "}
              <span className="font-medium">Google</span>,{" "}
              <span className="font-medium">Meta</span>,{" "}
              <span className="font-medium">Scale AI</span>,{" "}
              <span className="font-medium">Tesla</span>, and more.
            </span>
          </p>
        </div>

        {/* problem-type selector */}
        <div className="mx-auto mt-12 flex max-w-4xl justify-center">
          <div
            role="tablist"
            aria-label="Choose a problem type"
            className="flex flex-wrap items-center justify-center gap-1 rounded-lg border border-border bg-card p-1"
          >
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active === t.id}
                onClick={() => setActive(t.id)}
                className={cn(
                  'rounded-md px-3.5 py-1.5 text-sm transition-colors',
                  active === t.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* window frame */}
        <div className="mx-auto mt-6 max-w-4xl overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {/* title bar */}
          <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2.5">
            <span className="flex gap-1.5">
              <span className="size-3 rounded-full border border-border bg-background" />
              <span className="size-3 rounded-full border border-border bg-background" />
              <span className="size-3 rounded-full border border-border bg-background" />
            </span>
            <span className="ml-2 flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <span className="inline-block size-1.5 rounded-full bg-destructive" />
              Zoom · screen shared
            </span>
          </div>

          <div className="relative grid gap-0 md:grid-cols-[1.15fr_1fr]">
            {/* the "problem" side — visible to everyone on the call */}
            <div className="border-b border-border p-6 md:border-b-0 md:border-r">
              <p className="font-mono text-xs text-muted-foreground">
                problem.md
              </p>
              <h3 className="mt-3 text-lg font-medium tracking-tight">
                {tabs.find((t) => t.id === active)?.problem}
              </h3>
              <div className="mt-4 space-y-2.5">
                {[85, 72, 90, 64].map((w, i) => (
                  <div
                    key={i}
                    className="h-2.5 rounded-full bg-muted"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
              <div className="mt-6 rounded-lg border border-border bg-muted/40 p-3">
                <div className="h-2.5 w-1/3 rounded-full bg-muted" />
                <div className="mt-2 h-2.5 w-3/4 rounded-full bg-muted" />
              </div>
            </div>

            {/* the companion overlay side — only you see this */}
            <div className="relative min-h-[280px] p-6">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-mono text-xs text-signal">
                  <Sparkles className="size-3.5" />
                  SWECompanion
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                  <EyeOff className="size-3" />
                  Hidden from screen share
                </span>
              </div>
              <p className="mt-3 text-sm font-medium">{panel.title}</p>
              <pre className="mt-3 overflow-x-auto rounded-lg border border-brand-navy bg-brand-navy p-3 font-mono text-[12px] leading-relaxed text-brand-navy-foreground">
                <code>
                  {panel.lines.map((line, i) => (
                    <div key={i} className={cn(line.dim && 'text-brand-cyan/80')}>
                      {line.t}
                    </div>
                  ))}
                </code>
              </pre>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {panel.footer}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            size="lg"
            className="h-11 bg-brand-blue px-5 text-[0.95rem] text-white hover:bg-brand-blue/90"
            render={
              <a href="#download">
                Download for macOS
                <ArrowRight className="size-4" />
              </a>
            }
          />
        </div>
      </Container>
    </section>
  )
}

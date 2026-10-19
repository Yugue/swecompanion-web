import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

export function Container({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('mx-auto w-full max-w-6xl px-5 md:px-8', className)}>
      {children}
    </div>
  )
}

export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase',
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-signal" />
      {children}
    </span>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="text-balance text-3xl font-medium tracking-tight md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            'max-w-2xl text-pretty leading-relaxed text-muted-foreground',
            align === 'center' && 'mx-auto',
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  )
}

export function Keycap({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-[5px] border border-border bg-card px-1.5 font-mono text-xs text-foreground shadow-[0_1px_0_var(--border)]">
      {children}
    </kbd>
  )
}

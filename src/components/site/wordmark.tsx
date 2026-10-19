import { cn } from '@/lib/utils'

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'flex items-center gap-1.5 text-[15px] font-medium tracking-tight text-foreground',
        className,
      )}
    >
      <span aria-hidden className="font-mono text-brand-blue">[</span>
      SWECompanion
      <span aria-hidden className="font-mono text-brand-cyan">]</span>
    </span>
  )
}

import { cn } from '@/lib/utils'
import { ProductMark } from '@/components/ProductMark'

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'flex items-center gap-1.5 text-base font-medium tracking-tight text-foreground',
        className,
      )}
    >
      <ProductMark size={30} />
      SWECompanion
    </span>
  )
}

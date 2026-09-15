import { cn } from '@/lib/cn'

export function Logo({
  className,
  tone = 'dark',
  showWordmark = true,
}: {
  className?: string
  tone?: 'dark' | 'light'
  showWordmark?: boolean
}) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span
        className={cn(
          'grid h-7 w-7 shrink-0 place-items-center rounded-lg text-[15px] font-bold leading-none',
          tone === 'dark' ? 'bg-navy-900 text-white' : 'bg-white text-navy-900',
        )}
        aria-hidden="true"
      >
        A
      </span>
      {showWordmark ? (
        <span
          className={cn(
            'text-[15px] font-semibold tracking-tight',
            tone === 'dark' ? 'text-navy-900' : 'text-white',
          )}
        >
          Atlas
        </span>
      ) : null}
    </span>
  )
}

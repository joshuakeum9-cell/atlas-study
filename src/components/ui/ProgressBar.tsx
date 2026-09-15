import { cn } from '@/lib/cn'

interface ProgressBarProps {
  value: number
  label?: string
  tone?: 'brand' | 'amber' | 'emerald'
  className?: string
}

const TONES = {
  brand: 'bg-brand-600',
  amber: 'bg-amber-500',
  emerald: 'bg-emerald-600',
} as const

/** A labelled meter. Uses role="meter" so assistive tech reads the value. */
export function ProgressBar({ value, label, tone = 'brand', className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)))
  return (
    <div
      className={cn('h-2 w-full overflow-hidden rounded-full bg-navy-100', className)}
      role="meter"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-700 ease-out', TONES[tone])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

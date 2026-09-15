import type { ReactNode } from 'react'
import { FlaskConical } from 'lucide-react'
import { cn } from '@/lib/cn'

type Tone = 'neutral' | 'brand' | 'amber' | 'emerald' | 'rose' | 'violet'

const TONES: Record<Tone, string> = {
  neutral: 'bg-navy-100 text-navy-700 ring-navy-200',
  brand: 'bg-brand-50 text-brand-800 ring-brand-200',
  amber: 'bg-amber-50 text-amber-800 ring-amber-200',
  emerald: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  rose: 'bg-rose-50 text-rose-800 ring-rose-200',
  violet: 'bg-violet-50 text-violet-800 ring-violet-200',
}

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11.5px] font-medium ring-1 ring-inset',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

/**
 * The simulated-AI marker.
 *
 * It appears next to every piece of generated output in the app. The prototype
 * has to be honest about what is real, and a single banner at the top of the
 * page is not enough once someone is three clicks deep into a tutor reply.
 */
export function SimulatedTag({ label = 'Simulated', className }: { label?: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide text-violet-700 ring-1 ring-inset ring-violet-200',
        className,
      )}
      title="This output is scripted mock data. No AI model is called and nothing leaves your browser."
    >
      <FlaskConical className="h-3 w-3" aria-hidden="true" />
      {label}
    </span>
  )
}

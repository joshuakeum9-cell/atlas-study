import { FlaskConical } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * The honesty label, required on every screen.
 *
 * Someone shown this prototype should never be in doubt about what is real.
 * The banner states it once per page; `SimulatedTag` repeats it next to each
 * individual piece of generated output.
 */
export function PrototypeBanner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-start gap-2.5 bg-navy-900 px-4 py-2 text-[12.5px] leading-relaxed text-navy-100 sm:items-center sm:justify-center',
        className,
      )}
    >
      <FlaskConical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-300 sm:mt-0" aria-hidden="true" />
      <p>
        <span className="font-semibold text-white">Interactive concept prototype.</span>{' '}
        Every AI answer, transcription, voice input and search result is simulated with local mock
        data. No model is called, nothing is uploaded, and there is no account or backend.
      </p>
    </div>
  )
}

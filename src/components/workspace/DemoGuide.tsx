import { useEffect, useRef, useState } from 'react'
import { Check, Compass } from 'lucide-react'
import { DEMO_STEPS, useStore } from '@/state/store'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'

/**
 * A quiet checklist of the things worth trying.
 *
 * A prototype is only useful if the person you hand it to finds the parts that
 * matter. This tracks what they have already done rather than interrupting them
 * with a tour.
 */
export function DemoGuide() {
  const { state } = useStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const done = state.explored.length
  const total = DEMO_STEPS.length

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <Button
        size="sm"
        variant={done === total ? 'subtle' : 'secondary'}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <Compass className="h-3.5 w-3.5 text-brand-700" />
        <span className="hidden sm:inline">Demo guide</span>
        <span className="tabular-nums text-navy-500">
          {done}/{total}
        </span>
      </Button>

      {open ? (
        <div
          role="dialog"
          aria-label="Demo guide"
          className="absolute right-0 top-10 z-50 w-72 animate-fade-up overflow-hidden rounded-xl bg-white shadow-lift ring-1 ring-navy-200"
        >
          <div className="border-b border-navy-100 px-3.5 py-3">
            <p className="text-[13.5px] font-semibold text-navy-900">Things worth trying</p>
            <p className="mt-1 text-[12px] leading-relaxed text-navy-600">
              Nothing here is required. Tick them off in any order.
            </p>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-navy-100">
              <div
                className="h-full rounded-full bg-brand-600 transition-[width] duration-500"
                style={{ width: `${(done / total) * 100}%` }}
              />
            </div>
          </div>

          <ul className="scrollbar-slim max-h-80 overflow-y-auto py-1.5">
            {DEMO_STEPS.map((step) => {
              const complete = state.explored.includes(step.id)
              return (
                <li key={step.id} className="flex items-center gap-2.5 px-3.5 py-1.5">
                  <span
                    className={cn(
                      'grid h-4 w-4 shrink-0 place-items-center rounded-full ring-1',
                      complete
                        ? 'bg-emerald-600 text-white ring-emerald-600'
                        : 'bg-white text-transparent ring-navy-300',
                    )}
                  >
                    <Check className="h-2.5 w-2.5" aria-hidden="true" />
                  </span>
                  <span
                    className={cn(
                      'text-[12.5px]',
                      complete ? 'text-navy-500 line-through' : 'text-navy-800',
                    )}
                  >
                    {step.label}
                  </span>
                </li>
              )
            })}
          </ul>

          {done === total ? (
            <p className="border-t border-navy-100 bg-emerald-50 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-emerald-900">
              That is everything. If you have feedback on the idea, this is the moment it is most
              useful.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

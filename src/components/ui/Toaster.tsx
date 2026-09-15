import { useEffect } from 'react'
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useStore, type Toast } from '@/state/store'

const TONES = {
  info: { icon: Info, ring: 'ring-navy-200', badge: 'text-brand-700 bg-brand-50' },
  success: { icon: CheckCircle2, ring: 'ring-emerald-200', badge: 'text-emerald-700 bg-emerald-50' },
  warn: { icon: AlertTriangle, ring: 'ring-amber-200', badge: 'text-amber-700 bg-amber-50' },
} as const

function ToastCard({ toast }: { toast: Toast }) {
  const { dispatch } = useStore()
  const { icon: Icon, ring, badge } = TONES[toast.tone]

  useEffect(() => {
    const timer = setTimeout(() => dispatch({ type: 'dismiss-toast', id: toast.id }), 4600)
    return () => clearTimeout(timer)
  }, [toast.id, dispatch])

  return (
    <div
      className={cn(
        'pointer-events-auto flex w-full max-w-sm animate-fade-up items-start gap-3 rounded-xl bg-white p-3 shadow-lift ring-1',
        ring,
      )}
    >
      <span className={cn('mt-0.5 rounded-lg p-1.5', badge)}>
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13.5px] font-semibold text-navy-900">{toast.title}</p>
        {toast.detail ? <p className="mt-0.5 text-[12.5px] leading-relaxed text-navy-600">{toast.detail}</p> : null}
      </div>
      <button
        type="button"
        onClick={() => dispatch({ type: 'dismiss-toast', id: toast.id })}
        aria-label={`Dismiss: ${toast.title}`}
        className="rounded-md p-1 text-navy-400 transition-colors hover:bg-navy-100 hover:text-navy-700"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export function Toaster() {
  const { state } = useStore()
  return (
    <div
      className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2"
      role="status"
      aria-live="polite"
    >
      {state.toasts.map((t) => (
        <ToastCard key={t.id} toast={t} />
      ))}
    </div>
  )
}

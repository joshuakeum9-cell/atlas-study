import { useEffect, useRef, useState } from 'react'
import { Mic, Square, X } from 'lucide-react'
import { startListening, type VoiceSession } from '@/services/voice'
import { Button } from '@/components/ui/Button'
import { SimulatedTag } from '@/components/ui/Badge'

interface VoiceOverlayProps {
  open: boolean
  onCancel: () => void
  onResult: (transcript: string) => void
}

/**
 * The listening state.
 *
 * The waveform is driven by generated levels rather than real audio, but the
 * interaction is the real one: it shows words appearing as they are recognised,
 * it can be stopped early, and it can be cancelled without sending anything.
 */
export function VoiceOverlay({ open, onCancel, onResult }: VoiceOverlayProps) {
  const [levels, setLevels] = useState<number[]>(() => new Array(28).fill(0.08))
  const [partial, setPartial] = useState('')
  const sessionRef = useRef<VoiceSession | null>(null)

  useEffect(() => {
    if (!open) return
    setPartial('')
    setLevels(new Array(28).fill(0.08))

    const session = startListening({
      onLevel: setLevels,
      onPartial: setPartial,
      onFinal: (text) => {
        sessionRef.current = null
        onResult(text)
      },
      onCancel: () => {
        sessionRef.current = null
      },
    })
    sessionRef.current = session

    return () => {
      session.cancel()
      sessionRef.current = null
    }
  }, [open, onResult])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onCancel()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="animate-fade-up rounded-xl bg-navy-900 p-3.5 shadow-lift"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2">
        <span className="relative grid h-7 w-7 place-items-center rounded-full bg-rose-500">
          <span className="absolute inset-0 animate-pulse-ring rounded-full bg-rose-500/60" />
          <Mic className="relative h-3.5 w-3.5 text-white" aria-hidden="true" />
        </span>
        <p className="text-[12.5px] font-semibold text-white">Listening</p>
        <SimulatedTag label="Simulated voice" className="ml-auto bg-white/10 text-violet-200 ring-white/20" />
      </div>

      {/* Waveform */}
      <div className="mt-3 flex h-10 items-center justify-center gap-[3px]" aria-hidden="true">
        {levels.map((level, i) => (
          <span
            key={i}
            className="w-[3px] rounded-full bg-brand-400 transition-[height] duration-75 ease-out"
            style={{ height: `${Math.max(8, level * 100)}%`, opacity: 0.45 + level * 0.55 }}
          />
        ))}
      </div>

      <p className="mt-2 min-h-[2.5rem] text-center text-[13px] leading-relaxed text-navy-100">
        {partial ? (
          <>
            {partial}
            <span className="ml-0.5 inline-block h-3.5 w-[2px] animate-caret bg-brand-300 align-middle" />
          </>
        ) : (
          <span className="text-navy-400">Say your question...</span>
        )}
      </p>

      <div className="mt-2 flex items-center justify-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          className="text-navy-200 hover:bg-white/10 hover:text-white"
          onClick={onCancel}
        >
          <X className="h-3.5 w-3.5" />
          Cancel
        </Button>
        <Button size="sm" variant="secondary" onClick={() => sessionRef.current?.stop()}>
          <Square className="h-3 w-3 fill-current" />
          Stop and send
        </Button>
      </div>
    </div>
  )
}

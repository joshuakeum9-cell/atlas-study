import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Check, Pencil, RotateCcw, Wand2 } from 'lucide-react'
import type { OcrResult } from '@/services/ocr'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { SimulatedTag } from '@/components/ui/Badge'
import { WorksheetCrop } from './WorksheetCrop'
import { cn } from '@/lib/cn'

interface TranscriptionDialogProps {
  result: OcrResult | null
  open: boolean
  onCancel: () => void
  /** Called with the final text the student agreed to. */
  onConfirm: (transcript: string, wasEdited: boolean) => void
}

/**
 * The confirmation step.
 *
 * This screen is the whole reason the flow is trustworthy. Recognition on
 * handwriting is never certain, so the student sees exactly what was read,
 * which characters the recogniser doubted, and can fix it before the tutor
 * reasons about anything.
 */
export function TranscriptionDialog({ result, open, onCancel, onConfirm }: TranscriptionDialogProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  useEffect(() => {
    if (open && result) {
      setDraft(result.transcript)
      setEditing(false)
    }
  }, [open, result])

  const confidencePct = result ? Math.round(result.confidence * 100) : 0
  const lowConfidence = confidencePct < 90

  /** Splits the transcript so uncertain tokens can be highlighted in place. */
  const segments = useMemo(() => {
    if (!result) return []
    if (!result.uncertainTokens.length) return [{ text: result.transcript, uncertain: false }]
    const pattern = new RegExp(
      `(${result.uncertainTokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
      'g',
    )
    return result.transcript
      .split(pattern)
      .filter(Boolean)
      .map((text) => ({ text, uncertain: result.uncertainTokens.includes(text) }))
  }, [result])

  if (!result) return null

  const edited = draft.trim() !== result.transcript.trim()

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={`Confirm what was read from ${result.partLabel}`}
      description="Check the transcription before the tutor works with it. Nothing is sent until you confirm."
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          {editing ? (
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setDraft(result.transcript)
                  setEditing(false)
                }}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Revert
              </Button>
              <Button
                variant="primary"
                onClick={() => onConfirm(draft.trim() || result.transcript, edited)}
                disabled={!draft.trim()}
              >
                <Check className="h-4 w-4" />
                Save and ask the tutor
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setEditing(true)}>
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button variant="primary" onClick={() => onConfirm(result.transcript, false)}>
                <Check className="h-4 w-4" />
                Confirm
              </Button>
            </>
          )}
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-navy-500">
            What you selected
          </p>
          <WorksheetCrop box={result.box} />
        </div>

        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-navy-500">
              Transcription
            </p>
            <SimulatedTag label="Simulated OCR" />
            <span
              className={cn(
                'ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11.5px] font-medium ring-1 ring-inset',
                lowConfidence
                  ? 'bg-amber-50 text-amber-800 ring-amber-200'
                  : 'bg-emerald-50 text-emerald-800 ring-emerald-200',
              )}
            >
              {lowConfidence ? <AlertTriangle className="h-3 w-3" aria-hidden="true" /> : null}
              {confidencePct}% confident
            </span>
          </div>

          {editing ? (
            <div>
              <label htmlFor="transcript-edit" className="sr-only">
                Edit the transcription
              </label>
              <textarea
                id="transcript-edit"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={3}
                className="w-full resize-y rounded-lg border-0 bg-white p-3 font-mono text-[14px] leading-relaxed text-navy-900 ring-1 ring-inset ring-navy-300 placeholder:text-navy-400 focus:ring-2 focus:ring-brand-600"
                placeholder="Type what you actually wrote"
              />
              <p className="mt-2 text-[12px] text-navy-500">
                Corrections are kept with the page, so the same line is not misread next time.
              </p>
            </div>
          ) : (
            <p className="rounded-lg bg-navy-50 p-3 font-mono text-[14.5px] leading-relaxed text-navy-900 ring-1 ring-inset ring-navy-200">
              {segments.map((seg, i) =>
                seg.uncertain ? (
                  <mark
                    key={i}
                    className="rounded bg-amber-200/70 px-0.5 text-navy-900 underline decoration-amber-600 decoration-dotted decoration-2 underline-offset-4"
                    title="The recogniser was not confident about this"
                  >
                    {seg.text}
                  </mark>
                ) : (
                  <span key={i}>{seg.text}</span>
                ),
              )}
            </p>
          )}
        </div>

        {!editing && result.uncertainTokens.length ? (
          <div className="rounded-lg bg-amber-50 p-3 ring-1 ring-inset ring-amber-200">
            <p className="flex items-start gap-2 text-[13px] leading-relaxed text-amber-900">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>
                The highlighted part was hard to read. If{' '}
                <strong className="font-semibold">{result.uncertainTokens.join(', ')}</strong> is
                wrong, fix it now - the tutor will take this as exactly what you wrote.
              </span>
            </p>
            {result.likelyCorrection ? (
              <Button
                size="sm"
                variant="secondary"
                className="mt-2.5"
                onClick={() => {
                  setDraft(result.likelyCorrection!)
                  setEditing(true)
                }}
              >
                <Wand2 className="h-3.5 w-3.5" />
                Use the second guess instead
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </Modal>
  )
}

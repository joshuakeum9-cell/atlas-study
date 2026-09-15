import { FileText, Mic, Quote, Sparkles } from 'lucide-react'
import type { ChatMessage } from '@/types'
import { formatClock } from '@/services/util'
import { SimulatedTag } from '@/components/ui/Badge'
import { RichText } from './RichText'

interface MessageBubbleProps {
  message: ChatMessage
  onSuggestion: (text: string) => void
  onOpenCitation: (docId: string) => void
  /** Hides the follow-up chips on anything but the newest reply. */
  showSuggestions: boolean
}

export function MessageBubble({
  message,
  onSuggestion,
  onOpenCitation,
  showSuggestions,
}: MessageBubbleProps) {
  if (message.role === 'student') {
    return (
      <div className="flex flex-col items-end gap-1.5">
        {message.context ? (
          <div className="max-w-[92%] rounded-lg rounded-br-sm bg-brand-50 px-2.5 py-2 ring-1 ring-inset ring-brand-200">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-brand-800">
              <Quote className="h-3 w-3" aria-hidden="true" />
              Asking about {message.context.partLabel}
            </p>
            <p className="mt-1 font-mono text-[12.5px] leading-relaxed text-navy-800">
              {message.context.transcript}
            </p>
            <p className="mt-1 truncate text-[11px] text-brand-700">{message.context.docTitle}</p>
          </div>
        ) : null}

        <div className="max-w-[88%] rounded-2xl rounded-br-sm bg-navy-900 px-3.5 py-2.5">
          <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed text-white">{message.text}</p>
        </div>

        <p className="flex items-center gap-1.5 pr-1 text-[10.5px] text-navy-400">
          {message.via === 'voice' ? (
            <>
              <Mic className="h-3 w-3" aria-hidden="true" />
              Voice
              <span aria-hidden="true">-</span>
            </>
          ) : null}
          {formatClock(message.at)}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        <span className="grid h-5 w-5 place-items-center rounded-md bg-brand-700">
          <Sparkles className="h-3 w-3 text-white" aria-hidden="true" />
        </span>
        <span className="text-[11.5px] font-semibold text-navy-800">Tutor</span>
        <SimulatedTag />
        <span className="ml-auto text-[10.5px] text-navy-400">{formatClock(message.at)}</span>
      </div>

      <div className="rounded-2xl rounded-bl-sm bg-white px-3.5 py-3 shadow-panel ring-1 ring-navy-100">
        <RichText text={message.text} />

        {message.citations?.length ? (
          <div className="mt-3 border-t border-navy-100 pt-2.5">
            <p className="text-[10.5px] font-semibold uppercase tracking-wider text-navy-400">
              Based on your workspace
            </p>
            <ul className="mt-1.5 space-y-1">
              {message.citations.map((citation) => (
                <li key={`${citation.label}-${citation.detail}`}>
                  <button
                    type="button"
                    disabled={!citation.docId}
                    onClick={() => citation.docId && onOpenCitation(citation.docId)}
                    className="flex w-full items-start gap-1.5 rounded-md px-1 py-0.5 text-left transition-colors hover:bg-navy-50 disabled:cursor-default disabled:hover:bg-transparent"
                  >
                    <FileText className="mt-0.5 h-3 w-3 shrink-0 text-navy-400" aria-hidden="true" />
                    <span className="text-[12px] leading-snug">
                      <span className="font-medium text-brand-800">{citation.label}</span>
                      <span className="text-navy-500"> - {citation.detail}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      {showSuggestions && message.suggestions?.length ? (
        <div className="flex flex-wrap gap-1.5">
          {message.suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => onSuggestion(suggestion)}
              className="rounded-full bg-white px-2.5 py-1 text-[12px] font-medium text-navy-700 shadow-sm ring-1 ring-navy-200 transition-colors hover:bg-brand-50 hover:text-brand-800 hover:ring-brand-300"
            >
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

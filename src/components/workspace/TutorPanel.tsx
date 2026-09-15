import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  ChevronDown,
  History,
  Layers,
  Mic,
  Plus,
  Quote,
  SendHorizonal,
  Sparkles,
  Square,
  X,
} from 'lucide-react'
import type { useTutorChat } from '@/hooks/useTutorChat'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { SimulatedTag } from '@/components/ui/Badge'
import { MessageBubble } from './MessageBubble'
import { RichText } from './RichText'
import { VoiceOverlay } from './VoiceOverlay'

export interface PendingContext {
  partLabel: string
  transcript: string
  docTitle: string
  analysisKey: string
}

interface TutorPanelProps {
  chat: ReturnType<typeof useTutorChat>
  pendingContext: PendingContext | null
  onClearPendingContext: () => void
  onOpenCitation: (docId: string) => void
  assignmentTitle: string
  courseCode: string
  /** Documents currently in scope, shown in the context strip. */
  contextDocTitles: string[]
}

const OPENERS = [
  'Where else have I made this mistake?',
  'Why is a rise in payables a source of cash?',
  'Show me the corrected working',
]

export function TutorPanel({
  chat,
  pendingContext,
  onClearPendingContext,
  onOpenCitation,
  assignmentTitle,
  courseCode,
  contextDocTitles,
}: TutorPanelProps) {
  const [draft, setDraft] = useState('')
  const [listening, setListening] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [contextOpen, setContextOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const historyRef = useRef<HTMLDivElement>(null)

  const { messages, streaming, thinking, busy, ask, stop } = chat

  // Keep the newest message in view as the reply streams in.
  useLayoutEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages.length, streaming, thinking, pendingContext])

  // Close the history dropdown on an outside click.
  useEffect(() => {
    if (!historyOpen) return
    const onDown = (e: PointerEvent) => {
      if (!historyRef.current?.contains(e.target as Node)) setHistoryOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [historyOpen])

  const send = (text: string, via: 'text' | 'voice' = 'text') => {
    if (!text.trim() || busy) return
    ask(text, {
      via,
      context: pendingContext
        ? {
            partLabel: pendingContext.partLabel,
            transcript: pendingContext.transcript,
            docTitle: pendingContext.docTitle,
          }
        : undefined,
      regionAnalysisKey: pendingContext?.analysisKey,
    })
    setDraft('')
    onClearPendingContext()
    // Reset the auto-grown textarea.
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  const onTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(140, el.scrollHeight)}px`
  }

  return (
    <section className="flex h-full min-w-0 flex-col border-l border-navy-100 bg-navy-50/50" aria-label="AI tutor">
      {/* Header */}
      <header className="flex items-center gap-2 border-b border-navy-100 bg-white px-3 py-2">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-brand-700">
          <Sparkles className="h-3.5 w-3.5 text-white" aria-hidden="true" />
        </span>
        <h2 className="text-[13.5px] font-semibold text-navy-900">AI tutor</h2>

        <div ref={historyRef} className="relative ml-auto">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setHistoryOpen((v) => !v)}
            aria-expanded={historyOpen}
            aria-haspopup="menu"
          >
            <History className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">History</span>
            <ChevronDown className="h-3 w-3" />
          </Button>

          {historyOpen ? (
            <div
              role="menu"
              className="absolute right-0 top-9 z-40 w-72 animate-fade-up overflow-hidden rounded-xl bg-white shadow-lift ring-1 ring-navy-200"
            >
              <p className="border-b border-navy-100 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-navy-400">
                Conversations on this assignment
              </p>
              <ul className="scrollbar-slim max-h-72 overflow-y-auto py-1">
                {chat.conversations.length === 0 ? (
                  <li className="px-3 py-3 text-[12.5px] text-navy-500">
                    Nothing saved here yet. Ask something and it will appear.
                  </li>
                ) : (
                  chat.conversations.map((conversation) => (
                    <li key={conversation.id}>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          chat.selectConversation(conversation.id)
                          setHistoryOpen(false)
                        }}
                        className={cn(
                          'w-full px-3 py-2 text-left transition-colors hover:bg-navy-50',
                          conversation.id === chat.active?.id && 'bg-brand-50',
                        )}
                      >
                        <span className="block truncate text-[12.5px] font-medium text-navy-900">
                          {conversation.title}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-navy-500">
                          {conversation.when} - {conversation.messages.length} messages
                        </span>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
          ) : null}
        </div>

        <Button size="sm" variant="ghost" iconOnly aria-label="Start a new conversation" onClick={chat.newConversation}>
          <Plus className="h-4 w-4" />
        </Button>
      </header>

      {/* What the tutor can see */}
      <div className="border-b border-navy-100 bg-white/70 px-3 py-1.5">
        <button
          type="button"
          onClick={() => setContextOpen((v) => !v)}
          aria-expanded={contextOpen}
          className="flex w-full items-center gap-1.5 rounded-md py-0.5 text-left"
        >
          <Layers className="h-3 w-3 shrink-0 text-navy-400" aria-hidden="true" />
          <span className="truncate text-[11.5px] text-navy-600">
            Sees <span className="font-medium text-navy-800">{courseCode}</span> - {assignmentTitle} and{' '}
            {contextDocTitles.length} {contextDocTitles.length === 1 ? 'document' : 'documents'}
          </span>
          <ChevronDown
            className={cn(
              'ml-auto h-3 w-3 shrink-0 text-navy-400 transition-transform',
              contextOpen && 'rotate-180',
            )}
            aria-hidden="true"
          />
        </button>
        {contextOpen ? (
          <ul className="animate-fade-in space-y-0.5 pb-1.5 pl-4.5 pt-1">
            {contextDocTitles.map((title) => (
              <li key={title} className="truncate text-[11.5px] text-navy-600">
                - {title}
              </li>
            ))}
            <li className="pt-1 text-[11px] leading-relaxed text-navy-500">
              Plus your notes, marked work and past conversations for this course.
            </li>
          </ul>
        ) : null}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="scrollbar-slim min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-4">
        {messages.length === 0 && !streaming && !thinking ? (
          <div className="rounded-xl bg-white p-4 shadow-panel ring-1 ring-navy-100">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-brand-700" aria-hidden="true" />
              <p className="text-[13px] font-semibold text-navy-900">Ask about this assignment</p>
              <SimulatedTag className="ml-auto" />
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-navy-600">
              Circle any handwritten answer on the page to ask about that exact line, or start with
              one of these:
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {OPENERS.map((opener) => (
                <button
                  key={opener}
                  type="button"
                  onClick={() => send(opener)}
                  className="rounded-full bg-navy-50 px-2.5 py-1 text-[12px] font-medium text-navy-700 ring-1 ring-navy-200 transition-colors hover:bg-brand-50 hover:text-brand-800 hover:ring-brand-300"
                >
                  {opener}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {messages.map((message, i) => (
          <MessageBubble
            key={message.id}
            message={message}
            onSuggestion={(text) => send(text)}
            onOpenCitation={onOpenCitation}
            showSuggestions={i === messages.length - 1 && !streaming && !thinking}
          />
        ))}

        {thinking ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <span className="grid h-5 w-5 place-items-center rounded-md bg-brand-700">
                <Sparkles className="h-3 w-3 text-white" aria-hidden="true" />
              </span>
              <span className="text-[11.5px] font-semibold text-navy-800">Tutor</span>
            </div>
            <div className="rounded-2xl rounded-bl-sm bg-white px-3.5 py-3 shadow-panel ring-1 ring-navy-100">
              <p className="flex items-center gap-2 text-[12.5px] text-navy-500">
                <span className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-400"
                      style={{ animationDelay: `${i * 140}ms` }}
                    />
                  ))}
                </span>
                Reading your workspace
              </p>
              <div className="mt-2.5 space-y-1.5">
                <div className="skeleton h-2.5 w-full rounded-full" />
                <div className="skeleton h-2.5 w-11/12 rounded-full" />
                <div className="skeleton h-2.5 w-2/3 rounded-full" />
              </div>
            </div>
          </div>
        ) : null}

        {streaming !== null ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              <span className="grid h-5 w-5 place-items-center rounded-md bg-brand-700">
                <Sparkles className="h-3 w-3 text-white" aria-hidden="true" />
              </span>
              <span className="text-[11.5px] font-semibold text-navy-800">Tutor</span>
              <SimulatedTag />
            </div>
            <div className="rounded-2xl rounded-bl-sm bg-white px-3.5 py-3 shadow-panel ring-1 ring-navy-100">
              <RichText text={streaming} />
              <span className="ml-0.5 inline-block h-3.5 w-[2px] animate-caret bg-brand-600 align-middle" />
            </div>
          </div>
        ) : null}
      </div>

      {/* Composer */}
      <div className="border-t border-navy-100 bg-white p-2.5">
        {listening ? (
          <VoiceOverlay
            open={listening}
            onCancel={() => setListening(false)}
            onResult={(transcript) => {
              setListening(false)
              send(transcript, 'voice')
            }}
          />
        ) : (
          <>
            {pendingContext ? (
              <div className="mb-2 flex items-start gap-2 rounded-lg bg-brand-50 px-2.5 py-2 ring-1 ring-inset ring-brand-200">
                <Quote className="mt-0.5 h-3 w-3 shrink-0 text-brand-700" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-800">
                    Attached: {pendingContext.partLabel}
                  </p>
                  <p className="truncate font-mono text-[12px] text-navy-800">{pendingContext.transcript}</p>
                </div>
                <button
                  type="button"
                  onClick={onClearPendingContext}
                  aria-label="Remove the attached selection"
                  className="rounded p-0.5 text-brand-700 transition-colors hover:bg-brand-100"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : null}

            <div className="flex items-end gap-1.5 rounded-xl bg-navy-50 p-1.5 ring-1 ring-inset ring-navy-200 focus-within:ring-2 focus-within:ring-brand-600">
              <label htmlFor="tutor-composer" className="sr-only">
                Ask the tutor a question
              </label>
              <textarea
                id="tutor-composer"
                ref={textareaRef}
                rows={1}
                value={draft}
                onChange={onTextareaChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    send(draft)
                  }
                }}
                placeholder={pendingContext ? 'Ask about the selection...' : 'Ask about this assignment...'}
                className="max-h-36 min-h-[2.25rem] flex-1 resize-none bg-transparent px-2 py-2 text-[13.5px] leading-snug text-navy-900 outline-none placeholder:text-navy-400"
              />
              <Button
                size="sm"
                variant="ghost"
                iconOnly
                aria-label="Ask by voice"
                disabled={busy}
                onClick={() => setListening(true)}
                className="mb-0.5 text-navy-600 hover:text-brand-800"
              >
                <Mic className="h-4 w-4" />
              </Button>
              {busy ? (
                <Button
                  size="sm"
                  variant="secondary"
                  iconOnly
                  aria-label="Stop the reply"
                  onClick={stop}
                  className="mb-0.5"
                >
                  <Square className="h-3 w-3 fill-current" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="primary"
                  iconOnly
                  aria-label="Send question"
                  disabled={!draft.trim()}
                  onClick={() => send(draft)}
                  className="mb-0.5"
                >
                  <SendHorizonal className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="mt-1.5 px-1 text-[10.5px] text-navy-400">
              Enter to send, Shift+Enter for a new line. Replies are scripted mock data.
            </p>
          </>
        )}
      </div>
    </section>
  )
}

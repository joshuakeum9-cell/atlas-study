import { documents } from '@/data/documents'
import { fallbackReply, regionAnalyses, scriptedReplies, type ScriptedReply } from '@/data/tutorScript'
import type { ChatMessage, Citation } from '@/types'
import { delay, uid } from './util'

/**
 * MOCK AI TUTOR
 * =============
 * Simulated. No model is called and nothing leaves the browser.
 *
 * REAL IMPLEMENTATION would replace `resolveReply` with a request to a chat
 * completions endpoint, passing `buildContext()` as system context and keeping
 * the same streaming interface so the UI does not change:
 *
 *   const res = await fetch(`${import.meta.env.VITE_AI_API_BASE}/messages`, {
 *     method: 'POST',
 *     body: JSON.stringify({ model, system: buildContext(...), messages }),
 *   })
 *   for await (const chunk of readSSE(res.body)) onChunk(chunk)
 */

export interface TutorRequest {
  question: string
  /** Set when the question is about a circled region of a worksheet. */
  regionAnalysisKey?: string
  /** Everything currently open, used to build context. */
  context: {
    courseId: string
    assignmentId: string
    openDocIds: string[]
  }
}

export interface TutorReply {
  text: string
  citations: Citation[]
  suggestions: string[]
  replyId: string
}

/** Words that carry no signal when matching a question to a scripted reply. */
const STOPWORDS = new Set([
  'a', 'about', 'again', 'am', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'because', 'been',
  'but', 'by', 'can', 'could', 'did', 'do', 'does', 'for', 'from', 'get', 'had', 'has', 'have',
  'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'just', 'me', 'my', 'need', 'not', 'of',
  'on', 'or', 'please', 'should', 'so', 'some', 'tell', 'that', 'the', 'their', 'them', 'then',
  'there', 'these', 'they', 'this', 'to', 'up', 'was', 'we', 'were', 'what', 'when', 'where',
  'which', 'who', 'why', 'will', 'with', 'would', 'you', 'your',
])

export const normalise = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s/-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

/**
 * Scores one scripted reply against a question.
 *
 * Multi-word keywords are worth more than single words because they are far
 * less likely to match by accident. Exported so the unit tests can pin the
 * behaviour down.
 */
export function scoreReply(question: string, reply: ScriptedReply): number {
  const q = normalise(question)
  if (!q) return 0
  const tokens = new Set(q.split(' ').filter((t) => t.length > 1 && !STOPWORDS.has(t)))

  let score = 0
  for (const keyword of reply.keywords) {
    const k = normalise(keyword)
    if (!k) continue
    if (k.includes(' ')) {
      // Phrase match: strong signal.
      if (q.includes(k)) score += 4
    } else if (tokens.has(k)) {
      score += 2
    } else if (k.length > 4 && q.includes(k)) {
      // Catches plurals and simple suffixes ("brackets" vs "bracket").
      score += 1
    }
  }
  return score
}

/** Picks the best scripted reply, or the fallback when nothing matches well. */
export function resolveReply(req: TutorRequest): ScriptedReply {
  if (req.regionAnalysisKey && regionAnalyses[req.regionAnalysisKey]) {
    return regionAnalyses[req.regionAnalysisKey]
  }

  let best: ScriptedReply | null = null
  let bestScore = 0
  for (const reply of scriptedReplies) {
    const score = scoreReply(req.question, reply)
    if (score > bestScore) {
      bestScore = score
      best = reply
    }
  }
  // Threshold of 2 means a single ordinary word is not enough on its own.
  return bestScore >= 2 && best ? best : fallbackReply
}

/**
 * Sketch of the context-assembly step that a real implementation would need.
 *
 * This is the actually-hard part of the product: a term of a student's work is
 * far too large to send with every question, so something has to decide which
 * documents, which past mistakes, and how much of each are worth the tokens.
 */
export function buildContext(ctx: TutorRequest['context']) {
  const open = documents.filter((d) => ctx.openDocIds.includes(d.id))
  const courseDocs = documents.filter((d) => d.courseId === ctx.courseId)
  return {
    course: ctx.courseId,
    assignment: ctx.assignmentId,
    openDocuments: open.map((d) => ({ id: d.id, title: d.title, summary: d.summary })),
    // A real version would rank these by embedding similarity to the question
    // and truncate to a token budget rather than taking everything.
    relatedDocuments: courseDocs
      .filter((d) => !ctx.openDocIds.includes(d.id))
      .map((d) => ({ id: d.id, title: d.title, tags: d.tags })),
    knownStruggles: courseDocs.flatMap((d) => d.struggleTopics),
  }
}

/**
 * Streams a reply chunk by chunk, the way a real streaming endpoint would.
 * Returns a cancel function so the UI can abort a reply mid-flight.
 */
export function streamTutorReply(
  req: TutorRequest,
  handlers: {
    onStart?: (replyId: string) => void
    onChunk: (chunk: string) => void
    onDone: (reply: TutorReply) => void
  },
): () => void {
  const reply = resolveReply(req)
  const full = reply.text
  // Stream by word so punctuation and line breaks land naturally.
  const pieces = full.match(/\S+\s*/g) ?? [full]

  let cancelled = false
  let index = 0
  let timer: ReturnType<typeof setTimeout> | undefined

  const step = () => {
    if (cancelled) return
    // Two or three words per tick reads like a fast model rather than a typewriter.
    const take = 2 + Math.floor(Math.random() * 2)
    const chunk = pieces.slice(index, index + take).join('')
    index += take
    if (chunk) handlers.onChunk(chunk)

    if (index >= pieces.length) {
      handlers.onDone({
        text: full,
        citations: reply.citations ?? [],
        suggestions: reply.suggestions ?? [],
        replyId: reply.id,
      })
      return
    }
    timer = setTimeout(step, 18 + Math.random() * 26)
  }

  // "Thinking" pause before the first token, like a real request.
  timer = setTimeout(() => {
    if (cancelled) return
    handlers.onStart?.(reply.id)
    step()
  }, 620 + Math.random() * 480)

  return () => {
    cancelled = true
    if (timer) clearTimeout(timer)
  }
}

/** Non-streaming variant, used by the practice panel's feedback. */
export async function askTutor(req: TutorRequest): Promise<TutorReply> {
  await delay(500, 900)
  const reply = resolveReply(req)
  return {
    text: reply.text,
    citations: reply.citations ?? [],
    suggestions: reply.suggestions ?? [],
    replyId: reply.id,
  }
}

export function studentMessage(
  text: string,
  opts: { via?: 'text' | 'voice'; context?: ChatMessage['context'] } = {},
): ChatMessage {
  return {
    id: uid('msg'),
    role: 'student',
    text,
    at: new Date().toISOString(),
    via: opts.via ?? 'text',
    context: opts.context,
  }
}

export function tutorMessage(text: string, reply?: Partial<TutorReply>): ChatMessage {
  return {
    id: uid('msg'),
    role: 'tutor',
    text,
    at: new Date().toISOString(),
    citations: reply?.citations,
    suggestions: reply?.suggestions,
  }
}

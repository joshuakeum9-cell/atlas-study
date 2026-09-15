import { courses } from '@/data/courses'
import { documents } from '@/data/documents'
import type { SearchResult, StudyDoc } from '@/types'
import { delay } from './util'

/**
 * MOCK NATURAL-LANGUAGE SEARCH
 * ============================
 * Simulated. This is a hand-written scorer over the local document list, not a
 * semantic index - but it is built to behave like one in the ways that matter
 * to the demo: it understands intent words ("struggled", "got wrong"), it
 * matches ideas rather than only exact strings, and it explains its ranking.
 *
 * REAL IMPLEMENTATION would embed the query and search a vector store:
 *
 *   const res = await fetch(`${import.meta.env.VITE_SEARCH_API_BASE}/search`, {
 *     method: 'POST', body: JSON.stringify({ query, userId, topK: 8 }),
 *   })
 *
 * Keeping the `reasons` field in the response shape is deliberate. A real
 * semantic index can populate it from the matched chunks, and showing a user
 * *why* something matched is what makes natural-language search trustworthy
 * rather than magic.
 */

const STOPWORDS = new Set([
  'a', 'about', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'been', 'but', 'by',
  'can', 'did', 'do', 'find', 'for', 'from', 'get', 'go', 'had', 'has', 'have', 'i', 'in', 'is',
  'it', 'me', 'my', 'of', 'on', 'or', 'show', 'that', 'the', 'their', 'them', 'there', 'these',
  'they', 'this', 'to', 'up', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'with',
  'you', 'your',
])

/** Words that signal the student is looking for something that went badly. */
const STRUGGLE_WORDS = [
  'struggl', 'stuck', 'confus', 'wrong', 'mistake', 'lost marks', 'lost a mark', 'bad at',
  'difficult', 'hard', 'trouble', 'keep getting', 'messed up', 'failed', 'weak', 'did not get',
  'didnt get', 'dont understand', 'do not understand', 'flagged', 'error',
]

/** Words that signal the student wants something they were marked on. */
const GRADED_WORDS = ['graded', 'marked', 'quiz', 'exam', 'test', 'score', 'result', 'feedback']

/** Words that signal a handwritten or photographed item. */
const PHOTO_WORDS = ['photo', 'picture', 'handwritten', 'handwriting', 'wrote', 'scan', 'worksheet']

/**
 * Loose concept expansion. A vector index gets this for free from embeddings;
 * a keyword scorer has to be told, so a small hand-built map stands in.
 */
const CONCEPTS: Record<string, string[]> = {
  'working capital': ['working capital', 'nwc', 'payable', 'receivable', 'inventory', 'sign convention'],
  payable: ['working capital', 'payable', 'sign convention'],
  receivable: ['working capital', 'receivable'],
  cash: ['cash flow statement', 'free cash flow', 'indirect method', 'operating activities'],
  'cash flow': ['cash flow statement', 'free cash flow', 'indirect method', 'operating activities'],
  fcf: ['free cash flow'],
  wacc: ['wacc', 'cost of capital', 'capital structure'],
  discount: ['wacc', 'cost of capital', 'time value of money'],
  ratio: ['ratios', 'liquidity', 'leverage', 'current ratio'],
  liquidity: ['ratios', 'liquidity', 'current ratio'],
  annuity: ['time value of money', 'annuities'],
  pvalue: ['p-value', 'hypothesis testing'],
  'p-value': ['p-value', 'hypothesis testing'],
  hypothesis: ['hypothesis testing', 'p-value'],
  accrual: ['accruals', 'deferrals', 'journal entries'],
  inventory: ['inventory', 'fifo', 'weighted average', 'working capital'],
  memo: ['case memo', 'earnings quality'],
  earnings: ['earnings quality', 'case memo'],
  depreciation: ['indirect method', 'cash flow statement'],
  slides: ['slides'],
  lecture: ['lecture notes', 'slides'],
  notes: ['lecture notes'],
}

export function tokenise(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t))
}

function hasAny(haystack: string, needles: string[]): boolean {
  return needles.some((n) => haystack.includes(n))
}

interface Scored {
  doc: StudyDoc
  score: number
  reasons: string[]
}

/**
 * Reasons are collected with a priority so that the three shown to the user are
 * the three most informative ones, not simply the first three computed.
 */
interface Reason {
  text: string
  priority: number
}

/**
 * Ranks documents against a natural-language query.
 * Exported separately from `searchDocuments` so the unit tests can assert on
 * ranking without waiting for the simulated latency.
 */
export function rankDocuments(query: string, docs: StudyDoc[] = documents): Scored[] {
  const raw = query.toLowerCase().trim()
  if (!raw) return []

  const tokens = tokenise(raw)
  const wantsStruggle = hasAny(raw, STRUGGLE_WORDS)
  const wantsGraded = hasAny(raw, GRADED_WORDS)
  const wantsPhoto = hasAny(raw, PHOTO_WORDS)

  // Expand the query with related concepts.
  const expanded = new Set<string>(tokens)
  for (const [key, related] of Object.entries(CONCEPTS)) {
    if (raw.includes(key)) related.forEach((r) => expanded.add(r))
  }

  // A course code or name in the query filters hard.
  const courseHit = courses.find(
    (c) => raw.includes(c.code.toLowerCase()) || raw.includes(c.title.toLowerCase()),
  )

  const results: Scored[] = []

  for (const doc of docs) {
    // Naming a course is a filter, not a hint: never return another course's work.
    if (courseHit && doc.courseId !== courseHit.id) continue

    let score = 0
    const reasons: Reason[] = []
    const addReason = (text: string, priority: number) => reasons.push({ text, priority })
    const haystack = `${doc.title} ${doc.summary} ${doc.tags.join(' ')} ${doc.struggleTopics.join(' ')}`.toLowerCase()

    const matchedTags = doc.tags.filter((tag) =>
      [...expanded].some((t) => tag.includes(t) || t.includes(tag)),
    )
    if (matchedTags.length) {
      score += matchedTags.length * 3
      addReason(`Topic match: ${matchedTags.slice(0, 3).join(', ')}`, 5)
    }

    const titleHits = tokens.filter((t) => doc.title.toLowerCase().includes(t))
    if (titleHits.length) {
      score += titleHits.length * 2
      addReason(`Title mentions ${titleHits.slice(0, 2).join(' and ')}`, 4)
    }

    const summaryHits = tokens.filter((t) => doc.summary.toLowerCase().includes(t))
    if (summaryHits.length) {
      score += summaryHits.length
      addReason('Content covers this idea', 2)
    }

    const struggleHits = doc.struggleTopics.filter((topic) =>
      [...expanded].some((t) => topic.includes(t) || t.includes(topic)),
    )

    if (wantsStruggle) {
      if (doc.struggleTopics.length) {
        score += 6 + doc.struggleTopics.length * 2
        addReason(
          struggleHits.length
            ? `Flagged as difficult: ${struggleHits[0]}`
            : `Flagged as difficult: ${doc.struggleTopics[0]}`,
          10,
        )
      } else {
        // Asking about struggles should push clean work down the list.
        score -= 3
      }
    } else if (struggleHits.length) {
      score += 2
      addReason(`Related to a flagged topic: ${struggleHits[0]}`, 6)
    }

    if (wantsGraded && /quiz|graded|marked/.test(haystack)) {
      score += 5
      addReason('Marked or graded work', 7)
    }

    if (wantsPhoto && doc.kind === 'worksheet-photo') {
      score += 6
      addReason('Photographed handwritten page', 8)
    }

    if (courseHit) {
      score += 4
      addReason(`In ${courseHit.code}`, 3)
    }

    // Chapter names are a natural way to describe a document.
    for (const course of courses) {
      for (const ch of course.chapters) {
        if (doc.chapterIds.includes(ch.id) && raw.includes(ch.title.toLowerCase())) {
          score += 5
          addReason(`Chapter ${ch.number}: ${ch.title}`, 9)
        }
      }
    }

    if (score > 0) {
      const top = reasons
        .sort((a, b) => b.priority - a.priority)
        .map((r) => r.text)
      results.push({ doc, score, reasons: [...new Set(top)].slice(0, 3) })
    }
  }

  return results.sort((a, b) => b.score - a.score || a.doc.title.localeCompare(b.doc.title))
}

function snippetFor(doc: StudyDoc): string {
  const first = doc.summary.split('. ')[0]
  return first.endsWith('.') ? first : `${first}.`
}

export async function searchDocuments(query: string): Promise<SearchResult[]> {
  await delay(420, 780)
  const courseCodeOf = (courseId: string) => courses.find((c) => c.id === courseId)?.code ?? ''
  return rankDocuments(query)
    .slice(0, 8)
    .map(({ doc, score, reasons }) => ({
      docId: doc.id,
      title: doc.title,
      courseCode: courseCodeOf(doc.courseId),
      kind: doc.kind,
      snippet: snippetFor(doc),
      reasons,
      score,
      assignmentId: doc.assignmentId,
    }))
}

/** Example queries offered under the empty search field. */
export const searchExamples = [
  'find the notes where I struggled with working capital',
  'the page I photographed for problem set 4',
  'everything about free cash flow',
  'the quiz where I lost marks on ratios',
  'slides about cost of capital',
]

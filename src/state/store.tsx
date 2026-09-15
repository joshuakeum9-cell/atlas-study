import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react'
import { assignments, courses } from '@/data/courses'
import { seedConversations } from '@/data/conversations'
import { documents } from '@/data/documents'
import { clearAll, readJSON, writeJSON } from '@/lib/storage'
import type { ChatMessage, Conversation, StudyDoc } from '@/types'
import { uid } from '@/services/util'

/**
 * One store for the whole demo.
 *
 * Everything except the in-flight streaming reply is persisted to
 * localStorage, so a refresh keeps the conversations, the confirmed
 * transcriptions, the practice results and the recent searches. That is what
 * makes the prototype feel like a product rather than a slideshow.
 */

/** Things a first-time visitor can try, tracked so the demo can guide them. */
export const DEMO_STEPS = [
  { id: 'select-region', label: 'Circle part of the worksheet' },
  { id: 'confirm-transcription', label: 'Confirm the transcription' },
  { id: 'ask-tutor', label: 'Ask the tutor a question' },
  { id: 'voice', label: 'Use the microphone' },
  { id: 'search', label: 'Search by description' },
  { id: 'history', label: 'Open a past conversation' },
  { id: 'insights', label: 'Open learning insights' },
  { id: 'practice', label: 'Answer a practice question' },
  { id: 'share', label: 'Share a workspace' },
  { id: 'import', label: 'Import a file' },
] as const

export type DemoStepId = (typeof DEMO_STEPS)[number]['id']

export interface Toast {
  id: string
  title: string
  detail?: string
  tone: 'info' | 'success' | 'warn'
}

export interface State {
  courseId: string
  assignmentId: string
  activeDocId: string
  conversations: Conversation[]
  activeConversationId: string
  /** regionId -> the transcript the student confirmed. */
  confirmedRegions: Record<string, string>
  practiceAnswers: Record<string, { optionId: string; correct: boolean }>
  recentSearches: string[]
  userDocs: StudyDoc[]
  explored: DemoStepId[]
  sharesCreated: number
  /** Not persisted: the reply currently streaming in. */
  stream: { conversationId: string; text: string } | null
  toasts: Toast[]
}

type Action =
  | { type: 'select-course'; courseId: string }
  | { type: 'select-assignment'; assignmentId: string }
  | { type: 'select-doc'; docId: string }
  | { type: 'new-conversation'; title?: string; id?: string }
  | { type: 'select-conversation'; conversationId: string }
  | { type: 'append-message'; conversationId: string; message: ChatMessage }
  | { type: 'stream-start'; conversationId: string }
  | { type: 'stream-chunk'; chunk: string }
  | { type: 'stream-end' }
  | { type: 'confirm-region'; regionId: string; transcript: string }
  | { type: 'answer-practice'; questionId: string; optionId: string; correct: boolean }
  | { type: 'reset-practice' }
  | { type: 'add-search'; query: string }
  | { type: 'add-user-doc'; doc: StudyDoc }
  | { type: 'mark-explored'; step: DemoStepId }
  | { type: 'record-share' }
  | { type: 'toast'; toast: Omit<Toast, 'id'> }
  | { type: 'dismiss-toast'; id: string }
  | { type: 'reset-demo' }

const DEFAULT_COURSE = 'fin301'
const DEFAULT_ASSIGNMENT = 'ps4'
const DEFAULT_DOC = 'doc-ps4-photo'

function firstConversationFor(conversations: Conversation[], assignmentId: string): string {
  return conversations.find((c) => c.assignmentId === assignmentId)?.id ?? ''
}

function initialState(): State {
  return {
    courseId: DEFAULT_COURSE,
    assignmentId: DEFAULT_ASSIGNMENT,
    activeDocId: DEFAULT_DOC,
    conversations: seedConversations,
    activeConversationId: firstConversationFor(seedConversations, DEFAULT_ASSIGNMENT),
    confirmedRegions: {},
    practiceAnswers: {},
    recentSearches: [],
    userDocs: [],
    explored: [],
    sharesCreated: 0,
    stream: null,
    toasts: [],
  }
}

/** The slice written to localStorage. Stream and toasts are session-only. */
type Persisted = Omit<State, 'stream' | 'toasts'>

function loadState(): State {
  const base = initialState()
  const saved = readJSON<Partial<Persisted> | null>('state-v1', null)
  if (!saved) return base

  // Guard every field: a stale or hand-edited payload must not break the app.
  const courseId = courses.some((c) => c.id === saved.courseId) ? saved.courseId! : base.courseId
  const assignment = assignments.find((a) => a.id === saved.assignmentId && a.courseId === courseId)
  const assignmentId = assignment?.id ?? assignments.find((a) => a.courseId === courseId)!.id

  const conversations = Array.isArray(saved.conversations) && saved.conversations.length
    ? saved.conversations
    : base.conversations

  const userDocs = Array.isArray(saved.userDocs) ? saved.userDocs : []
  const allDocIds = new Set([...documents.map((d) => d.id), ...userDocs.map((d) => d.id)])
  const activeDocId =
    saved.activeDocId && allDocIds.has(saved.activeDocId) ? saved.activeDocId : DEFAULT_DOC

  return {
    ...base,
    courseId,
    assignmentId,
    activeDocId,
    conversations,
    activeConversationId:
      conversations.some((c) => c.id === saved.activeConversationId)
        ? saved.activeConversationId!
        : firstConversationFor(conversations, assignmentId),
    confirmedRegions: saved.confirmedRegions ?? {},
    practiceAnswers: saved.practiceAnswers ?? {},
    recentSearches: Array.isArray(saved.recentSearches) ? saved.recentSearches.slice(0, 6) : [],
    // Object URLs do not survive a refresh, so an imported image loses its
    // preview. The document card handles that case explicitly.
    userDocs,
    explored: Array.isArray(saved.explored) ? saved.explored : [],
    sharesCreated: typeof saved.sharesCreated === 'number' ? saved.sharesCreated : 0,
  }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'select-course': {
      const first = assignments.find((a) => a.courseId === action.courseId)
      if (!first) return state
      const docId = first.docIds[0] ?? DEFAULT_DOC
      return {
        ...state,
        courseId: action.courseId,
        assignmentId: first.id,
        activeDocId: docId,
        activeConversationId: firstConversationFor(state.conversations, first.id),
        stream: null,
      }
    }
    case 'select-assignment': {
      const assignment = assignments.find((a) => a.id === action.assignmentId)
      if (!assignment) return state
      return {
        ...state,
        courseId: assignment.courseId,
        assignmentId: assignment.id,
        activeDocId: assignment.docIds[0] ?? state.activeDocId,
        activeConversationId: firstConversationFor(state.conversations, assignment.id),
        stream: null,
      }
    }
    case 'select-doc':
      return { ...state, activeDocId: action.docId }

    case 'new-conversation': {
      const conversation: Conversation = {
        id: action.id ?? uid('conv'),
        assignmentId: state.assignmentId,
        title: action.title ?? 'New conversation',
        when: 'Just now',
        messages: [],
      }
      return {
        ...state,
        conversations: [conversation, ...state.conversations],
        activeConversationId: conversation.id,
        stream: null,
      }
    }
    case 'select-conversation':
      return { ...state, activeConversationId: action.conversationId, stream: null }

    case 'append-message': {
      const conversations = state.conversations.map((c) =>
        c.id === action.conversationId
          ? {
              ...c,
              when: 'Just now',
              messages: [...c.messages, action.message],
              // A conversation that started empty takes its name from the first question.
              title:
                c.messages.length === 0 && action.message.role === 'student'
                  ? action.message.text.slice(0, 48) + (action.message.text.length > 48 ? '...' : '')
                  : c.title,
            }
          : c,
      )
      return { ...state, conversations }
    }

    case 'stream-start':
      return { ...state, stream: { conversationId: action.conversationId, text: '' } }
    case 'stream-chunk':
      return state.stream
        ? { ...state, stream: { ...state.stream, text: state.stream.text + action.chunk } }
        : state
    case 'stream-end':
      return { ...state, stream: null }

    case 'confirm-region':
      return {
        ...state,
        confirmedRegions: { ...state.confirmedRegions, [action.regionId]: action.transcript },
      }

    case 'answer-practice':
      return {
        ...state,
        practiceAnswers: {
          ...state.practiceAnswers,
          [action.questionId]: { optionId: action.optionId, correct: action.correct },
        },
      }
    case 'reset-practice':
      return { ...state, practiceAnswers: {} }

    case 'add-search': {
      const query = action.query.trim()
      if (!query) return state
      return {
        ...state,
        recentSearches: [query, ...state.recentSearches.filter((q) => q !== query)].slice(0, 6),
      }
    }

    case 'add-user-doc':
      return { ...state, userDocs: [action.doc, ...state.userDocs], activeDocId: action.doc.id }

    case 'mark-explored':
      return state.explored.includes(action.step)
        ? state
        : { ...state, explored: [...state.explored, action.step] }

    case 'record-share':
      return { ...state, sharesCreated: state.sharesCreated + 1 }

    case 'toast':
      return { ...state, toasts: [...state.toasts, { ...action.toast, id: uid('toast') }] }
    case 'dismiss-toast':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) }

    case 'reset-demo':
      clearAll()
      return initialState()

    default:
      return state
  }
}

interface StoreValue {
  state: State
  dispatch: Dispatch<Action>
  /** Convenience helpers used all over the UI. */
  markExplored: (step: DemoStepId) => void
  toast: (toast: Omit<Toast, 'id'>) => void
}

const StoreContext = createContext<StoreValue | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState)

  useEffect(() => {
    const { stream: _stream, toasts: _toasts, ...persisted } = state
    writeJSON('state-v1', persisted)
  }, [state])

  const markExplored = useCallback((step: DemoStepId) => dispatch({ type: 'mark-explored', step }), [])
  const toast = useCallback((t: Omit<Toast, 'id'>) => dispatch({ type: 'toast', toast: t }), [])

  const value = useMemo<StoreValue>(
    () => ({ state, dispatch, markExplored, toast }),
    [state, markExplored, toast],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore(): StoreValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}

/**
 * Shared domain types for the Atlas prototype.
 *
 * Everything here describes *mock* data that ships with the app. There is no
 * server: the shapes below are simply what a real API would be expected to
 * return, which keeps the mock service layer honest.
 */

export type CourseColor = 'navy' | 'blue' | 'teal' | 'violet' | 'amber'

export interface Chapter {
  id: string
  number: number
  title: string
  /** 0-100. Drives the mastery bars on the insights page. */
  mastery: number
}

export interface Course {
  id: string
  code: string
  title: string
  term: string
  instructor: string
  color: CourseColor
  chapters: Chapter[]
}

export type AssignmentStatus = 'in-progress' | 'not-started' | 'submitted' | 'graded'

export interface Assignment {
  id: string
  courseId: string
  chapterId: string
  title: string
  /** Human label, e.g. "Due Fri 19 Sep". Kept as a string so the demo never ages badly. */
  due: string
  status: AssignmentStatus
  /** Documents attached to this assignment, in the order they appear in the workspace. */
  docIds: string[]
  /** Short line shown under the title in the sidebar. */
  blurb: string
}

export type DocKind = 'worksheet-photo' | 'pdf' | 'note' | 'slides' | 'upload'

export interface StudyDoc {
  id: string
  courseId: string
  assignmentId?: string
  title: string
  kind: DocKind
  pages: number
  /** Human label, e.g. "2 days ago". */
  updated: string
  sizeLabel: string
  tags: string[]
  /** One-paragraph mock "document understanding" summary. */
  summary: string
  /** Chapter ids this document is about - used by search and insights. */
  chapterIds: string[]
  /** Topics the student visibly struggled with inside this document. */
  struggleTopics: string[]
  /** Pre-rendered body used by the note/pdf readers. */
  body?: DocBlock[]
  /** Only present for the photographed worksheet. */
  worksheetId?: string
  /** True for files the user "uploaded" during the demo. */
  userAdded?: boolean
}

export type DocBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'bullets'; items: string[] }
  | { type: 'callout'; tone: 'struggle' | 'info'; text: string }
  | { type: 'formula'; text: string; caption?: string }
  | { type: 'table'; head: string[]; rows: string[][] }

/** A rectangle in worksheet coordinate space (the SVG viewBox, 0-800 x 0-1040). */
export interface Box {
  x: number
  y: number
  w: number
  h: number
}

export interface WorksheetRegion {
  id: string
  /** e.g. "Part (b)" - shown in the selection chip and the keyboard list. */
  partLabel: string
  label: string
  box: Box
  /** What the handwriting recognition returns, warts and all. */
  transcript: string
  /** Tokens the recogniser is unsure about - highlighted in the confirm dialog. */
  uncertainTokens: string[]
  /** What the student actually wrote, offered as a one-click fix. */
  likelyCorrection?: string
  confidence: number
  /** Key used to look up the scripted tutor analysis for this region. */
  analysisKey: string
}

export interface HandwritingLine {
  x: number
  y: number
  text: string
  size?: number
  rotate?: number
  /** Slightly different ink tone per line, like a real photo. */
  tone?: 'ink' | 'ink-light' | 'pencil'
}

export interface Worksheet {
  id: string
  docId: string
  title: string
  courseLabel: string
  /** Printed (typeset) content of the page. */
  printed: {
    heading: string
    sub: string
    intro: string
    givens: [string, string][]
    parts: { label: string; text: string; y: number }[]
  }
  /** The student's handwriting, drawn over the printed page. */
  handwriting: HandwritingLine[]
  regions: WorksheetRegion[]
}

export type ChatRole = 'student' | 'tutor'

export interface Citation {
  label: string
  detail: string
  docId?: string
}

export interface ChatMessage {
  id: string
  role: ChatRole
  text: string
  /** ISO timestamp. */
  at: string
  /** Set when the message was asked about a specific circled region. */
  context?: {
    partLabel: string
    transcript: string
    docTitle: string
  }
  citations?: Citation[]
  suggestions?: string[]
  /** "voice" messages render with a small mic badge. */
  via?: 'text' | 'voice'
}

export interface Conversation {
  id: string
  assignmentId: string
  title: string
  /** Human label, e.g. "Yesterday, 9:14 PM". */
  when: string
  messages: ChatMessage[]
}

export interface SearchResult {
  docId: string
  title: string
  courseCode: string
  kind: DocKind
  /** Snippet with the matched idea. */
  snippet: string
  /** Why the (mock) semantic index thinks this matches. */
  reasons: string[]
  score: number
  assignmentId?: string
}

export interface StruggleInsight {
  id: string
  topic: string
  chapterId: string
  /** How many times this showed up across work. */
  occurrences: number
  /** 0-100, higher = more of a problem. */
  severity: number
  lastSeen: string
  pattern: string
  fix: string
  evidenceDocIds: string[]
}

export interface StrengthInsight {
  id: string
  topic: string
  chapterId: string
  accuracy: number
  note: string
}

export interface ReviewRecommendation {
  id: string
  title: string
  reason: string
  minutes: number
  chapterId: string
  kind: 'practice' | 'reread' | 'redo'
}

export interface PracticeOption {
  id: string
  text: string
  correct: boolean
  feedback: string
}

export interface PracticeQuestion {
  id: string
  chapterId: string
  prompt: string
  /** Optional scenario block shown above the options. */
  given?: string[]
  options: PracticeOption[]
  explanation: string
  /** Topic this question is probing, matched to a struggle insight. */
  topic: string
}

export interface SharedWorkspace {
  id: string
  name: string
  courseCode: string
  owner: string
  members: { name: string; initials: string; role: 'Owner' | 'Can edit' | 'Can view' }[]
  updated: string
  itemCount: number
}

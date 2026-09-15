import {
  BookOpen,
  Camera,
  ChevronRight,
  Clock,
  FileText,
  LineChart,
  Presentation,
  RotateCcw,
  StickyNote,
  Upload,
  Users,
} from 'lucide-react'
import { assignments, courses } from '@/data/courses'
import { documents } from '@/data/documents'
import { sharedWorkspaces } from '@/data/insights'
import type { Assignment, StudyDoc } from '@/types'
import { cn } from '@/lib/cn'
import { useStore } from '@/state/store'

const STATUS_STYLE: Record<Assignment['status'], { dot: string; label: string }> = {
  'in-progress': { dot: 'bg-brand-600', label: 'In progress' },
  'not-started': { dot: 'bg-navy-300', label: 'Not started' },
  submitted: { dot: 'bg-violet-500', label: 'Submitted' },
  graded: { dot: 'bg-emerald-600', label: 'Graded' },
}

const KIND_ICON = {
  'worksheet-photo': Camera,
  pdf: FileText,
  note: StickyNote,
  slides: Presentation,
  upload: FileText,
} as const

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="px-2 pb-1.5 pt-4 text-[10.5px] font-semibold uppercase tracking-wider text-navy-400">
      {children}
    </h3>
  )
}

interface SidebarProps {
  onOpenInsights: () => void
  onOpenShared: (workspaceName: string) => void
  onImport: () => void
  onResetDemo: () => void
}

export function Sidebar({ onOpenInsights, onOpenShared, onImport, onResetDemo }: SidebarProps) {
  const { state, dispatch } = useStore()

  const courseAssignments = assignments.filter((a) => a.courseId === state.courseId)
  const recentDocs: StudyDoc[] = [...state.userDocs, ...documents].slice(0, 6)

  return (
    <nav
      className="scrollbar-slim flex h-full flex-col overflow-y-auto border-r border-navy-100 bg-navy-50/60 px-2 pb-3"
      aria-label="Courses and files"
    >
      <SectionHeading>Courses</SectionHeading>
      <ul className="space-y-0.5">
        {courses.map((course) => {
          const active = course.id === state.courseId
          return (
            <li key={course.id}>
              <button
                type="button"
                onClick={() => dispatch({ type: 'select-course', courseId: course.id })}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors',
                  active ? 'bg-navy-900 text-white' : 'text-navy-700 hover:bg-white hover:shadow-sm',
                )}
              >
                <BookOpen
                  className={cn('h-3.5 w-3.5 shrink-0', active ? 'text-brand-300' : 'text-navy-400')}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[12.5px] font-semibold leading-tight">{course.code}</span>
                  <span
                    className={cn(
                      'block truncate text-[11.5px] leading-tight',
                      active ? 'text-navy-200' : 'text-navy-500',
                    )}
                  >
                    {course.title}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <SectionHeading>Assignments</SectionHeading>
      <ul className="space-y-0.5">
        {courseAssignments.map((assignment) => {
          const active = assignment.id === state.assignmentId
          const status = STATUS_STYLE[assignment.status]
          return (
            <li key={assignment.id}>
              <button
                type="button"
                onClick={() => dispatch({ type: 'select-assignment', assignmentId: assignment.id })}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'flex w-full items-start gap-2 rounded-lg px-2 py-2 text-left transition-colors',
                  active
                    ? 'bg-white text-navy-900 shadow-sm ring-1 ring-navy-200'
                    : 'text-navy-700 hover:bg-white/70',
                )}
              >
                <span
                  className={cn('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', status.dot)}
                  title={status.label}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[12.5px] font-medium leading-snug">{assignment.title}</span>
                  <span className="mt-0.5 block truncate text-[11.5px] text-navy-500">
                    {assignment.blurb}
                  </span>
                  <span className="mt-1 block text-[11px] font-medium text-navy-500">{assignment.due}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <SectionHeading>Recent files</SectionHeading>
      <ul className="space-y-0.5">
        {recentDocs.map((doc) => {
          const Icon = KIND_ICON[doc.kind] ?? FileText
          const active = doc.id === state.activeDocId
          return (
            <li key={doc.id}>
              <button
                type="button"
                onClick={() => {
                  if (doc.assignmentId) dispatch({ type: 'select-assignment', assignmentId: doc.assignmentId })
                  dispatch({ type: 'select-doc', docId: doc.id })
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors',
                  active ? 'bg-white text-navy-900 shadow-sm ring-1 ring-navy-200' : 'text-navy-700 hover:bg-white/70',
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0 text-navy-400" aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] leading-tight">{doc.title}</span>
                  <span className="block truncate text-[11px] text-navy-500">{doc.updated}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <button
        type="button"
        onClick={onImport}
        className="mt-1 flex w-full items-center gap-2 rounded-lg border border-dashed border-navy-200 px-2 py-2 text-[12px] font-medium text-navy-600 transition-colors hover:border-brand-400 hover:bg-white hover:text-brand-800"
      >
        <Upload className="h-3.5 w-3.5" aria-hidden="true" />
        Import a file or photo
      </button>

      <SectionHeading>Shared workspaces</SectionHeading>
      <ul className="space-y-0.5">
        {sharedWorkspaces.map((ws) => (
          <li key={ws.id}>
            <button
              type="button"
              onClick={() => onOpenShared(ws.name)}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-navy-700 transition-colors hover:bg-white/70"
            >
              <Users className="h-3.5 w-3.5 shrink-0 text-navy-400" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[12px] leading-tight">{ws.name}</span>
                <span className="block truncate text-[11px] text-navy-500">
                  {ws.members.length} people - {ws.itemCount} items
                </span>
              </span>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-navy-300" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-auto space-y-1 pt-4">
        <button
          type="button"
          onClick={onOpenInsights}
          className="flex w-full items-center gap-2 rounded-lg bg-white px-2 py-2 text-left text-[12.5px] font-medium text-navy-800 shadow-sm ring-1 ring-navy-200 transition-colors hover:bg-navy-50"
        >
          <LineChart className="h-4 w-4 text-brand-700" aria-hidden="true" />
          Learning insights
          <span className="ml-auto rounded-full bg-amber-100 px-1.5 py-0.5 text-[10.5px] font-semibold text-amber-800">
            1 new
          </span>
        </button>
        <button
          type="button"
          onClick={onResetDemo}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[11.5px] text-navy-500 transition-colors hover:bg-white/70 hover:text-navy-800"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Reset the demo
        </button>
        <p className="flex items-start gap-1.5 px-2 pt-1 text-[10.5px] leading-relaxed text-navy-400">
          <Clock className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
          Your demo actions are saved in this browser only.
        </p>
      </div>
    </nav>
  )
}

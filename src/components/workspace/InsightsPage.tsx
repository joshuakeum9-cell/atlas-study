import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  Repeat,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { activityWeeks, recommendations, strengths, struggles } from '@/data/insights'
import { courses } from '@/data/courses'
import { docById } from '@/data/documents'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SimulatedTag } from '@/components/ui/Badge'
import { PracticePanel } from './PracticePanel'

const REC_STYLE = {
  practice: { label: 'Practice', tone: 'bg-brand-50 text-brand-800 ring-brand-200' },
  reread: { label: 'Re-read', tone: 'bg-violet-50 text-violet-800 ring-violet-200' },
  redo: { label: 'Redo', tone: 'bg-amber-50 text-amber-800 ring-amber-200' },
} as const

function StatCard({
  icon: Icon,
  value,
  label,
  detail,
}: {
  icon: typeof TrendingUp
  value: string
  label: string
  detail: string
}) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-panel ring-1 ring-navy-100">
      <Icon className="h-4 w-4 text-brand-700" aria-hidden="true" />
      <p className="mt-2.5 text-2xl font-semibold tracking-tight tabular-nums text-navy-900">{value}</p>
      <p className="text-[13px] font-medium text-navy-800">{label}</p>
      <p className="mt-1 text-[12px] leading-relaxed text-navy-500">{detail}</p>
    </div>
  )
}

/** Small weekly activity chart. Hand-drawn SVG beats a charting dependency here. */
function ActivityChart() {
  const max = Math.max(...activityWeeks.map((w) => w.minutes))
  return (
    <div className="rounded-xl bg-white p-5 shadow-panel ring-1 ring-navy-100">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-[15px] font-semibold tracking-tight text-navy-900">Study time and errors</h3>
        <SimulatedTag className="ml-auto" />
      </div>
      <p className="mt-1 text-[12.5px] leading-relaxed text-navy-600">
        Minutes of work each week, against the number of flagged mistakes. Time went up and errors
        came down - the two are not always related, but here they are.
      </p>

      <div className="mt-5 flex items-end gap-2.5" role="img" aria-label="Weekly study minutes and error counts for six weeks">
        {activityWeeks.map((week) => (
          <div key={week.label} className="flex flex-1 flex-col items-center gap-1.5">
            <span className="text-[10.5px] font-medium tabular-nums text-navy-500">{week.minutes}</span>
            <div className="relative flex w-full justify-center" style={{ height: 96 }}>
              <div
                className="w-full max-w-[2.5rem] self-end rounded-t-md bg-brand-600/85 transition-[height] duration-700"
                style={{ height: `${(week.minutes / max) * 100}%` }}
              />
              {/* Error markers stacked on top of the bar */}
              <span className="absolute -top-0.5 flex gap-0.5">
                {Array.from({ length: week.errors }, (_, i) => (
                  <span key={i} className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                ))}
              </span>
            </div>
            <span className="text-[10.5px] text-navy-500">{week.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 border-t border-navy-100 pt-3 text-[11.5px] text-navy-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-brand-600/85" />
          Minutes studied
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Flagged mistakes
        </span>
      </div>
    </div>
  )
}

interface InsightsPageProps {
  onBack: () => void
  onOpenDoc: (docId: string) => void
  onAskTutor: (question: string) => void
}

export function InsightsPage({ onBack, onOpenDoc, onAskTutor }: InsightsPageProps) {
  const course = courses[0]
  const avgMastery = Math.round(
    course.chapters.reduce((sum, ch) => sum + ch.mastery, 0) / course.chapters.length,
  )
  const totalMinutes = activityWeeks.reduce((sum, w) => sum + w.minutes, 0)

  return (
    <div className="scrollbar-slim h-full overflow-y-auto bg-navy-100/50">
      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6 sm:py-7">
        <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to the workspace
        </Button>

        <header className="mt-3">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-navy-900">Learning insights</h1>
            <SimulatedTag label="Simulated analysis" />
          </div>
          <p className="mt-2 max-w-2xl text-pretty text-[14.5px] leading-relaxed text-navy-700">
            Built from the work already in this workspace: your notes, the pages you photographed,
            your marked quiz and every tutor conversation. Nothing here came from a self-assessment.
          </p>
        </header>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Repeat}
            value={String(struggles.length)}
            label="Recurring mistakes"
            detail="One of them accounts for most of the marks lost this term"
          />
          <StatCard
            icon={TrendingUp}
            value={`${avgMastery}%`}
            label="Average mastery"
            detail={`Across ${course.chapters.length} chapters in ${course.code}`}
          />
          <StatCard
            icon={Clock}
            value={`${Math.round(totalMinutes / 60)}h`}
            label="Tracked study time"
            detail="Six weeks, rising steadily"
          />
          <StatCard
            icon={CheckCircle2}
            value={String(strengths.length)}
            label="What is going well"
            detail="Things that are reliably right in your work"
          />
        </div>

        {/* Recurring struggles */}
        <section className="mt-6">
          <div className="flex flex-wrap items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden="true" />
            <h2 className="text-[17px] font-semibold tracking-tight text-navy-900">
              What keeps coming back
            </h2>
          </div>
          <div className="mt-3 space-y-3">
            {struggles.map((struggle) => (
              <article key={struggle.id} className="rounded-xl bg-white p-5 shadow-panel ring-1 ring-navy-100">
                <div className="flex flex-wrap items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[15.5px] font-semibold tracking-tight text-navy-900">
                      {struggle.topic}
                    </h3>
                    <p className="mt-0.5 text-[12px] text-navy-500">
                      {struggle.occurrences} {struggle.occurrences === 1 ? 'appearance' : 'appearances'} - last
                      seen {struggle.lastSeen}
                    </p>
                  </div>
                  <div className="w-full sm:w-40">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] font-medium text-navy-500">Priority</span>
                      <span className="text-[11.5px] font-semibold tabular-nums text-navy-800">
                        {struggle.severity}
                      </span>
                    </div>
                    <ProgressBar
                      className="mt-1"
                      value={struggle.severity}
                      tone={struggle.severity > 70 ? 'amber' : 'brand'}
                      label={`${struggle.topic} priority`}
                    />
                  </div>
                </div>

                <dl className="mt-3.5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-navy-50 p-3">
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-navy-500">
                      The pattern
                    </dt>
                    <dd className="mt-1 text-[13px] leading-relaxed text-navy-800">{struggle.pattern}</dd>
                  </div>
                  <div className="rounded-lg bg-brand-50 p-3 ring-1 ring-inset ring-brand-100">
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-brand-800">
                      What would actually fix it
                    </dt>
                    <dd className="mt-1 text-[13px] leading-relaxed text-navy-800">{struggle.fix}</dd>
                  </div>
                </dl>

                <div className="mt-3.5 flex flex-wrap items-center gap-2">
                  <span className="text-[11.5px] font-medium text-navy-500">Seen in:</span>
                  {struggle.evidenceDocIds.map((docId) => {
                    const doc = docById(docId)
                    if (!doc) return null
                    return (
                      <button
                        key={docId}
                        type="button"
                        onClick={() => onOpenDoc(docId)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[12px] font-medium text-navy-700 ring-1 ring-navy-200 transition-colors hover:bg-brand-50 hover:text-brand-800 hover:ring-brand-300"
                      >
                        <FileText className="h-3 w-3 text-navy-400" aria-hidden="true" />
                        <span className="max-w-[12rem] truncate">{doc.title}</span>
                      </button>
                    )
                  })}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-auto"
                    onClick={() => onAskTutor(`Where else have I made this mistake with ${struggle.topic}?`)}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Ask about this
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Practice */}
        <section className="mt-6">
          <h2 className="text-[17px] font-semibold tracking-tight text-navy-900">
            Close the biggest gap now
          </h2>
          <p className="mt-1 max-w-2xl text-[13.5px] leading-relaxed text-navy-600">
            Three questions on the one thing that costs you the most marks. Each asks it a different
            way, so pattern-matching will not get you through.
          </p>
          <div className="mt-3">
            <PracticePanel onAskTutor={onAskTutor} />
          </div>
        </section>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {/* Strengths */}
          <section className="rounded-xl bg-white p-5 shadow-panel ring-1 ring-navy-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
              <h2 className="text-[15px] font-semibold tracking-tight text-navy-900">
                What is working
              </h2>
            </div>
            <ul className="mt-3 space-y-3.5">
              {strengths.map((strength) => (
                <li key={strength.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-[13.5px] font-medium text-navy-900">{strength.topic}</h3>
                    <span className="shrink-0 text-[12px] font-semibold tabular-nums text-emerald-700">
                      {strength.accuracy}%
                    </span>
                  </div>
                  <ProgressBar
                    className="mt-1.5"
                    value={strength.accuracy}
                    tone="emerald"
                    label={`${strength.topic} accuracy`}
                  />
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-navy-600">{strength.note}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Chapter mastery */}
          <section className="rounded-xl bg-white p-5 shadow-panel ring-1 ring-navy-100">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-brand-700" aria-hidden="true" />
              <h2 className="text-[15px] font-semibold tracking-tight text-navy-900">
                Chapter mastery - {course.code}
              </h2>
            </div>
            <ul className="mt-3 space-y-3">
              {course.chapters.map((chapter) => (
                <li key={chapter.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="truncate text-[13px] text-navy-800">
                      <span className="font-medium text-navy-500">{chapter.number}.</span> {chapter.title}
                    </span>
                    <span
                      className={cn(
                        'shrink-0 text-[12px] font-semibold tabular-nums',
                        chapter.mastery < 50
                          ? 'text-amber-700'
                          : chapter.mastery < 75
                            ? 'text-navy-700'
                            : 'text-emerald-700',
                      )}
                    >
                      {chapter.mastery}%
                    </span>
                  </div>
                  <ProgressBar
                    className="mt-1.5"
                    value={chapter.mastery}
                    tone={chapter.mastery < 50 ? 'amber' : chapter.mastery < 75 ? 'brand' : 'emerald'}
                    label={`Chapter ${chapter.number} mastery`}
                  />
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="mt-4">
          <ActivityChart />
        </div>

        {/* Recommendations */}
        <section className="mt-6 pb-8">
          <h2 className="text-[17px] font-semibold tracking-tight text-navy-900">
            What to do this week
          </h2>
          <p className="mt-1 text-[13.5px] text-navy-600">
            Ordered by how many marks it is likely to recover, not by how long it takes.
          </p>
          <ol className="mt-3 space-y-2.5">
            {recommendations.map((rec, i) => {
              const style = REC_STYLE[rec.kind]
              return (
                <li
                  key={rec.id}
                  className="flex flex-wrap items-start gap-3 rounded-xl bg-white p-4 shadow-panel ring-1 ring-navy-100"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-navy-900 text-[12px] font-semibold text-white">
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[14px] font-semibold text-navy-900">{rec.title}</h3>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset',
                          style.tone,
                        )}
                      >
                        {style.label}
                      </span>
                      <span className="text-[11.5px] text-navy-500">{rec.minutes} min</span>
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed text-navy-600">{rec.reason}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </section>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { ArrowRight, Check, RotateCcw, Sparkles, X } from 'lucide-react'
import { practiceQuestions } from '@/data/insights'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { SimulatedTag } from '@/components/ui/Badge'
import { useStore } from '@/state/store'

/**
 * A short, targeted practice set.
 *
 * The questions all probe the same misconception from different angles, which
 * is the point the insights page is making: the gap is narrow, so the fix is
 * drilling rather than re-reading.
 */
export function PracticePanel({ onAskTutor }: { onAskTutor: (question: string) => void }) {
  const { state, dispatch, markExplored } = useStore()
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState<string | null>(null)

  const question = practiceQuestions[index]
  const saved = state.practiceAnswers[question.id]
  const chosenId = revealed ?? saved?.optionId ?? null
  const chosen = chosenId ? question.options.find((o) => o.id === chosenId) : null
  const answeredCount = Object.keys(state.practiceAnswers).length
  const correctCount = Object.values(state.practiceAnswers).filter((a) => a.correct).length
  const isLast = index === practiceQuestions.length - 1
  const allDone = answeredCount >= practiceQuestions.length

  const choose = (optionId: string) => {
    if (chosen) return
    const option = question.options.find((o) => o.id === optionId)
    if (!option) return
    setRevealed(optionId)
    dispatch({ type: 'answer-practice', questionId: question.id, optionId, correct: option.correct })
    markExplored('practice')
  }

  const next = () => {
    setRevealed(null)
    setIndex((i) => Math.min(practiceQuestions.length - 1, i + 1))
  }

  const restart = () => {
    dispatch({ type: 'reset-practice' })
    setRevealed(null)
    setIndex(0)
  }

  return (
    <section className="rounded-xl bg-white p-5 shadow-panel ring-1 ring-navy-100">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-[15px] font-semibold tracking-tight text-navy-900">
          Practice: working capital signs
        </h3>
        <SimulatedTag label="Simulated feedback" />
        <span className="ml-auto text-[12px] tabular-nums text-navy-500">
          {correctCount} / {practiceQuestions.length} correct
        </span>
      </div>

      {/* Question pips */}
      <div className="mt-3 flex gap-1.5">
        {practiceQuestions.map((q, i) => {
          const answer = state.practiceAnswers[q.id]
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => {
                setRevealed(null)
                setIndex(i)
              }}
              aria-label={`Question ${i + 1}${answer ? (answer.correct ? ', answered correctly' : ', answered incorrectly') : ''}`}
              aria-current={i === index ? 'step' : undefined}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors',
                i === index
                  ? 'bg-brand-600'
                  : answer
                    ? answer.correct
                      ? 'bg-emerald-500'
                      : 'bg-amber-500'
                    : 'bg-navy-200',
              )}
            />
          )
        })}
      </div>

      <p className="mt-4 text-[14.5px] leading-relaxed text-navy-900">{question.prompt}</p>

      {question.given ? (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {question.given.map((g) => (
            <li
              key={g}
              className="rounded-md bg-navy-50 px-2 py-1 font-mono text-[12px] text-navy-700 ring-1 ring-inset ring-navy-200"
            >
              {g}
            </li>
          ))}
        </ul>
      ) : null}

      <ul className="mt-4 space-y-2">
        {question.options.map((option) => {
          const isChosen = chosenId === option.id
          const showState = Boolean(chosen)
          return (
            <li key={option.id}>
              <button
                type="button"
                onClick={() => choose(option.id)}
                disabled={showState}
                aria-pressed={isChosen}
                className={cn(
                  'flex w-full items-start gap-2.5 rounded-lg p-3 text-left text-[13.5px] leading-relaxed ring-1 ring-inset transition-colors',
                  !showState && 'bg-white text-navy-800 ring-navy-200 hover:bg-navy-50 hover:ring-navy-300',
                  showState && option.correct && 'bg-emerald-50 text-emerald-900 ring-emerald-300',
                  showState && !option.correct && isChosen && 'bg-rose-50 text-rose-900 ring-rose-300',
                  showState && !option.correct && !isChosen && 'bg-white text-navy-500 ring-navy-100',
                  showState && 'cursor-default',
                )}
              >
                <span
                  className={cn(
                    'mt-0.5 grid h-4.5 w-4.5 shrink-0 place-items-center rounded-full text-[10px] font-bold',
                    showState && option.correct && 'bg-emerald-600 text-white',
                    showState && !option.correct && isChosen && 'bg-rose-600 text-white',
                    (!showState || (!option.correct && !isChosen)) && 'bg-navy-100 text-navy-600',
                  )}
                >
                  {showState && option.correct ? (
                    <Check className="h-3 w-3" aria-hidden="true" />
                  ) : showState && isChosen ? (
                    <X className="h-3 w-3" aria-hidden="true" />
                  ) : (
                    option.id.toUpperCase()
                  )}
                </span>
                {option.text}
              </button>
            </li>
          )
        })}
      </ul>

      {chosen ? (
        <div className="mt-4 animate-fade-up space-y-3">
          <div
            className={cn(
              'rounded-lg p-3.5 ring-1 ring-inset',
              chosen.correct ? 'bg-emerald-50 ring-emerald-200' : 'bg-amber-50 ring-amber-200',
            )}
          >
            <p
              className={cn(
                'text-[12px] font-semibold uppercase tracking-wide',
                chosen.correct ? 'text-emerald-800' : 'text-amber-800',
              )}
            >
              {chosen.correct ? 'Correct' : 'Not quite'}
            </p>
            <p
              className={cn(
                'mt-1 text-[13.5px] leading-relaxed',
                chosen.correct ? 'text-emerald-900' : 'text-amber-900',
              )}
            >
              {chosen.feedback}
            </p>
          </div>

          <div className="rounded-lg bg-navy-50 p-3.5 ring-1 ring-inset ring-navy-200">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-navy-500">
              Why, in full
            </p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-navy-800">{question.explanation}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!isLast ? (
              <Button variant="primary" onClick={next}>
                Next question
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            ) : null}
            <Button
              variant="secondary"
              onClick={() => onAskTutor(`Explain this again: ${question.topic}`)}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Ask the tutor about this
            </Button>
            {answeredCount > 0 ? (
              <Button variant="ghost" onClick={restart}>
                <RotateCcw className="h-3.5 w-3.5" />
                Start over
              </Button>
            ) : null}
          </div>
        </div>
      ) : null}

      {allDone && chosen ? (
        <p className="mt-4 rounded-lg bg-brand-50 p-3 text-[13px] leading-relaxed text-brand-900 ring-1 ring-inset ring-brand-200">
          {correctCount === practiceQuestions.length
            ? 'Three from three, including the one where an asset decreased. That is the pattern closing. Come back to it once more in a few days and it should be finished.'
            : `${correctCount} from ${practiceQuestions.length}. The misses were all on the same line, which is exactly what the insights above predicted. Two more short sessions like this one should do it.`}
        </p>
      ) : null}
    </section>
  )
}

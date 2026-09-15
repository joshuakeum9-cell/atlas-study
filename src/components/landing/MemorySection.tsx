import { Quote } from 'lucide-react'
import { SimulatedTag } from '@/components/ui/Badge'

const STAGES = [
  {
    when: 'Week 1',
    knows: 'One assignment and its handout',
    says: 'Net working capital is operating current assets minus operating current liabilities.',
    tone: 'A correct textbook answer. Any chatbot can do this.',
  },
  {
    when: 'Week 3',
    knows: 'Your notes, and where you flagged yourself',
    says: 'Your Chapter 4 notes have the payables line written the wrong way round, with your own correction under it.',
    tone: 'It can now point at your material instead of a textbook.',
  },
  {
    when: 'Week 6',
    knows: 'Marked work, and what the marker said',
    says: 'This is the same sign that cost you four marks on Quiz 2 question 3.',
    tone: 'It connects today’s mistake to a specific past one.',
  },
  {
    when: 'Week 12',
    knows: 'A term of patterns across every course',
    says: 'It only goes wrong on payables, only mid-calculation, never when I ask you the definition. That is fluency, not understanding - drill it, do not re-read it.',
    tone: 'It can say something no textbook and no fresh chat ever could.',
  },
]

export function MemorySection() {
  return (
    <section
      id="memory"
      className="scroll-mt-16 border-b border-navy-100 bg-white px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-[12.5px] font-semibold uppercase tracking-wider text-brand-700">
            Academic memory
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-navy-900 sm:text-[2.1rem]">
            The same question gets a better answer in week twelve
          </h2>
          <p className="mt-4 text-pretty text-[15.5px] leading-relaxed text-navy-700">
            The long-term goal is not a chatbot that answers isolated questions. It is a record of
            how you have actually learned, so that the answer you get depends on everything that
            came before it. Here is the same question about working capital, asked four times across
            a term.
          </p>
        </div>

        <ol className="mt-10 grid gap-5 lg:grid-cols-4">
          {STAGES.map((stage, i) => (
            <li key={stage.when} className="relative flex flex-col">
              {/* Connector line between stages on wide screens */}
              {i < STAGES.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-3 hidden h-px w-full translate-x-1/2 bg-gradient-to-r from-brand-300 to-navy-100 lg:block"
                />
              ) : null}

              <div className="relative mb-4 flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-brand-600 ring-4 ring-brand-100" />
                <span className="text-[13px] font-semibold text-navy-900">{stage.when}</span>
              </div>

              <div className="flex flex-1 flex-col rounded-xl bg-navy-50/70 p-4 ring-1 ring-navy-100">
                <p className="text-[12px] font-semibold uppercase tracking-wide text-navy-500">
                  Knows
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-navy-700">{stage.knows}</p>

                <div className="mt-4 rounded-lg bg-white p-3 ring-1 ring-navy-100">
                  <Quote className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
                  <p className="mt-1.5 text-[13px] leading-relaxed text-navy-800">{stage.says}</p>
                </div>

                <p className="mt-3 text-[12px] leading-relaxed text-navy-500">{stage.tone}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-8 flex flex-wrap items-center gap-2 text-[12.5px] text-navy-500">
          <SimulatedTag />
          In this prototype the memory is a fixed sample dataset. The point of the demo is the
          shape of the idea, not a real record of anyone&rsquo;s term.
        </p>
      </div>
    </section>
  )
}

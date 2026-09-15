import { FolderX, Repeat, SplitSquareHorizontal } from 'lucide-react'

const PROBLEMS = [
  {
    icon: SplitSquareHorizontal,
    title: 'The tutor cannot see the work',
    body: 'Your problem set is on paper, the handout is a PDF in one folder, your notes are in another app, and the AI is in a browser tab that knows none of it. So you retype the question, badly, and get an answer to a question you did not ask.',
  },
  {
    icon: Repeat,
    title: 'Every session starts from zero',
    body: 'A chatbot has no idea that you made this exact mistake on last month’s quiz, or that the marker already wrote a comment about it. It explains the concept again, correctly and uselessly, because it cannot see the pattern.',
  },
  {
    icon: FolderX,
    title: 'Nothing is findable later',
    body: 'Three weeks on, you know you worked something out but not where. It could be in a photo, a PDF, a note, or a chat thread you cannot name. Searching by filename only works if you can remember the filename.',
  },
]

export function ProblemSection() {
  return (
    <section id="problem" className="scroll-mt-16 border-b border-navy-100 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-[12.5px] font-semibold uppercase tracking-wider text-brand-700">
            The problem
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-navy-900 sm:text-[2.1rem]">
            Studying is scattered across four places. The AI only sees one of them.
          </h2>
          <p className="mt-4 text-pretty text-[15.5px] leading-relaxed text-navy-700">
            The tools are all fine on their own. The problem is the gaps between them, and the gaps
            are exactly where the useful context lives.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {PROBLEMS.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="rounded-xl bg-white p-5 shadow-panel ring-1 ring-navy-100 transition-shadow duration-200 hover:shadow-lift"
            >
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy-900 text-white">
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-[16px] font-semibold tracking-tight text-navy-900">{title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-navy-600">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

const STEPS = [
  {
    n: '01',
    title: 'Bring the work in',
    body: 'Import the handout, your notes, a PDF, or photograph the page you wrote on. Everything lands in the assignment it belongs to.',
    detail: 'PDFs, images, notes and photographed worksheets',
  },
  {
    n: '02',
    title: 'Circle what you are stuck on',
    body: 'Drag a box around one line of your own handwriting. Not the whole page, not a retyped summary - the actual thing that is going wrong.',
    detail: 'Works on handwriting, printed text and diagrams',
  },
  {
    n: '03',
    title: 'Confirm what it read',
    body: 'Handwriting recognition is never certain, so you see the transcription before the tutor does anything with it. Confirm it, or fix it in one click.',
    detail: 'Low-confidence characters are highlighted',
  },
  {
    n: '04',
    title: 'Ask, by text or voice',
    body: 'Your question arrives attached to the thing you circled, with the assignment brief, your notes and your past work already in view.',
    detail: 'The answer cites the documents it used',
  },
  {
    n: '05',
    title: 'It stays where it happened',
    body: 'The conversation is saved against the assignment, not lost in a chat history. Open the assignment in three weeks and the reasoning is still there.',
    detail: 'Searchable by description, not filename',
  },
]

export function WorkflowSection() {
  return (
    <section
      id="workflow"
      className="scroll-mt-16 border-b border-navy-100 bg-white px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-[12.5px] font-semibold uppercase tracking-wider text-brand-700">
            The workflow
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-navy-900 sm:text-[2.1rem]">
            Five steps, one workspace
          </h2>
          <p className="mt-4 text-pretty text-[15.5px] leading-relaxed text-navy-700">
            This is the whole loop, and it is the same loop whether you are two minutes or two
            months into a course.
          </p>
        </div>

        <ol className="mt-10 grid gap-px overflow-hidden rounded-xl bg-navy-100 ring-1 ring-navy-100 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((step) => (
            <li key={step.n} className="flex flex-col bg-white p-5">
              <span className="text-[13px] font-semibold tabular-nums text-brand-700">{step.n}</span>
              <h3 className="mt-2.5 text-[15.5px] font-semibold leading-snug tracking-tight text-navy-900">
                {step.title}
              </h3>
              <p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-navy-600">{step.body}</p>
              <p className="mt-4 border-t border-navy-100 pt-3 text-[12px] leading-relaxed text-navy-500">
                {step.detail}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

import {
  Camera,
  FileSearch,
  Highlighter,
  LineChart,
  Mic,
  MessageSquareText,
  Share2,
  Upload,
} from 'lucide-react'

const FEATURES = [
  {
    icon: Upload,
    title: 'One place for everything',
    body: 'Assignments, PDFs, lecture notes, slides and photos of paper, filed under the course and the assignment they belong to.',
  },
  {
    icon: Camera,
    title: 'Photograph paper work',
    body: 'Snap the worksheet you wrote on and it becomes a first-class document in the workspace, not an attachment you lose.',
  },
  {
    icon: Highlighter,
    title: 'Circle to ask',
    body: 'Select any part of a page - a line of your handwriting, a step in a proof, a figure - and ask about exactly that.',
  },
  {
    icon: MessageSquareText,
    title: 'Confirm before it reasons',
    body: 'Handwriting recognition shows you what it read, flags what it is unsure about, and waits for you to confirm or correct it.',
  },
  {
    icon: Mic,
    title: 'Voice or text',
    body: 'Talk to it when your hands are busy working through a problem. The question arrives with the same context attached.',
  },
  {
    icon: FileSearch,
    title: 'Search by description',
    body: '"The notes where I struggled with the minus sign" finds the page, because the workspace knows what is in it and how it went.',
  },
  {
    icon: LineChart,
    title: 'Learning insights',
    body: 'Recurring mistakes, strengths, chapter mastery and a review plan, built from your actual work rather than a self-assessment.',
  },
  {
    icon: Share2,
    title: 'Share a workspace',
    body: 'Send a friend the whole assignment, a single PDF, or a study-group workspace, with view, comment or edit access.',
  },
]

export function FeatureSection() {
  return (
    <section id="features" className="scroll-mt-16 border-b border-navy-100 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-[12.5px] font-semibold uppercase tracking-wider text-brand-700">
            Core features
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-navy-900 sm:text-[2.1rem]">
            What is in Version 1
          </h2>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <article key={title} className="rounded-xl bg-white p-5 shadow-panel ring-1 ring-navy-100">
              <Icon className="h-5 w-5 text-brand-700" aria-hidden="true" />
              <h3 className="mt-3.5 text-[15px] font-semibold leading-snug tracking-tight text-navy-900">
                {title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-navy-600">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

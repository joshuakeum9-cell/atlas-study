import { ArrowRight, Camera, Brain, MessagesSquare } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { WorkspacePreview } from './WorkspacePreview'

const PILLARS = [
  { icon: Camera, label: 'Point at the work', detail: 'Circle handwriting on a photo of your page' },
  { icon: MessagesSquare, label: 'Ask about that', detail: 'The tutor reads what you circled' },
  { icon: Brain, label: 'It remembers', detail: 'Every answer knows the rest of your term' },
]

export function Hero({ onOpenDemo }: { onOpenDemo: () => void }) {
  return (
    <section className="relative overflow-hidden border-b border-navy-100">
      {/* Soft background wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_32rem_at_70%_-10%,var(--color-brand-100),transparent_60%)] opacity-70"
      />
      <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-14">
        <div className="animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[12px] font-medium text-navy-700 ring-1 ring-navy-200">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
            Version 1 - the all-in-one study workspace
          </p>

          <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-navy-900 sm:text-5xl">
            A tutor that can see your actual work
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-[16.5px] leading-relaxed text-navy-700">
            Atlas keeps your documents, your handwritten pages, your notes and your AI tutor in one
            workspace. Circle the line you are stuck on and ask about that specific thing. Because
            everything lives together, the tutor answers with your whole course in view, not just
            the message you typed.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button size="lg" variant="primary" onClick={onOpenDemo}>
              Try interactive demo
              <ArrowRight className="h-4 w-4" />
            </Button>
            <a
              href="#workflow"
              className="inline-flex h-11 items-center rounded-lg px-4 text-[15px] font-medium text-navy-700 transition-colors hover:bg-navy-100/70 hover:text-navy-900"
            >
              See the workflow
            </a>
          </div>

          <dl className="mt-10 grid gap-4 sm:grid-cols-3">
            {PILLARS.map(({ icon: Icon, label, detail }) => (
              <div key={label} className="flex gap-2.5">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
                <div>
                  <dt className="text-[13.5px] font-semibold text-navy-900">{label}</dt>
                  <dd className="mt-0.5 text-[12.5px] leading-relaxed text-navy-600">{detail}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        <div className="animate-fade-up [animation-delay:120ms]">
          <WorkspacePreview />
          <p className="mt-3 text-center text-[12px] text-navy-500">
            The workspace: your courses, the document you are working on, and the tutor beside it.
          </p>
        </div>
      </div>
    </section>
  )
}

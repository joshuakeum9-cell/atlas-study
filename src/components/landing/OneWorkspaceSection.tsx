import { Check, X } from 'lucide-react'

const IN_V1 = [
  'Documents, notes and the tutor in one panel layout',
  'The tutor reads whatever is open, without being told about it',
  'Conversations saved against the assignment they belong to',
  'One search across every file, note and chat in the workspace',
  'Insights built from the work already sitting in the workspace',
]

const NOT_YET = [
  'A separate mobile capture app',
  'Live tutoring during a lecture',
  'Integrations with your university LMS',
  'Collaborative real-time editing',
  'Anything that needs an account or a server',
]

export function OneWorkspaceSection() {
  return (
    <section className="border-b border-navy-100 px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
        <div>
          <p className="text-[12.5px] font-semibold uppercase tracking-wider text-brand-700">
            Why one workspace
          </p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-navy-900 sm:text-[2.1rem]">
            Version 1 keeps everything in one place on purpose
          </h2>
          <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-navy-700">
            <p>
              The obvious way to build this is as several products: a document store, a note app, a
              tutor, a search tool. That is also the way to rebuild the original problem, because
              the context stops at each boundary.
            </p>
            <p>
              Keeping it in one workspace means the tutor does not need to be handed anything. The
              assignment brief, the page you photographed, the notes you took in week three and the
              quiz you got back last Tuesday are all already in scope. That is what lets it say
              &ldquo;this is the fourth time&rdquo; instead of explaining the concept again.
            </p>
            <p>
              It is a constraint, not a feature list. Version 1 deliberately does less so that the
              one thing it does - answering with your whole course in view - actually works.
            </p>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:mt-14">
          <div className="rounded-xl bg-white p-5 shadow-panel ring-1 ring-navy-100">
            <h3 className="text-[14px] font-semibold text-navy-900">In Version 1</h3>
            <ul className="mt-3 space-y-2.5">
              {IN_V1.map((item) => (
                <li key={item} className="flex gap-2 text-[13px] leading-relaxed text-navy-700">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-navy-50/70 p-5 ring-1 ring-navy-100">
            <h3 className="text-[14px] font-semibold text-navy-900">Deliberately out of scope</h3>
            <ul className="mt-3 space-y-2.5">
              {NOT_YET.map((item) => (
                <li key={item} className="flex gap-2 text-[13px] leading-relaxed text-navy-600">
                  <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-navy-400" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

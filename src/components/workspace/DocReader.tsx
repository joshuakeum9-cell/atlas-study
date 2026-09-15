import { AlertTriangle, FileText, Info, Sparkles } from 'lucide-react'
import type { StudyDoc } from '@/types'
import { SimulatedTag } from '@/components/ui/Badge'

/**
 * Reader for notes, PDFs and slides. The "pages" are rendered from structured
 * blocks rather than a real PDF renderer - this is a prototype, and a real PDF
 * pipeline would add weight without changing what the demo communicates.
 */
export function DocReader({ doc }: { doc: StudyDoc }) {
  return (
    <div className="scrollbar-slim h-full overflow-y-auto bg-navy-100/60 p-4 sm:p-6">
      <div className="mx-auto max-w-3xl space-y-4">
        {/* Mock document-understanding panel */}
        <section className="rounded-xl bg-white p-4 shadow-panel ring-1 ring-navy-100">
          <div className="flex flex-wrap items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-700" aria-hidden="true" />
            <h3 className="text-[13.5px] font-semibold text-navy-900">What this document is about</h3>
            <SimulatedTag label="Simulated analysis" className="ml-auto" />
          </div>
          <p className="mt-2.5 text-[13.5px] leading-relaxed text-navy-700">{doc.summary}</p>
          {doc.tags.length ? (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {doc.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-navy-100 px-2 py-0.5 text-[11.5px] font-medium text-navy-700"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        {/* The page itself */}
        <article className="rounded-xl bg-white px-5 py-6 shadow-lift ring-1 ring-navy-900/10 sm:px-9 sm:py-9">
          {doc.body?.length ? (
            <div className="space-y-4">
              {doc.body.map((block, i) => {
                switch (block.type) {
                  case 'heading':
                    return (
                      <h2
                        key={i}
                        className="mt-2 text-[19px] font-semibold tracking-tight text-navy-900 first:mt-0"
                      >
                        {block.text}
                      </h2>
                    )
                  case 'paragraph':
                    return (
                      <p key={i} className="text-[14.5px] leading-[1.75] text-navy-800">
                        {block.text}
                      </p>
                    )
                  case 'bullets':
                    return (
                      <ul key={i} className="space-y-1.5 pl-1">
                        {block.items.map((item) => (
                          <li key={item} className="flex gap-2.5 text-[14.5px] leading-[1.7] text-navy-800">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-navy-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )
                  case 'formula':
                    return (
                      <figure key={i} className="rounded-lg bg-navy-50 px-4 py-3 ring-1 ring-inset ring-navy-100">
                        <p className="text-center font-mono text-[14.5px] text-navy-900">{block.text}</p>
                        {block.caption ? (
                          <figcaption className="mt-1.5 text-center text-[12px] text-navy-500">
                            {block.caption}
                          </figcaption>
                        ) : null}
                      </figure>
                    )
                  case 'callout':
                    return (
                      <aside
                        key={i}
                        className={
                          block.tone === 'struggle'
                            ? 'flex gap-2.5 rounded-lg bg-amber-50 p-3.5 ring-1 ring-inset ring-amber-200'
                            : 'flex gap-2.5 rounded-lg bg-brand-50 p-3.5 ring-1 ring-inset ring-brand-200'
                        }
                      >
                        {block.tone === 'struggle' ? (
                          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
                        ) : (
                          <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
                        )}
                        <p
                          className={
                            block.tone === 'struggle'
                              ? 'text-[13.5px] leading-relaxed text-amber-900'
                              : 'text-[13.5px] leading-relaxed text-brand-900'
                          }
                        >
                          {block.text}
                        </p>
                      </aside>
                    )
                  case 'table':
                    return (
                      <div key={i} className="overflow-x-auto">
                        <table className="w-full min-w-[22rem] border-collapse text-[14px]">
                          <thead>
                            <tr>
                              {block.head.map((h, hi) => (
                                <th
                                  key={h}
                                  scope="col"
                                  className={`border-b-2 border-navy-200 py-2 font-semibold text-navy-900 ${
                                    hi === 0 ? 'text-left' : 'text-right'
                                  }`}
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {block.rows.map((row) => (
                              <tr key={row[0]} className="border-b border-navy-100 last:border-0">
                                {row.map((cell, ci) => (
                                  <td
                                    key={ci}
                                    className={`py-2 text-navy-800 ${
                                      ci === 0 ? 'text-left' : 'text-right tabular-nums'
                                    }`}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )
                  default:
                    return null
                }
              })}
            </div>
          ) : (
            <div className="py-10 text-center">
              <FileText className="mx-auto h-8 w-8 text-navy-300" aria-hidden="true" />
              <p className="mt-3 text-[14px] font-medium text-navy-800">{doc.title}</p>
              <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-navy-600">
                This prototype does not render the full contents of every sample file. The summary
                above is what a document-understanding pass would extract, and it is what makes the
                file findable by description.
              </p>
            </div>
          )}
        </article>

        <p className="pb-2 text-center text-[12px] text-navy-500">
          {doc.pages} {doc.pages === 1 ? 'page' : 'pages'} - {doc.sizeLabel} - {doc.updated}
        </p>
      </div>
    </div>
  )
}

import { Fragment, type ReactNode } from 'react'

/**
 * A very small formatter for the tutor's scripted replies.
 *
 * Deliberately not a markdown library: the replies use exactly four things -
 * bold, italics, indented formula lines and blockquotes - and a 60-line
 * formatter is far lighter than a parser plus a sanitiser. Nothing here renders
 * raw HTML, so there is no injection surface.
 */

function inline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  // Split on **bold** and *italic*, keeping the delimiters.
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
  parts.forEach((part, i) => {
    if (!part) return
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      nodes.push(
        <strong key={`${keyPrefix}-b-${i}`} className="font-semibold text-navy-900">
          {part.slice(2, -2)}
        </strong>,
      )
    } else if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      nodes.push(
        <em key={`${keyPrefix}-i-${i}`} className="italic">
          {part.slice(1, -1)}
        </em>,
      )
    } else {
      nodes.push(<Fragment key={`${keyPrefix}-t-${i}`}>{part}</Fragment>)
    }
  })
  return nodes
}

export function RichText({ text }: { text: string }) {
  const lines = text.split('\n')
  const blocks: ReactNode[] = []

  let paragraph: string[] = []
  let formula: string[] = []

  const flushParagraph = (key: string) => {
    if (!paragraph.length) return
    const content = paragraph.join(' ')
    paragraph = []
    blocks.push(
      <p key={key} className="text-[13.5px] leading-[1.65] text-navy-800">
        {inline(content, key)}
      </p>,
    )
  }

  const flushFormula = (key: string) => {
    if (!formula.length) return
    const content = formula.join('\n')
    formula = []
    blocks.push(
      <pre
        key={key}
        className="overflow-x-auto rounded-lg bg-navy-50 px-3 py-2 font-mono text-[12.5px] leading-relaxed text-navy-900 ring-1 ring-inset ring-navy-100"
      >
        {content}
      </pre>,
    )
  }

  lines.forEach((rawLine, i) => {
    const key = `l-${i}`
    const line = rawLine.trimEnd()

    // Indented lines are formulas and worked steps.
    if (/^ {2,}\S/.test(line)) {
      flushParagraph(`${key}-p`)
      formula.push(line.replace(/^ {2}/, ''))
      return
    }
    flushFormula(`${key}-f`)

    if (!line.trim()) {
      flushParagraph(`${key}-p`)
      return
    }

    if (line.startsWith('> ')) {
      flushParagraph(`${key}-p`)
      blocks.push(
        <blockquote
          key={key}
          className="border-l-2 border-brand-400 bg-brand-50/50 py-1.5 pl-3 pr-2 text-[13.5px] italic leading-relaxed text-navy-800"
        >
          {inline(line.slice(2), key)}
        </blockquote>,
      )
      return
    }

    if (/^[-*] /.test(line)) {
      flushParagraph(`${key}-p`)
      blocks.push(
        <div key={key} className="flex gap-2 text-[13.5px] leading-[1.6] text-navy-800">
          <span className="mt-[0.5rem] h-1 w-1 shrink-0 rounded-full bg-navy-400" />
          <span>{inline(line.slice(2), key)}</span>
        </div>,
      )
      return
    }

    // Numbered list item.
    const numbered = line.match(/^(\d+)\.\s+(.*)$/)
    if (numbered) {
      flushParagraph(`${key}-p`)
      blocks.push(
        <div key={key} className="flex gap-2 text-[13.5px] leading-[1.6] text-navy-800">
          <span className="shrink-0 font-semibold tabular-nums text-brand-700">{numbered[1]}.</span>
          <span>{inline(numbered[2], key)}</span>
        </div>,
      )
      return
    }

    paragraph.push(line.trim())
  })

  flushParagraph('l-end-p')
  flushFormula('l-end-f')

  return <div className="space-y-2.5">{blocks}</div>
}

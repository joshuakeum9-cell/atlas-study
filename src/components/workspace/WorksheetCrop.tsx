import { worksheet } from '@/data/worksheet'
import type { Box } from '@/types'
import { cn } from '@/lib/cn'

/**
 * Renders just the cropped part of the worksheet that the student selected.
 * In a real product this would be an image crop; here it re-renders the same
 * SVG with a tighter viewBox, which keeps the two views pixel-identical.
 */
export function WorksheetCrop({ box, className }: { box: Box; className?: string }) {
  const pad = 10
  const vb = `${box.x - pad} ${box.y - pad} ${box.w + pad * 2} ${box.h + pad * 2}`

  return (
    <svg
      viewBox={vb}
      className={cn('w-full rounded-lg bg-white ring-1 ring-navy-200', className)}
      style={{ aspectRatio: `${box.w + pad * 2} / ${box.h + pad * 2}` }}
      role="img"
      aria-label="The part of the page you selected"
    >
      <rect x={box.x - pad} y={box.y - pad} width={box.w + pad * 2} height={box.h + pad * 2} fill="#fdfcf9" />
      {/* Ruled lines, clipped by the viewBox. */}
      {Array.from({ length: 34 }, (_, i) => (
        <line
          key={i}
          x1="64"
          x2="744"
          y1={168 + i * 30}
          y2={168 + i * 30}
          stroke="#dfe6f0"
          strokeWidth="1"
          opacity="0.5"
        />
      ))}
      {worksheet.handwriting.map((line, i) => (
        <text
          key={i}
          x={line.x}
          y={line.y}
          fontSize={line.size ?? 24}
          fill={line.tone === 'pencil' ? '#6b7280' : '#233f86'}
          fontFamily="var(--font-hand)"
          transform={line.rotate ? `rotate(${line.rotate} ${line.x} ${line.y})` : undefined}
        >
          {line.text}
        </text>
      ))}
      <rect
        x={box.x}
        y={box.y}
        width={box.w}
        height={box.h}
        rx="7"
        fill="none"
        stroke="#2563eb"
        strokeWidth="2"
        strokeDasharray="6 4"
      />
    </svg>
  )
}

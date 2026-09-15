import { useCallback, useRef, useState } from 'react'
import { Check, Hand, Minus, Plus, ScanLine } from 'lucide-react'
import { worksheet } from '@/data/worksheet'
import { isMeaningfulSelection, normaliseSelection } from '@/services/ocr'
import type { Box, WorksheetRegion } from '@/types'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'

const VIEW_W = 800
const VIEW_H = 1040

const INK = '#233f86'
const PENCIL = '#6b7280'

interface WorksheetViewerProps {
  /** regionId -> confirmed transcript. */
  confirmed: Record<string, string>
  /** Fired when the user finishes a drag, or activates a region by keyboard. */
  onSelect: (box: Box, viaKeyboard?: boolean) => void
  /** True while recognition is running. */
  recognising: boolean
  /** The region currently being recognised, for the scanning overlay. */
  activeRegionId?: string | null
}

export function WorksheetViewer({
  confirmed,
  onSelect,
  recognising,
  activeRegionId,
}: WorksheetViewerProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [drag, setDrag] = useState<{ start: { x: number; y: number }; current: { x: number; y: number } } | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)

  /** Converts a pointer event to worksheet coordinates. */
  const toLocal = useCallback((e: { clientX: number; clientY: number }) => {
    const rect = svgRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    return {
      x: ((e.clientX - rect.left) / rect.width) * VIEW_W,
      y: ((e.clientY - rect.top) / rect.height) * VIEW_H,
    }
  }, [])

  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (recognising || e.button !== 0) return
    const point = toLocal(e)
    e.currentTarget.setPointerCapture(e.pointerId)
    setDrag({ start: point, current: point })
  }

  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag) return
    setDrag({ ...drag, current: toLocal(e) })
  }

  const onPointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!drag) return
    const box = normaliseSelection(drag.start, toLocal(e))
    setDrag(null)
    if (isMeaningfulSelection(box)) onSelect(box)
  }

  const selectionBox: Box | null = drag ? normaliseSelection(drag.start, drag.current) : null

  const selectRegion = (region: WorksheetRegion) => onSelect(region.box, true)

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-navy-100 bg-white px-3 py-2">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-brand-50 px-2 py-1 text-[12px] font-medium text-brand-800 ring-1 ring-inset ring-brand-200">
          <Hand className="h-3.5 w-3.5" aria-hidden="true" />
          Drag a box around any handwritten answer
        </span>
        <span className="hidden text-[12px] text-navy-500 sm:inline">
          or use the buttons below the page
        </span>

        <div className="ml-auto flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            iconOnly
            aria-label="Zoom out"
            disabled={zoom <= 0.75}
            onClick={() => setZoom((z) => Math.max(0.75, +(z - 0.25).toFixed(2)))}
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <span className="w-11 text-center text-[12px] tabular-nums text-navy-600">
            {Math.round(zoom * 100)}%
          </span>
          <Button
            size="sm"
            variant="ghost"
            iconOnly
            aria-label="Zoom in"
            disabled={zoom >= 1.75}
            onClick={() => setZoom((z) => Math.min(1.75, +(z + 0.25).toFixed(2)))}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* The page */}
      <div className="scrollbar-slim flex-1 overflow-auto bg-navy-100/60 p-4 sm:p-6">
        <div className="mx-auto" style={{ width: `${Math.min(100, 100 * zoom)}%`, maxWidth: 820 * zoom }}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className={cn(
              'w-full rounded-lg bg-white shadow-lift ring-1 ring-navy-900/10',
              recognising ? 'cursor-progress' : 'cursor-crosshair',
            )}
            style={{ touchAction: 'none' }}
            role="img"
            aria-label="Photographed worksheet: Algebra I Worksheet 5, question 3, with handwritten working for parts a, b and c."
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={() => setDrag(null)}
          >
            <defs>
              {/* Uneven lighting, so it reads as a photo of paper rather than a PDF. */}
              <linearGradient id="paperLight" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="55%" stopColor="#fdfcf9" />
                <stop offset="100%" stopColor="#f4f1ea" />
              </linearGradient>
              <radialGradient id="vignette" cx="50%" cy="42%" r="78%">
                <stop offset="60%" stopColor="#000000" stopOpacity="0" />
                <stop offset="100%" stopColor="#0b2545" stopOpacity="0.07" />
              </radialGradient>
              <linearGradient id="scanBeam" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0" />
                <stop offset="50%" stopColor="#2563eb" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
              </linearGradient>
            </defs>

            <rect width={VIEW_W} height={VIEW_H} fill="url(#paperLight)" />

            {/* Faint ruled lines */}
            <g opacity="0.5">
              {Array.from({ length: 30 }, (_, i) => (
                <line
                  key={i}
                  x1="64"
                  x2={VIEW_W - 56}
                  y1={168 + i * 30}
                  y2={168 + i * 30}
                  stroke="#dfe6f0"
                  strokeWidth="1"
                />
              ))}
              <line x1="92" x2="92" y1="56" y2={VIEW_H - 48} stroke="#f0d5d8" strokeWidth="1.5" />
            </g>

            {/* Printed content */}
            <text x="64" y="76" fontSize="25" fontWeight="600" fill="#152a4e" fontFamily="Georgia, serif">
              {worksheet.printed.heading}
            </text>
            <text x="64" y="104" fontSize="14.5" fill="#5b6b86" fontFamily="Georgia, serif">
              {worksheet.printed.sub}
            </text>
            <text x="64" y="142" fontSize="14.5" fill="#33405a" fontFamily="Georgia, serif">
              {worksheet.printed.intro}
            </text>

            {/* The question itself, set large. */}
            {worksheet.printed.equation ? (
              <text
                x="118"
                y="212"
                fontSize="30"
                fill="#152a4e"
                fontFamily="Georgia, serif"
                letterSpacing="0.5"
              >
                {worksheet.printed.equation}
              </text>
            ) : null}

            {/* Table of supplied figures, only for questions that have one. */}
            {worksheet.printed.givens.length ? (
              <g>
                <rect x="64" y="162" width="440" height="192" fill="#f7f8fb" stroke="#dde4ee" />
                {worksheet.printed.givens.map(([label, value], i) => (
                  <g key={label}>
                    <text x="78" y={190 + i * 30} fontSize="13.5" fill="#33405a" fontFamily="Georgia, serif">
                      {label}
                    </text>
                    <text
                      x="488"
                      y={190 + i * 30}
                      fontSize="13.5"
                      fill="#152a4e"
                      textAnchor="end"
                      fontFamily="Georgia, serif"
                    >
                      {value}
                    </text>
                  </g>
                ))}
              </g>
            ) : null}

            {/* Part prompts */}
            {worksheet.printed.parts.map((part) => (
              <g key={part.label}>
                <text x="64" y={part.y} fontSize="14.5" fontWeight="600" fill="#152a4e" fontFamily="Georgia, serif">
                  {part.label}
                </text>
                <text x="96" y={part.y} fontSize="14.5" fill="#33405a" fontFamily="Georgia, serif">
                  {part.text}
                </text>
              </g>
            ))}

            {/* The student's handwriting */}
            {worksheet.handwriting.map((line, i) => (
              <text
                key={i}
                x={line.x}
                y={line.y}
                fontSize={line.size ?? 24}
                fill={line.tone === 'pencil' ? PENCIL : INK}
                fontFamily="var(--font-hand)"
                transform={line.rotate ? `rotate(${line.rotate} ${line.x} ${line.y})` : undefined}
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {line.text}
              </text>
            ))}

            {/* Region affordances */}
            {worksheet.regions.map((region) => {
              const isConfirmed = Boolean(confirmed[region.id])
              const isActive = activeRegionId === region.id
              const isHovered = hovered === region.id
              const { x, y, w, h } = region.box
              return (
                <g key={region.id}>
                  <rect
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    rx="8"
                    fill={isHovered && !recognising ? 'rgba(37,99,235,0.07)' : 'transparent'}
                    stroke={
                      isActive
                        ? '#2563eb'
                        : isConfirmed
                          ? '#059669'
                          : isHovered
                            ? 'rgba(37,99,235,0.45)'
                            : 'transparent'
                    }
                    strokeWidth={isActive ? 3 : 2}
                    strokeDasharray={isActive ? '7 5' : undefined}
                    onPointerEnter={() => setHovered(region.id)}
                    onPointerLeave={() => setHovered((cur) => (cur === region.id ? null : cur))}
                    style={{ transition: 'fill 150ms ease, stroke 150ms ease' }}
                  />
                  {/* Hand-drawn circle once the student has confirmed this part */}
                  {isConfirmed ? (
                    <>
                      <ellipse
                        cx={x + w / 2}
                        cy={y + h / 2}
                        rx={w / 2 + 6}
                        ry={h / 2 + 4}
                        fill="none"
                        stroke="#059669"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeDasharray="1000"
                        opacity="0.55"
                        transform={`rotate(-1.5 ${x + w / 2} ${y + h / 2})`}
                      />
                      <g transform={`translate(${x + w + 12}, ${y + h / 2 - 11})`}>
                        <rect width="22" height="22" rx="11" fill="#059669" />
                        <path
                          d="M6 11.5l3.4 3.4L16 8.3"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    </>
                  ) : null}

                  {/* Scanning beam while recognition runs */}
                  {isActive && recognising ? (
                    <g>
                      <rect x={x} y={y} width={w} height={h} rx="8" fill="rgba(37,99,235,0.08)" />
                      <rect x={x} y={y} width={w} height="14" fill="url(#scanBeam)">
                        <animate
                          attributeName="y"
                          values={`${y};${y + h - 14};${y}`}
                          dur="1.1s"
                          repeatCount="indefinite"
                        />
                      </rect>
                    </g>
                  ) : null}
                </g>
              )
            })}

            {/* Live drag rectangle */}
            {selectionBox ? (
              <rect
                x={selectionBox.x}
                y={selectionBox.y}
                width={selectionBox.w}
                height={selectionBox.h}
                rx="6"
                fill="rgba(37,99,235,0.10)"
                stroke="#1d4ed8"
                strokeWidth="2"
                strokeDasharray="6 4"
                style={{ pointerEvents: 'none' }}
              />
            ) : null}

            <rect width={VIEW_W} height={VIEW_H} fill="url(#vignette)" style={{ pointerEvents: 'none' }} />
          </svg>
        </div>

        {/* Keyboard-accessible equivalent of dragging. */}
        <div className="mx-auto mt-4 max-w-3xl rounded-xl bg-white p-3 shadow-panel ring-1 ring-navy-100">
          <p className="text-[12px] font-medium text-navy-600">
            Prefer the keyboard? Select a region directly:
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {worksheet.regions.map((region) => {
              const isConfirmed = Boolean(confirmed[region.id])
              return (
                <button
                  key={region.id}
                  type="button"
                  // `aria-disabled` rather than `disabled`: disabling a button that
                  // currently has focus makes the browser blur it to <body>, so a
                  // keyboard user loses their place and the dialog has nothing to
                  // restore focus to when it closes. The click guard below does the
                  // work that `disabled` would have done.
                  aria-disabled={recognising || undefined}
                  onClick={() => {
                    if (recognising) return
                    selectRegion(region)
                  }}
                  onFocus={() => setHovered(region.id)}
                  onBlur={() => setHovered((cur) => (cur === region.id ? null : cur))}
                  onMouseEnter={() => setHovered(region.id)}
                  onMouseLeave={() => setHovered((cur) => (cur === region.id ? null : cur))}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium transition-colors',
                    'ring-1 ring-inset',
                    recognising && 'cursor-not-allowed opacity-60',
                    isConfirmed
                      ? 'bg-emerald-50 text-emerald-800 ring-emerald-200 hover:bg-emerald-100'
                      : 'bg-white text-navy-700 ring-navy-200 hover:bg-navy-50',
                  )}
                >
                  {recognising && activeRegionId === region.id ? (
                    <Spinner className="h-3 w-3" />
                  ) : isConfirmed ? (
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <ScanLine className="h-3.5 w-3.5 text-navy-400" aria-hidden="true" />
                  )}
                  {region.partLabel}
                  <span className="hidden font-normal text-navy-500 sm:inline">- {region.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

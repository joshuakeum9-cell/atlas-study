import { worksheet } from '@/data/worksheet'
import type { Box, WorksheetRegion } from '@/types'
import { delay } from './util'

/**
 * MOCK HANDWRITING RECOGNITION
 * ============================
 * Simulated. The "recognition" is a lookup: the selection the user drags is
 * matched against pre-authored regions of the sample worksheet, and the region
 * carries the transcript that a real recogniser would have produced.
 *
 * REAL IMPLEMENTATION would crop the selection out of the page image and post
 * it to a handwriting OCR endpoint:
 *
 *   const crop = await cropToBlob(pageImage, selection)
 *   const res = await fetch(`${import.meta.env.VITE_OCR_API_BASE}/recognise`, {
 *     method: 'POST', body: crop,
 *   })
 *   const { text, confidence, tokens } = await res.json()
 *
 * The response shape below deliberately mirrors what such a service returns,
 * including per-token confidence, because the confirmation step in the UI is
 * built on it. Recognition on messy handwriting is never certain, so the
 * product asks the student to confirm before the tutor reasons about it.
 */

export interface OcrResult {
  regionId: string
  partLabel: string
  label: string
  transcript: string
  /** Substrings the recogniser is unsure about, highlighted in the dialog. */
  uncertainTokens: string[]
  /** Offered as a one-click fix when the recogniser has a second guess. */
  likelyCorrection?: string
  confidence: number
  analysisKey: string
  box: Box
}

/** Area of the intersection of two boxes. */
export function intersectionArea(a: Box, b: Box): number {
  const x = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x))
  const y = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y))
  return x * y
}

/**
 * Finds which region the user meant.
 *
 * A student circling an answer will not draw a tidy box around exactly the
 * right pixels, so the match is generous: the winning region is the one with
 * the largest overlap, provided the selection covers a reasonable share of it
 * OR the region covers a reasonable share of the selection. That second clause
 * matters for someone who drags a big loose circle around the whole answer.
 */
export function findRegion(selection: Box, regions: WorksheetRegion[] = worksheet.regions): WorksheetRegion | null {
  const selArea = Math.max(1, selection.w * selection.h)
  let best: WorksheetRegion | null = null
  let bestOverlap = 0

  for (const region of regions) {
    const overlap = intersectionArea(selection, region.box)
    if (overlap <= 0) continue
    const regionArea = Math.max(1, region.box.w * region.box.h)
    const coverageOfRegion = overlap / regionArea
    const coverageOfSelection = overlap / selArea
    if (coverageOfRegion < 0.22 && coverageOfSelection < 0.35) continue
    if (overlap > bestOverlap) {
      bestOverlap = overlap
      best = region
    }
  }
  return best
}

export function normaliseSelection(a: { x: number; y: number }, b: { x: number; y: number }): Box {
  return {
    x: Math.min(a.x, b.x),
    y: Math.min(a.y, b.y),
    w: Math.abs(a.x - b.x),
    h: Math.abs(a.y - b.y),
  }
}

/** True when the drag is big enough to be a deliberate selection. */
export function isMeaningfulSelection(box: Box): boolean {
  return box.w > 24 && box.h > 14
}

export async function recogniseRegion(regionId: string): Promise<OcrResult | null> {
  // Recognition is the slowest step in the real flow, so it is the slowest here.
  await delay(900, 1500)
  const region = worksheet.regions.find((r) => r.id === regionId)
  if (!region) return null
  return {
    regionId: region.id,
    partLabel: region.partLabel,
    label: region.label,
    transcript: region.transcript,
    uncertainTokens: region.uncertainTokens,
    likelyCorrection: region.likelyCorrection,
    confidence: region.confidence,
    analysisKey: region.analysisKey,
    box: region.box,
  }
}

/** Recognise whatever the user dragged over, if anything. */
export async function recogniseSelection(selection: Box): Promise<OcrResult | null> {
  const region = findRegion(selection)
  if (!region) {
    await delay(500, 800)
    return null
  }
  return recogniseRegion(region.id)
}

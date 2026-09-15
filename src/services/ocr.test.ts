import { describe, expect, it } from 'vitest'
import { worksheet } from '@/data/worksheet'
import { findRegion, intersectionArea, isMeaningfulSelection, normaliseSelection } from './ocr'

const partA = worksheet.regions.find((r) => r.id === 'r-a')!
const partB = worksheet.regions.find((r) => r.id === 'r-b')!

describe('normaliseSelection', () => {
  it('handles a drag in any direction', () => {
    const downRight = normaliseSelection({ x: 10, y: 10 }, { x: 60, y: 40 })
    const upLeft = normaliseSelection({ x: 60, y: 40 }, { x: 10, y: 10 })
    expect(downRight).toEqual({ x: 10, y: 10, w: 50, h: 30 })
    expect(upLeft).toEqual(downRight)
  })
})

describe('isMeaningfulSelection', () => {
  it('rejects a click or a tiny twitch', () => {
    expect(isMeaningfulSelection({ x: 0, y: 0, w: 0, h: 0 })).toBe(false)
    expect(isMeaningfulSelection({ x: 0, y: 0, w: 10, h: 6 })).toBe(false)
  })

  it('accepts a deliberate drag', () => {
    expect(isMeaningfulSelection({ x: 0, y: 0, w: 120, h: 40 })).toBe(true)
  })
})

describe('intersectionArea', () => {
  it('is zero for boxes that do not touch', () => {
    expect(intersectionArea({ x: 0, y: 0, w: 10, h: 10 }, { x: 50, y: 50, w: 10, h: 10 })).toBe(0)
  })

  it('measures the overlap', () => {
    expect(intersectionArea({ x: 0, y: 0, w: 10, h: 10 }, { x: 5, y: 5, w: 10, h: 10 })).toBe(25)
  })
})

describe('findRegion', () => {
  it('matches an exact box', () => {
    expect(findRegion(partA.box)?.id).toBe('r-a')
  })

  it('matches a loose circle drawn around the answer', () => {
    const loose = {
      x: partA.box.x - 30,
      y: partA.box.y - 20,
      w: partA.box.w + 60,
      h: partA.box.h + 40,
    }
    expect(findRegion(loose)?.id).toBe('r-a')
  })

  it('matches a small selection inside the answer', () => {
    const inside = { x: partA.box.x + 20, y: partA.box.y + 20, w: 60, h: 30 }
    expect(findRegion(inside)?.id).toBe('r-a')
  })

  it('returns null for empty space on the page', () => {
    expect(findRegion({ x: 560, y: 880, w: 120, h: 60 })).toBeNull()
  })

  it('picks the region with the greater overlap when a drag spans two', () => {
    // A tall drag covering all of part (b) and only the last sliver of part (a).
    const spanning = {
      x: partA.box.x,
      y: partA.box.y + partA.box.h - 8,
      w: partB.box.w,
      h: partB.box.y + partB.box.h - partA.box.y - partA.box.h + 8,
    }
    expect(findRegion(spanning)?.id).toBe('r-b')
  })
})

describe('worksheet data', () => {
  it('gives every region a scripted analysis to route to', () => {
    for (const region of worksheet.regions) {
      expect(region.analysisKey).toBeTruthy()
      expect(region.transcript.length).toBeGreaterThan(0)
      expect(region.confidence).toBeGreaterThan(0)
      expect(region.confidence).toBeLessThanOrEqual(1)
    }
  })

  it('keeps every uncertain token present in its transcript', () => {
    for (const region of worksheet.regions) {
      for (const token of region.uncertainTokens) {
        expect(region.transcript).toContain(token)
      }
    }
  })

  it('keeps region boxes inside the page', () => {
    for (const { box } of worksheet.regions) {
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.y).toBeGreaterThanOrEqual(0)
      expect(box.x + box.w).toBeLessThanOrEqual(800)
      expect(box.y + box.h).toBeLessThanOrEqual(1040)
    }
  })
})

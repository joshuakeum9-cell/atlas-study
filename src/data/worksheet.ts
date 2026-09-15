import type { Worksheet } from '@/types'

/**
 * The sample "photographed worksheet".
 *
 * The page is drawn as an SVG on a 800 x 1040 canvas so that region boxes,
 * pointer selections and the highlight overlay all share one coordinate space.
 * In a real product this would be a camera image plus bounding boxes returned
 * by a handwriting recognition service; the shape of the data is the same.
 *
 * The student's work contains one deliberate, very common mistake: the increase
 * in accounts payable is ADDED to the change in net working capital instead of
 * subtracted. The error then carries through parts (b) and (c), which is what
 * makes the tutor's explanation worth reading.
 */
export const worksheet: Worksheet = {
  id: 'ws-ps4',
  docId: 'doc-ps4-photo',
  title: 'Problem Set 4 - my handwritten work',
  courseLabel: 'FIN 301 - Corporate Finance',
  printed: {
    heading: 'FIN 301 — Problem Set 4',
    sub: 'Harbor Logistics Inc.  ·  all figures in $000',
    intro: 'Using the figures below, compute parts (a) to (c). Show your working.',
    givens: [
      ['Net income', '240'],
      ['Depreciation & amortisation', '85'],
      ['Increase in accounts receivable', '60'],
      ['Increase in inventory', '45'],
      ['Increase in accounts payable', '30'],
      ['Capital expenditures', '120'],
    ],
    parts: [
      { label: '(a)', text: 'Compute the change in net working capital.', y: 404 },
      { label: '(b)', text: 'Compute cash flow from operations.', y: 548 },
      { label: '(c)', text: 'Compute free cash flow.', y: 692 },
    ],
  },
  handwriting: [
    { x: 118, y: 452, text: 'ΔNWC = ΔAR + ΔInv + ΔAP', rotate: -0.6 },
    { x: 130, y: 492, text: '= 60 + 45 + 30  =  135', rotate: -0.3 },
    { x: 118, y: 596, text: 'CFO = NI + Dep − ΔNWC', rotate: -0.4 },
    { x: 130, y: 636, text: '= 240 + 85 − 135  =  190', rotate: 0.4 },
    { x: 118, y: 740, text: 'FCF = 190 − 120  =  70', rotate: -0.5 },
    { x: 486, y: 470, text: 'check sign on A/P ??', rotate: -7, size: 21, tone: 'pencil' },
  ],
  regions: [
    {
      id: 'r-a',
      partLabel: 'Part (a)',
      label: 'Change in net working capital',
      box: { x: 100, y: 424, w: 372, h: 88 },
      transcript: 'ΔNWC = ΔAR + ΔInv + ΔAP = 60 + 45 + 30 = 155',
      uncertainTokens: ['155'],
      likelyCorrection: 'ΔNWC = ΔAR + ΔInv + ΔAP = 60 + 45 + 30 = 135',
      confidence: 0.86,
      analysisKey: 'part-a',
    },
    {
      id: 'r-b',
      partLabel: 'Part (b)',
      label: 'Cash flow from operations',
      box: { x: 100, y: 568, w: 392, h: 88 },
      transcript: 'CFO = NI + Dep − ΔNWC = 240 + 85 − 135 = 190',
      uncertainTokens: [],
      confidence: 0.94,
      analysisKey: 'part-b',
    },
    {
      id: 'r-c',
      partLabel: 'Part (c)',
      label: 'Free cash flow',
      box: { x: 100, y: 714, w: 320, h: 48 },
      transcript: 'FCF = 190 − 120 = 70',
      uncertainTokens: [],
      confidence: 0.97,
      analysisKey: 'part-c',
    },
    {
      id: 'r-note',
      partLabel: 'Margin note',
      label: 'Note written beside part (a)',
      box: { x: 462, y: 440, w: 232, h: 48 },
      transcript: 'check sign on A/P ??',
      uncertainTokens: ['A/P'],
      confidence: 0.71,
      analysisKey: 'margin-note',
    },
  ],
}

export const regionById = (id: string) => worksheet.regions.find((r) => r.id === id)

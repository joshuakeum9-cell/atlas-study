import type { Worksheet } from '@/types'

/**
 * The sample "photographed worksheet".
 *
 * The page is drawn as an SVG on a 800 x 1040 canvas so that region boxes,
 * pointer selections and the highlight overlay all share one coordinate space.
 * In a real product this would be a camera image plus bounding boxes returned
 * by a handwriting recognition service; the shape of the data is the same.
 *
 * One problem, three steps, one mistake. The student expands -3(x + 1) as
 * -3x + 3, applying the minus to the first term only. It is the most common
 * error in the whole topic, and it carries through the next two lines, which is
 * what makes the tutor's explanation worth reading.
 *
 *   Their answer:  x = 10        Correct:  x = 16
 */
export const worksheet: Worksheet = {
  id: 'ws-5',
  docId: 'doc-ws5-photo',
  title: 'Worksheet 5 - my working',
  courseLabel: 'Algebra I',
  printed: {
    heading: 'Algebra I — Worksheet 5',
    sub: 'Solving equations with brackets  ·  show every step',
    intro: 'Question 3.   Solve for x:',
    equation: '4(x − 2) − 3(x + 1) = 5',
    // No table of givens for this one - the equation below is the whole setup.
    givens: [],
    parts: [
      { label: '(a)', text: 'Expand the brackets.', y: 288 },
      { label: '(b)', text: 'Collect like terms.', y: 438 },
      { label: '(c)', text: 'Solve for x.', y: 588 },
    ],
  },
  handwriting: [
    { x: 116, y: 338, text: '4x − 8 − 3x + 3 = 5', rotate: -0.5 },
    { x: 116, y: 488, text: 'x − 5 = 5', rotate: -0.3 },
    { x: 116, y: 638, text: 'x = 10', rotate: -0.6 },
    { x: 470, y: 322, text: 'minus on both ?', rotate: -7, size: 21, tone: 'pencil' },
  ],
  regions: [
    {
      id: 'r-a',
      partLabel: 'Part (a)',
      label: 'Expanding the brackets',
      box: { x: 98, y: 306, w: 330, h: 48 },
      // The recogniser misreads the final 5 as a 6, so confirming is a real step.
      transcript: '4x − 8 − 3x + 3 = 6',
      uncertainTokens: ['6'],
      likelyCorrection: '4x − 8 − 3x + 3 = 5',
      confidence: 0.87,
      analysisKey: 'part-a',
    },
    {
      id: 'r-b',
      partLabel: 'Part (b)',
      label: 'Collecting like terms',
      box: { x: 98, y: 456, w: 210, h: 48 },
      transcript: 'x − 5 = 5',
      uncertainTokens: [],
      confidence: 0.95,
      analysisKey: 'part-b',
    },
    {
      id: 'r-c',
      partLabel: 'Part (c)',
      label: 'The final answer',
      box: { x: 98, y: 606, w: 170, h: 48 },
      transcript: 'x = 10',
      uncertainTokens: [],
      confidence: 0.97,
      analysisKey: 'part-c',
    },
    {
      id: 'r-note',
      partLabel: 'Margin note',
      label: 'Note written beside part (a)',
      box: { x: 448, y: 294, w: 236, h: 46 },
      transcript: 'minus on both ?',
      uncertainTokens: ['both'],
      confidence: 0.73,
      analysisKey: 'margin-note',
    },
  ],
}

export const regionById = (id: string) => worksheet.regions.find((r) => r.id === id)

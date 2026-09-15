import type { StudyDoc } from '@/types'

/**
 * The document library - four documents, not forty.
 *
 * `summary`, `tags` and `struggleTopics` are what a real document-understanding
 * pass would produce; here they are hand written so the mock search and
 * insights engines have something honest to work from.
 */
export const documents: StudyDoc[] = [
  {
    id: 'doc-ws5-photo',
    courseId: 'algebra1',
    assignmentId: 'ws5',
    title: 'Worksheet 5 - my working',
    kind: 'worksheet-photo',
    pages: 1,
    updated: 'Edited 20 minutes ago',
    sizeLabel: 'Photo - 1.8 MB',
    tags: ['expanding brackets', 'negative sign', 'handwritten', 'solving equations'],
    summary:
      'Photo of my Worksheet 5 page, question 3. Parts (a) to (c) are worked in pen. When expanding -3(x + 1) the minus is applied to the first term only, giving -3x + 3 instead of -3x - 3, and that error carries through to the final answer.',
    chapterIds: ['ch2', 'ch3'],
    struggleTopics: ['distributing a negative', 'expanding brackets'],
    worksheetId: 'ws-5',
  },
  {
    id: 'doc-ch2-notes',
    courseId: 'algebra1',
    assignmentId: 'ws5',
    title: 'Chapter 2 notes - expanding brackets',
    kind: 'note',
    pages: 2,
    updated: 'Edited 3 days ago',
    sizeLabel: 'Note - 2 pages',
    tags: ['expanding brackets', 'distributing', 'negative sign', 'class notes'],
    summary:
      'Class notes on expanding brackets. Covers the distributive rule and what happens when the number in front is negative. Contains a spot I flagged myself where I wrote the rule down wrong and corrected it later.',
    chapterIds: ['ch2'],
    struggleTopics: ['distributing a negative'],
    body: [
      { type: 'heading', text: 'Expanding a bracket' },
      {
        type: 'paragraph',
        text: 'The number outside multiplies every single term inside. Not just the first one. Every one.',
      },
      { type: 'formula', text: 'a(b + c) = ab + ac' },
      { type: 'heading', text: 'When the number outside is negative' },
      {
        type: 'paragraph',
        text: 'The minus sign belongs to the number, and it travels with it to every term inside the bracket.',
      },
      {
        type: 'formula',
        text: '−3(x + 1) = −3x − 3',
        caption: 'Not −3x + 3. The minus hits the 1 as well.',
      },
      {
        type: 'bullets',
        items: [
          '−2(x + 5) = −2x − 10',
          '−2(x − 5) = −2x + 10  (minus times minus is plus)',
          '−(x + 4) = −x − 4  (an invisible 1 in front)',
        ],
      },
      {
        type: 'callout',
        tone: 'struggle',
        text: 'Flagged in class: I wrote "-3(x + 1) = -3x + 3" here, which is wrong. The minus applies to both terms. Corrected after Ms. Dagnall went through it.',
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'Quick check: put a number in. If x = 2, then -3(2 + 1) = -9. And -3x - 3 = -6 - 3 = -9. It matches, so the expansion is right.',
      },
    ],
  },
  {
    id: 'doc-quiz2',
    courseId: 'algebra1',
    assignmentId: 'quiz2',
    title: 'Quiz 2 - marked copy.pdf',
    kind: 'pdf',
    pages: 2,
    updated: 'Added last week',
    sizeLabel: 'PDF - 240 KB',
    tags: ['quiz', 'marked', 'expanding brackets', 'negative sign'],
    summary:
      'Marked Quiz 2. Three marks lost on question 4, where the minus in front of a bracket was applied to the first term only. Everything else was correct.',
    chapterIds: ['ch2'],
    struggleTopics: ['distributing a negative'],
    body: [
      { type: 'heading', text: 'Quiz 2 - marked, 17 / 20' },
      {
        type: 'callout',
        tone: 'struggle',
        text: 'Q4 (-3): expanded 5 - 2(x + 3) as 5 - 2x + 6. The minus goes with the 2, so it is 5 - 2x - 6. Teacher comment: "The minus belongs to the 2. It multiplies everything in the bracket."',
      },
      {
        type: 'paragraph',
        text: 'Every other question was right, including all three of the solving-for-x questions once the brackets were gone.',
      },
    ],
  },
  {
    id: 'doc-ws4',
    courseId: 'algebra1',
    assignmentId: 'ws4',
    title: 'Worksheet 4 - graded.pdf',
    kind: 'pdf',
    pages: 1,
    updated: 'Added 2 weeks ago',
    sizeLabel: 'PDF - 180 KB',
    tags: ['order of operations', 'graded', 'worksheet'],
    summary:
      'Graded Worksheet 4 on order of operations. 95%. One arithmetic slip near the end; the method was right the whole way through.',
    chapterIds: ['ch1'],
    struggleTopics: [],
    body: [
      { type: 'heading', text: 'Worksheet 4 - 95%' },
      {
        type: 'paragraph',
        text: 'Teacher comment: "Really clear working, easy to follow every line. Just double-check your arithmetic at the end."',
      },
    ],
  },
]

export const docById = (id: string) => documents.find((d) => d.id === id)
export const docsForCourse = (courseId: string) => documents.filter((d) => d.courseId === courseId)

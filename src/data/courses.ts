import type { Assignment, Course } from '@/types'

/**
 * Sample courses. Corporate Finance is the fully-built demo course; the others
 * exist so course switching feels real.
 */
export const courses: Course[] = [
  {
    id: 'fin301',
    code: 'FIN 301',
    title: 'Corporate Finance',
    term: 'Fall term',
    instructor: 'Prof. M. Ayalew',
    color: 'navy',
    chapters: [
      { id: 'ch1', number: 1, title: 'Time Value of Money', mastery: 88 },
      { id: 'ch2', number: 2, title: 'Financial Statements & Ratios', mastery: 74 },
      { id: 'ch3', number: 3, title: 'The Statement of Cash Flows', mastery: 61 },
      { id: 'ch4', number: 4, title: 'Working Capital Management', mastery: 38 },
      { id: 'ch5', number: 5, title: 'Capital Budgeting & NPV', mastery: 69 },
      { id: 'ch6', number: 6, title: 'Cost of Capital (WACC)', mastery: 52 },
    ],
  },
  {
    id: 'acc210',
    code: 'ACC 210',
    title: 'Financial Accounting',
    term: 'Fall term',
    instructor: 'Prof. R. Okonjo',
    color: 'teal',
    chapters: [
      { id: 'a-ch1', number: 1, title: 'The Accounting Equation', mastery: 91 },
      { id: 'a-ch2', number: 2, title: 'Accruals & Deferrals', mastery: 64 },
      { id: 'a-ch3', number: 3, title: 'Inventory Methods', mastery: 57 },
    ],
  },
  {
    id: 'sta220',
    code: 'STA 220',
    title: 'Statistics for Business',
    term: 'Fall term',
    instructor: 'Prof. L. Hartmann',
    color: 'violet',
    chapters: [
      { id: 's-ch1', number: 1, title: 'Sampling Distributions', mastery: 72 },
      { id: 's-ch2', number: 2, title: 'Hypothesis Testing', mastery: 45 },
      { id: 's-ch3', number: 3, title: 'Linear Regression', mastery: 60 },
    ],
  },
  {
    id: 'eco201',
    code: 'ECO 201',
    title: 'Intermediate Microeconomics',
    term: 'Fall term',
    instructor: 'Prof. D. Castellanos',
    color: 'amber',
    chapters: [
      { id: 'e-ch1', number: 1, title: 'Consumer Choice', mastery: 80 },
      { id: 'e-ch2', number: 2, title: 'Production & Costs', mastery: 66 },
    ],
  },
]

export const assignments: Assignment[] = [
  {
    id: 'ps4',
    courseId: 'fin301',
    chapterId: 'ch4',
    title: 'Problem Set 4 - Free Cash Flow',
    due: 'Due Friday',
    status: 'in-progress',
    docIds: ['doc-ps4-photo', 'doc-ps4-brief', 'doc-ch4-notes'],
    blurb: 'Harbor Logistics - working capital & FCF',
  },
  {
    id: 'memo2',
    courseId: 'fin301',
    chapterId: 'ch3',
    title: 'Case Memo: Statement of Cash Flows',
    due: 'Due next Wednesday',
    status: 'not-started',
    docIds: ['doc-memo-brief', 'doc-ch3-notes'],
    blurb: 'Two pages on Harbor Logistics cash quality',
  },
  {
    id: 'quiz2fix',
    courseId: 'fin301',
    chapterId: 'ch2',
    title: 'Quiz 2 Corrections - Ratios',
    due: 'Submitted Monday',
    status: 'submitted',
    docIds: ['doc-quiz2', 'doc-ch2-notes'],
    blurb: 'Rework of the three questions I lost marks on',
  },
  {
    id: 'ps3',
    courseId: 'fin301',
    chapterId: 'ch1',
    title: 'Problem Set 3 - Time Value of Money',
    due: 'Graded - 92%',
    status: 'graded',
    docIds: ['doc-ps3'],
    blurb: 'Annuities, perpetuities, effective rates',
  },
  {
    id: 'acc-ps2',
    courseId: 'acc210',
    chapterId: 'a-ch2',
    title: 'Problem Set 2 - Accruals',
    due: 'Due Thursday',
    status: 'in-progress',
    docIds: ['doc-acc-ps2'],
    blurb: 'Prepaid expense and unearned revenue entries',
  },
  {
    id: 'acc-lab',
    courseId: 'acc210',
    chapterId: 'a-ch3',
    title: 'Inventory Lab - FIFO vs. weighted average',
    due: 'Due in 10 days',
    status: 'not-started',
    docIds: ['doc-acc-lab'],
    blurb: 'Spreadsheet plus a short write-up',
  },
  {
    id: 'sta-ps5',
    courseId: 'sta220',
    chapterId: 's-ch2',
    title: 'Problem Set 5 - Hypothesis Tests',
    due: 'Due Friday',
    status: 'in-progress',
    docIds: ['doc-sta-ps5'],
    blurb: 'One-sample and two-sample means',
  },
  {
    id: 'eco-pset',
    courseId: 'eco201',
    chapterId: 'e-ch2',
    title: 'Problem Set 4 - Cost Curves',
    due: 'Due Monday',
    status: 'not-started',
    docIds: ['doc-eco-ps4'],
    blurb: 'Short-run vs. long-run average cost',
  },
]

export const courseById = (id: string) => courses.find((c) => c.id === id)
export const assignmentById = (id: string) => assignments.find((a) => a.id === id)
export const assignmentsForCourse = (courseId: string) =>
  assignments.filter((a) => a.courseId === courseId)
export const chapterById = (courseId: string, chapterId: string) =>
  courseById(courseId)?.chapters.find((ch) => ch.id === chapterId)

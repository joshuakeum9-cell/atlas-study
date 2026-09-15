import type { Assignment, Course } from '@/types'

/**
 * One sample course, kept deliberately small.
 *
 * The demo makes its point with a single worked example rather than a large
 * fake library: a student who keeps dropping the sign when they expand a
 * bracket. Everything else in the workspace exists to support that one thread.
 */
export const courses: Course[] = [
  {
    id: 'algebra1',
    code: 'Algebra I',
    title: 'Expressions and equations',
    term: 'Fall term',
    instructor: 'Ms. Dagnall',
    color: 'navy',
    chapters: [
      { id: 'ch1', number: 1, title: 'Order of operations', mastery: 88 },
      { id: 'ch2', number: 2, title: 'Expanding brackets', mastery: 42 },
      { id: 'ch3', number: 3, title: 'Solving linear equations', mastery: 71 },
      { id: 'ch4', number: 4, title: 'Inequalities', mastery: 64 },
    ],
  },
]

export const assignments: Assignment[] = [
  {
    id: 'ws5',
    courseId: 'algebra1',
    chapterId: 'ch2',
    title: 'Worksheet 5 - Solving equations',
    due: 'Due Friday',
    status: 'in-progress',
    docIds: ['doc-ws5-photo', 'doc-ch2-notes'],
    blurb: 'Brackets on both sides',
  },
  {
    id: 'quiz2',
    courseId: 'algebra1',
    chapterId: 'ch2',
    title: 'Quiz 2 - marked',
    due: 'Returned last week',
    status: 'graded',
    docIds: ['doc-quiz2'],
    blurb: 'Lost 3 marks on question 4',
  },
  {
    id: 'ws4',
    courseId: 'algebra1',
    chapterId: 'ch1',
    title: 'Worksheet 4 - Order of operations',
    due: 'Graded - 95%',
    status: 'graded',
    docIds: ['doc-ws4'],
    blurb: 'One arithmetic slip, method fine',
  },
]

export const courseById = (id: string) => courses.find((c) => c.id === id)
export const assignmentById = (id: string) => assignments.find((a) => a.id === id)
export const assignmentsForCourse = (courseId: string) =>
  assignments.filter((a) => a.courseId === courseId)
export const chapterById = (courseId: string, chapterId: string) =>
  courseById(courseId)?.chapters.find((ch) => ch.id === chapterId)

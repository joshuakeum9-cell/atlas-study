import type {
  PracticeQuestion,
  ReviewRecommendation,
  SharedWorkspace,
  StrengthInsight,
  StruggleInsight,
} from '@/types'

/**
 * The "academic memory" layer, kept small.
 *
 * In a real product these would be derived by analysing a term of a student's
 * work. Here they are authored so the demo tells one coherent story: a single
 * sign slip that keeps resurfacing, and a clear way to close it.
 */
export const struggles: StruggleInsight[] = [
  {
    id: 'st-minus-bracket',
    topic: 'The minus in front of a bracket',
    chapterId: 'ch2',
    occurrences: 3,
    severity: 88,
    lastSeen: 'Today, Worksheet 5',
    pattern:
      'Only when the number outside the bracket is negative, and only mid-question. Asked the rule directly, you get it right every time. It slips when you are working quickly.',
    fix: 'Five minutes of expanding brackets with a negative out front, twice this week. Then redo Quiz 2 question 4 without the marked copy in front of you.',
    evidenceDocIds: ['doc-ws5-photo', 'doc-quiz2', 'doc-ch2-notes'],
  },
  {
    id: 'st-checking',
    topic: 'Not checking the answer',
    chapterId: 'ch3',
    occurrences: 2,
    severity: 44,
    lastSeen: 'Today, Worksheet 5',
    pattern:
      'You almost never substitute your answer back into the original equation. Both of the questions you have lost marks on this term would have been caught by a fifteen-second check.',
    fix: 'Make it a habit: every time you get a value for x, put it back in and see if both sides match.',
    evidenceDocIds: ['doc-ws5-photo', 'doc-quiz2'],
  },
]

export const strengths: StrengthInsight[] = [
  {
    id: 'sg-positive-brackets',
    topic: 'Expanding positive brackets',
    chapterId: 'ch2',
    accuracy: 96,
    note: 'Right in every piece of work on record. 4(x − 2) has never given you trouble.',
  },
  {
    id: 'sg-isolating',
    topic: 'Getting x on its own',
    chapterId: 'ch3',
    accuracy: 92,
    note: 'Your method here has been correct every single time, including on questions marked wrong where only the input was off.',
  },
  {
    id: 'sg-working',
    topic: 'Showing your steps',
    chapterId: 'ch1',
    accuracy: 95,
    note: 'Two teachers have now commented on how clear your working is. That is why a slip costs you one mark instead of the whole question.',
  },
]

export const recommendations: ReviewRecommendation[] = [
  {
    id: 'rec-1',
    title: 'Five minutes on negative brackets',
    reason: 'Three appearances and 3 marks lost. This is the highest-value few minutes available to you.',
    minutes: 5,
    chapterId: 'ch2',
    kind: 'practice',
  },
  {
    id: 'rec-2',
    title: 'Redo Quiz 2 question 4',
    reason: 'Same slip as today. Do it closed-book before you look at the marked copy again.',
    minutes: 10,
    chapterId: 'ch2',
    kind: 'redo',
  },
  {
    id: 'rec-3',
    title: 'Practise checking by substitution',
    reason: 'A fifteen-second habit that would have caught both of the mistakes you have made this term.',
    minutes: 10,
    chapterId: 'ch3',
    kind: 'practice',
  },
]

/** Weekly practice minutes, used by the small activity chart. */
export const activityWeeks = [
  { label: 'Wk 1', minutes: 40, errors: 3 },
  { label: 'Wk 2', minutes: 65, errors: 4 },
  { label: 'Wk 3', minutes: 55, errors: 3 },
  { label: 'Wk 4', minutes: 90, errors: 2 },
  { label: 'Wk 5', minutes: 75, errors: 2 },
  { label: 'Wk 6', minutes: 105, errors: 1 },
]

export const practiceQuestions: PracticeQuestion[] = [
  {
    id: 'pq-1',
    chapterId: 'ch2',
    topic: 'The minus in front of a bracket',
    prompt: 'Expand:   −3(x + 1)',
    options: [
      {
        id: 'a',
        text: '−3x − 3',
        correct: true,
        feedback:
          'Correct. The minus belongs to the 3, and the 3 multiplies both terms inside. Negative three times x is −3x, negative three times +1 is −3.',
      },
      {
        id: 'b',
        text: '−3x + 3',
        correct: false,
        feedback:
          'This is the exact slip from Worksheet 5 part (a) and Quiz 2 question 4. The minus reached the x but not the 1. It goes to both.',
      },
      {
        id: 'c',
        text: '3x + 3',
        correct: false,
        feedback: 'The minus has disappeared entirely here. It multiplies both terms, so both should end up negative.',
      },
      {
        id: 'd',
        text: '−3x + 1',
        correct: false,
        feedback: 'The 1 has been left alone. Everything inside the bracket gets multiplied, not just the x.',
      },
    ],
    explanation:
      'Read −3(x + 1) as "negative three times everything in the bracket". Check it with a number: if x = 2, the original is −3(3) = −9, and −3(2) − 3 = −9. They match.',
  },
  {
    id: 'pq-2',
    chapterId: 'ch2',
    topic: 'The minus in front of a bracket',
    prompt: 'Expand and simplify:   5 − 2(x + 4)',
    options: [
      {
        id: 'a',
        text: '−2x − 3',
        correct: true,
        feedback:
          'Correct. 5 − 2x − 8, and 5 − 8 is −3. The minus went to both the x and the 4, and the 5 just came along for the ride.',
      },
      {
        id: 'b',
        text: '−2x + 13',
        correct: false,
        feedback: 'This gives the 4 a plus: 5 − 2x + 8. Negative two times +4 is −8, not +8.',
      },
      {
        id: 'c',
        text: '3x + 12',
        correct: false,
        feedback: 'The 5 has been combined with the 2, which cannot happen while the bracket is still there. Expand first, then collect.',
      },
      {
        id: 'd',
        text: '2x − 3',
        correct: false,
        feedback: 'Close on the numbers, but the x term should be negative. There is a minus in front of the 2.',
      },
    ],
    explanation:
      'Expand first: 5 − 2(x + 4) = 5 − 2x − 8. Then collect the plain numbers: 5 − 8 = −3, giving −2x − 3. This is the same question you lost 3 marks on in Quiz 2.',
  },
  {
    id: 'pq-3',
    chapterId: 'ch2',
    topic: 'The minus in front of a bracket',
    prompt: 'Expand:   −4(x − 2)',
    options: [
      {
        id: 'a',
        text: '−4x + 8',
        correct: true,
        feedback:
          'Correct, and this is the one that catches people going the other way. Negative four times negative two is positive eight.',
      },
      {
        id: 'b',
        text: '−4x − 8',
        correct: false,
        feedback:
          'Careful — there are two minuses meeting here. Negative four times negative two gives a positive. This one flips the other way.',
      },
      {
        id: 'c',
        text: '4x − 8',
        correct: false,
        feedback: 'The minus on the 4 has been dropped. It multiplies both terms inside.',
      },
      {
        id: 'd',
        text: '−4x − 2',
        correct: false,
        feedback: 'The 2 was not multiplied. Everything inside the bracket gets multiplied by what is outside.',
      },
    ],
    explanation:
      'Negative times positive is negative, so −4 × x = −4x. Negative times negative is positive, so −4 × −2 = +8. Check with x = 1: the original is −4(−1) = 4, and −4(1) + 8 = 4.',
  },
]

export const sharedWorkspaces: SharedWorkspace[] = [
  {
    id: 'sw-1',
    name: 'Algebra study group',
    courseCode: 'Algebra I',
    owner: 'Priya N.',
    members: [
      { name: 'Priya Nair', initials: 'PN', role: 'Owner' },
      { name: 'You', initials: 'JK', role: 'Can edit' },
      { name: 'Marcus Lee', initials: 'ML', role: 'Can edit' },
    ],
    updated: 'Marcus added notes 2 hours ago',
    itemCount: 8,
  },
  {
    id: 'sw-2',
    name: 'Quiz 3 revision',
    courseCode: 'Algebra I',
    owner: 'You',
    members: [
      { name: 'You', initials: 'JK', role: 'Owner' },
      { name: 'Priya Nair', initials: 'PN', role: 'Can edit' },
    ],
    updated: 'You added a file yesterday',
    itemCount: 4,
  },
]

/** Sample utterances the simulated microphone "hears". */
export const voiceSamples = [
  'Why does the minus go to both terms?',
  'Where else have I made this mistake?',
  'Show me the whole thing done right',
  'How do I check my answer?',
  'Give me one to practise',
]

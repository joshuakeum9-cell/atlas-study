import type {
  PracticeQuestion,
  ReviewRecommendation,
  SharedWorkspace,
  StrengthInsight,
  StruggleInsight,
} from '@/types'

/**
 * The "academic memory" layer. In a real product these would be derived by
 * analysing a term of a student's work; here they are authored so the demo
 * tells one coherent story - a single sign convention that keeps resurfacing.
 */
export const struggles: StruggleInsight[] = [
  {
    id: 'st-wc-sign',
    topic: 'Working capital sign convention',
    chapterId: 'ch4',
    occurrences: 4,
    severity: 86,
    lastSeen: 'Today, Problem Set 4',
    pattern:
      'Only on the payables line, and only mid-calculation. When asked the definition directly you state it correctly. It goes wrong when you are working at speed.',
    fix: 'Two ten-minute drill sessions rather than a re-read. Then rework Quiz 2 questions 3 and 5 without the marked copy in front of you.',
    evidenceDocIds: ['doc-ps4-photo', 'doc-quiz2', 'doc-ch4-notes'],
  },
  {
    id: 'st-wacc-weights',
    topic: 'Market-value weights in WACC',
    chapterId: 'ch6',
    occurrences: 2,
    severity: 58,
    lastSeen: '4 days ago, Lecture 6 notes',
    pattern:
      'You default to book values when the question does not spell it out. Not yet a habit - it has only come up twice - but Chapter 6 is heavily weighted on the midterm.',
    fix: 'Read slides 4 to 12 of Lecture 6, then work one question where book and market weights are both given so the gap is visible.',
    evidenceDocIds: ['doc-ch6-slides'],
  },
  {
    id: 'st-pvalue',
    topic: 'P-value interpretation',
    chapterId: 's-ch2',
    occurrences: 2,
    severity: 47,
    lastSeen: '2 days ago, STA 220 Problem Set 5',
    pattern:
      'The conditional gets inverted - written as the probability the null is true rather than the probability of the data given the null.',
    fix: 'Write the correct sentence out once, in your own words, and keep it at the top of the chapter.',
    evidenceDocIds: ['doc-sta-ps5'],
  },
  {
    id: 'st-unearned',
    topic: 'Direction of unearned revenue',
    chapterId: 'a-ch2',
    occurrences: 1,
    severity: 31,
    lastSeen: 'Yesterday, ACC 210 Problem Set 2',
    pattern:
      'The word "revenue" pulls you toward the income statement. It is a liability until the service is delivered.',
    fix: 'One worked entry from cash receipt through to recognition will probably settle it.',
    evidenceDocIds: ['doc-acc-ps2'],
  },
]

export const strengths: StrengthInsight[] = [
  {
    id: 'sg-tvm',
    topic: 'Discounting and time value',
    chapterId: 'ch1',
    accuracy: 94,
    note: 'Correct in every piece of work on record. The one lost mark was a compounding-period slip, not a method error.',
  },
  {
    id: 'sg-indirect-order',
    topic: 'Indirect method ordering',
    chapterId: 'ch3',
    accuracy: 88,
    note: 'You used to put capex inside operating activities. That stopped three weeks ago and has not come back.',
  },
  {
    id: 'sg-ratio-calc',
    topic: 'Ratio computation',
    chapterId: 'ch2',
    accuracy: 91,
    note: 'The arithmetic is reliable. It is the interpretation step that still wobbles, not the calculation.',
  },
  {
    id: 'sg-layout',
    topic: 'Showing your working',
    chapterId: 'ch1',
    accuracy: 96,
    note: 'Markers have twice commented on how legible your working is. That is why a sign error costs you one mark rather than the question.',
  },
]

export const recommendations: ReviewRecommendation[] = [
  {
    id: 'rec-1',
    title: 'Drill the working capital sign convention',
    reason: 'Four appearances in three weeks and eight marks lost on Quiz 2. This is the highest-value 20 minutes available to you.',
    minutes: 20,
    chapterId: 'ch4',
    kind: 'practice',
  },
  {
    id: 'rec-2',
    title: 'Rework Quiz 2 questions 3 and 5',
    reason: 'Same root cause as Problem Set 4. Redo them closed-book before you look at the marked copy again.',
    minutes: 25,
    chapterId: 'ch2',
    kind: 'redo',
  },
  {
    id: 'rec-3',
    title: 'Lecture 6 slides 4 to 12 - market-value weights',
    reason: 'Chapter 6 is at 52% mastery and carries the most weight on the midterm.',
    minutes: 15,
    chapterId: 'ch6',
    kind: 'reread',
  },
  {
    id: 'rec-4',
    title: 'One clean run at the full cash flow build',
    reason: 'Your method is right end to end. A single correct run with no sign errors will lock it in before the memo is due.',
    minutes: 30,
    chapterId: 'ch3',
    kind: 'practice',
  },
]

/** Weekly study minutes, used by the small activity chart. */
export const activityWeeks = [
  { label: 'Wk 1', minutes: 120, errors: 3 },
  { label: 'Wk 2', minutes: 185, errors: 5 },
  { label: 'Wk 3', minutes: 150, errors: 4 },
  { label: 'Wk 4', minutes: 240, errors: 2 },
  { label: 'Wk 5', minutes: 205, errors: 2 },
  { label: 'Wk 6', minutes: 275, errors: 1 },
]

export const practiceQuestions: PracticeQuestion[] = [
  {
    id: 'pq-1',
    chapterId: 'ch4',
    topic: 'Working capital sign convention',
    prompt: 'Over the year, accounts payable increased by 30. What is the effect on cash flow from operations?',
    options: [
      {
        id: 'a',
        text: 'Cash flow from operations increases by 30',
        correct: true,
        feedback:
          'Correct. You received goods or services and have not paid for them yet, so the cash stayed with you. A rise in a current liability is a source of cash.',
      },
      {
        id: 'b',
        text: 'Cash flow from operations decreases by 30',
        correct: false,
        feedback:
          'This is the same slip as Problem Set 4 part (a) and Quiz 2 question 3. Payables rising means you have not paid yet, so cash stayed in your account. It is a source, not a use.',
      },
      {
        id: 'c',
        text: 'No effect - payables are not an operating account',
        correct: false,
        feedback:
          'Payables are very much an operating account. They arise directly from trading with suppliers, which is why they sit inside the working capital adjustment.',
      },
      {
        id: 'd',
        text: 'It depends on whether the payables are overdue',
        correct: false,
        feedback:
          'Ageing matters for credit analysis, but not for the mechanics of the cash flow statement. The change in the balance is what moves cash.',
      },
    ],
    explanation:
      'Net working capital is operating current assets minus operating current liabilities. A rise in payables lowers net working capital, and because the change is subtracted in the cash flow build, cash flow from operations rises.',
  },
  {
    id: 'pq-2',
    chapterId: 'ch4',
    topic: 'Working capital sign convention',
    prompt:
      'A firm reports net income of 400 and depreciation of 60. Receivables fell by 25, inventory rose by 40 and accounts payable rose by 15. What is cash flow from operations?',
    given: ['Net income 400', 'Depreciation 60', 'Receivables −25', 'Inventory +40', 'Accounts payable +15'],
    options: [
      {
        id: 'a',
        text: '460',
        correct: true,
        feedback:
          'Correct. ΔNWC = (−25) + 40 − 15 = 0, so CFO = 400 + 60 − 0 = 460. All three signs handled right, including the receivables decrease.',
      },
      {
        id: 'b',
        text: '430',
        correct: false,
        feedback:
          'This adds the payables increase instead of subtracting it: (−25) + 40 + 15 = 30, giving 460 − 30 = 430. Payables rising is a source of cash.',
      },
      {
        id: 'c',
        text: '410',
        correct: false,
        feedback:
          'This treats the receivables fall as a use of cash. When receivables drop, customers have paid you - the cash came in, so it reduces the change in net working capital.',
      },
      {
        id: 'd',
        text: '500',
        correct: false,
        feedback:
          'This looks like the working capital adjustment was skipped or reversed entirely. Start by computing ΔNWC on its own, then subtract it.',
      },
    ],
    explanation:
      'ΔNWC = Δreceivables + Δinventory − Δpayables = (−25) + 40 − 15 = 0. With no net working capital movement, CFO = 400 + 60 = 460. The trap is that one asset decreased, which flips its sign again.',
  },
  {
    id: 'pq-3',
    chapterId: 'ch4',
    topic: 'Working capital sign convention',
    prompt: 'A company reports a change in net working capital of −40 for the year. What does this tell you?',
    options: [
      {
        id: 'a',
        text: 'The business released 40 of cash from working capital',
        correct: true,
        feedback:
          'Correct. A negative change means working capital shrank - faster collection, less inventory, or longer payment terms. In the cash flow build you subtract the change, and subtracting −40 adds 40.',
      },
      {
        id: 'b',
        text: 'The business consumed 40 of cash',
        correct: false,
        feedback:
          'This is Quiz 2 question 5 again. A negative change releases cash. A positive change is the one that consumes it.',
      },
      {
        id: 'c',
        text: 'The company is running out of cash',
        correct: false,
        feedback:
          'Nothing here says that. A falling working capital balance is usually a cash inflow. Whether it is good news depends on why, which is a separate question.',
      },
      {
        id: 'd',
        text: 'Net income must have fallen by 40',
        correct: false,
        feedback:
          'Working capital and net income are independent here. The working capital adjustment is exactly the bridge between reported profit and cash.',
      },
    ],
    explanation:
      'Positive ΔNWC is a use of cash, negative ΔNWC is a source. The follow-up question a marker wants is why it fell: faster collection is healthy, while running inventory down to nothing is a warning.',
  },
]

export const sharedWorkspaces: SharedWorkspace[] = [
  {
    id: 'sw-1',
    name: 'FIN 301 study group',
    courseCode: 'FIN 301',
    owner: 'Priya N.',
    members: [
      { name: 'Priya Nair', initials: 'PN', role: 'Owner' },
      { name: 'You', initials: 'JK', role: 'Can edit' },
      { name: 'Marcus Lee', initials: 'ML', role: 'Can edit' },
      { name: 'Tomas Oyelaran', initials: 'TO', role: 'Can view' },
    ],
    updated: 'Marcus added notes 2 hours ago',
    itemCount: 14,
  },
  {
    id: 'sw-2',
    name: 'Midterm cram - cash flows',
    courseCode: 'FIN 301',
    owner: 'You',
    members: [
      { name: 'You', initials: 'JK', role: 'Owner' },
      { name: 'Priya Nair', initials: 'PN', role: 'Can edit' },
    ],
    updated: 'You added 3 files yesterday',
    itemCount: 7,
  },
  {
    id: 'sw-3',
    name: 'ACC 210 problem sets',
    courseCode: 'ACC 210',
    owner: 'Dana R.',
    members: [
      { name: 'Dana Rios', initials: 'DR', role: 'Owner' },
      { name: 'You', initials: 'JK', role: 'Can view' },
      { name: 'Sam Achebe', initials: 'SA', role: 'Can edit' },
    ],
    updated: 'Dana shared Problem Set 2 last week',
    itemCount: 9,
  },
]

/** Sample utterances the simulated microphone "hears". */
export const voiceSamples = [
  'Why is an increase in accounts payable a source of cash?',
  'Where else have I made this mistake?',
  'Can you show me the corrected working from the top?',
  'Explain free cash flow like I have not seen it before',
  'Help me write part d on earnings quality',
  'Drill me on the sign convention',
]

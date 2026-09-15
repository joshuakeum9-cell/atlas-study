import type { StudyDoc } from '@/types'

/**
 * The document library. `summary`, `tags` and `struggleTopics` are what a real
 * document-understanding pass would produce; here they are hand written so the
 * mock search and insights engines have something honest to work from.
 */
export const documents: StudyDoc[] = [
  {
    id: 'doc-ps4-photo',
    courseId: 'fin301',
    assignmentId: 'ps4',
    title: 'Problem Set 4 - my handwritten work',
    kind: 'worksheet-photo',
    pages: 1,
    updated: 'Edited 20 minutes ago',
    sizeLabel: 'Photo - 2.4 MB',
    tags: ['working capital', 'free cash flow', 'handwritten', 'harbor logistics'],
    summary:
      'Photo of the Problem Set 4 page. Parts (a) to (c) are worked in pen. The change in net working capital in part (a) adds the increase in accounts payable instead of subtracting it, and that error carries through parts (b) and (c).',
    chapterIds: ['ch4', 'ch3'],
    struggleTopics: ['working capital sign convention', 'free cash flow'],
    worksheetId: 'ws-ps4',
  },
  {
    id: 'doc-ps4-brief',
    courseId: 'fin301',
    assignmentId: 'ps4',
    title: 'Problem Set 4 - assignment brief.pdf',
    kind: 'pdf',
    pages: 2,
    updated: 'Added 6 days ago',
    sizeLabel: 'PDF - 180 KB',
    tags: ['free cash flow', 'working capital', 'problem set', 'harbor logistics'],
    summary:
      'The handout for Problem Set 4. Sets up Harbor Logistics and asks for change in net working capital, cash flow from operations and free cash flow, then a short comment on cash quality.',
    chapterIds: ['ch4'],
    struggleTopics: [],
    body: [
      { type: 'heading', text: 'FIN 301 - Problem Set 4' },
      {
        type: 'paragraph',
        text: 'Harbor Logistics is a regional freight company. Using the figures below, work through parts (a) to (d). Show every step; unsupported answers receive no credit.',
      },
      {
        type: 'table',
        head: ['Line item', 'This year ($000)'],
        rows: [
          ['Net income', '240'],
          ['Depreciation & amortisation', '85'],
          ['Increase in accounts receivable', '60'],
          ['Increase in inventory', '45'],
          ['Increase in accounts payable', '30'],
          ['Capital expenditures', '120'],
        ],
      },
      {
        type: 'bullets',
        items: [
          '(a) Compute the change in net working capital for the year.',
          '(b) Compute cash flow from operations.',
          '(c) Compute free cash flow.',
          '(d) In two sentences, comment on the quality of the earnings.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'Reminder from lecture: an increase in a current liability is a source of cash, not a use of cash.',
      },
    ],
  },
  {
    id: 'doc-ch4-notes',
    courseId: 'fin301',
    assignmentId: 'ps4',
    title: 'Chapter 4 notes - working capital',
    kind: 'note',
    pages: 3,
    updated: 'Edited 2 days ago',
    sizeLabel: 'Note - 3 pages',
    tags: ['working capital', 'cash conversion cycle', 'lecture notes', 'sign convention'],
    summary:
      'Lecture notes on working capital management. Covers the cash conversion cycle and the sign convention for changes in current assets and current liabilities. Contains a flagged spot where the sign convention was written down the wrong way round and corrected later.',
    chapterIds: ['ch4'],
    struggleTopics: ['working capital sign convention', 'cash conversion cycle'],
    body: [
      { type: 'heading', text: 'Working capital - what actually moves cash' },
      {
        type: 'paragraph',
        text: 'Net working capital is current assets minus current liabilities. For cash flow we never care about the level, only the change over the period, and only for the operating accounts (receivables, inventory, payables, accruals). Cash and short-term debt are excluded.',
      },
      {
        type: 'formula',
        text: 'ΔNWC = Δ(operating current assets) − Δ(operating current liabilities)',
      },
      {
        type: 'bullets',
        items: [
          'Receivables up = you sold it but have not been paid = cash goes DOWN.',
          'Inventory up = you bought stock that is sitting in a warehouse = cash goes DOWN.',
          'Payables up = the supplier is financing you = cash goes UP.',
          'A positive change in NWC is a USE of cash, so it is subtracted in the cash flow build.',
        ],
      },
      {
        type: 'callout',
        tone: 'struggle',
        text: 'Flagged in class: I wrote "payables up = use of cash" here and it is wrong. Payables rising is a source of cash. Corrected after the tutorial.',
      },
      { type: 'heading', text: 'Cash conversion cycle' },
      {
        type: 'formula',
        text: 'CCC = DSO + DIO − DPO',
        caption: 'Days to turn a dollar of inventory back into a dollar of cash.',
      },
      {
        type: 'paragraph',
        text: 'Stretching payables shortens the cycle, which is why the sign on payables matters twice: once in the cash flow build and once in the cycle.',
      },
    ],
  },
  {
    id: 'doc-ch3-notes',
    courseId: 'fin301',
    assignmentId: 'memo2',
    title: 'Chapter 3 notes - statement of cash flows',
    kind: 'note',
    pages: 4,
    updated: 'Edited 5 days ago',
    sizeLabel: 'Note - 4 pages',
    tags: ['cash flow statement', 'indirect method', 'lecture notes', 'operating activities'],
    summary:
      'Notes on building a statement of cash flows with the indirect method: start from net income, add back non-cash charges, adjust for working capital, then split investing and financing.',
    chapterIds: ['ch3'],
    struggleTopics: ['indirect method adjustments'],
    body: [
      { type: 'heading', text: 'Indirect method, in order' },
      {
        type: 'bullets',
        items: [
          'Start: net income.',
          'Add back non-cash charges: depreciation, amortisation, impairments, stock compensation.',
          'Subtract gains on asset sales, add back losses - they belong in investing.',
          'Adjust for the change in operating working capital.',
          'Result: cash flow from operations.',
        ],
      },
      { type: 'formula', text: 'CFO = NI + non-cash charges − ΔNWC' },
      {
        type: 'callout',
        tone: 'struggle',
        text: 'I keep losing marks by putting the capex line inside operations. Capex is investing. Free cash flow is where the two meet.',
      },
      { type: 'formula', text: 'FCF = CFO − capital expenditures' },
    ],
  },
  {
    id: 'doc-memo-brief',
    courseId: 'fin301',
    assignmentId: 'memo2',
    title: 'Case memo brief - Harbor Logistics.pdf',
    kind: 'pdf',
    pages: 3,
    updated: 'Added 3 days ago',
    sizeLabel: 'PDF - 420 KB',
    tags: ['case memo', 'cash flow statement', 'earnings quality', 'harbor logistics'],
    summary:
      'Brief for the two-page case memo. Asks whether Harbor Logistics earnings are backed by cash, using the statement of cash flows and the working capital trend over three years.',
    chapterIds: ['ch3', 'ch4'],
    struggleTopics: [],
    body: [
      { type: 'heading', text: 'Case memo - is the profit real?' },
      {
        type: 'paragraph',
        text: 'Harbor Logistics has reported rising net income for three straight years while cash flow from operations has been flat. Write two pages for the credit committee on whether the earnings are supported by cash.',
      },
      {
        type: 'bullets',
        items: [
          'Rebuild the statement of cash flows for the three years shown in Exhibit 1.',
          'Decompose the gap between net income and cash flow from operations.',
          'State a view. A memo without a recommendation is not a memo.',
        ],
      },
    ],
  },
  {
    id: 'doc-quiz2',
    courseId: 'fin301',
    assignmentId: 'quiz2fix',
    title: 'Quiz 2 - marked copy.pdf',
    kind: 'pdf',
    pages: 2,
    updated: 'Added 9 days ago',
    sizeLabel: 'PDF - 310 KB',
    tags: ['quiz', 'ratios', 'current ratio', 'marked'],
    summary:
      'Marked Quiz 2. Marks lost on question 3 (current ratio after a payables increase) and question 5 (interpreting a negative change in working capital). Both errors trace back to the same sign convention.',
    chapterIds: ['ch2', 'ch4'],
    struggleTopics: ['working capital sign convention', 'ratio interpretation'],
    body: [
      { type: 'heading', text: 'Quiz 2 - marked, 17 / 25' },
      {
        type: 'callout',
        tone: 'struggle',
        text: 'Q3 (-4): treated the rise in accounts payable as reducing cash. Marker comment: payables are a source, check your signs.',
      },
      {
        type: 'callout',
        tone: 'struggle',
        text: 'Q5 (-4): read a negative change in net working capital as bad news. A negative change releases cash.',
      },
      {
        type: 'paragraph',
        text: 'Everything else was clean, including both time value questions and the ratio computations themselves.',
      },
    ],
  },
  {
    id: 'doc-ps3',
    courseId: 'fin301',
    assignmentId: 'ps3',
    title: 'Problem Set 3 - graded.pdf',
    kind: 'pdf',
    pages: 3,
    updated: 'Added 2 weeks ago',
    sizeLabel: 'PDF - 290 KB',
    tags: ['time value of money', 'annuities', 'graded', 'problem set'],
    summary:
      'Graded Problem Set 3 on time value of money. 92%. One small arithmetic slip on the effective annual rate; the method was right throughout.',
    chapterIds: ['ch1'],
    struggleTopics: [],
    body: [
      { type: 'heading', text: 'Problem Set 3 - 92%' },
      {
        type: 'paragraph',
        text: 'Marker comment: clear, well laid out, discounting handled correctly throughout. Watch the compounding periods when converting a nominal rate.',
      },
    ],
  },
  {
    id: 'doc-ch6-slides',
    courseId: 'fin301',
    title: 'Lecture 6 slides - WACC.pdf',
    kind: 'slides',
    pages: 24,
    updated: 'Added 4 days ago',
    sizeLabel: 'PDF - 1.1 MB',
    tags: ['wacc', 'cost of capital', 'slides', 'capital structure'],
    summary:
      'Lecture 6 slides on the weighted average cost of capital: cost of equity via CAPM, after-tax cost of debt, market-value weights, and when WACC is the wrong discount rate.',
    chapterIds: ['ch6'],
    struggleTopics: ['market-value weights'],
    body: [
      { type: 'heading', text: 'Lecture 6 - cost of capital' },
      { type: 'formula', text: 'WACC = (E/V) × Re + (D/V) × Rd × (1 − t)' },
      {
        type: 'bullets',
        items: [
          'Weights are market values, never book values.',
          'Cost of equity from CAPM: risk-free rate + beta times the equity risk premium.',
          'The tax shield lives on the debt side only.',
          'Use a project-specific rate when the project risk differs from the firm.',
        ],
      },
    ],
  },
  {
    id: 'doc-ch2-notes',
    courseId: 'fin301',
    assignmentId: 'quiz2fix',
    title: 'Chapter 2 notes - ratio analysis',
    kind: 'note',
    pages: 2,
    updated: 'Edited 8 days ago',
    sizeLabel: 'Note - 2 pages',
    tags: ['ratios', 'liquidity', 'leverage', 'lecture notes'],
    summary:
      'Ratio families and what each one is actually asking: liquidity, leverage, efficiency, profitability. Includes the current ratio worked example that went wrong on the quiz.',
    chapterIds: ['ch2'],
    struggleTopics: ['ratio interpretation'],
    body: [
      { type: 'heading', text: 'Four families of ratio' },
      {
        type: 'bullets',
        items: [
          'Liquidity - can it pay this year bills? Current, quick.',
          'Leverage - how much of it is borrowed? Debt to equity, interest cover.',
          'Efficiency - how hard do the assets work? Asset turnover, DSO, DIO.',
          'Profitability - what is left at the end? Margins, return on equity, return on invested capital.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        text: 'A ratio on its own says nothing. Compare it to last year, to a peer, or to a covenant.',
      },
    ],
  },
  {
    id: 'doc-acc-ps2',
    courseId: 'acc210',
    assignmentId: 'acc-ps2',
    title: 'ACC 210 Problem Set 2.pdf',
    kind: 'pdf',
    pages: 2,
    updated: 'Added yesterday',
    sizeLabel: 'PDF - 240 KB',
    tags: ['accruals', 'deferrals', 'journal entries'],
    summary:
      'Adjusting entries for prepaid expenses, unearned revenue, accrued wages and accrued interest at period end.',
    chapterIds: ['a-ch2'],
    struggleTopics: ['unearned revenue direction'],
    body: [
      { type: 'heading', text: 'ACC 210 - Problem Set 2' },
      {
        type: 'paragraph',
        text: 'Prepare the adjusting entries at 31 December for each of the eight situations described. State the account, the direction and the amount.',
      },
      {
        type: 'callout',
        tone: 'struggle',
        text: 'Unearned revenue still catches me: cash arrives first, so it starts life as a liability and only becomes revenue as the service is delivered.',
      },
    ],
  },
  {
    id: 'doc-acc-lab',
    courseId: 'acc210',
    assignmentId: 'acc-lab',
    title: 'Inventory lab worksheet',
    kind: 'pdf',
    pages: 1,
    updated: 'Added 3 days ago',
    sizeLabel: 'Spreadsheet - 62 KB',
    tags: ['inventory', 'fifo', 'weighted average'],
    summary: 'Blank workbook for the FIFO versus weighted average cost comparison.',
    chapterIds: ['a-ch3'],
    struggleTopics: [],
  },
  {
    id: 'doc-sta-ps5',
    courseId: 'sta220',
    assignmentId: 'sta-ps5',
    title: 'STA 220 Problem Set 5.pdf',
    kind: 'pdf',
    pages: 3,
    updated: 'Added 2 days ago',
    sizeLabel: 'PDF - 350 KB',
    tags: ['hypothesis testing', 'p-value', 'two sample'],
    summary:
      'One-sample and two-sample tests of means, with a question on interpreting a p-value that has caught me out twice.',
    chapterIds: ['s-ch2'],
    struggleTopics: ['p-value interpretation'],
    body: [
      { type: 'heading', text: 'STA 220 - Problem Set 5' },
      {
        type: 'paragraph',
        text: 'Questions 1 to 4 are one-sample tests of a mean. Questions 5 and 6 compare two independent samples. Question 7 asks you to state, in words, what the p-value does and does not tell you.',
      },
      {
        type: 'callout',
        tone: 'struggle',
        text: 'Written down twice now and still wrong twice: the p-value is not the probability that the null hypothesis is true.',
      },
    ],
  },
  {
    id: 'doc-eco-ps4',
    courseId: 'eco201',
    assignmentId: 'eco-pset',
    title: 'ECO 201 Problem Set 4.pdf',
    kind: 'pdf',
    pages: 2,
    updated: 'Added 4 days ago',
    sizeLabel: 'PDF - 210 KB',
    tags: ['cost curves', 'marginal cost', 'returns to scale'],
    summary: 'Short-run and long-run cost curves, plus a returns-to-scale identification question.',
    chapterIds: ['e-ch2'],
    struggleTopics: [],
    body: [
      { type: 'heading', text: 'ECO 201 - Problem Set 4' },
      {
        type: 'paragraph',
        text: 'Derive the short-run average and marginal cost curves for the production function given, then show where the long-run envelope sits relative to them.',
      },
    ],
  },
]

export const docById = (id: string) => documents.find((d) => d.id === id)
export const docsForCourse = (courseId: string) => documents.filter((d) => d.courseId === courseId)

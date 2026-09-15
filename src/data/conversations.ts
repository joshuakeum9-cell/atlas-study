import type { Conversation } from '@/types'

/**
 * Saved tutor conversations, stored against the assignment they belong to.
 * This is the "every assignment keeps its own chats" part of the concept: the
 * workspace is the unit of memory, not the chat window.
 */
export const seedConversations: Conversation[] = [
  {
    id: 'conv-ps4-1',
    assignmentId: 'ps4',
    title: 'Setting up the cash flow build',
    when: 'Yesterday, 9:14 PM',
    messages: [
      {
        id: 'm1',
        role: 'student',
        at: '2026-09-13T21:14:00.000Z',
        text: 'I have the Harbor Logistics numbers but I do not know which order to do this in. Do I start from revenue or net income?',
      },
      {
        id: 'm2',
        role: 'tutor',
        at: '2026-09-13T21:14:20.000Z',
        text: `Net income. The brief gives you net income directly, which is the signal that it wants the indirect method.

The direct method starts from cash collected from customers and cash paid to suppliers, and you have not been given either. The indirect method starts from the bottom of the income statement and unwinds the accounting back to cash:

  net income -> add non-cash charges -> adjust working capital -> cash flow from operations

Your Chapter 3 notes have this in order already. Work down that list and do not jump ahead to capex - that belongs in part (c).`,
        citations: [{ label: 'Chapter 3 notes', detail: 'Indirect method, in order', docId: 'doc-ch3-notes' }],
      },
      {
        id: 'm3',
        role: 'student',
        at: '2026-09-13T21:19:00.000Z',
        text: 'Ok that helps. So depreciation gets added back because it is not cash?',
      },
      {
        id: 'm4',
        role: 'tutor',
        at: '2026-09-13T21:19:15.000Z',
        text: `Exactly right. The cash left when the asset was bought - that sits in investing as capex. Depreciation just spreads that one payment across the asset's useful life so the income statement is not distorted by a lumpy purchase.

Since it reduced net income without moving cash this year, you add it back to get from profit to cash.`,
        suggestions: ['What about working capital?', 'Is capex in operations?'],
      },
    ],
  },
  {
    id: 'conv-ps4-2',
    assignmentId: 'ps4',
    title: 'Which accounts go into working capital',
    when: 'Yesterday, 9:41 PM',
    messages: [
      {
        id: 'm1',
        role: 'student',
        at: '2026-09-13T21:41:00.000Z',
        via: 'voice',
        text: 'Does cash itself go into the working capital adjustment?',
      },
      {
        id: 'm2',
        role: 'tutor',
        at: '2026-09-13T21:41:12.000Z',
        text: `No, and the reason is worth holding onto: cash is what you are solving for. Putting it inside the adjustment would make the calculation circular.

The operating accounts are receivables, inventory, prepaid expenses, payables, accrued expenses and unearned revenue. Cash, short-term debt and marketable securities all stay out - the first because it is the answer, the other two because they are financing and investing rather than operations.`,
        citations: [{ label: 'Chapter 4 notes', detail: 'Operating accounts only', docId: 'doc-ch4-notes' }],
      },
    ],
  },
  {
    id: 'conv-quiz2-1',
    assignmentId: 'quiz2fix',
    title: 'Why I lost marks on Q3',
    when: 'Last Tuesday, 4:02 PM',
    messages: [
      {
        id: 'm1',
        role: 'student',
        at: '2026-09-08T16:02:00.000Z',
        text: 'The marker wrote "payables are a source, check your signs" on question 3 and I still do not really see it.',
      },
      {
        id: 'm2',
        role: 'tutor',
        at: '2026-09-08T16:02:18.000Z',
        text: `Take the word "payable" literally: it is something you are going to pay, and have not yet.

If that balance grows over the year, the growth is cash you are still holding. The goods arrived, the invoice is sitting in your accounts, and your bank balance has not moved. Your supplier has effectively lent you the money, interest free.

So a rise in payables is a source of cash. In the net working capital formula it is subtracted, because net working capital is current assets minus current liabilities.

Compare it against receivables to make the symmetry obvious. Receivables rising means you delivered and have not been paid - cash is with your customer. Payables rising means you received and have not paid - cash is with you.`,
        citations: [{ label: 'Quiz 2 - marked copy', detail: 'Q3, -4 marks', docId: 'doc-quiz2' }],
        suggestions: ['What about Q5?'],
      },
      {
        id: 'm3',
        role: 'student',
        at: '2026-09-08T16:08:00.000Z',
        text: 'And Q5? I said a negative change in working capital was a bad sign.',
      },
      {
        id: 'm4',
        role: 'tutor',
        at: '2026-09-08T16:08:14.000Z',
        text: `Same root, opposite direction. A negative change in net working capital means the business released cash over the period - it collected faster, held less stock, or stretched its payables.

In the cash flow build you subtract the change, so subtracting a negative adds to cash flow.

It is only a bad sign if you look at why. Released cash because customers paid promptly is good. Released cash because you stopped restocking is a warning. The number alone does not tell you which, and the marks in that question were for saying so.`,
      },
    ],
  },
  {
    id: 'conv-memo-1',
    assignmentId: 'memo2',
    title: 'Structuring the credit committee memo',
    when: 'Two days ago, 11:20 AM',
    messages: [
      {
        id: 'm1',
        role: 'student',
        at: '2026-09-12T11:20:00.000Z',
        text: 'Two pages feels like nothing. What do I cut?',
      },
      {
        id: 'm2',
        role: 'tutor',
        at: '2026-09-12T11:20:22.000Z',
        text: `Cut the setup. A credit committee already knows what Harbor Logistics does - you do not need a paragraph reintroducing the company.

Put your view in the first three sentences, then spend the space on the gap between net income and cash flow from operations and what explains it. Finish with one or two specific things to watch, each with a threshold attached.

The rule of thumb: if a sentence would survive unchanged in a memo about a different company, it is not earning its place.`,
        citations: [{ label: 'Case memo brief', detail: 'Deliverable and length', docId: 'doc-memo-brief' }],
      },
    ],
  },
  {
    id: 'conv-ps3-1',
    assignmentId: 'ps3',
    title: 'Effective annual rate slip',
    when: 'Two weeks ago',
    messages: [
      {
        id: 'm1',
        role: 'student',
        at: '2026-08-31T15:02:00.000Z',
        text: 'I lost a mark converting a nominal rate. Where did it go wrong?',
      },
      {
        id: 'm2',
        role: 'tutor',
        at: '2026-08-31T15:02:16.000Z',
        text: `You used 12 compounding periods where the question said quarterly.

  EAR = (1 + r/m)^m - 1

with m as the number of compounding periods per year. Quarterly means m = 4, so a 8% nominal rate gives (1.02)^4 - 1 = 8.24%, not (1.0067)^12 - 1.

The method was right all the way through, which is why it was one mark rather than the question. When you read a rate question, circle the compounding word before you start - that is the only place this ever goes wrong.`,
        citations: [{ label: 'Problem Set 3 - graded', detail: 'Marker comment', docId: 'doc-ps3' }],
      },
    ],
  },
  {
    id: 'conv-sta-1',
    assignmentId: 'sta-ps5',
    title: 'What a p-value actually says',
    when: 'Three days ago',
    messages: [
      {
        id: 'm1',
        role: 'student',
        at: '2026-09-11T19:30:00.000Z',
        text: 'Question 7 wants it in words and I have written the same wrong sentence twice now.',
      },
      {
        id: 'm2',
        role: 'tutor',
        at: '2026-09-11T19:30:20.000Z',
        text: `The sentence you keep writing is probably some version of "the probability the null hypothesis is true". That is the classic inversion.

The correct direction: the p-value is the probability of observing data at least as extreme as yours, assuming the null hypothesis is true. The condition sits on the null, not on your data.

A sentence that would earn the mark: "If there were truly no difference, we would see a result this extreme about 3 times in 100."`,
        citations: [{ label: 'STA 220 Problem Set 5', detail: 'Question 7', docId: 'doc-sta-ps5' }],
      },
    ],
  },
]

export const conversationsForAssignment = (assignmentId: string) =>
  seedConversations.filter((c) => c.assignmentId === assignmentId)

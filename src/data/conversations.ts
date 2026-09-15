import type { Conversation } from '@/types'

/**
 * Saved tutor conversations, stored against the assignment they belong to.
 * This is the "every assignment keeps its own chats" part of the concept: the
 * workspace is the unit of memory, not the chat window.
 */
export const seedConversations: Conversation[] = [
  {
    id: 'conv-ws5-1',
    assignmentId: 'ws5',
    title: 'Getting started on question 3',
    when: 'Yesterday, 7:40 PM',
    messages: [
      {
        id: 'm1',
        role: 'student',
        at: '2026-09-14T19:40:00.000Z',
        text: 'Do I have to expand the brackets first or can I divide by something?',
      },
      {
        id: 'm2',
        role: 'tutor',
        at: '2026-09-14T19:40:18.000Z',
        text: `Expand first. Dividing only helps when there is a single bracket on its own, like 4(x − 2) = 12, where you could divide both sides by 4.

Here you have two brackets being subtracted, so there is nothing you can cleanly divide the whole equation by. Get rid of the brackets, collect the like terms, then isolate x.

Three steps, in that order, every time.`,
        citations: [{ label: 'Chapter 2 notes', detail: 'Expanding a bracket', docId: 'doc-ch2-notes' }],
        suggestions: ['What if the number outside is negative?'],
      },
      {
        id: 'm3',
        role: 'student',
        at: '2026-09-14T19:44:00.000Z',
        via: 'voice',
        text: 'What about when the number outside is negative?',
      },
      {
        id: 'm4',
        role: 'tutor',
        at: '2026-09-14T19:44:12.000Z',
        text: `The minus goes with the number, and the number multiplies everything inside the bracket.

  −3(x + 1) = −3x − 3

Both terms. The 1 gets it too, which is the part people drop.`,
        citations: [{ label: 'Chapter 2 notes', detail: 'Negative in front', docId: 'doc-ch2-notes' }],
      },
    ],
  },
  {
    id: 'conv-quiz2-1',
    assignmentId: 'quiz2',
    title: 'Why I lost marks on Q4',
    when: 'Last week',
    messages: [
      {
        id: 'm1',
        role: 'student',
        at: '2026-09-08T16:02:00.000Z',
        text: 'My teacher wrote "the minus belongs to the 2" on question 4 and I still do not really get it.',
      },
      {
        id: 'm2',
        role: 'tutor',
        at: '2026-09-08T16:02:16.000Z',
        text: `You had 5 − 2(x + 3) and wrote 5 − 2x + 6.

Read that middle bit as "negative two times the bracket". Negative two times x is −2x. Negative two times +3 is −6, not +6.

  5 − 2(x + 3) = 5 − 2x − 6 = −2x − 1

The minus is stuck to the 2. Wherever the 2 goes, the minus goes with it.

Check it with x = 1: the original is 5 − 2(4) = −3, and −2(1) − 1 = −3. Match.`,
        citations: [{ label: 'Quiz 2 - marked copy', detail: 'Q4, −3 marks', docId: 'doc-quiz2' }],
      },
    ],
  },
]

export const conversationsForAssignment = (assignmentId: string) =>
  seedConversations.filter((c) => c.assignmentId === assignmentId)

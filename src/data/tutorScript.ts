import type { Citation } from '@/types'

/**
 * The scripted tutor.
 *
 * Every reply below is written by hand. `resolveReply` scores an incoming
 * question against the `keywords` of each entry and returns the best match,
 * falling back to a generic reply that still points at real course material.
 *
 * Replies are kept short on purpose. A tutor who says the useful thing in four
 * sentences is more convincing than one who writes an essay.
 */
export interface ScriptedReply {
  id: string
  /** Scored against the question. Multi-word entries count double. */
  keywords: string[]
  text: string
  citations?: Citation[]
  suggestions?: string[]
}

/** Replies triggered by confirming a circled region of the worksheet. */
export const regionAnalyses: Record<string, ScriptedReply> = {
  'part-a': {
    id: 'analysis-part-a',
    keywords: [],
    text: `The first bracket is perfect. 4(x − 2) really is 4x − 8.

The second one is where it goes wrong. You wrote:

  −3(x + 1) = −3x + 3

The minus belongs to the 3, and it travels with it to **every** term inside the bracket. So it is:

  −3(x + 1) = −3x − 3

Your full line should read 4x − 8 − 3x − 3 = 5.

Here is a check you can do in five seconds. Put x = 2 in. The original −3(2 + 1) = −9. Your version gives −3(2) + 3 = −3. Mine gives −3(2) − 3 = −9. They match, so mine is the right expansion.

That +3 instead of −3 is a difference of 6, and it carries into (b) and (c).`,
    citations: [
      { label: 'Chapter 2 notes', detail: 'When the number outside is negative', docId: 'doc-ch2-notes' },
    ],
    suggestions: [
      'So what should (b) and (c) be?',
      'Why does the minus go to both terms?',
      'Give me one to practise',
    ],
  },
  'part-b': {
    id: 'analysis-part-b',
    keywords: [],
    text: `Your method here is right. You collected the x terms and the number terms separately, which is exactly what you should do.

4x − 3x = x. That part is correct.

The numbers are where the earlier error lands. You had −8 + 3, which gives −5. With the correct expansion it is −8 − 3, which gives −11. So the line should be:

  x − 11 = 5

Nothing you did in this step was wrong. You just carried a +3 into it that should have been a −3.`,
    citations: [{ label: 'Part (a) on this page', detail: 'Where the +3 came from', docId: 'doc-ws5-photo' }],
    suggestions: ['Then what is the final answer?', 'Show me the whole thing done right', 'Why does the minus go to both terms?'],
  },
  'part-c': {
    id: 'analysis-part-c',
    keywords: [],
    text: `The step itself is right: you added 5 to both sides to get x on its own. That is the correct move.

With the corrected line x − 11 = 5, you add 11 to both sides:

  x = 16

So the answer is 16, not 10.

Always worth checking at the end, and it takes seconds. Put 16 back into the original:

  4(16 − 2) − 3(16 + 1) = 4(14) − 3(17) = 56 − 51 = 5 ✓

Try the same check with x = 10 and you get −1, not 5. That check would have caught this on its own.`,
    citations: [{ label: 'Worksheet 5 - my working', detail: 'Parts (a) to (c)', docId: 'doc-ws5-photo' }],
    suggestions: ['Show me the whole thing done right', 'Where else have I made this mistake?', 'Give me one to practise'],
  },
  'margin-note': {
    id: 'analysis-margin-note',
    keywords: [],
    text: `Your own note says "minus on both?" — so part of you already knew.

Yes. It goes on both. The minus belongs to the 3, and the 3 multiplies everything inside the bracket:

  −3(x + 1) = −3x − 3

This is the third time this exact thing has come up. It is in your Chapter 2 notes, where you wrote the rule backwards and corrected it yourself, and it cost you 3 marks on Quiz 2 question 4.

The pattern is quite specific: you never get it wrong when the number outside is positive, and you can state the rule correctly if I just ask you. It slips when you are working quickly. That is a habit thing, not an understanding thing, so a few quick reps will fix it faster than re-reading the chapter.`,
    citations: [
      { label: 'Chapter 2 notes', detail: 'Your own flagged correction', docId: 'doc-ch2-notes' },
      { label: 'Quiz 2 - marked copy', detail: 'Q4, −3 marks, same slip', docId: 'doc-quiz2' },
    ],
    suggestions: ['Give me one to practise', 'Show me the whole thing done right', 'Where else have I made this mistake?'],
  },
}

/** General question bank, matched on keywords. */
export const scriptedReplies: ScriptedReply[] = [
  {
    id: 'why-minus-both',
    keywords: [
      'why does the minus',
      'minus on both',
      'both terms',
      'negative',
      'minus sign',
      'distribute',
      'distributing',
      'why both',
      'sign',
    ],
    text: `Because the minus is part of the number, not a separate thing sitting outside.

When you see −3(x + 1), read it as "negative three, times everything in the bracket". Negative three times x is −3x. Negative three times +1 is −3. So:

  −3(x + 1) = −3x − 3

It helps to think of the bracket as a bag holding two things. Whatever is outside multiplies **each** thing in the bag, not just the one nearest the door.

Two more, to see the pattern:

- −2(x + 5) = −2x − 10
- −2(x − 5) = −2x + 10  (negative times negative is positive)

And if there is nothing but a minus in front, there is an invisible 1: −(x + 4) = −x − 4.`,
    citations: [{ label: 'Chapter 2 notes', detail: 'When the number outside is negative', docId: 'doc-ch2-notes' }],
    suggestions: ['Give me one to practise', 'How do I check my answer?', 'Show me the whole thing done right'],
  },
  {
    id: 'corrected-working',
    keywords: [
      'whole thing',
      'done right',
      'corrected working',
      'from the start',
      'full solution',
      'walk me through',
      'show me the working',
      'what should',
      'redo',
      'corrected',
    ],
    text: `Here is question 3 from the top, with the one fix applied.

  4(x − 2) − 3(x + 1) = 5

**(a) Expand**
  4x − 8 − 3x − 3 = 5

**(b) Collect like terms**
  x − 11 = 5

**(c) Solve**
  x = **16**

**Check:** 4(16 − 2) − 3(16 + 1) = 56 − 51 = 5 ✓

The only thing that changed from your version is one sign in part (a). Parts (b) and (c) were your own method, and the method was right both times.`,
    citations: [{ label: 'Worksheet 5 - my working', detail: 'Question 3', docId: 'doc-ws5-photo' }],
    suggestions: ['Why does the minus go to both terms?', 'How do I check my answer?', 'Give me one to practise'],
  },
  {
    id: 'check-answer',
    keywords: [
      'check my answer',
      'how do i check',
      'substitute',
      'substituting',
      'plug in',
      'is it right',
      'verify',
      'make sure',
    ],
    text: `Put your answer back into the original equation and see if both sides match. If they do, you are right. If they do not, something upstream is wrong.

With x = 16:

  4(16 − 2) − 3(16 + 1)
  = 4(14) − 3(17)
  = 56 − 51
  = 5 ✓

The right-hand side is 5, so it checks out.

Now try it with your x = 10:

  4(8) − 3(11) = 32 − 33 = −1

That is not 5, so x = 10 cannot be right.

This is worth doing every single time. It takes about fifteen seconds and it catches exactly the kind of sign slip that keeps costing you marks.`,
    citations: [{ label: 'Worksheet 5 - my working', detail: 'Part (c)', docId: 'doc-ws5-photo' }],
    suggestions: ['Show me the whole thing done right', 'Give me one to practise', 'Where else have I made this mistake?'],
  },
  {
    id: 'like-terms',
    keywords: ['like terms', 'collect', 'combining', 'simplify', 'combine'],
    text: `Like terms are terms with exactly the same letter part. You can only add or subtract those.

In 4x − 8 − 3x − 3:

- The x terms: 4x and −3x. Those combine to x.
- The plain numbers: −8 and −3. Those combine to −11.

So it tidies up to x − 11.

The thing to watch is that each term keeps the sign in front of it. The −3 travels with its minus, and so does the −8. A lot of slips here are really just a sign that got left behind when the terms were moved around.

And 4x and −8 are **not** like terms, so they stay separate. You cannot turn them into −4x, tempting as it looks.`,
    citations: [{ label: 'Chapter 2 notes', detail: 'Expanding and simplifying', docId: 'doc-ch2-notes' }],
    suggestions: ['Show me the whole thing done right', 'Give me one to practise', 'How do I check my answer?'],
  },
  {
    id: 'where-else-mistake',
    keywords: [
      'where else',
      'same mistake',
      'pattern',
      'recurring',
      'keep getting wrong',
      'again',
      'history',
      'before',
    ],
    text: `It shows up three times in your work.

**Chapter 2 notes.** You wrote "−3(x + 1) = −3x + 3" and then corrected it yourself after class. Your flag is still on it.

**Quiz 2, question 4.** Three marks. You expanded 5 − 2(x + 3) as 5 − 2x + 6. Your teacher wrote "the minus belongs to the 2".

**Worksheet 5, part (a).** Today. Same slip.

The useful detail is how *narrow* it is. It never happens when the number in front is positive, and if I ask you the rule cold you get it right. It goes wrong mid-question, when you are moving quickly. That is worth knowing, because it means drilling a few quick ones will help far more than reading the chapter again.`,
    citations: [
      { label: 'Chapter 2 notes', detail: 'Your own correction', docId: 'doc-ch2-notes' },
      { label: 'Quiz 2 - marked copy', detail: 'Q4, −3 marks', docId: 'doc-quiz2' },
    ],
    suggestions: ['Give me one to practise', 'Open my learning insights', 'Why does the minus go to both terms?'],
  },
  {
    id: 'practise',
    keywords: ['practise', 'practice', 'drill', 'test me', 'quiz me', 'give me a question', 'try one', 'one to'],
    text: `Here is one. Expand it, do not solve it:

  **5 − 2(x + 4)**

Two things to watch: the minus in front of the 2, and the fact that the 5 just comes along for the ride.

Tell me what you get and I will tell you where it went right or wrong, rather than just marking it.

There are three more in the practice set on the **Learning insights** page if you want to keep going.`,
    citations: [{ label: 'Chapter 2 notes', detail: 'Negative in front of a bracket', docId: 'doc-ch2-notes' }],
    suggestions: ['5 - 2x - 8', 'Open my learning insights', 'I am not sure where to start'],
  },
  {
    id: 'practise-answer',
    keywords: ['5 - 2x - 8', '5 minus 2x minus 8', 'my answer is', 'the answer is', 'i got', '2x - 8', '2x + 8'],
    text: `That is right. 5 − 2(x + 4) = 5 − 2x − 8, which tidies up to **−2x − 3**.

The minus went to both the x and the 4, which is the exact thing that caught you on the worksheet.

If you got 5 − 2x + 8 instead, that is the old pattern: the minus reached the x but not the 4.

Quick check with x = 1: the original is 5 − 2(5) = −5. And −2(1) − 3 = −5. Match.

Want another, or shall we go back to the worksheet?`,
    citations: [{ label: 'Chapter 2 notes', detail: 'Negative in front of a bracket', docId: 'doc-ch2-notes' }],
    suggestions: ['Give me another one', 'Back to the worksheet', 'Open my learning insights'],
  },
  {
    id: 'insights-pointer',
    keywords: ['insights', 'how am i doing', 'progress', 'weak areas', 'what should i review', 'revise', 'study plan'],
    text: `Short version.

**The one real gap: the minus in front of a bracket.** Three appearances, 3 marks lost on Quiz 2, and again on today's worksheet. Chapter 2 is sitting at 42%, the lowest of the four.

**What is solid.** Order of operations at 88%. Expanding positive brackets is reliable. Your method for isolating x has been right every single time I can see — including on the questions you got "wrong", where only the input was off.

**What I would actually do.** Five minutes of expanding brackets with a negative out front, twice this week. Then redo Quiz 2 question 4 without looking at the marked copy. That is about fifteen minutes total, and it targets nearly every mark you are currently dropping.

Open **Learning insights** for the full picture and the practice set.`,
    citations: [{ label: 'Quiz 2 - marked copy', detail: 'Q4', docId: 'doc-quiz2' }],
    suggestions: ['Give me one to practise', 'Where else have I made this mistake?', 'Open my learning insights'],
  },
  {
    id: 'how-do-you-know',
    keywords: ['how do you know', 'how did you know', 'remember', 'you know my', 'memory', 'my history', 'seen my work'],
    text: `Everything in this workspace is part of what I can see, not just the message you typed.

For this course that means your photographed worksheet, your Chapter 2 notes including the correction you made to them, your marked Quiz 2 with the teacher's comment, and every conversation we have had here.

So when you circle a line, I am not reading it cold. I can see that the same slip cost you marks on Quiz 2, and that you had already caught yourself once in your own notes.

That is the difference between a chatbot and a tutor who has been with you all term. A chatbot can explain how to expand a bracket. It cannot tell you that this is the third time, that it only happens with a negative out front, and that it only happens when you are rushing.

*(This is a prototype, so the memory is a fixed sample rather than a real record of your work.)*`,
    citations: [
      { label: 'Quiz 2 - marked copy', detail: 'Q4', docId: 'doc-quiz2' },
      { label: 'Chapter 2 notes', detail: 'Your own correction', docId: 'doc-ch2-notes' },
    ],
    suggestions: ['Where else have I made this mistake?', 'Open my learning insights', 'Show me the whole thing done right'],
  },
  {
    id: 'hello',
    keywords: ['hello', 'hi', 'hey', 'what can you do', 'help', 'start'],
    text: `I have your Algebra I workspace open — Worksheet 5, question 3.

Three things worth trying:

- **Circle something on the page.** Drag a box around any line of your working and I will read it back, ask you to confirm it, then go through it with you.
- **Ask about the idea**, not just the answer. "Why does the minus go to both terms?" gets you further than "is this right".
- **Ask what you keep getting wrong.** I can see your notes and your marked quiz, so "where else have I made this mistake?" has a real answer.

Part (a) is where I would start. Something in it is worth a conversation.`,
    suggestions: [
      'Where else have I made this mistake?',
      'Why does the minus go to both terms?',
      'How do I check my answer?',
    ],
  },
]

/** Used when nothing scores above the match threshold. */
export const fallbackReply: ScriptedReply = {
  id: 'fallback',
  keywords: [],
  text: `This prototype ships with a fixed set of scripted answers, and that one is outside them — so rather than make something up, here is what I can actually do well.

I know this workspace: Worksheet 5 question 3, your handwritten working, your Chapter 2 notes and your marked Quiz 2. Try one of these:

- Circle part (a), (b) or (c) on the page and confirm the transcription
- "Why does the minus go to both terms?"
- "Where else have I made this mistake?"
- "Show me the whole thing done right"
- "How do I check my answer?"

In a real version this question would go to an actual model with the same workspace attached. The interesting problem is not the model — it is working out which parts of a term's work to send with the question.`,
  suggestions: [
    'Where else have I made this mistake?',
    'Show me the whole thing done right',
    'Why does the minus go to both terms?',
  ],
}

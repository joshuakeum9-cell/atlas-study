import type { Citation } from '@/types'

/**
 * The scripted tutor.
 *
 * Every reply below is written by hand. `mockAiService` scores an incoming
 * question against the `keywords` of each entry and returns the best match,
 * falling back to a generic reply that still points at real course material.
 *
 * Two things make the scripted replies feel like a tutor rather than a chatbot:
 *  1. They cite the student's own documents (that is the "academic memory").
 *  2. They refer back to earlier mistakes on the same idea.
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
    text: `I can read your part (a) clearly, and the setup is right: you identified the three operating accounts that moved and you are working with the *changes*, not the levels. That is the part most people get wrong first.

The problem is one sign. You wrote:

  ΔNWC = ΔAR + ΔInv + ΔAP = 60 + 45 + 30 = 135

Accounts payable belongs on the other side. Net working capital is operating current assets minus operating current liabilities, so a rise in payables *reduces* it:

  ΔNWC = ΔAR + ΔInv − ΔAP = 60 + 45 − 30 = 75

The intuition is worth more than the formula here. When your payables go up by 30, you have taken delivery of something and not paid for it yet. Your supplier is lending you 30 for free. Cash stayed in your account, so this cannot be a use of cash.

A quick test you can run on any working capital line: ask "did cash leave the building?" Receivables up means you shipped the goods and are still waiting to be paid, so cash did leave. Inventory up means you bought stock that is sitting in a warehouse, so cash left. Payables up means you have not paid yet, so cash stayed.

This matters beyond part (a) because the 135 flows straight into parts (b) and (c).`,
    citations: [
      { label: 'Chapter 4 notes', detail: 'Sign convention, page 1', docId: 'doc-ch4-notes' },
      { label: 'Problem Set 4 brief', detail: 'Reminder box on current liabilities', docId: 'doc-ps4-brief' },
    ],
    suggestions: [
      'So what should parts (b) and (c) be?',
      'Why is a rise in payables a source of cash?',
      'Give me a practice question on this',
    ],
  },
  'part-b': {
    id: 'analysis-part-b',
    keywords: [],
    text: `Your part (b) is structurally correct. You started from net income, added back depreciation because it is a non-cash charge, and subtracted the change in working capital. That is exactly the indirect method, in the right order.

  CFO = NI + Dep − ΔNWC

The only thing wrong is the number you carried in. You used ΔNWC = 135, which came from adding the increase in payables in part (a) instead of subtracting it. With the corrected 75:

  CFO = 240 + 85 − 75 = 250

So the real answer is 250, not 190. You lost 60 of cash flow to a single sign, which in a case memo would be the difference between "earnings are cash-backed" and "earnings are not".

Worth noting what you did *not* do: you left capital expenditures out of this line. Your Chapter 3 notes say you keep pulling capex into operations, and you did not do it here. That habit has stuck.`,
    citations: [
      { label: 'Chapter 3 notes', detail: 'Indirect method, in order', docId: 'doc-ch3-notes' },
      { label: 'Part (a) on this page', detail: 'Where the 135 came from', docId: 'doc-ps4-photo' },
    ],
    suggestions: [
      'Then what is the corrected free cash flow?',
      'Why is depreciation added back?',
      'How would this change my answer to part (d)?',
    ],
  },
  'part-c': {
    id: 'analysis-part-c',
    keywords: [],
    text: `Part (c) is right in method and wrong in input, which is the best kind of wrong.

  FCF = CFO − capital expenditures

You subtracted capex of 120 from the CFO you had computed, and you did not double-count it anywhere else. That is the whole idea of free cash flow: the cash operations threw off, less what you had to spend to keep the assets running.

Recomputing with the corrected CFO of 250:

  FCF = 250 − 120 = 130

Your 70 becomes 130. The interesting part is what that does to the story. At 70, Harbor Logistics is generating barely half its net income in free cash, which reads like an earnings quality problem. At 130, the picture is ordinary: a growing freight company tying up cash in receivables and inventory while it expands. Part (d) asks you to comment on earnings quality, so the sign error would have led you to the wrong conclusion, not just the wrong number.`,
    citations: [
      { label: 'Chapter 3 notes', detail: 'FCF = CFO − capex', docId: 'doc-ch3-notes' },
      { label: 'Problem Set 4 brief', detail: 'Part (d) asks about earnings quality', docId: 'doc-ps4-brief' },
    ],
    suggestions: [
      'Help me write part (d)',
      'Show me the corrected working from the top',
      'Where else have I made this mistake?',
    ],
  },
  'margin-note': {
    id: 'analysis-margin-note',
    keywords: [],
    text: `Your own margin note says "check sign on A/P ??" — so some part of you already knew.

You were right to be suspicious. The increase in accounts payable should be subtracted in the change in net working capital, not added. A rise in payables means your supplier has not been paid yet, so cash stayed with you. It is a source of cash.

  ΔNWC = 60 + 45 − 30 = 75, not 135

This is the third time this exact doubt has shown up in your work. It is in the Chapter 4 notes, where you wrote the convention backwards and corrected it after the tutorial, and it cost you four marks on Quiz 2 question 3. The pattern is consistent: you know the definition, and the doubt appears under time pressure on the payables line specifically — never on receivables or inventory.

That is a narrow enough gap to close with about ten minutes of drilling rather than a re-read of the chapter.`,
    citations: [
      { label: 'Chapter 4 notes', detail: 'Flagged correction after the tutorial', docId: 'doc-ch4-notes' },
      { label: 'Quiz 2 - marked copy', detail: 'Q3, −4 marks, same sign', docId: 'doc-quiz2' },
    ],
    suggestions: [
      'Drill me on the sign convention',
      'Fix part (a) for me and show the working',
      'Where else have I made this mistake?',
    ],
  },
}

/** General question bank, matched on keywords. */
export const scriptedReplies: ScriptedReply[] = [
  {
    id: 'payables-source',
    keywords: [
      'accounts payable',
      'payable',
      'a/p',
      'source of cash',
      'sign convention',
      'why subtract',
      'sign',
      'supplier',
    ],
    text: `Because you have not paid it yet.

Think about what a payable is. You received goods or a service, the invoice sits in your accounts, and the cash has not left your bank. If that balance grows from one year to the next, the growth is money you are holding on to. Your supplier is financing you, interest free.

That is why payables sit on the liability side of net working capital:

  NWC = operating current assets − operating current liabilities

and why a rise in them pushes ΔNWC down, which pushes cash flow up.

The mirror image is receivables. When receivables grow, you have delivered the goods and are waiting to be paid, so the cash is with your customer rather than with you. Cash goes down.

One sentence to hold onto: assets up means cash out, liabilities up means cash in.`,
    citations: [{ label: 'Chapter 4 notes', detail: 'Sign convention, page 1', docId: 'doc-ch4-notes' }],
    suggestions: ['Give me a practice question on this', 'What about accrued wages?', 'Explain the cash conversion cycle'],
  },
  {
    id: 'corrected-working',
    keywords: [
      'corrected working',
      'from the top',
      'show me the working',
      'fix part',
      'what should parts',
      'redo',
      'full solution',
      'walk me through',
      'corrected',
    ],
    text: `Here is the whole page reworked, with the one correction applied.

**(a) Change in net working capital**
  ΔNWC = ΔAR + ΔInv − ΔAP
  = 60 + 45 − 30
  = **75**

**(b) Cash flow from operations**
  CFO = NI + depreciation − ΔNWC
  = 240 + 85 − 75
  = **250**

**(c) Free cash flow**
  FCF = CFO − capex
  = 250 − 120
  = **130**

**(d) Earnings quality, in two sentences**
Net income of 240 converted into 250 of operating cash flow, so the profit is backed by cash rather than by accruals. The working capital build of 75 is worth watching, but with capex of 120 the firm still produced 130 of free cash, which is consistent with a company growing rather than one struggling to collect.

The only thing that changed between your version and this one is a single minus sign in part (a). Everything downstream was your own method, and it was correct.`,
    citations: [
      { label: 'Problem Set 4 brief', detail: 'All four parts', docId: 'doc-ps4-brief' },
      { label: 'Chapter 3 notes', detail: 'Indirect method order', docId: 'doc-ch3-notes' },
    ],
    suggestions: ['Why is depreciation added back?', 'Help me write part (d)', 'Drill me on the sign convention'],
  },
  {
    id: 'depreciation-addback',
    keywords: ['depreciation', 'add back', 'non-cash', 'amortisation', 'amortization', 'why add'],
    text: `Depreciation is added back because it never cost you any cash this year.

The cash went out when the asset was bought. That was a single, real payment, and it shows up in investing activities as capital expenditure. Depreciation is the accounting system spreading that one payment across the years the asset is useful, so the income statement is not distorted by a lumpy purchase.

So when you start from net income and want to get to cash, you have to undo that spreading:

  CFO = net income + non-cash charges − ΔNWC

The same logic applies to amortisation, impairments and stock-based compensation. All of them reduce reported profit without moving cash in the period.

There is a trap worth knowing: this does not mean depreciation is irrelevant to cash. It is, indirectly, through tax. A higher depreciation charge lowers taxable income and therefore lowers the tax you actually pay. That is the depreciation tax shield, and it shows up properly in Chapter 5 when you build project cash flows.`,
    citations: [
      { label: 'Chapter 3 notes', detail: 'Add back non-cash charges', docId: 'doc-ch3-notes' },
      { label: 'Lecture 6 slides', detail: 'Tax shield, slide 11', docId: 'doc-ch6-slides' },
    ],
    suggestions: ['What is the depreciation tax shield?', 'Why is capex not in operations?', 'Explain free cash flow'],
  },
  {
    id: 'free-cash-flow',
    keywords: ['free cash flow', 'fcf', 'what is free cash', 'capex', 'capital expenditure'],
    text: `Free cash flow is what is genuinely left over for the people who funded the business, after the company has paid for everything it needs to keep running.

  FCF = cash flow from operations − capital expenditures

Two things make it useful. First, it is hard to manipulate. You can flatter net income with accounting choices, but cash either arrived or it did not. Second, it is what a valuation actually discounts. When you get to Chapter 5 and build a discounted cash flow, this is the line you project.

The part students trip over is where capex sits. Capex is an investing activity, so it is not inside cash flow from operations. Free cash flow is the deliberate bridge between the two sections: operations produce cash, investing consumes it, and the difference is free.

Your Chapter 3 notes flag this exact thing — you have written that you keep pulling capex into the operating section. On this problem set you kept them separate, which is the improvement.`,
    citations: [
      { label: 'Chapter 3 notes', detail: 'FCF = CFO − capex', docId: 'doc-ch3-notes' },
      { label: 'Problem Set 4 - your work', detail: 'Part (c)', docId: 'doc-ps4-photo' },
    ],
    suggestions: ['Show me the corrected working', 'Why is depreciation added back?', 'How does this feed a DCF?'],
  },
  {
    id: 'part-d-help',
    keywords: [
      'part d',
      'earnings quality',
      'quality of earnings',
      'is the profit real',
      'write part',
      'comment on',
      'two sentences',
    ],
    text: `Part (d) is a judgment question, so the marks are in the reasoning rather than the number. The examiner is looking for you to compare net income against cash flow from operations and say what the gap means.

With the corrected figures the comparison is: net income 240, CFO 250. Cash flow slightly exceeds profit, which is the healthy direction.

A two-sentence answer that would score well:

> Net income of 240 converted into 250 of cash flow from operations, so the reported profit is supported by cash rather than by accruals. The 75 build in working capital is worth monitoring, but alongside capex of 120 the firm still generated 130 of free cash, which is consistent with growth rather than with deteriorating collection.

Notice what makes it work. It uses both numbers, it names the one risk, and it ends with a view. A sentence that only says "earnings quality is good" earns very little.

Here is why the sign error mattered more than it looked: with your original figures, CFO of 190 sat *below* net income of 240, and the honest conclusion from that would have been the opposite one.`,
    citations: [
      { label: 'Problem Set 4 brief', detail: 'Part (d)', docId: 'doc-ps4-brief' },
      { label: 'Case memo brief', detail: 'Same question, two pages', docId: 'doc-memo-brief' },
    ],
    suggestions: ['Show me the corrected working', 'How do I start the case memo?', 'Give me a practice question'],
  },
  {
    id: 'cash-conversion-cycle',
    keywords: ['cash conversion cycle', 'ccc', 'dso', 'dio', 'dpo', 'days sales', 'conversion cycle'],
    text: `The cash conversion cycle measures how many days a dollar is stuck inside the business before it comes back as cash.

  CCC = DSO + DIO − DPO

Read it as a timeline. You buy inventory and it sits on the shelf for DIO days. You sell it and wait DSO days to be paid. Against that, you did not pay your own supplier for DPO days, so that part was financed for you.

Notice the minus sign on payables, again. It is the same idea as the sign convention that caught you in part (a): payables work in your favour. Lengthening the time you take to pay shortens the cycle.

A short or negative cycle is a real competitive advantage. Large retailers often run a negative one — they collect from customers at the till long before they pay their suppliers, so growth generates cash instead of consuming it.

For Harbor Logistics, receivables and inventory both grew faster than payables, which is why the working capital build showed up as a use of cash of 75.`,
    citations: [{ label: 'Chapter 4 notes', detail: 'Cash conversion cycle', docId: 'doc-ch4-notes' }],
    suggestions: ['Why is a rise in payables a source of cash?', 'Give me a practice question on this', 'What counts as working capital?'],
  },
  {
    id: 'what-counts-wc',
    keywords: [
      'what counts',
      'which items',
      'included in working capital',
      'operating current',
      'accrued',
      'wages',
      'short-term debt',
      'cash included',
    ],
    text: `Only the accounts that move because of day-to-day trading go into the working capital adjustment.

In:
- Accounts receivable
- Inventory
- Prepaid expenses
- Accounts payable
- Accrued expenses, including accrued wages
- Deferred or unearned revenue

Out:
- Cash and cash equivalents — cash is what you are solving for, so putting it inside would be circular
- Short-term debt and the current portion of long-term debt — that is financing, not operations
- Marketable securities — investing
- Dividends payable — financing

Accrued wages are a good test case, and they behave exactly like payables. If the balance rises, you have had the work done and not yet paid for it, so cash stayed with you. Source of cash.

Unearned revenue behaves the same way and catches people because the word "revenue" is in it. The customer paid you up front, the cash is in your account, and you owe them a service. Rising unearned revenue is a source of cash.`,
    citations: [
      { label: 'Chapter 4 notes', detail: 'Operating accounts only', docId: 'doc-ch4-notes' },
      { label: 'ACC 210 Problem Set 2', detail: 'Unearned revenue entries', docId: 'doc-acc-ps2' },
    ],
    suggestions: ['Why is a rise in payables a source of cash?', 'Explain the cash conversion cycle', 'Drill me on the sign convention'],
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
    text: `This one has a clear trail through your work.

**Chapter 4 notes, page 1.** You wrote the convention backwards — "payables up = use of cash" — and corrected it yourself after the tutorial. The corrected line is still there with your flag on it.

**Quiz 2, question 3.** Four marks. You treated a rise in accounts payable as reducing cash when computing the current ratio. The marker wrote "payables are a source, check your signs".

**Quiz 2, question 5.** Another four marks, same root. You read a negative change in net working capital as bad news. A negative change releases cash.

**Problem Set 4, part (a).** Today. Same line, same direction.

The shape of the pattern is specific and that is good news. You never get this wrong on receivables or inventory, and you can state the definition correctly when asked directly. It goes wrong on payables, under time pressure, mid-calculation. That is a fluency problem rather than a comprehension problem, and fluency responds to short repeated drills far better than to re-reading the chapter.`,
    citations: [
      { label: 'Chapter 4 notes', detail: 'Self-corrected convention', docId: 'doc-ch4-notes' },
      { label: 'Quiz 2 - marked copy', detail: 'Q3 and Q5, −8 marks', docId: 'doc-quiz2' },
      { label: 'Problem Set 4 - your work', detail: 'Part (a)', docId: 'doc-ps4-photo' },
    ],
    suggestions: ['Drill me on the sign convention', 'Open my learning insights', 'Show me the corrected working'],
  },
  {
    id: 'drill-me',
    keywords: [
      'drill',
      'practice question',
      'test me',
      'quiz me',
      'give me a question',
      'try one',
      'practice',
    ],
    text: `Good. Short and targeted beats long and general for this.

I have put three questions in the practice panel, all on the payables direction, phrased differently each time so you cannot pattern-match your way through them. Open **Learning insights** and start the practice set, or take this one right now:

**A firm reports net income of 400 and depreciation of 60. Over the year, receivables fell by 25, inventory rose by 40, and accounts payable rose by 15. What is cash flow from operations?**

Work out ΔNWC first, and watch all three signs — one of them is a decrease, which flips the direction again.

Tell me your answer and I will tell you where it went right or wrong rather than just marking it.`,
    citations: [{ label: 'Chapter 4 notes', detail: 'Sign convention', docId: 'doc-ch4-notes' }],
    suggestions: ['Open my learning insights', 'The answer is 445', 'I am not sure where to start'],
  },
  {
    id: 'drill-answer',
    keywords: ['445', 'my answer is', 'the answer is', 'i got', 'is it 445'],
    text: `That is right, and the working matters more than the number, so let me lay it out.

  ΔNWC = ΔAR + ΔInv − ΔAP
  = (−25) + 40 − 15
  = **0**

  CFO = 400 + 60 − 0 = **460**

If you got 445 you probably handled the payables line correctly but treated the receivables *fall* as a use of cash. A decrease in receivables means customers paid you what they owed, so cash came in. It reduces ΔNWC.

Three signs, three different directions, and that is exactly the situation where this trips you up. The rule underneath all of it is still one sentence: assets up means cash out, liabilities up means cash in. Reverse it for decreases.

Want another one with different numbers?`,
    citations: [{ label: 'Chapter 4 notes', detail: 'Sign convention', docId: 'doc-ch4-notes' }],
    suggestions: ['Give me another one', 'Open my learning insights', 'Back to the problem set'],
  },
  {
    id: 'case-memo-start',
    keywords: ['case memo', 'memo', 'how do i start', 'two pages', 'credit committee', 'harbor logistics case'],
    text: `Start from the conclusion and work backwards. A credit committee reads the first paragraph and skims the rest.

A structure that works for this brief:

1. **The view, in three sentences.** Are the earnings cash-backed or not, and what would change your mind. Put it first, not last.
2. **The gap.** Net income against cash flow from operations for each of the three years. One small table. The reader should see the trend without doing arithmetic.
3. **What explains the gap.** Decompose it: non-cash charges, then each working capital line. This is where your Problem Set 4 method is reused directly — same build, three years of it.
4. **What to watch.** Name one or two specific things, with a threshold. "If days sales outstanding passes 60 the picture changes" is useful; "management should monitor receivables" is not.

The brief says rising net income with flat cash flow from operations across three years. That pattern usually resolves into one of three stories: growth tying up working capital, weakening collection, or revenue recognition getting aggressive. Your job is to say which one, with the numbers behind it.

Your Chapter 3 notes already have the indirect method laid out in order, which is the machinery for section 3.`,
    citations: [
      { label: 'Case memo brief', detail: 'Exhibit 1, three years', docId: 'doc-memo-brief' },
      { label: 'Chapter 3 notes', detail: 'Indirect method', docId: 'doc-ch3-notes' },
    ],
    suggestions: ['What is earnings quality?', 'Show me the corrected working', 'Open my learning insights'],
  },
  {
    id: 'wacc',
    keywords: ['wacc', 'cost of capital', 'discount rate', 'capm', 'beta', 'cost of equity', 'weights'],
    text: `The weighted average cost of capital is the blended return the company has to earn to keep both its lenders and its shareholders satisfied.

  WACC = (E/V) × Re + (D/V) × Rd × (1 − t)

Three things carry most of the marks:

**The weights are market values.** Book equity is an accounting residual and has almost nothing to do with what shareholders actually have at stake. This is the single most common error on this topic.

**The tax shield sits only on the debt side.** Interest is deductible, dividends are not. That (1 − t) is the whole reason debt looks cheaper than equity before you account for risk.

**It is the firm's rate, not every project's rate.** If you discount a project that is riskier than the existing business at the company WACC, you will accept things you should reject. Lecture 6 covers the divisional rate adjustment for this.

Lecture 6 slides are in your library and your mastery on this chapter is sitting at 52%, mostly on the market-value weights point. It is worth a pass before the midterm.`,
    citations: [{ label: 'Lecture 6 slides - WACC', detail: 'Slides 4 to 12', docId: 'doc-ch6-slides' }],
    suggestions: ['Why market values and not book?', 'Open my learning insights', 'What is the depreciation tax shield?'],
  },
  {
    id: 'market-value-weights',
    keywords: ['market value', 'book value', 'why market', 'weights book'],
    text: `Because the cost of capital is about what investors require *now*, and only market values tell you that.

Book equity is history. It is what was paid in when shares were issued, plus retained earnings, less whatever has been distributed. It can be a fraction of what the company is worth, and for some firms it is negative while the shares trade perfectly happily.

The weights in WACC are meant to answer: of every dollar of capital currently funding this business, how much is debt and how much is equity? That is a question about today's claims, so you use today's prices — share price times shares outstanding for equity, market price of the bonds for debt.

Using book weights usually overstates the debt share, because equity is understated. That pulls the WACC down, which makes every project look better than it is. That is the direction the error runs, which is worth remembering in an exam when you are checking whether an answer is plausible.`,
    citations: [{ label: 'Lecture 6 slides - WACC', detail: 'Slide 7', docId: 'doc-ch6-slides' }],
    suggestions: ['Explain WACC again', 'When is WACC the wrong rate?', 'Open my learning insights'],
  },
  {
    id: 'tax-shield',
    keywords: ['tax shield', 'depreciation tax shield', 'interest deductible'],
    text: `A tax shield is the tax you do not pay because a deductible expense reduced your taxable income.

  Tax shield = deductible expense × tax rate

**Depreciation tax shield.** Depreciation is not a cash cost, but it is deductible. With a 25% tax rate, a depreciation charge of 85 saves you 85 × 0.25 = 21.25 of tax. That saving is real cash, which is why depreciation matters to cash flow even though the charge itself does not.

**Interest tax shield.** Interest is deductible too, and that is the reason the cost of debt in WACC is multiplied by (1 − t). Borrow at 6% with a 25% tax rate and the effective cost is 4.5%.

The cleanest way to keep these straight: depreciation affects cash only through tax, while interest affects both cash and the discount rate.`,
    citations: [{ label: 'Lecture 6 slides - WACC', detail: 'Slide 11', docId: 'doc-ch6-slides' }],
    suggestions: ['Explain WACC again', 'Why is depreciation added back?', 'Explain free cash flow'],
  },
  {
    id: 'ratios',
    keywords: ['ratio', 'current ratio', 'liquidity', 'quick ratio', 'leverage', 'quiz 2'],
    text: `Ratios come in four families, and knowing which family a ratio belongs to tells you what question it is answering.

**Liquidity** — can it pay this year's bills? Current ratio, quick ratio.
**Leverage** — how much of it is borrowed? Debt to equity, interest cover.
**Efficiency** — how hard are the assets working? Asset turnover, days sales outstanding, days inventory outstanding.
**Profitability** — what survives to the bottom? Margins, return on equity, return on invested capital.

On Quiz 2 question 3 you were asked what happens to the current ratio when accounts payable rise. Payables are a current liability, so the denominator grows and the ratio falls — and separately, the cash effect is positive, because you have not paid yet. Those two facts point in opposite directions, which is what made the question hard and what made the sign slip costly.

The general warning from your Chapter 2 notes still applies: a ratio on its own says nothing. It needs a comparison — last year, a peer, or a covenant threshold.`,
    citations: [
      { label: 'Chapter 2 notes', detail: 'Four families of ratio', docId: 'doc-ch2-notes' },
      { label: 'Quiz 2 - marked copy', detail: 'Q3', docId: 'doc-quiz2' },
    ],
    suggestions: ['Where else have I made this mistake?', 'Why is a rise in payables a source of cash?', 'Open my learning insights'],
  },
  {
    id: 'p-value',
    keywords: ['p-value', 'p value', 'hypothesis', 'null hypothesis', 'significance', 'statistics'],
    text: `A p-value is the probability of seeing data at least as extreme as yours, *assuming the null hypothesis is true*.

That conditional clause is the whole thing, and it is where your STA 220 work keeps going wrong — you have flagged it twice in that problem set yourself.

What it is not:
- It is not the probability that the null hypothesis is true.
- It is not the probability that your result happened by chance.
- It is not a measure of how large or important the effect is.

A small p-value says: if nothing were going on, data like this would be surprising. That is all. A large sample can produce a tiny p-value for an effect far too small to matter, which is why you report an effect size and a confidence interval alongside it.

This sits outside Corporate Finance, but Atlas keeps your courses together, and the same question came up twice in your statistics set, so it is worth closing.`,
    citations: [{ label: 'STA 220 Problem Set 5', detail: 'Question 7', docId: 'doc-sta-ps5' }],
    suggestions: ['Back to the problem set', 'Open my learning insights', 'Explain free cash flow'],
  },
  {
    id: 'insights-pointer',
    keywords: ['insights', 'how am i doing', 'progress', 'weak areas', 'what should i review', 'revise', 'study plan'],
    text: `Here is the short version across Corporate Finance.

**The one real gap: the working capital sign convention.** Four appearances in three weeks, eight marks lost on Quiz 2, and it showed up again on Problem Set 4 today. Chapter 4 mastery is at 38%, the lowest of the six.

**Second: market-value weights in WACC.** Only two appearances, so it is not a habit yet, but Chapter 6 is at 52% and the midterm weights it heavily.

**What is solid.** Time value of money at 88%, discounting handled correctly in every piece of work I can see. Your indirect-method ordering is now reliable — you stopped pulling capex into operations three weeks ago and have not done it since. Ratio computation is accurate; it is only ratio *interpretation* that wobbles.

**What I would actually do this week.** Ten minutes of sign-convention drills, twice. Then rework Quiz 2 questions 3 and 5 without looking at the marked copy. That is roughly 40 minutes total and it targets 80% of the marks you are currently losing.

Open the Learning insights tab for the full picture and the practice set.`,
    citations: [
      { label: 'Quiz 2 - marked copy', detail: 'Q3 and Q5', docId: 'doc-quiz2' },
      { label: 'Chapter 4 notes', detail: 'Mastery 38%', docId: 'doc-ch4-notes' },
    ],
    suggestions: ['Drill me on the sign convention', 'Where else have I made this mistake?', 'Explain WACC again'],
  },
  {
    id: 'how-do-you-know',
    keywords: [
      'how do you know',
      'how did you know',
      'remember',
      'you know my',
      'memory',
      'my history',
      'seen my work',
    ],
    text: `Everything in this workspace is part of my context, not just the message you sent.

For this course that means: the Problem Set 4 brief and your photographed working, your Chapter 2, 3 and 4 notes including the corrections you made to them, your marked Quiz 2 with the marker's comments, the graded Problem Set 3, the Lecture 6 slides, and every conversation we have had on this assignment.

So when you circle a line, I am not reading it cold. I can see that the same sign error cost you marks on Quiz 2, that you flagged the convention yourself in your Chapter 4 notes, and that you fixed a different habit — capex in operations — three weeks ago and have kept it fixed.

That is the difference between a chatbot and a tutor who has been with you all term. A chatbot can explain working capital. It cannot tell you that this is the fourth time, that it only happens on payables, and that it only happens when you are working quickly.

*(This is a prototype, so the memory is a fixed sample dataset rather than a real record of your work.)*`,
    citations: [
      { label: 'Quiz 2 - marked copy', detail: 'Q3 and Q5', docId: 'doc-quiz2' },
      { label: 'Chapter 4 notes', detail: 'Your own correction', docId: 'doc-ch4-notes' },
    ],
    suggestions: ['Where else have I made this mistake?', 'Open my learning insights', 'Show me the corrected working'],
  },
  {
    id: 'hello',
    keywords: ['hello', 'hi', 'hey', 'what can you do', 'help', 'start'],
    text: `I have your Corporate Finance workspace open — Problem Set 4, the Harbor Logistics free cash flow question.

Useful things to try:

- **Circle something on the worksheet.** Drag a box around any of your handwritten answers and I will read it, ask you to confirm the transcription, then work through it with you.
- **Ask about the concept**, not just the answer. "Why is a rise in payables a source of cash?" will get you further than "is this right".
- **Ask what you keep getting wrong.** I can see your notes, your marked quiz and your earlier problem sets, so "where else have I made this mistake?" has a real answer.

Part (a) is where I would start. Something in it is worth a conversation.`,
    suggestions: [
      'Where else have I made this mistake?',
      'Why is a rise in payables a source of cash?',
      'Explain free cash flow',
    ],
  },
]

/** Used when nothing scores above the match threshold. */
export const fallbackReply: ScriptedReply = {
  id: 'fallback',
  keywords: [],
  text: `This prototype ships with a fixed set of scripted answers, and that question is outside them — so rather than invent something, here is what I can actually do well.

I know this workspace in detail: Problem Set 4 on Harbor Logistics, your handwritten working, your Chapter 2, 3 and 4 notes, the marked Quiz 2, and the Lecture 6 WACC slides. Try one of these:

- Circle part (a), (b) or (c) on the worksheet and confirm the transcription
- "Why is a rise in payables a source of cash?"
- "Where else have I made this mistake?"
- "Show me the corrected working"
- "Explain WACC" or "What is free cash flow?"

In a production version this question would go to a real model with the same workspace context attached. The interesting engineering problem is not the model — it is assembling the right context from a term's worth of a student's work before the question is ever sent.`,
  suggestions: [
    'Where else have I made this mistake?',
    'Show me the corrected working',
    'Explain free cash flow',
  ],
}

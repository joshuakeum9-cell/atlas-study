import { describe, expect, it, vi } from 'vitest'
import { regionAnalyses, scriptedReplies } from '@/data/tutorScript'
import { buildContext, normalise, resolveReply, scoreReply, streamTutorReply } from './ai'

const ctx = { courseId: 'algebra1', assignmentId: 'ws5', openDocIds: ['doc-ws5-photo'] }

describe('normalise', () => {
  it('lowercases and strips punctuation', () => {
    expect(normalise('Why does the MINUS go to both?!')).toBe('why does the minus go to both')
  })
})

describe('scoreReply', () => {
  const minusReply = scriptedReplies.find((r) => r.id === 'why-minus-both')!

  it('scores a phrase match above a single word match', () => {
    const phrase = scoreReply('why does the minus go to both terms', minusReply)
    const word = scoreReply('negative', minusReply)
    expect(phrase).toBeGreaterThan(word)
  })

  it('scores an unrelated question at zero', () => {
    expect(scoreReply('what is the capital of France', minusReply)).toBe(0)
  })

  it('scores an empty question at zero', () => {
    expect(scoreReply('   ', minusReply)).toBe(0)
  })
})

describe('resolveReply', () => {
  it('routes a confirmed region straight to its scripted analysis', () => {
    const reply = resolveReply({ question: 'anything at all', regionAnalysisKey: 'part-a', context: ctx })
    expect(reply).toBe(regionAnalyses['part-a'])
  })

  it('matches the sign explanation from a natural question', () => {
    const reply = resolveReply({ question: 'Why does the minus go to both terms?', context: ctx })
    expect(reply.id).toBe('why-minus-both')
  })

  it('matches the pattern reply when asked about repeated mistakes', () => {
    const reply = resolveReply({ question: 'where else have I made this mistake?', context: ctx })
    expect(reply.id).toBe('where-else-mistake')
  })

  it('falls back rather than inventing an answer', () => {
    const reply = resolveReply({ question: 'who won the 1998 world cup', context: ctx })
    expect(reply.id).toBe('fallback')
  })

  it('does not match on a single common word', () => {
    // "the" alone must not be enough to pull a scripted reply.
    const reply = resolveReply({ question: 'the', context: ctx })
    expect(reply.id).toBe('fallback')
  })

  it('always returns something with text', () => {
    for (const question of ['hello', 'like terms', 'check my answer', 'zzzz', '']) {
      const reply = resolveReply({ question, context: ctx })
      expect(reply.text.length).toBeGreaterThan(0)
    }
  })
})

describe('buildContext', () => {
  it('separates open documents from the rest of the course', () => {
    const built = buildContext(ctx)
    expect(built.openDocuments.map((d) => d.id)).toEqual(['doc-ws5-photo'])
    expect(built.relatedDocuments.some((d) => d.id === 'doc-ws5-photo')).toBe(false)
    expect(built.relatedDocuments.length).toBeGreaterThan(0)
  })

  it('collects the known struggle topics for the course', () => {
    expect(buildContext(ctx).knownStruggles).toContain('distributing a negative')
  })
})

describe('streamTutorReply', () => {
  it('streams chunks and finishes with the whole reply', async () => {
    vi.useFakeTimers()
    const chunks: string[] = []
    const onDone = vi.fn()

    streamTutorReply(
      { question: 'why does the minus go to both terms', context: ctx },
      { onChunk: (c) => chunks.push(c), onDone },
    )

    await vi.advanceTimersByTimeAsync(60_000)

    expect(onDone).toHaveBeenCalledTimes(1)
    const reply = onDone.mock.calls[0][0]
    expect(chunks.join('')).toBe(reply.text)
    expect(reply.replyId).toBe('why-minus-both')
    vi.useRealTimers()
  })

  it('stops emitting once cancelled', async () => {
    vi.useFakeTimers()
    const onDone = vi.fn()
    const chunks: string[] = []

    const cancel = streamTutorReply(
      { question: 'show me the whole thing done right', context: ctx },
      { onChunk: (c) => chunks.push(c), onDone },
    )

    await vi.advanceTimersByTimeAsync(1_400)
    const received = chunks.length
    cancel()
    await vi.advanceTimersByTimeAsync(60_000)

    expect(chunks.length).toBe(received)
    expect(onDone).not.toHaveBeenCalled()
    vi.useRealTimers()
  })
})

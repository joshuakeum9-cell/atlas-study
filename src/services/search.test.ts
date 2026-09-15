import { describe, expect, it } from 'vitest'
import { rankDocuments, tokenise } from './search'

describe('tokenise', () => {
  it('drops stopwords and single characters', () => {
    expect(tokenise('find the notes where I struggled with the minus sign')).toEqual([
      'notes',
      'struggled',
      'minus',
      'sign',
    ])
  })

  it('returns nothing for a query made only of stopwords', () => {
    expect(tokenise('what is the')).toEqual([])
  })
})

describe('rankDocuments', () => {
  it('returns nothing for an empty query', () => {
    expect(rankDocuments('   ')).toEqual([])
  })

  it('puts the flagged notes first for the headline demo query', () => {
    const results = rankDocuments('find the notes where I struggled with the minus sign')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].doc.id).toBe('doc-ch2-notes')
    expect(results[0].reasons.some((r) => r.toLowerCase().includes('flagged'))).toBe(true)
  })

  it('demotes clean work when the query is about struggling', () => {
    const results = rankDocuments('where did I struggle')
    const clean = results.find((r) => r.doc.id === 'doc-ws4')
    const flagged = results.find((r) => r.doc.id === 'doc-ch2-notes')
    // Worksheet 4 has no flagged topics, so it must not outrank the notes.
    expect(flagged).toBeDefined()
    if (clean) expect(flagged!.score).toBeGreaterThan(clean.score)
  })

  it('finds the photographed page from a description of it', () => {
    const results = rankDocuments('the page I photographed for worksheet 5')
    expect(results[0].doc.kind).toBe('worksheet-photo')
  })

  it('finds marked work when asked about lost marks', () => {
    const results = rankDocuments('the quiz where I lost marks')
    expect(results[0].doc.id).toBe('doc-quiz2')
  })

  it('expands concepts so a related term still matches', () => {
    // "bracket" never appears verbatim in every tag, but the concept map
    // connects it to the expanding-brackets material.
    const results = rankDocuments('brackets')
    expect(results.map((r) => r.doc.id)).toContain('doc-ch2-notes')
  })

  it('restricts results to a course when the query names one', () => {
    const results = rankDocuments('Algebra I notes')
    expect(results.length).toBeGreaterThan(0)
    expect(results.every((r) => r.doc.courseId === 'algebra1')).toBe(true)
  })

  it('always explains why something matched', () => {
    const results = rankDocuments('expanding brackets')
    expect(results.length).toBeGreaterThan(0)
    for (const result of results) {
      expect(result.reasons.length).toBeGreaterThan(0)
      expect(result.reasons.length).toBeLessThanOrEqual(3)
    }
  })

  it('returns results in descending score order', () => {
    const results = rankDocuments('expanding brackets and solving equations')
    const scores = results.map((r) => r.score)
    expect([...scores].sort((a, b) => b - a)).toEqual(scores)
  })
})

import { describe, expect, it } from 'vitest'
import { rankDocuments, tokenise } from './search'

describe('tokenise', () => {
  it('drops stopwords and single characters', () => {
    expect(tokenise('find the notes where I struggled with working capital')).toEqual([
      'notes',
      'struggled',
      'working',
      'capital',
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
    const results = rankDocuments('find the notes where I struggled with working capital')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0].doc.id).toBe('doc-ch4-notes')
    expect(results[0].reasons.some((r) => r.toLowerCase().includes('flagged'))).toBe(true)
  })

  it('demotes clean work when the query is about struggling', () => {
    const struggling = rankDocuments('where did I struggle')
    const graded = struggling.find((r) => r.doc.id === 'doc-ps3')
    const flagged = struggling.find((r) => r.doc.id === 'doc-ch4-notes')
    // Problem Set 3 has no flagged topics, so it must not outrank the notes.
    expect(flagged).toBeDefined()
    if (graded) expect(flagged!.score).toBeGreaterThan(graded.score)
  })

  it('finds the photographed page from a description of it', () => {
    const results = rankDocuments('the page I photographed for problem set 4')
    expect(results[0].doc.kind).toBe('worksheet-photo')
  })

  it('finds marked work when asked about lost marks', () => {
    const results = rankDocuments('the quiz where I lost marks on ratios')
    expect(results[0].doc.id).toBe('doc-quiz2')
  })

  it('expands concepts so a related term still matches', () => {
    // "payable" is never in the WACC slides, but is in the working capital notes.
    const results = rankDocuments('payables')
    expect(results.map((r) => r.doc.id)).toContain('doc-ch4-notes')
  })

  it('restricts results to a course when the query names one', () => {
    const results = rankDocuments('STA 220 problem set')
    expect(results.length).toBeGreaterThan(0)
    expect(results.every((r) => r.doc.courseId === 'sta220')).toBe(true)
  })

  it('always explains why something matched', () => {
    const results = rankDocuments('cost of capital slides')
    expect(results.length).toBeGreaterThan(0)
    for (const result of results) {
      expect(result.reasons.length).toBeGreaterThan(0)
      expect(result.reasons.length).toBeLessThanOrEqual(3)
    }
  })

  it('returns results in descending score order', () => {
    const results = rankDocuments('working capital and free cash flow')
    const scores = results.map((r) => r.score)
    expect([...scores].sort((a, b) => b - a)).toEqual(scores)
  })
})

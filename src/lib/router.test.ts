import { describe, expect, it } from 'vitest'
import { parseHash, routeHref } from './router'

describe('parseHash', () => {
  it('treats an empty hash as the landing page', () => {
    expect(parseHash('')).toBe('landing')
    expect(parseHash('#')).toBe('landing')
    expect(parseHash('#/')).toBe('landing')
  })

  it('resolves the workspace and insights routes', () => {
    expect(parseHash('#/app')).toBe('workspace')
    expect(parseHash('#/app/insights')).toBe('insights')
  })

  it('tolerates a trailing slash', () => {
    expect(parseHash('#/app/')).toBe('workspace')
    expect(parseHash('#/app/insights/')).toBe('insights')
  })

  it('ignores a query string, which is how share links arrive', () => {
    expect(parseHash('#/app?shared=abc123')).toBe('workspace')
  })

  it('falls back to the landing page for anything unknown', () => {
    expect(parseHash('#/nope')).toBe('landing')
    expect(parseHash('#/app/insights/extra')).toBe('landing')
  })

  it('round-trips every route through its href', () => {
    for (const route of ['landing', 'workspace', 'insights'] as const) {
      expect(parseHash(routeHref(route))).toBe(route)
    }
  })
})

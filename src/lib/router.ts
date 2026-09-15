import { useCallback, useEffect, useState } from 'react'

/**
 * Hash-based routing.
 *
 * GitHub Pages serves static files, so a deep link like /app would 404 on
 * refresh unless the host is configured to rewrite it. Hash routes never hit
 * the server at all, which means every route survives a refresh, a bookmark
 * and a shared link with no server configuration whatsoever.
 */

export type Route = 'landing' | 'workspace' | 'insights'

const ROUTE_PATHS: Record<Route, string> = {
  landing: '#/',
  workspace: '#/app',
  insights: '#/app/insights',
}

export function parseHash(hash: string): Route {
  const clean = hash.replace(/^#/, '').split('?')[0].replace(/\/+$/, '') || '/'
  if (clean === '/app/insights') return 'insights'
  if (clean === '/app') return 'workspace'
  return 'landing'
}

export function useHashRoute(): [Route, (route: Route) => void] {
  const [route, setRoute] = useState<Route>(() =>
    typeof window === 'undefined' ? 'landing' : parseHash(window.location.hash),
  )

  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const navigate = useCallback((next: Route) => {
    const target = ROUTE_PATHS[next]
    if (window.location.hash === target) {
      setRoute(next)
      return
    }
    window.location.hash = target
  }, [])

  return [route, navigate]
}

export const routeHref = (route: Route) => ROUTE_PATHS[route]

/**
 * localStorage with the sharp edges removed.
 *
 * Storage can be unavailable (private windows, blocked site data) or full, and
 * any access can throw. Every call here is guarded so a storage failure can
 * never take the demo down - it just stops remembering.
 */

const PREFIX = 'atlas-study'

export const storageKey = (name: string) => `${PREFIX}/${name}`

export function readJSON<T>(name: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(storageKey(name))
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJSON(name: string, value: unknown): void {
  try {
    window.localStorage.setItem(storageKey(name), JSON.stringify(value))
  } catch {
    // Quota exceeded or storage blocked. The demo carries on in memory.
  }
}

export function clearAll(): void {
  try {
    const doomed: string[] = []
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i)
      if (key && key.startsWith(`${PREFIX}/`)) doomed.push(key)
    }
    doomed.forEach((k) => window.localStorage.removeItem(k))
  } catch {
    // Nothing to do.
  }
}

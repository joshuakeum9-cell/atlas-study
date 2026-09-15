/** Small helpers shared by the mock services. */

/** Simulated network latency. Prototypes that answer instantly feel fake. */
export function delay(min: number, max = min): Promise<void> {
  const ms = min + Math.random() * Math.max(0, max - min)
  return new Promise((resolve) => setTimeout(resolve, ms))
}

let counter = 0
/** Collision-free enough for a single browser session. */
export function uid(prefix = 'id'): string {
  counter += 1
  return `${prefix}-${Date.now().toString(36)}-${counter.toString(36)}`
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export function formatClock(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

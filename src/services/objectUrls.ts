/**
 * Object URLs for locally imported images.
 *
 * These live only for the browser session - an object URL cannot be persisted
 * to localStorage and is invalid after a refresh. The document card handles the
 * missing-preview case explicitly rather than showing a broken image.
 */
const urls = new Map<string, string>()

export function setObjectUrl(docId: string, url: string) {
  const existing = urls.get(docId)
  if (existing && existing !== url) URL.revokeObjectURL(existing)
  urls.set(docId, url)
}

export function getObjectUrl(docId: string): string | undefined {
  return urls.get(docId)
}

export function revokeObjectUrl(docId: string) {
  const existing = urls.get(docId)
  if (existing) URL.revokeObjectURL(existing)
  urls.delete(docId)
}

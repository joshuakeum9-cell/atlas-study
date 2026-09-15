import { delay, uid } from './util'

/**
 * MOCK SHARING
 * ============
 * Simulated. No link is created on any server and nothing is published. The
 * URL below is generated locally and points at this same static demo, so it is
 * safe to copy and paste - it simply reopens the prototype.
 *
 * REAL IMPLEMENTATION would create a share record and return a signed URL:
 *
 *   const res = await fetch(`${import.meta.env.VITE_STORAGE_API_BASE}/shares`, {
 *     method: 'POST',
 *     body: JSON.stringify({ resourceId, access, expiresIn }),
 *   })
 *   const { url } = await res.json()
 *
 * The access model sketched here (view / comment / edit, plus an expiry) is the
 * minimum a real version would need, and it is worth designing in the prototype
 * because it changes the dialog's layout.
 */

export type ShareAccess = 'view' | 'comment' | 'edit'
export type ShareTarget = 'workspace' | 'assignment' | 'document'

export interface ShareLink {
  id: string
  url: string
  access: ShareAccess
  target: ShareTarget
  label: string
  createdAt: string
  expiresLabel: string
}

export const accessLabels: Record<ShareAccess, { title: string; detail: string }> = {
  view: { title: 'Can view', detail: 'Read the documents and the tutor conversations' },
  comment: { title: 'Can comment', detail: 'Read everything and leave notes on the work' },
  edit: { title: 'Can edit', detail: 'Add files, edit notes and ask the tutor in this workspace' },
}

export async function createShareLink(opts: {
  target: ShareTarget
  label: string
  access: ShareAccess
  expiresLabel?: string
}): Promise<ShareLink> {
  await delay(450, 800)
  const token = Math.random().toString(36).slice(2, 10)
  // Points back at this demo. Nothing is uploaded and no server is involved.
  const base = typeof window !== 'undefined' ? window.location.href.split('#')[0] : 'https://example.com/'
  return {
    id: uid('share'),
    url: `${base}#/app?shared=${token}`,
    access: opts.access,
    target: opts.target,
    label: opts.label,
    createdAt: new Date().toISOString(),
    expiresLabel: opts.expiresLabel ?? 'No expiry',
  }
}

/**
 * Copies text to the clipboard, with a fallback for browsers that block the
 * async Clipboard API outside a secure context.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Fall through to the legacy path below.
  }

  try {
    const el = document.createElement('textarea')
    el.value = text
    el.setAttribute('readonly', '')
    el.style.position = 'fixed'
    el.style.opacity = '0'
    document.body.appendChild(el)
    el.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(el)
    return ok
  } catch {
    return false
  }
}

import type { StudyDoc } from '@/types'
import { delay, uid } from './util'

/**
 * MOCK FILE IMPORT
 * ================
 * Simulated, and deliberately so. Files chosen through the importer are read
 * in the browser with `FileReader` and never leave the machine. There is no
 * upload, no storage bucket and no server of any kind.
 *
 * REAL IMPLEMENTATION would request a pre-signed URL and upload directly:
 *
 *   const { uploadUrl, id } = await fetch(`${VITE_STORAGE_API_BASE}/uploads`, ...)
 *   await fetch(uploadUrl, { method: 'PUT', body: file })
 *   // then a document-understanding pass to produce the summary and tags
 *
 * The `summary` and `tags` on an imported document are produced here by a
 * trivial heuristic on the filename. In a real product that is the job of a
 * document-understanding pass, which is also what makes natural-language
 * search work later.
 */

export interface ImportedFile {
  doc: StudyDoc
  /** Object URL for previewing images locally. Revoke when the doc is removed. */
  objectUrl?: string
}

export const ACCEPTED_TYPES = '.pdf,.png,.jpg,.jpeg,.webp,.heic,.txt,.md,.docx,.xlsx'
const MAX_BYTES = 25 * 1024 * 1024

export class FileTooLargeError extends Error {
  constructor() {
    super('That file is larger than 25 MB. This prototype keeps everything in the browser, so it caps the size.')
    this.name = 'FileTooLargeError'
  }
}

function kindFor(file: File): StudyDoc['kind'] {
  if (file.type.startsWith('image/')) return 'worksheet-photo'
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) return 'pdf'
  return 'upload'
}

function sizeLabel(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Stand-in for a document-understanding pass. */
function describe(file: File, kind: StudyDoc['kind']): { summary: string; tags: string[] } {
  const stem = file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim()
  const words = stem.toLowerCase().split(/\s+/).filter((w) => w.length > 3)
  const tags = [...new Set(words)].slice(0, 4)
  const noun =
    kind === 'worksheet-photo' ? 'photograph' : kind === 'pdf' ? 'PDF' : 'file'
  return {
    summary: `Imported ${noun}: ${stem}. In a production version, a document-understanding pass would read this and write a real summary here, which is what makes it findable by description later. Nothing was uploaded - this file stayed in your browser.`,
    tags: tags.length ? tags : ['imported'],
  }
}

export async function importFile(
  file: File,
  target: { courseId: string; assignmentId?: string },
): Promise<ImportedFile> {
  if (file.size > MAX_BYTES) throw new FileTooLargeError()

  // Simulates the read-and-analyse step so the UI's progress state is real.
  await delay(700, 1300)

  const kind = kindFor(file)
  const { summary, tags } = describe(file, kind)
  const objectUrl = file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined

  const doc: StudyDoc = {
    id: uid('doc-user'),
    courseId: target.courseId,
    assignmentId: target.assignmentId,
    title: file.name,
    kind,
    pages: 1,
    updated: 'Added just now',
    sizeLabel: `${kind === 'pdf' ? 'PDF' : kind === 'worksheet-photo' ? 'Image' : 'File'} - ${sizeLabel(file.size)}`,
    tags,
    summary,
    chapterIds: [],
    struggleTopics: [],
    userAdded: true,
  }

  return { doc, objectUrl }
}

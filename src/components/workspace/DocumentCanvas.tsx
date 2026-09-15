import { Camera, FileText, Image as ImageIcon, Presentation, Share2, StickyNote, Upload } from 'lucide-react'
import type { Box, StudyDoc } from '@/types'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { getObjectUrl } from '@/services/objectUrls'
import { WorksheetViewer } from './WorksheetViewer'
import { DocReader } from './DocReader'

const KIND_ICON = {
  'worksheet-photo': Camera,
  pdf: FileText,
  note: StickyNote,
  slides: Presentation,
  upload: ImageIcon,
} as const

interface DocumentCanvasProps {
  docs: StudyDoc[]
  activeDoc: StudyDoc | undefined
  onSelectDoc: (docId: string) => void
  onImport: () => void
  onShareDoc: (doc: StudyDoc) => void
  /** Worksheet props, forwarded when the active document is the photographed page. */
  confirmedRegions: Record<string, string>
  onSelectRegion: (box: Box, viaKeyboard?: boolean) => void
  recognising: boolean
  activeRegionId: string | null
}

/** Preview for a file the user imported during the demo. */
function ImportedDocView({ doc }: { doc: StudyDoc }) {
  const url = getObjectUrl(doc.id)
  return (
    <div className="scrollbar-slim h-full overflow-y-auto bg-navy-100/60 p-4 sm:p-6">
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="rounded-xl bg-white p-4 shadow-panel ring-1 ring-navy-100">
          <p className="text-[13.5px] leading-relaxed text-navy-700">{doc.summary}</p>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-lift ring-1 ring-navy-900/10">
          {url ? (
            <img src={url} alt={doc.title} className="mx-auto block max-h-[70vh] w-auto max-w-full" />
          ) : (
            <div className="px-6 py-14 text-center">
              <FileText className="mx-auto h-9 w-9 text-navy-300" aria-hidden="true" />
              <p className="mt-3 text-[14px] font-medium text-navy-800">{doc.title}</p>
              <p className="mx-auto mt-2 max-w-md text-[13px] leading-relaxed text-navy-600">
                The file details are remembered, but the preview is gone. Imported files are held in
                the browser for the session only and are never uploaded, so a refresh clears the
                image itself.
              </p>
            </div>
          )}
        </div>

        <p className="pb-2 text-center text-[12px] text-navy-500">
          {doc.sizeLabel} - {doc.updated} - stayed on your device
        </p>
      </div>
    </div>
  )
}

export function DocumentCanvas({
  docs,
  activeDoc,
  onSelectDoc,
  onImport,
  onShareDoc,
  confirmedRegions,
  onSelectRegion,
  recognising,
  activeRegionId,
}: DocumentCanvasProps) {
  return (
    <section
      className="flex h-full min-h-0 min-w-0 flex-col bg-white"
      aria-label="Document workspace"
    >
      {/* Document tabs */}
      <div className="flex shrink-0 items-center gap-1 border-b border-navy-100 bg-navy-50/60 px-2 py-1.5">
        <div
          className="scrollbar-slim flex min-w-0 flex-1 gap-1 overflow-x-auto"
          role="tablist"
          aria-label="Open documents"
        >
          {docs.map((doc) => {
            const Icon = KIND_ICON[doc.kind] ?? FileText
            const active = doc.id === activeDoc?.id
            return (
              <button
                key={doc.id}
                role="tab"
                aria-selected={active}
                onClick={() => onSelectDoc(doc.id)}
                className={cn(
                  'inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12.5px] font-medium transition-colors',
                  active
                    ? 'bg-white text-navy-900 shadow-sm ring-1 ring-navy-200'
                    : 'text-navy-600 hover:bg-white/70 hover:text-navy-900',
                )}
              >
                <Icon className={cn('h-3.5 w-3.5', active ? 'text-brand-700' : 'text-navy-400')} aria-hidden="true" />
                <span className="max-w-[10rem] truncate sm:max-w-[14rem]">{doc.title}</span>
              </button>
            )
          })}
        </div>

        <div className="flex shrink-0 items-center gap-1 pl-1">
          <Button size="sm" variant="ghost" onClick={onImport}>
            <Upload className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Import</span>
          </Button>
          {activeDoc ? (
            <Button size="sm" variant="ghost" onClick={() => onShareDoc(activeDoc)}>
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          ) : null}
        </div>
      </div>

      {/* Body */}
      <div className="min-h-0 flex-1">
        {!activeDoc ? (
          <div className="grid h-full place-items-center p-8 text-center">
            <div>
              <FileText className="mx-auto h-8 w-8 text-navy-300" aria-hidden="true" />
              <p className="mt-3 text-[14px] font-medium text-navy-800">Nothing open</p>
              <p className="mt-1 text-[13px] text-navy-600">
                Pick a document from the sidebar, or import one.
              </p>
              <Button className="mt-4" variant="secondary" onClick={onImport}>
                <Upload className="h-3.5 w-3.5" />
                Import a file
              </Button>
            </div>
          </div>
        ) : activeDoc.worksheetId ? (
          <WorksheetViewer
            confirmed={confirmedRegions}
            onSelect={onSelectRegion}
            recognising={recognising}
            activeRegionId={activeRegionId}
          />
        ) : activeDoc.userAdded ? (
          <ImportedDocView doc={activeDoc} />
        ) : (
          <DocReader doc={activeDoc} />
        )}
      </div>
    </section>
  )
}

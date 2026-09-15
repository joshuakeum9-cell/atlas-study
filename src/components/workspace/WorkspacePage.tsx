import { useCallback, useEffect, useMemo, useState } from 'react'
import { FileText, FolderOpen, Home, LineChart, Share2, Sparkles } from 'lucide-react'
import { assignmentById, courseById } from '@/data/courses'
import { documents } from '@/data/documents'
import { worksheet } from '@/data/worksheet'
import { recogniseSelection, type OcrResult } from '@/services/ocr'
import type { Box, SearchResult } from '@/types'
import { cn } from '@/lib/cn'
import { useStore } from '@/state/store'
import { useTutorChat } from '@/hooks/useTutorChat'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/layout/Logo'
import { PrototypeBanner } from '@/components/layout/PrototypeBanner'
import { Sidebar } from './Sidebar'
import { SearchBar } from './SearchBar'
import { DocumentCanvas } from './DocumentCanvas'
import { TutorPanel, type PendingContext } from './TutorPanel'
import { TranscriptionDialog } from './TranscriptionDialog'
import { ShareDialog, type ShareRequest } from './ShareDialog'
import { ImportDialog } from './ImportDialog'
import { DemoGuide } from './DemoGuide'
import { InsightsPage } from './InsightsPage'

type Pane = 'files' | 'doc' | 'tutor'

const PANES: { id: Pane; label: string; icon: typeof Home }[] = [
  { id: 'files', label: 'Files', icon: FolderOpen },
  { id: 'doc', label: 'Document', icon: FileText },
  { id: 'tutor', label: 'Tutor', icon: Sparkles },
]

interface WorkspacePageProps {
  onExit: () => void
  showInsights: boolean
  onOpenInsights: () => void
  onCloseInsights: () => void
}

export function WorkspacePage({
  onExit,
  showInsights,
  onOpenInsights,
  onCloseInsights,
}: WorkspacePageProps) {
  const { state, dispatch, markExplored, toast } = useStore()
  const chat = useTutorChat()

  const [pane, setPane] = useState<Pane>('doc')
  const [recognising, setRecognising] = useState(false)
  const [activeRegionId, setActiveRegionId] = useState<string | null>(null)
  const [ocrResult, setOcrResult] = useState<OcrResult | null>(null)
  const [pendingContext, setPendingContext] = useState<PendingContext | null>(null)
  const [shareRequest, setShareRequest] = useState<ShareRequest | null>(null)
  const [importOpen, setImportOpen] = useState(false)

  const course = courseById(state.courseId)
  const assignment = assignmentById(state.assignmentId)

  const allDocs = useMemo(() => [...state.userDocs, ...documents], [state.userDocs])

  /** Documents shown as tabs: the assignment's own, plus anything imported into it. */
  const openDocs = useMemo(() => {
    const fromAssignment = (assignment?.docIds ?? [])
      .map((id) => allDocs.find((d) => d.id === id))
      .filter((d): d is NonNullable<typeof d> => Boolean(d))
    const imported = state.userDocs.filter((d) => d.assignmentId === state.assignmentId)
    const merged = [...imported, ...fromAssignment]
    // A document opened from search or a citation may live outside this assignment.
    const active = allDocs.find((d) => d.id === state.activeDocId)
    if (active && !merged.some((d) => d.id === active.id)) merged.unshift(active)
    return merged
  }, [assignment, allDocs, state.userDocs, state.assignmentId, state.activeDocId])

  const activeDoc = allDocs.find((d) => d.id === state.activeDocId)

  /** Opens a document, switching assignment first when it belongs to another one. */
  const openDoc = useCallback(
    (docId: string) => {
      const doc = allDocs.find((d) => d.id === docId)
      if (!doc) return
      if (doc.assignmentId && doc.assignmentId !== state.assignmentId) {
        dispatch({ type: 'select-assignment', assignmentId: doc.assignmentId })
      }
      dispatch({ type: 'select-doc', docId })
      onCloseInsights()
      setPane('doc')
    },
    [allDocs, dispatch, onCloseInsights, state.assignmentId],
  )

  /** A drag on the worksheet, or a keyboard region activation. */
  const handleSelectRegion = useCallback(
    async (box: Box, viaKeyboard = false) => {
      if (recognising) return
      markExplored('select-region')
      setRecognising(true)

      // Show the scanning overlay on whichever region the selection landed in.
      const guess = worksheet.regions.find(
        (r) =>
          box.x < r.box.x + r.box.w &&
          box.x + box.w > r.box.x &&
          box.y < r.box.y + r.box.h &&
          box.y + box.h > r.box.y,
      )
      setActiveRegionId(guess?.id ?? null)

      const result = await recogniseSelection(box)
      setRecognising(false)

      if (!result) {
        setActiveRegionId(null)
        toast({
          tone: 'warn',
          title: 'Nothing readable in that selection',
          detail: viaKeyboard
            ? 'Try one of the region buttons below the page.'
            : 'Draw a box around one of the handwritten answers, or use the buttons below the page.',
        })
        return
      }

      setActiveRegionId(result.regionId)
      setOcrResult(result)
    },
    [markExplored, recognising, toast],
  )

  /** The student accepted (or corrected) the transcription. */
  const handleConfirmTranscription = useCallback(
    (transcript: string, wasEdited: boolean) => {
      if (!ocrResult) return
      dispatch({ type: 'confirm-region', regionId: ocrResult.regionId, transcript })
      markExplored('confirm-transcription')

      const context: PendingContext = {
        partLabel: ocrResult.partLabel,
        transcript,
        docTitle: activeDoc?.title ?? worksheet.title,
        analysisKey: ocrResult.analysisKey,
      }
      setPendingContext(context)
      setOcrResult(null)
      setActiveRegionId(null)
      setPane('tutor')

      chat.ask(
        wasEdited
          ? `I corrected the transcription. Can you look at ${ocrResult.partLabel}?`
          : `Can you look at my ${ocrResult.partLabel} and tell me if it is right?`,
        {
          context: {
            partLabel: context.partLabel,
            transcript: context.transcript,
            docTitle: context.docTitle,
          },
          regionAnalysisKey: ocrResult.analysisKey,
        },
      )
      setPendingContext(null)

      if (wasEdited) {
        toast({
          tone: 'success',
          title: 'Correction saved with the page',
          detail: 'The tutor is working from what you actually wrote.',
        })
      }
    },
    [activeDoc?.title, chat, dispatch, markExplored, ocrResult, toast],
  )

  const askFromAnywhere = useCallback(
    (question: string) => {
      onCloseInsights()
      setPane('tutor')
      chat.ask(question)
    },
    [chat, onCloseInsights],
  )

  const handleSearchResult = useCallback(
    (result: SearchResult) => {
      openDoc(result.docId)
      toast({
        tone: 'info',
        title: 'Opened from search',
        detail: result.reasons[0] ?? 'Matched your description.',
      })
    },
    [openDoc, toast],
  )

  const resetDemo = useCallback(() => {
    dispatch({ type: 'reset-demo' })
    setPendingContext(null)
    setOcrResult(null)
    setPane('doc')
    onCloseInsights()
    toast({ tone: 'info', title: 'Demo reset', detail: 'Everything is back to its starting state.' })
  }, [dispatch, onCloseInsights, toast])

  // Mark insights as explored whenever the page is opened.
  useEffect(() => {
    if (showInsights) markExplored('insights')
  }, [showInsights, markExplored])

  return (
    // `overflow-clip` rather than `overflow-hidden`: hidden still creates a
    // scroll container, so focusing a control that sits below the fold scrolls
    // the entire app shell and strands the top bar off-screen. Clip cannot scroll.
    <div className="flex h-dvh flex-col overflow-clip bg-white">
      <PrototypeBanner className="shrink-0" />

      {/* Top bar */}
      <header className="z-30 flex shrink-0 flex-wrap items-center gap-2 border-b border-navy-100 bg-white px-3 py-2">
        <button
          onClick={onExit}
          className="flex shrink-0 items-center gap-2 rounded-lg px-1 py-1 transition-colors hover:bg-navy-50"
          title="Back to the product overview"
        >
          <Logo showWordmark={false} />
          <span className="hidden text-[14px] font-semibold tracking-tight text-navy-900 sm:inline">
            Atlas
          </span>
        </button>

        <div className="order-3 w-full min-w-0 sm:order-none sm:w-auto sm:flex-1 sm:max-w-xl">
          <SearchBar onOpenResult={handleSearchResult} />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          <DemoGuide />
          <Button
            size="sm"
            variant={showInsights ? 'subtle' : 'ghost'}
            onClick={showInsights ? onCloseInsights : onOpenInsights}
          >
            <LineChart className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Insights</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() =>
              setShareRequest({
                target: 'workspace',
                label: `${course?.code ?? ''} - ${assignment?.title ?? 'Workspace'}`,
              })
            }
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Share</span>
          </Button>
          <Button size="sm" variant="ghost" onClick={onExit} className="hidden sm:inline-flex">
            <Home className="h-3.5 w-3.5" />
            <span className="hidden lg:inline">Overview</span>
          </Button>
        </div>
      </header>

      {/* Pane switcher, below the three-column breakpoint */}
      {!showInsights ? (
        <div className="flex shrink-0 gap-1 border-b border-navy-100 bg-navy-50/70 px-2 py-1.5 lg:hidden">
          {PANES.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setPane(id)}
              aria-current={pane === id ? 'page' : undefined}
              className={cn(
                'inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[12.5px] font-medium transition-colors',
                pane === id
                  ? 'bg-white text-navy-900 shadow-sm ring-1 ring-navy-200'
                  : 'text-navy-600 hover:bg-white/70',
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      ) : null}

      {/* Body */}
      {showInsights ? (
        <div className="min-h-0 flex-1">
          <InsightsPage onBack={onCloseInsights} onOpenDoc={openDoc} onAskTutor={askFromAnywhere} />
        </div>
      ) : (
        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)_320px] xl:grid-cols-[250px_minmax(0,1fr)_380px]">
          <div className={cn('min-h-0', pane === 'files' ? 'block' : 'hidden', 'lg:block')}>
            <Sidebar
              onOpenInsights={onOpenInsights}
              onOpenShared={(name) => setShareRequest({ target: 'workspace', label: name })}
              onImport={() => setImportOpen(true)}
              onResetDemo={resetDemo}
            />
          </div>

          <div className={cn('min-h-0', pane === 'doc' ? 'flex' : 'hidden', 'lg:flex')}>
            <div className="flex min-h-0 w-full flex-col">
              <DocumentCanvas
                docs={openDocs}
                activeDoc={activeDoc}
                onSelectDoc={(docId) => dispatch({ type: 'select-doc', docId })}
                onImport={() => setImportOpen(true)}
                onShareDoc={(doc) => setShareRequest({ target: 'document', label: doc.title })}
                confirmedRegions={state.confirmedRegions}
                onSelectRegion={handleSelectRegion}
                recognising={recognising}
                activeRegionId={activeRegionId}
              />
            </div>
          </div>

          <div className={cn('min-h-0', pane === 'tutor' ? 'flex' : 'hidden', 'lg:flex')}>
            <div className="min-h-0 w-full">
              <TutorPanel
                chat={chat}
                pendingContext={pendingContext}
                onClearPendingContext={() => setPendingContext(null)}
                onOpenCitation={openDoc}
                assignmentTitle={assignment?.title ?? 'Workspace'}
                courseCode={course?.code ?? ''}
                contextDocTitles={openDocs.map((d) => d.title)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <TranscriptionDialog
        open={Boolean(ocrResult)}
        result={ocrResult}
        onCancel={() => {
          setOcrResult(null)
          setActiveRegionId(null)
        }}
        onConfirm={handleConfirmTranscription}
      />
      <ShareDialog request={shareRequest} onClose={() => setShareRequest(null)} />
      <ImportDialog
        open={importOpen}
        onClose={() => setImportOpen(false)}
        onUseSample={() => {
          dispatch({ type: 'select-assignment', assignmentId: 'ps4' })
          dispatch({ type: 'select-doc', docId: 'doc-ps4-photo' })
          onCloseInsights()
          setPane('doc')
          toast({
            tone: 'info',
            title: 'Sample worksheet open',
            detail: 'Drag a box around any handwritten answer to see it read back.',
          })
        }}
      />
    </div>
  )
}

import { useRef, useState } from 'react'
import { Camera, FileUp, HardDrive, Loader2, ShieldCheck } from 'lucide-react'
import { ACCEPTED_TYPES, FileTooLargeError, importFile } from '@/services/files'
import { setObjectUrl } from '@/services/objectUrls'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useStore } from '@/state/store'

interface ImportDialogProps {
  open: boolean
  onClose: () => void
  /** Opens the sample photographed worksheet instead of importing. */
  onUseSample: () => void
}

export function ImportDialog({ open, onClose, onUseSample }: ImportDialogProps) {
  const { state, dispatch, markExplored, toast } = useStore()
  const [dragging, setDragging] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0]
    if (!file) return
    setError(null)
    setBusy(true)
    try {
      const { doc, objectUrl } = await importFile(file, {
        courseId: state.courseId,
        assignmentId: state.assignmentId,
      })
      if (objectUrl) setObjectUrl(doc.id, objectUrl)
      dispatch({ type: 'add-user-doc', doc })
      markExplored('import')
      toast({
        tone: 'success',
        title: 'Added to this assignment',
        detail: `${file.name} stayed on your device. Nothing was uploaded.`,
      })
      onClose()
    } catch (e) {
      setError(
        e instanceof FileTooLargeError
          ? e.message
          : 'That file could not be read in the browser. Try a PDF or an image.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Import into this assignment"
      description="Files are read in your browser and never leave your device."
      size="md"
      footer={
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      }
    >
      <div className="space-y-4">
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            void handleFiles(e.dataTransfer.files)
          }}
          className={cn(
            'rounded-xl border-2 border-dashed p-6 text-center transition-colors',
            dragging ? 'border-brand-500 bg-brand-50' : 'border-navy-200 bg-navy-50/60',
          )}
        >
          {busy ? (
            <div className="py-2">
              <Loader2 className="mx-auto h-7 w-7 animate-spin text-brand-600" aria-hidden="true" />
              <p className="mt-3 text-[13.5px] font-medium text-navy-800">Reading the file</p>
              <p className="mt-1 text-[12.5px] text-navy-600">
                A real version would run a document-understanding pass here.
              </p>
            </div>
          ) : (
            <>
              <FileUp className="mx-auto h-7 w-7 text-navy-400" aria-hidden="true" />
              <p className="mt-3 text-[13.5px] font-medium text-navy-800">
                Drop a file here, or choose one
              </p>
              <p className="mx-auto mt-1 max-w-xs text-[12.5px] leading-relaxed text-navy-600">
                PDFs, photos of paper work, images and documents. Up to 25 MB.
              </p>
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_TYPES}
                className="sr-only"
                onChange={(e) => {
                  void handleFiles(e.target.files)
                  e.target.value = ''
                }}
              />
              <Button className="mt-3.5" variant="secondary" onClick={() => inputRef.current?.click()}>
                <HardDrive className="h-3.5 w-3.5" />
                Choose a file
              </Button>
            </>
          )}
        </div>

        {error ? (
          <p role="alert" className="rounded-lg bg-rose-50 p-2.5 text-[12.5px] leading-relaxed text-rose-800 ring-1 ring-inset ring-rose-200">
            {error}
          </p>
        ) : null}

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-navy-100" />
          <span className="text-[11.5px] font-medium uppercase tracking-wide text-navy-400">or</span>
          <span className="h-px flex-1 bg-navy-100" />
        </div>

        <button
          type="button"
          onClick={() => {
            onUseSample()
            onClose()
          }}
          className="flex w-full items-start gap-3 rounded-xl bg-white p-3.5 text-left ring-1 ring-navy-200 transition-colors hover:bg-brand-50 hover:ring-brand-300"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-navy-900">
            <Camera className="h-4.5 w-4.5 text-white" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-[13.5px] font-semibold text-navy-900">
              Use the sample photographed worksheet
            </span>
            <span className="mt-0.5 block text-[12.5px] leading-relaxed text-navy-600">
              A photo of a handwritten Problem Set 4 page, already in the workspace. This is the one
              to try if you want to see the circle-and-ask flow.
            </span>
          </span>
        </button>

        <p className="flex items-start gap-2 rounded-lg bg-emerald-50 p-2.5 text-[12px] leading-relaxed text-emerald-900 ring-1 ring-inset ring-emerald-200">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          There is no upload endpoint in this prototype. Anything you choose is read locally with
          the browser FileReader and held in memory for this session only.
        </p>
      </div>
    </Modal>
  )
}

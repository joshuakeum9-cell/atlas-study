import { useEffect, useState } from 'react'
import { Check, Copy, Link2, Lock, Users } from 'lucide-react'
import {
  accessLabels,
  copyToClipboard,
  createShareLink,
  type ShareAccess,
  type ShareLink,
  type ShareTarget,
} from '@/services/share'
import { sharedWorkspaces } from '@/data/insights'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { SimulatedTag } from '@/components/ui/Badge'
import { useStore } from '@/state/store'

export interface ShareRequest {
  target: ShareTarget
  label: string
}

interface ShareDialogProps {
  request: ShareRequest | null
  onClose: () => void
}

const TARGET_NOUN: Record<ShareTarget, string> = {
  workspace: 'workspace',
  assignment: 'assignment',
  document: 'document',
}

export function ShareDialog({ request, onClose }: ShareDialogProps) {
  const { dispatch, markExplored, toast } = useStore()
  const [access, setAccess] = useState<ShareAccess>('view')
  const [link, setLink] = useState<ShareLink | null>(null)
  const [creating, setCreating] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (request) {
      setLink(null)
      setAccess('view')
      setCopied(false)
    }
  }, [request])

  if (!request) return null

  const people = sharedWorkspaces[0].members

  const create = async () => {
    setCreating(true)
    const created = await createShareLink({ target: request.target, label: request.label, access })
    setLink(created)
    setCreating(false)
    dispatch({ type: 'record-share' })
    markExplored('share')
  }

  const copy = async () => {
    if (!link) return
    const ok = await copyToClipboard(link.url)
    setCopied(ok)
    toast(
      ok
        ? {
            tone: 'success',
            title: 'Link copied',
            detail: 'It points back at this demo - nothing was uploaded anywhere.',
          }
        : {
            tone: 'warn',
            title: 'Could not reach the clipboard',
            detail: 'Your browser blocked it. Select the link and copy it manually.',
          },
    )
    if (ok) setTimeout(() => setCopied(false), 2400)
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={`Share this ${TARGET_NOUN[request.target]}`}
      description={request.label}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Done
          </Button>
          {!link ? (
            <Button variant="primary" loading={creating} onClick={create}>
              {creating ? 'Creating link' : 'Create share link'}
            </Button>
          ) : (
            <Button variant="primary" onClick={copy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy link'}
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-5">
        <fieldset>
          <legend className="text-[12px] font-semibold uppercase tracking-wide text-navy-500">
            Anyone with the link
          </legend>
          <div className="mt-2 space-y-1.5">
            {(Object.keys(accessLabels) as ShareAccess[]).map((key) => {
              const option = accessLabels[key]
              const selected = access === key
              return (
                <label
                  key={key}
                  className={cn(
                    'flex cursor-pointer items-start gap-2.5 rounded-lg p-2.5 ring-1 ring-inset transition-colors',
                    selected ? 'bg-brand-50 ring-brand-300' : 'bg-white ring-navy-200 hover:bg-navy-50',
                  )}
                >
                  <input
                    type="radio"
                    name="share-access"
                    value={key}
                    checked={selected}
                    onChange={() => {
                      setAccess(key)
                      setLink(null)
                    }}
                    className="mt-0.5 h-4 w-4 accent-brand-700"
                  />
                  <span>
                    <span className="block text-[13.5px] font-medium text-navy-900">{option.title}</span>
                    <span className="block text-[12.5px] leading-relaxed text-navy-600">{option.detail}</span>
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>

        {link ? (
          <div className="animate-fade-up">
            <p className="mb-1.5 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wide text-navy-500">
              <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
              Share link
              <SimulatedTag label="Simulated" className="ml-auto" />
            </p>
            <div className="flex items-center gap-2 rounded-lg bg-navy-50 p-2 ring-1 ring-inset ring-navy-200">
              <input
                readOnly
                value={link.url}
                aria-label="Share link"
                onFocus={(e) => e.currentTarget.select()}
                className="min-w-0 flex-1 bg-transparent font-mono text-[12px] text-navy-800 outline-none"
              />
              <Button size="sm" variant="secondary" onClick={copy}>
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3 w-3" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-navy-500">
              {accessLabels[access].title} - {link.expiresLabel}. This prototype has no server, so
              the link simply reopens the demo.
            </p>
          </div>
        ) : null}

        {request.target === 'workspace' ? (
          <div>
            <p className="mb-2 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wide text-navy-500">
              <Users className="h-3.5 w-3.5" aria-hidden="true" />
              People with access
            </p>
            <ul className="space-y-1.5">
              {people.map((person) => (
                <li key={person.name} className="flex items-center gap-2.5">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-navy-900 text-[11px] font-semibold text-white">
                    {person.initials}
                  </span>
                  <span className="flex-1 text-[13px] text-navy-800">{person.name}</span>
                  <span className="text-[12px] text-navy-500">{person.role}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <p className="flex items-start gap-2 rounded-lg bg-navy-50 p-2.5 text-[12px] leading-relaxed text-navy-600">
          <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-navy-400" aria-hidden="true" />
          Sharing is simulated. No files are uploaded, no link is registered anywhere, and no one is
          notified.
        </p>
      </div>
    </Modal>
  )
}

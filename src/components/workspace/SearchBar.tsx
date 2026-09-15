import { useCallback, useEffect, useRef, useState } from 'react'
import { Camera, CornerDownLeft, FileText, Presentation, Search, StickyNote, X } from 'lucide-react'
import { searchDocuments, searchExamples } from '@/services/search'
import type { SearchResult } from '@/types'
import { cn } from '@/lib/cn'
import { SimulatedTag } from '@/components/ui/Badge'
import { useStore } from '@/state/store'

const KIND_ICON = {
  'worksheet-photo': Camera,
  pdf: FileText,
  note: StickyNote,
  slides: Presentation,
  upload: FileText,
} as const

function ResultSkeleton() {
  return (
    <div className="space-y-2 px-3 py-2.5">
      <div className="skeleton h-3 w-1/2 rounded-full" />
      <div className="skeleton h-2.5 w-4/5 rounded-full" />
      <div className="skeleton h-2.5 w-1/3 rounded-full" />
    </div>
  )
}

export function SearchBar({ onOpenResult }: { onOpenResult: (result: SearchResult) => void }) {
  const { state, dispatch, markExplored } = useStore()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[] | null>(null)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Cmd/Ctrl+K focuses search from anywhere in the workspace.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Click outside closes the panel.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const runSearch = useCallback(
    async (q: string) => {
      const trimmed = q.trim()
      if (!trimmed) return
      setLoading(true)
      setResults(null)
      setActiveIndex(-1)
      setOpen(true)
      dispatch({ type: 'add-search', query: trimmed })
      markExplored('search')
      const found = await searchDocuments(trimmed)
      setResults(found)
      setLoading(false)
    },
    [dispatch, markExplored],
  )

  const choose = (result: SearchResult) => {
    onOpenResult(result)
    setOpen(false)
    setQuery('')
    setResults(null)
    inputRef.current?.blur()
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (results && activeIndex >= 0 && results[activeIndex]) choose(results[activeIndex])
      else void runSearch(query)
      return
    }
    if (e.key === 'Escape') {
      setOpen(false)
      return
    }
    if (!results?.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1))
    }
  }

  const showEmptyState = open && !loading && results === null

  return (
    <div ref={containerRef} className="relative min-w-0 flex-1">
      <div
        className={cn(
          'flex h-9 items-center gap-2 rounded-lg bg-white px-2.5 ring-1 transition-shadow',
          open ? 'ring-2 ring-brand-600' : 'ring-navy-200 hover:ring-navy-300',
        )}
      >
        <Search className="h-4 w-4 shrink-0 text-navy-400" aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Describe what you are looking for..."
          aria-label="Search your workspace by description"
          aria-expanded={open}
          aria-controls="search-results"
          role="combobox"
          className="min-w-0 flex-1 bg-transparent text-[13.5px] text-navy-900 outline-none placeholder:text-navy-400"
        />
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setResults(null)
              inputRef.current?.focus()
            }}
            aria-label="Clear search"
            className="rounded p-0.5 text-navy-400 transition-colors hover:bg-navy-100 hover:text-navy-700"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          <kbd className="hidden shrink-0 rounded border border-navy-200 bg-navy-50 px-1.5 py-0.5 text-[10.5px] font-medium text-navy-500 sm:block">
            Ctrl K
          </kbd>
        )}
      </div>

      {open ? (
        <div
          id="search-results"
          className="absolute left-0 right-0 top-11 z-40 max-h-[70vh] animate-fade-up overflow-hidden rounded-xl bg-white shadow-lift ring-1 ring-navy-200"
        >
          <div className="scrollbar-slim max-h-[70vh] overflow-y-auto">
            {showEmptyState ? (
              <div className="p-3">
                {state.recentSearches.length ? (
                  <>
                    <p className="px-1 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-navy-400">
                      Recent
                    </p>
                    <ul className="mb-3 space-y-0.5">
                      {state.recentSearches.map((q) => (
                        <li key={q}>
                          <button
                            type="button"
                            onClick={() => {
                              setQuery(q)
                              void runSearch(q)
                            }}
                            className="w-full truncate rounded-lg px-2 py-1.5 text-left text-[13px] text-navy-700 transition-colors hover:bg-navy-50"
                          >
                            {q}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}

                <p className="px-1 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-navy-400">
                  Try describing it
                </p>
                <ul className="space-y-0.5">
                  {searchExamples.map((example) => (
                    <li key={example}>
                      <button
                        type="button"
                        onClick={() => {
                          setQuery(example)
                          void runSearch(example)
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] text-navy-700 transition-colors hover:bg-navy-50"
                      >
                        <Search className="h-3 w-3 shrink-0 text-navy-300" aria-hidden="true" />
                        <span className="truncate">{example}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 border-t border-navy-100 px-1 pt-2.5 text-[11.5px] leading-relaxed text-navy-500">
                  Search matches what your documents are about, not just their filenames.
                </p>
              </div>
            ) : loading ? (
              <div className="divide-y divide-navy-100 py-1">
                <ResultSkeleton />
                <ResultSkeleton />
                <ResultSkeleton />
              </div>
            ) : results && results.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <p className="text-[13.5px] font-medium text-navy-800">Nothing matched that</p>
                <p className="mx-auto mt-1.5 max-w-xs text-[12.5px] leading-relaxed text-navy-600">
                  This prototype searches a small sample library. Try &ldquo;working capital&rdquo;,
                  &ldquo;the quiz I got wrong&rdquo; or &ldquo;cost of capital slides&rdquo;.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 border-b border-navy-100 px-3 py-2">
                  <p className="text-[11.5px] font-medium text-navy-600">
                    {results?.length} {results?.length === 1 ? 'result' : 'results'} for your description
                  </p>
                  <SimulatedTag label="Simulated search" className="ml-auto" />
                </div>
                <ul className="py-1">
                  {results?.map((result, i) => {
                    const Icon = KIND_ICON[result.kind] ?? FileText
                    return (
                      <li key={result.docId}>
                        <button
                          type="button"
                          onMouseEnter={() => setActiveIndex(i)}
                          onClick={() => choose(result)}
                          className={cn(
                            'flex w-full gap-2.5 px-3 py-2.5 text-left transition-colors',
                            i === activeIndex ? 'bg-brand-50' : 'hover:bg-navy-50',
                          )}
                        >
                          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-navy-400" aria-hidden="true" />
                          <span className="min-w-0 flex-1">
                            <span className="flex items-baseline gap-2">
                              <span className="truncate text-[13.5px] font-medium text-navy-900">
                                {result.title}
                              </span>
                              <span className="shrink-0 text-[11px] font-medium text-navy-500">
                                {result.courseCode}
                              </span>
                            </span>
                            <span className="mt-0.5 block line-clamp-2 text-[12.5px] leading-relaxed text-navy-600">
                              {result.snippet}
                            </span>
                            {result.reasons.length ? (
                              <span className="mt-1.5 flex flex-wrap gap-1">
                                {result.reasons.map((reason) => (
                                  <span
                                    key={reason}
                                    className="rounded bg-navy-100 px-1.5 py-0.5 text-[10.5px] font-medium text-navy-700"
                                  >
                                    {reason}
                                  </span>
                                ))}
                              </span>
                            ) : null}
                          </span>
                          {i === activeIndex ? (
                            <CornerDownLeft className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" aria-hidden="true" />
                          ) : null}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

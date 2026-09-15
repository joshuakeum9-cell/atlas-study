import { Mic, Search, Sparkles } from 'lucide-react'

/**
 * A static, non-interactive miniature of the workspace, used in the hero.
 * It is deliberately simplified - the point is to show the three-panel shape at
 * a glance, not to duplicate the real thing.
 */
export function WorkspacePreview() {
  return (
    <div
      className="overflow-hidden rounded-xl bg-white shadow-lift ring-1 ring-navy-900/10"
      aria-hidden="true"
    >
      {/* Top bar */}
      <div className="flex items-center gap-2 border-b border-navy-100 bg-white px-3 py-2">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-navy-200" />
          <span className="h-2 w-2 rounded-full bg-navy-200" />
          <span className="h-2 w-2 rounded-full bg-navy-200" />
        </div>
        <div className="ml-2 flex flex-1 items-center gap-1.5 rounded-md bg-navy-50 px-2 py-1 ring-1 ring-navy-100">
          <Search className="h-3 w-3 text-navy-400" />
          <span className="truncate text-[10px] text-navy-500">
            find the notes where I struggled with the minus sign
          </span>
        </div>
      </div>

      <div className="grid grid-cols-[86px_1fr_132px] sm:grid-cols-[104px_1fr_160px]">
        {/* Sidebar */}
        <div className="space-y-2.5 border-r border-navy-100 bg-navy-50/50 p-2.5">
          <div className="text-[8px] font-semibold uppercase tracking-wider text-navy-400">Course</div>
          <div className="space-y-1">
            <div className="rounded bg-navy-900 px-1.5 py-1 text-[9px] font-medium text-white">
              Algebra I
            </div>
            <div className="px-1.5 py-1 text-[9px] text-navy-600">Worksheet 5</div>
            <div className="px-1.5 py-1 text-[9px] text-navy-600">Quiz 2</div>
          </div>
          <div className="pt-1 text-[8px] font-semibold uppercase tracking-wider text-navy-400">Work</div>
          <div className="space-y-1.5">
            <div className="h-1.5 w-full rounded-full bg-navy-200" />
            <div className="h-1.5 w-4/5 rounded-full bg-navy-200/60" />
            <div className="h-1.5 w-3/5 rounded-full bg-navy-200/60" />
          </div>
        </div>

        {/* Worksheet */}
        <div className="bg-paper p-3">
          <div className="paper-grid rounded-md bg-white p-3 ring-1 ring-navy-100">
            <div className="mb-2 h-1.5 w-1/2 rounded-full bg-navy-200" />
            <div className="mb-3 h-1 w-3/4 rounded-full bg-navy-100" />
            <div className="space-y-1.5">
              <div className="h-1 w-full rounded-full bg-navy-100" />
              <div className="h-1 w-5/6 rounded-full bg-navy-100" />
            </div>
            {/* The circled answer */}
            <div className="relative mt-3 rounded-lg bg-brand-50/70 p-2 ring-2 ring-brand-500">
              <p
                className="text-[11px] leading-snug text-brand-900"
                style={{ fontFamily: 'var(--font-hand)' }}
              >
                4x &minus; 8 &minus; 3x + 3 = 5
              </p>
              <span className="absolute -right-1.5 -top-1.5 rounded-full bg-brand-700 px-1.5 py-0.5 text-[7px] font-semibold text-white">
                reading
              </span>
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="h-1 w-2/3 rounded-full bg-navy-100" />
              <div className="h-1 w-1/2 rounded-full bg-navy-100" />
            </div>
          </div>
        </div>

        {/* Tutor */}
        <div className="space-y-2 border-l border-navy-100 bg-white p-2.5">
          <div className="flex items-center gap-1">
            <Sparkles className="h-2.5 w-2.5 text-brand-700" />
            <span className="text-[8px] font-semibold uppercase tracking-wider text-navy-500">Tutor</span>
          </div>
          <div className="ml-auto w-4/5 rounded-lg rounded-br-sm bg-navy-900 p-1.5">
            <div className="h-1 w-full rounded-full bg-white/40" />
            <div className="mt-1 h-1 w-2/3 rounded-full bg-white/25" />
          </div>
          <div className="space-y-1 rounded-lg rounded-bl-sm bg-navy-50 p-1.5 ring-1 ring-navy-100">
            <div className="h-1 w-full rounded-full bg-navy-200" />
            <div className="h-1 w-full rounded-full bg-navy-200" />
            <div className="h-1 w-4/5 rounded-full bg-navy-200" />
            <div className="h-1 w-3/5 rounded-full bg-navy-200" />
          </div>
          <div className="rounded-md bg-amber-50 p-1.5 ring-1 ring-amber-200">
            <div className="h-1 w-full rounded-full bg-amber-300/70" />
            <div className="mt-1 h-1 w-1/2 rounded-full bg-amber-300/50" />
          </div>
          <div className="flex items-center gap-1 rounded-md bg-navy-50 px-1.5 py-1 ring-1 ring-navy-100">
            <span className="h-1 flex-1 rounded-full bg-navy-200" />
            <Mic className="h-2.5 w-2.5 text-navy-400" />
          </div>
        </div>
      </div>
    </div>
  )
}

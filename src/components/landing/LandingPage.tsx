import { ArrowRight, Github } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/layout/Logo'
import { PrototypeBanner } from '@/components/layout/PrototypeBanner'
import { Hero } from './Hero'
import { ProblemSection } from './ProblemSection'
import { WorkflowSection } from './WorkflowSection'
import { FeatureSection } from './FeatureSection'
import { MemorySection } from './MemorySection'
import { OneWorkspaceSection } from './OneWorkspaceSection'

const NAV_LINKS = [
  { href: '#problem', label: 'The problem' },
  { href: '#workflow', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#memory', label: 'Academic memory' },
]

export function LandingPage({ onOpenDemo }: { onOpenDemo: () => void }) {
  return (
    <div className="min-h-dvh bg-paper">
      <PrototypeBanner />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-navy-100 bg-paper/85 backdrop-blur-md">
        <nav
          className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6"
          aria-label="Main"
        >
          <a href="#main" className="rounded-lg">
            <Logo />
            <span className="sr-only">Atlas home</span>
          </a>
          <ul className="ml-4 hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-lg px-3 py-1.5 text-[13.5px] font-medium text-navy-600 transition-colors hover:bg-navy-100/70 hover:text-navy-900"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="ml-auto flex items-center gap-2">
            <Button size="sm" variant="primary" onClick={onOpenDemo}>
              Try interactive demo
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </nav>
      </header>

      <main id="main">
        <Hero onOpenDemo={onOpenDemo} />
        <ProblemSection />
        <WorkflowSection />
        <FeatureSection />
        <MemorySection />
        <OneWorkspaceSection />

        {/* Closing call to action */}
        <section className="border-t border-navy-100 bg-navy-900 px-4 py-16 text-center sm:px-6 sm:py-20">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              The fastest way to understand it is to use it
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-[15px] leading-relaxed text-navy-200">
              The demo opens on a real assignment with handwritten work already in it. Circle
              something on the page and see what happens.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button size="lg" variant="secondary" onClick={onOpenDemo}>
                Open the workspace
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-6 text-[12.5px] text-navy-400">
              No sign-up, no account, nothing to install. Takes about three minutes.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-navy-100 bg-paper px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-md">
            <Logo />
            <p className="mt-3 text-[13px] leading-relaxed text-navy-600">
              Atlas is a concept prototype for an all-in-one study workspace. Version 1 keeps
              documents, notes and the tutor in a single place, so the tutor can see the work
              rather than being told about it.
            </p>
          </div>
          <div className="text-[13px] text-navy-600">
            <p className="font-semibold text-navy-900">Built as a static prototype</p>
            <ul className="mt-2 space-y-1">
              <li>React, Vite, TypeScript and Tailwind</li>
              <li>All data is local mock data</li>
              <li>No APIs, accounts, databases or tracking</li>
            </ul>
            <p className="mt-4 inline-flex items-center gap-1.5 text-navy-500">
              <Github className="h-3.5 w-3.5" aria-hidden="true" />
              Deployed with GitHub Pages
            </p>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-6xl border-t border-navy-100 pt-5 text-[12px] text-navy-500">
          Interactive concept prototype. AI responses, handwriting recognition, voice input,
          document analysis, search and sharing are all simulated.
        </div>
      </footer>
    </div>
  )
}

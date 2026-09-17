'use client'

import * as React from 'react'
import { Calendar, CheckCircle2, GitCommit, History, Sparkles, Wrench, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ChangelogEntry {
  version: string
  date: string
  title: string
  description: string
  commitHash: string
  isLatest?: boolean
  features: string[]
  improvements: string[]
  fixes: string[]
}

const entries: ChangelogEntry[] = [
  {
    version: 'v2.4.0',
    date: 'August 2026',
    title: 'Marketing Blocks Expansion & Tailwind CSS v4 OKLCH Engine',
    description:
      'Massive expansion introducing 75+ unbundled marketing blocks with zero sub-12px microtext, dual-framework AST parity, and interactive functional workbenches.',
    commitHash: '926c404',
    isLatest: true,
    features: [
      'Interactive Hero Sandboxes with live framework and theme preview tabs.',
      'Split Developer Workbenches for live AST code preview and schema compilation.',
      'ROI & Usage Cost Calculators with reactive slider models and dynamic tier calculation.',
      'Infinite CSS-driven Logo Tickers and Verified Engineer Endorsement Masonry.',
    ],
    improvements: [
      'Strict adherence to Pioneer Craft standards (Linear, Raycast, Stripe typography scale).',
      'Refactored token definitions into single canonical shared `@theme inline` stylesheet.',
      'Optimized Astro SSG islands hydration for instant sub-20ms INP responsiveness.',
    ],
    fixes: [
      'Resolved circular imports in CVA variant definitions by extracting dedicated variant files.',
      'Fixed React JSX expression single curly braces syntax parity.',
    ],
  },
  {
    version: 'v2.3.0',
    date: 'July 2026',
    title: 'Dual-Framework Parity Engine & AST Synchronization',
    description:
      'Automated cross-framework parity check tool ensuring 100% token and CVA variant synchronization between Vue 3.5 and React 19.',
    commitHash: 'a8b3f12',
    features: [
      'Cross-framework parity checking CLI (`npm run check:parity`).',
      'Direct shadcn-vue and shadcn CLI HTTP unbundled distribution.',
    ],
    improvements: [
      'Removed all monolithic npm package bindings in favor of pure unbundled distribution.',
      'Enhanced Lucide icon alignment across polymorphic Reka UI primitives.',
    ],
    fixes: ['Fixed SSR hydration mismatch on theme color scheme initial render.'],
  },
  {
    version: 'v2.2.0',
    date: 'June 2026',
    title: 'Ecosystem Reference Templates Launch',
    description:
      'Introduced reference architectures for Nuxt 3 HRMS, Hospital Clinical Intelligence, and Global Shipment Tracking.',
    commitHash: 'e47c991',
    features: [
      'Shipment Tracking Template with live GPS telemetry cards.',
      'HRMS Nuxt Template with interactive payroll matrices and attendance timecards.',
    ],
    improvements: ['Streamlined bootstrap items (`init`, `tailwind`, `utils`, `use-theme`).'],
    fixes: ['Addressed upstream `shadcn-vue` resolver circular warning.'],
  },
]

export interface ChangelogReleaseNotesTimelineProps {
  className?: string
}

export function ChangelogReleaseNotesTimeline({ className }: ChangelogReleaseNotesTimelineProps) {
  const [selectedVersion, setSelectedVersion] = React.useState<string>('all')

  const filteredEntries = React.useMemo(() => {
    if (selectedVersion === 'all') return entries
    return entries.filter((e) => e.version === selectedVersion)
  }, [selectedVersion])

  return (
    <section
      data-slot="changelog-release-notes-timeline"
      className={cn('bg-background relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8', className)}
    >
      <div className="mx-auto max-w-4xl space-y-12">
        {/* Header */}
        <div className="mx-auto max-w-2xl space-y-4 text-center">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1 font-mono text-xs shadow-xs">
            <History className="text-primary size-3.5" />
            Changelog &amp; Release History
          </Badge>
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">Continuous craft updates.</h2>
          <p className="text-muted-foreground text-base">
            Explore every version release, architectural improvement, and new block added to the registry.
          </p>

          {/* Version Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              type="button"
              className={cn(
                'rounded-lg border px-3 py-1 font-mono text-xs transition-all',
                selectedVersion === 'all'
                  ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-xs'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground',
              )}
              onClick={() => setSelectedVersion('all')}
            >
              All Releases
            </button>
            {entries.map((e) => (
              <button
                key={e.version}
                type="button"
                className={cn(
                  'rounded-lg border px-3 py-1 font-mono text-xs transition-all',
                  selectedVersion === e.version
                    ? 'border-primary bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setSelectedVersion(e.version)}
              >
                {e.version}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Feed */}
        <div className="border-border/80 relative ml-2 space-y-12 border-l pl-6 text-left sm:ml-4 sm:pl-8">
          {filteredEntries.map((entry) => (
            <div key={entry.version} className="group relative">
              {/* Timeline Node Circle */}
              <div
                className={cn(
                  'bg-background absolute top-1.5 -left-[31px] flex size-4 items-center justify-center rounded-full border-2 transition-colors sm:-left-[39px]',
                  entry.isLatest ? 'border-primary bg-primary/20' : 'border-muted-foreground/40',
                )}
              >
                {entry.isLatest && <div className="bg-primary size-1.5 animate-pulse rounded-full" />}
              </div>

              {/* Entry Card */}
              <Card className="border-border bg-card/95 space-y-6 rounded-2xl p-6 shadow-xl sm:p-8">
                {/* Header Row: Version pill, Date, Commit Diff */}
                <div className="border-border/60 flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                  <div className="flex items-center gap-2.5">
                    <Badge
                      variant={entry.isLatest ? 'default' : 'secondary'}
                      className="px-2.5 py-0.5 font-mono text-xs"
                    >
                      {entry.version}
                    </Badge>
                    {entry.isLatest && (
                      <span className="font-mono text-xs font-bold text-emerald-500 uppercase">Latest Release</span>
                    )}
                  </div>

                  <div className="text-muted-foreground flex items-center gap-4 font-mono text-xs">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5" />
                      {entry.date}
                    </span>
                    <span className="text-foreground/80 hover:text-foreground flex items-center gap-1">
                      <GitCommit className="text-primary size-3.5" />
                      <code>{entry.commitHash}</code>
                    </span>
                  </div>
                </div>

                {/* Title & Summary */}
                <div className="space-y-2">
                  <h3 className="text-foreground font-mono text-xl font-bold tracking-tight">{entry.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">{entry.description}</p>
                </div>

                {/* Category Section 1: Features */}
                {entry.features.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="flex items-center gap-1.5 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <Sparkles className="size-3.5" />
                      New Capabilities &amp; Blocks
                    </h4>
                    <ul className="text-foreground/90 space-y-1.5 pl-1 font-mono text-xs">
                      {entry.features.map((f, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Category Section 2: Improvements */}
                {entry.improvements.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-primary flex items-center gap-1.5 font-mono text-xs font-bold">
                      <Zap className="size-3.5" />
                      Craft &amp; Architecture Enhancements
                    </h4>
                    <ul className="text-foreground/90 space-y-1.5 pl-1 font-mono text-xs">
                      {entry.improvements.map((imp, iIdx) => (
                        <li key={iIdx} className="flex items-start gap-2">
                          <span className="text-primary font-bold">&bull;</span>
                          <span>{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Category Section 3: Fixes */}
                {entry.fixes.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                      <Wrench className="size-3.5" />
                      Fixes &amp; Parity Patches
                    </h4>
                    <ul className="text-muted-foreground space-y-1.5 pl-1 font-mono text-xs">
                      {entry.fixes.map((fix, fxIdx) => (
                        <li key={fxIdx} className="flex items-start gap-2">
                          <span className="font-bold text-amber-500">&bull;</span>
                          <span>{fix}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
export default ChangelogReleaseNotesTimeline

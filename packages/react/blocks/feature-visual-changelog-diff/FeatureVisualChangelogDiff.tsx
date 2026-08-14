import * as React from 'react'
import { ArrowRight, Check, Copy, GitCommit, GitPullRequest } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface ChangelogRelease {
  version: string
  date: string
  title: string
  description: string
  commitSha: string
  diffLines: {
    type: 'add' | 'delete' | 'context'
    content: string
  }[]
}

export interface FeatureVisualChangelogDiffProps {
  title?: string
  description?: string
  releases?: ChangelogRelease[]
  className?: string
}

const DEFAULT_RELEASES: ChangelogRelease[] = [
  {
    version: 'v2.4.0',
    date: 'August 2026',
    title: 'Tailwind CSS v4 & OKLCH Semantic Color Spaces',
    description:
      'Upgraded all cross-framework tokens to direct @theme inline CSS bindings. Eliminates legacy postcss configs.',
    commitSha: '7f9a2b1',
    diffLines: [
      { type: 'delete', content: '- module.exports = { theme: { extend: { colors: { ... } } } }' },
      { type: 'add', content: '+ @theme inline {' },
      { type: 'add', content: '+   --color-background: oklch(1 0 0);' },
      { type: 'add', content: '+   --color-primary: oklch(0.205 0 0);' },
      { type: 'add', content: '+ }' },
      { type: 'context', content: '  // Zero JavaScript compilation overhead in production bundles' },
    ],
  },
  {
    version: 'v2.3.0',
    date: 'July 2026',
    title: 'Headless Polymorphic Primitive Architecture',
    description: 'Unified Reka UI and Radix UI state machines across Vue 3.5 and React 19 mirrors.',
    commitSha: '4c8e1d9',
    diffLines: [
      { type: 'delete', content: '- import { Dialog } from "legacy-untyped-modal"' },
      { type: 'add', content: '+ import { DialogRoot, DialogPortal } from "reka-ui"' },
      { type: 'add', content: '+ <Primitive data-slot="dialog" :as="as">' },
      { type: 'context', content: '  // Full WCAG AA focus trapping and keyboard navigation' },
    ],
  },
]

export function FeatureVisualChangelogDiff({
  title = 'Continuous evolution with transparent source-level changelogs.',
  description = 'Every architectural improvement, performance optimization, and token adjustment documented with precise git diffs.',
  releases = DEFAULT_RELEASES,
  className,
}: FeatureVisualChangelogDiffProps) {
  const [copiedSha, setCopiedSha] = React.useState<string | null>(null)

  async function copySha(sha: string) {
    try {
      await navigator.clipboard.writeText(sha)
      setCopiedSha(sha)
      setTimeout(() => {
        setCopiedSha(null)
      }, 2000)
    } catch {
      // fallback
    }
  }

  return (
    <section
      data-slot="feature-visual-changelog-diff"
      className={cn('bg-background relative overflow-hidden py-16 sm:py-24', className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <a
            href="#changelog"
            className="group border-border/80 bg-secondary/60 hover:bg-secondary text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium shadow-2xs transition-colors"
          >
            <GitPullRequest className="text-primary size-3.5" />
            <span>Continuous Release Ledger</span>
            <ArrowRight className="text-muted-foreground size-3 transition-transform group-hover:translate-x-0.5" />
          </a>

          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>

          <p className="text-muted-foreground text-base sm:text-lg">{description}</p>
        </div>

        {/* Changelog Timeline Entries */}
        <div className="mx-auto mt-12 max-w-4xl space-y-8">
          {releases.map((rel) => (
            <Card key={rel.version} className="border-border bg-card/80 overflow-hidden shadow-xs backdrop-blur-xs">
              <CardContent className="space-y-5 p-6">
                {/* Header Bar */}
                <div className="border-border flex flex-wrap items-center justify-between gap-2 border-b pb-3">
                  <div className="flex items-center gap-2.5">
                    <Badge
                      variant="outline"
                      className="border-primary/40 bg-primary/10 text-primary font-mono text-xs font-bold"
                    >
                      {rel.version}
                    </Badge>
                    <span className="text-foreground text-sm font-bold">{rel.title}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground font-mono text-xs">{rel.date}</span>
                    <button
                      type="button"
                      className="border-border bg-muted/30 text-muted-foreground hover:text-foreground inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-xs transition-colors"
                      onClick={() => copySha(rel.commitSha)}
                    >
                      <GitCommit className="text-primary size-3" />
                      <span>{rel.commitSha}</span>
                      {copiedSha === rel.commitSha ? (
                        <Check className="ml-0.5 size-3 text-emerald-500" />
                      ) : (
                        <Copy className="ml-0.5 size-3" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-muted-foreground text-xs leading-relaxed">{rel.description}</p>

                {/* Code Diff Box */}
                <div className="border-border bg-muted/40 overflow-hidden rounded-lg border font-mono text-xs">
                  <div className="border-border/80 bg-muted/60 text-muted-foreground flex items-center justify-between border-b px-3 py-1.5 text-xs font-bold">
                    <span>Unified Source Diff</span>
                    <span className="text-xs font-normal text-emerald-500">Git verified</span>
                  </div>
                  <div className="space-y-1 overflow-x-auto p-3 text-xs">
                    {rel.diffLines.map((line, lIdx) => (
                      <div
                        key={lIdx}
                        className={cn(
                          'rounded px-2 py-0.5 leading-relaxed',
                          line.type === 'add'
                            ? 'bg-emerald-500/10 font-medium text-emerald-600 dark:text-emerald-400'
                            : line.type === 'delete'
                              ? 'bg-red-500/10 text-red-600 line-through opacity-80 dark:text-red-400'
                              : 'text-muted-foreground',
                        )}
                      >
                        {line.content}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import * as React from 'react'
import { Bell } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge, type BadgeVariants } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SectionCard } from '@/components/ui/section-card'

export type ChangelogEntryType = 'new' | 'improved' | 'fixed' | 'breaking'

export interface ChangelogEntry {
  type: ChangelogEntryType
  title: string
  description?: string
}

export interface Release {
  version: string
  /** ISO date string, e.g. '2026-08-14'. */
  date: string
  /** Overrides the default "first release in the array is the latest" rule. */
  latest?: boolean
  entries: ChangelogEntry[]
}

export interface ChangelogProps {
  releases?: Release[]
  title?: string
  description?: string
  subscribe?: boolean
  subscribeVariant?: 'default' | 'outline'
  scrollable?: boolean
  className?: string
}

const entryTone: Record<ChangelogEntryType, NonNullable<BadgeVariants['variant']>> = {
  new: 'success',
  improved: 'info',
  fixed: 'warning',
  breaking: 'destructive',
}

const entryLabel: Record<ChangelogEntryType, string> = {
  new: 'New',
  improved: 'Improved',
  fixed: 'Fixed',
  breaking: 'Breaking',
}

const stubReleases: Release[] = [
  {
    version: 'v2.4.0',
    date: '2026-08-14',
    entries: [
      {
        type: 'new',
        title: 'Command palette',
        description: 'Global ⌘K palette with fuzzy search and full keyboard navigation.',
      },
      { type: 'improved', title: 'Table virtualization', description: 'Tables stay at 60fps past 10k rows.' },
      { type: 'fixed', title: 'Dark mode contrast', description: 'Sidebar badges now meet AA contrast in dark mode.' },
    ],
  },
  {
    version: 'v2.3.0',
    date: '2026-07-30',
    entries: [
      {
        type: 'new',
        title: 'Saved views',
        description: 'Pin filtered table views to the sidebar and share them with your team.',
      },
      {
        type: 'improved',
        title: 'CSV import',
        description: 'Merged cells and formula columns are flattened on import.',
      },
      { type: 'fixed', title: 'Scheduled exports', description: 'Exports no longer drift across DST boundaries.' },
    ],
  },
  {
    version: 'v2.2.1',
    date: '2026-07-08',
    entries: [
      {
        type: 'breaking',
        title: 'Node 20+ required',
        description: 'Node 18 reached end of life; the CLI now targets Node 20 and newer.',
      },
      {
        type: 'fixed',
        title: 'Safari login loop',
        description: 'Session cookies set on a redirect were dropped by ITP.',
      },
      {
        type: 'fixed',
        title: 'Duplicate webhooks',
        description: 'Retries after a timeout no longer double-deliver events.',
      },
    ],
  },
]

const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

function formatDate(date: string) {
  // Pin the time so a UTC-stored ISO date cannot shift a day in negative offsets.
  return dateFormatter.format(new Date(`${date}T00:00:00`))
}

export function Changelog({
  releases,
  title = 'Changelog',
  description = 'New features, improvements, and fixes — newest first.',
  subscribe = true,
  subscribeVariant = 'outline',
  scrollable = false,
  className,
}: ChangelogProps) {
  const source = releases ?? stubReleases

  return (
    <SectionCard
      data-slot="changelog"
      title={title}
      description={description}
      className={className}
      headerAction={
        subscribe ? (
          <Button variant={subscribeVariant} size="sm">
            <Bell aria-hidden="true" />
            Subscribe
          </Button>
        ) : undefined
      }
    >
      {/* Version groups. Each entry li carries its own border-l segment so the
          rail stays continuous through row spacing but breaks at version headers. */}
      {source.length === 0 ? (
        <p className="text-muted-foreground py-6 text-center text-sm">No releases yet.</p>
      ) : (
        <ol className={cn('space-y-8', scrollable && 'max-h-96 overflow-y-auto pr-1')}>
          {source.map((release, ri) => (
            <li key={release.version}>
              <div className="flex items-center gap-2.5">
                <h3 className="font-mono text-sm font-semibold tracking-tight break-all">{release.version}</h3>
                {(release.latest ?? ri === 0) && <Badge>Latest</Badge>}
                <time dateTime={release.date} className="text-muted-foreground ml-auto text-xs">
                  {formatDate(release.date)}
                </time>
              </div>

              <ol className="mt-3">
                {release.entries.map((entry, ei) => (
                  <li key={`${release.version}-${ei}`} className="border-border border-l pb-5 pl-6 last:pb-0">
                    <div className="flex items-start gap-3">
                      {/* In-flow dot pulled back over the rail; ring punches out the
                          line behind it (same trick as TimelineMedia's connector). */}
                      <span
                        aria-hidden="true"
                        className="bg-muted-foreground/40 ring-background mt-1.5 -ml-[30px] size-2.5 shrink-0 rounded-full ring-4"
                      />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <Badge variant={entryTone[entry.type]}>{entryLabel[entry.type]}</Badge>
                          <p className="text-sm font-medium">{entry.title}</p>
                        </div>
                        {entry.description && (
                          <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{entry.description}</p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      )}
    </SectionCard>
  )
}

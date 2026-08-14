'use client'

import * as React from 'react'
import { BookOpen, FileText, GitBranch, MessageSquare, Search, Users, Video } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Chip } from '@/components/ui/chip'
import { Input } from '@/components/ui/input'

interface SearchResult {
  id: string
  icon: React.ComponentType<{ className?: string }>
  title: string
  path: string
  snippet: string
  type: string
  updated: string
}

interface FacetOption {
  id: string
  label: string
  count: number
}

interface FacetGroup {
  id: string
  label: string
  options: FacetOption[]
}

export interface SearchResultsPageProps extends React.HTMLAttributes<HTMLDivElement> {}

const RESULTS: SearchResult[] = [
  {
    id: 'r1',
    icon: BookOpen,
    title: 'Onboarding flows: design your first-run experience',
    path: 'docs.acme.dev / guides / onboarding-flows',
    snippet:
      'Learn how to compose onboarding flows from checklists, tours, and progressive disclosure so new users reach their first aha moment faster.',
    type: 'Docs',
    updated: '2 days ago',
  },
  {
    id: 'r2',
    icon: FileText,
    title: 'Checklist API reference for onboarding flows',
    path: 'docs.acme.dev / api / checklist',
    snippet:
      'Full reference for the Checklist primitive used to drive onboarding flows, including step completion events, persistence, and theming.',
    type: 'Reference',
    updated: '5 hours ago',
  },
  {
    id: 'r3',
    icon: Video,
    title: 'Video walkthrough: building onboarding flows in 20 minutes',
    path: 'learn.acme.dev / videos / onboarding-flows-walkthrough',
    snippet:
      'A hands-on screencast that builds a complete onboarding flow with branching steps, skippable tours, and analytics instrumentation.',
    type: 'Video',
    updated: '1 week ago',
  },
  {
    id: 'r4',
    icon: MessageSquare,
    title: 'How do you measure completion of onboarding flows?',
    path: 'community.acme.dev / discussions / 4821',
    snippet:
      'Community thread comparing activation-rate funnels, step-drop-off charts, and qualitative surveys for measuring onboarding flow success.',
    type: 'Discussion',
    updated: '3 days ago',
  },
  {
    id: 'r5',
    icon: GitBranch,
    title: 'Example repo: onboarding flows with A/B-tested variants',
    path: 'github.com / acme / examples / onboarding-ab-test',
    snippet:
      'Runnable example that splits new signups into two onboarding flow variants and reports which one converts better to first project creation.',
    type: 'Example',
    updated: '2 weeks ago',
  },
  {
    id: 'r6',
    icon: Users,
    title: 'Playbook: personalizing onboarding flows by team role',
    path: 'docs.acme.dev / playbooks / role-based-onboarding',
    snippet:
      'Patterns for tailoring onboarding flows to admins, editors, and viewers, with sample copy, suggested defaults, and rollout checklists.',
    type: 'Guide',
    updated: '4 days ago',
  },
]

const FACET_GROUPS: FacetGroup[] = [
  {
    id: 'type',
    label: 'Type',
    options: [
      { id: 'type-docs', label: 'Docs', count: 18 },
      { id: 'type-guides', label: 'Guides', count: 11 },
      { id: 'type-video', label: 'Video', count: 7 },
      { id: 'type-discussion', label: 'Discussion', count: 6 },
    ],
  },
  {
    id: 'team',
    label: 'Team',
    options: [
      { id: 'team-product', label: 'Product', count: 14 },
      { id: 'team-engineering', label: 'Engineering', count: 16 },
      { id: 'team-design', label: 'Design', count: 8 },
      { id: 'team-support', label: 'Support', count: 4 },
    ],
  },
]

const TOTAL_PAGES = 3

export const SearchResultsPage = React.forwardRef<HTMLDivElement, SearchResultsPageProps>(
  ({ className, ...props }, ref) => {
    const [query, setQuery] = React.useState('onboarding flows')
    const [chips, setChips] = React.useState([
      { id: 'type-docs', label: 'Type: Docs' },
      { id: 'team-product', label: 'Team: Product' },
    ])
    const [activeFacets, setActiveFacets] = React.useState<Set<string>>(() => new Set(['type-docs', 'team-product']))
    const [page, setPage] = React.useState(1)

    function removeChip(id: string) {
      setChips((prev) => prev.filter((chip) => chip.id !== id))
    }

    function clearAll() {
      setChips([])
    }

    function toggleFacet(id: string, checked: boolean | 'indeterminate') {
      setActiveFacets((prev) => {
        const next = new Set(prev)
        if (checked === true) next.add(id)
        else next.delete(id)
        return next
      })
    }

    const start = (page - 1) * RESULTS.length + 1
    const resultRange = `${start}-${start + RESULTS.length - 1}`

    return (
      <div ref={ref} data-slot="search-results-page" className={cn('w-full space-y-6', className)} {...props}>
        <div className="space-y-3">
          <div className="relative max-w-xl">
            <Search
              aria-hidden="true"
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
            />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="h-11 pl-9 text-base"
            />
          </div>
          <p className="text-muted-foreground text-sm">
            {resultRange} of 42 results for &ldquo;{query}&rdquo;
          </p>
        </div>

        {chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {chips.map((chip) => (
              <Chip key={chip.id} variant="outline" size="sm" closable onClose={() => removeChip(chip.id)}>
                {chip.label}
              </Chip>
            ))}
            <Button variant="link" size="sm" className="text-muted-foreground h-auto min-h-6 px-2" onClick={clearAll}>
              Clear all
            </Button>
          </div>
        )}

        <div className="flex gap-8">
          <aside className="hidden w-48 shrink-0 space-y-6 lg:block" aria-label="Filters">
            {FACET_GROUPS.map((group) => (
              <div key={group.id}>
                <h3 className="text-muted-foreground mb-3 text-xs font-medium tracking-wider uppercase">
                  {group.label}
                </h3>
                <ul className="space-y-2.5">
                  {group.options.map((option) => (
                    <li key={option.id}>
                      <label
                        htmlFor={`${group.id}-${option.id}`}
                        className="flex cursor-pointer items-center gap-2 text-sm"
                      >
                        <Checkbox
                          id={`${group.id}-${option.id}`}
                          checked={activeFacets.has(option.id)}
                          onCheckedChange={(checked) => toggleFacet(option.id, checked)}
                        />
                        <span>{option.label}</span>
                        <span className="text-muted-foreground ml-auto text-xs tabular-nums">{option.count}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </aside>

          <div className="min-w-0 flex-1">
            <ol className="divide-border divide-y">
              {RESULTS.map((result) => (
                <li key={result.id}>
                  <a
                    href="#"
                    className="hover:bg-muted/50 focus-visible:ring-ring block rounded-lg p-4 transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <div className="flex gap-4">
                      <div className="bg-muted/50 text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-md border">
                        <result.icon aria-hidden="true" className="size-5" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <p className="truncate font-medium">{result.title}</p>
                        <p className="text-muted-foreground truncate text-xs">{result.path}</p>
                        <p className="text-muted-foreground line-clamp-2 text-sm">{result.snippet}</p>
                        <div className="flex items-center gap-3 pt-1">
                          <Badge variant="secondary">{result.type}</Badge>
                          <span className="text-muted-foreground text-xs">Updated {result.updated}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ol>

            <nav className="flex items-center justify-between pt-4" aria-label="Pagination">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((n) => (
                  <Button
                    key={n}
                    variant={n === page ? 'outline' : 'ghost'}
                    size="icon-sm"
                    aria-current={n === page ? 'page' : undefined}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </Button>
                ))}
              </div>
              <Button variant="outline" size="sm" disabled={page === TOTAL_PAGES} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </nav>
          </div>
        </div>
      </div>
    )
  },
)

SearchResultsPage.displayName = 'SearchResultsPage'

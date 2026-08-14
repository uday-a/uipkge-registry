'use client'

import * as React from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  Check,
  Container,
  CreditCard,
  LineChart,
  Mail,
  MessageSquare,
  Radar,
  Receipt,
  ScrollText,
  Search,
  SearchX,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Chip } from '@/components/ui/chip'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EmptyState } from '@/components/ui/empty-state'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

export type CategoryId = 'analytics' | 'devops' | 'communication' | 'billing'
export type CategoryFilter = 'all' | CategoryId

export interface Integration {
  id: string
  name: string
  description: string
  /** Longer paragraph shown in the detail view. */
  detail: string
  category: CategoryId
  author: string
  /** Lucide glyph standing in for the product logo. */
  icon: LucideIcon
  connected?: boolean
  permissions: string[]
}

export interface IntegrationsDirectoryProps {
  /** Replace the built-in stub catalog. */
  integrations?: Integration[]
  initialQuery?: string
  initialCategory?: CategoryFilter
  initialInstalledOnly?: boolean
  /** Render this integration's detail body as an always-visible panel (docs/story aid). */
  featuredId?: string
  className?: string
}

const CATEGORIES: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'devops', label: 'DevOps' },
  { id: 'communication', label: 'Communication' },
  { id: 'billing', label: 'Billing' },
]

const STUB_INTEGRATIONS: Integration[] = [
  {
    id: 'pulseboard',
    name: 'Pulseboard',
    description: 'Funnels, retention curves and cohort exploration for product teams.',
    detail:
      'Pulseboard plugs into your event stream and turns raw activity into funnels, retention curves and cohort views. Dashboards sync hourly, and annotations push back into your workspace so launches stay marked on every chart.',
    category: 'analytics',
    author: 'Pulseboard Labs',
    icon: BarChart3,
    connected: true,
    permissions: ['Read workspace profile', 'Read dashboards and events', 'Create annotations and highlights'],
  },
  {
    id: 'metrica',
    name: 'Metrica',
    description: 'Privacy-friendly web metrics with no cookie banner required.',
    detail:
      'Metrica collects pageviews and referrers without cookies or personal data, so sites stay compliant out of the box. Live visitor counts, entry pages and campaign attribution arrive as lightweight embeds or a full dashboard.',
    category: 'analytics',
    author: 'Metrica Inc.',
    icon: LineChart,
    permissions: ['Read site metadata', 'Record aggregate pageviews'],
  },
  {
    id: 'shipyard',
    name: 'Shipyard',
    description: 'Zero-config preview environments for every pull request.',
    detail:
      'Shipyard builds an isolated environment for each pull request, complete with seeded databases and shareable URLs. Deploys post status checks back to your repository, and idle previews sleep automatically to keep costs flat.',
    category: 'devops',
    author: 'Shipyard Systems',
    icon: Container,
    connected: true,
    permissions: ['Read pull requests and statuses', 'Create deployment check runs', 'Publish preview URLs'],
  },
  {
    id: 'watchtower',
    name: 'Watchtower',
    description: 'Uptime, SSL and domain monitoring with on-call escalations.',
    detail:
      'Watchtower probes your endpoints from twelve regions and escalates incidents through on-call schedules when thresholds break. SSL expiry, DNS drift and port changes are tracked alongside uptime so surprises surface early.',
    category: 'devops',
    author: 'Northwind Ops',
    icon: Radar,
    permissions: ['Read incident history', 'Register webhook endpoints', 'Send alert notifications'],
  },
  {
    id: 'loghound',
    name: 'Loghound',
    description: 'Structured log search across every service and region.',
    detail:
      'Loghound ingests structured logs from every service, indexes them in seconds and supports SQL-ish queries with saved views. Tail live streams during deploys and pipe matched events straight into your alerting rules.',
    category: 'devops',
    author: 'Houndworks',
    icon: ScrollText,
    permissions: ['Read log streams', 'Create saved queries', 'Forward events to webhooks'],
  },
  {
    id: 'chatterbox',
    name: 'Chatterbox',
    description: 'Team chat with threads, huddles and shared channels.',
    detail:
      'Chatterbox keeps conversations organized with threaded channels, quick huddles and shared external channels. Bots receive messages through webhooks and can post rich updates, keeping build and incident feeds where the team already works.',
    category: 'communication',
    author: 'Chatterbox Co.',
    icon: MessageSquare,
    permissions: ['Read channel names and topics', 'Post messages as the app', 'Upload notification files'],
  },
  {
    id: 'mailroom',
    name: 'Mailroom',
    description: 'Transactional email with templates and delivery insights.',
    detail:
      'Mailroom sends transactional email from versioned templates with per-recipient variables. Delivery webhooks report bounces, complaints and opens, and suppression lists keep problematic addresses out of future sends.',
    category: 'communication',
    author: 'Mailroom Ltd.',
    icon: Mail,
    permissions: ['Send email on your behalf', 'Read delivery and bounce events', 'Manage suppression list'],
  },
  {
    id: 'ledgerly',
    name: 'Ledgerly',
    description: 'Invoicing, tax handling and revenue recognition in one flow.',
    detail:
      'Ledgerly generates invoices from your billing events, applies regional tax rules automatically and reconciles payments against your ledger. Revenue schedules export to your accounting package month by month.',
    category: 'billing',
    author: 'Ledgerly Inc.',
    icon: Receipt,
    permissions: ['Read customer records', 'Create and send invoices', 'Read payment statuses'],
  },
  {
    id: 'billfold',
    name: 'Billfold',
    description: 'Subscription management and dunning recovery built in.',
    detail:
      'Billfold manages plans, proration and trial conversions with hosted checkout and self-serve portals. Smart retries and expiry reminders recover failed payments before customers ever notice.',
    category: 'billing',
    author: 'Billfold Labs',
    icon: CreditCard,
    permissions: ['Read subscription states', 'Start checkout sessions', 'Send payment reminders'],
  },
]

function categoryLabel(id: CategoryId): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id
}

function initials(author: string): string {
  return author
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

export function IntegrationsDirectory({
  integrations,
  initialQuery = '',
  initialCategory = 'all',
  initialInstalledOnly = false,
  featuredId,
  className,
}: IntegrationsDirectoryProps) {
  const [items, setItems] = React.useState<Integration[]>(integrations ?? STUB_INTEGRATIONS)
  const [query, setQuery] = React.useState(initialQuery)
  const [category, setCategory] = React.useState<CategoryFilter>(initialCategory)
  const [installedOnly, setInstalledOnly] = React.useState(initialInstalledOnly)
  const [detailId, setDetailId] = React.useState<string | null>(null)
  const [detailOpen, setDetailOpen] = React.useState(false)

  const counts = React.useMemo(() => {
    const acc: Record<string, number> = {}
    for (const c of CATEGORIES) acc[c.id] = 0
    for (const i of items) acc[i.category] = (acc[i.category] ?? 0) + 1
    return acc
  }, [items])

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((i) => {
      if (category !== 'all' && i.category !== category) return false
      if (installedOnly && !i.connected) return false
      if (!q) return true
      const hay = `${i.name} ${i.description} ${i.author} ${categoryLabel(i.category)}`.toLowerCase()
      return hay.includes(q)
    })
  }, [items, query, category, installedOnly])

  const featured = featuredId ? (items.find((i) => i.id === featuredId) ?? null) : null
  const activeDetail = detailId ? (items.find((i) => i.id === detailId) ?? null) : null

  function openDetail(id: string) {
    setDetailId(id)
    setDetailOpen(true)
  }

  function setConnected(id: string, connected: boolean) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, connected } : i)))
  }

  function install(id: string) {
    setConnected(id, true)
  }

  function disconnect(id: string) {
    setConnected(id, false)
  }

  function clearFilters() {
    setQuery('')
    setCategory('all')
    setInstalledOnly(false)
  }

  return (
    <div data-slot="integrations-directory" className={cn('space-y-4', className)}>
      {/* Toolbar */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            prefixIcon={<Search className="size-4" />}
            placeholder="Search integrations…"
            aria-label="Search integrations"
            className="min-w-56 flex-1"
          />
          <div className="ml-auto flex items-center gap-2">
            <Switch
              checked={installedOnly}
              onCheckedChange={setInstalledOnly}
              size="sm"
              aria-label="Show installed integrations only"
            />
            <span className="text-muted-foreground text-sm select-none">Installed</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              className="focus-visible:ring-ring rounded-full focus-visible:ring-2 focus-visible:outline-none"
              aria-pressed={category === c.id}
              onClick={() => setCategory(c.id)}
            >
              <Chip variant={category === c.id ? 'filled' : 'outline'} size="sm">
                {c.label}
                <span className="tabular-nums opacity-70">{counts[c.id] ?? 0}</span>
              </Chip>
            </button>
          ))}
        </div>
      </div>

      {/* Featured detail panel (always-visible variant of the dialog body) */}
      {featured && (
        <section
          data-slot="integration-detail-panel"
          className="bg-card space-y-4 rounded-xl border p-6 shadow-sm"
          aria-label="Integration details"
        >
          <div className="flex items-start gap-4">
            <span
              className="bg-primary/10 text-primary flex size-14 shrink-0 items-center justify-center rounded-xl"
              aria-hidden="true"
            >
              <featured.icon className="size-7" />
            </span>
            <div className="min-w-0">
              <h2 className="text-base font-semibold tracking-tight">{featured.name}</h2>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <Chip variant="outline" size="sm">
                  {categoryLabel(featured.category)}
                </Chip>
                <span className="text-muted-foreground text-xs">by {featured.author}</span>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">{featured.detail}</p>
          <div>
            <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">Permissions</p>
            <ul className="mt-2 space-y-1.5">
              {featured.permissions.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm">
                  <Check className="text-success mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-border flex items-center gap-2 border-t pt-4">
            {featured.connected ? (
              <>
                <Badge variant="success">
                  <Check aria-hidden="true" /> Connected
                </Badge>
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => disconnect(featured.id)}>
                  Disconnect
                </Button>
              </>
            ) : (
              <Button className="w-full" onClick={() => install(featured.id)}>
                Install
              </Button>
            )}
          </div>
        </section>
      )}

      {/* Results */}
      {visible.length > 0 ? (
        <>
          <p className="text-muted-foreground text-xs tabular-nums">
            Showing {visible.length} of {items.length} integrations
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((i) => (
              <article
                key={i.id}
                data-slot="integration-card"
                className="bg-card hover:border-ring/50 relative flex flex-col gap-3 rounded-xl border p-5 shadow-sm transition-colors hover:shadow-md"
              >
                <button
                  type="button"
                  className="focus-visible:ring-ring/50 absolute inset-0 rounded-xl focus-visible:ring-2 focus-visible:outline-none"
                  aria-label={`View ${i.name} details`}
                  onClick={() => openDetail(i.id)}
                />
                <div className="flex items-start justify-between gap-2">
                  <span
                    className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg"
                    aria-hidden="true"
                  >
                    <i.icon className="size-5" />
                  </span>
                  <Chip variant="outline" size="sm">
                    {categoryLabel(i.category)}
                  </Chip>
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-tight">{i.name}</p>
                  <p className="text-muted-foreground mt-0.5 truncate text-xs">{i.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="bg-muted text-muted-foreground flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium"
                    aria-hidden="true"
                  >
                    {initials(i.author)}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">{i.author}</span>
                </div>
                <div className="border-border relative mt-auto flex items-center gap-2 border-t pt-3">
                  {i.connected ? (
                    <>
                      <Badge variant="success">
                        <Check aria-hidden="true" /> Connected
                      </Badge>
                      <Button
                        variant="ghost"
                        size="xs"
                        className="ml-auto"
                        onClick={(e) => {
                          e.stopPropagation()
                          disconnect(i.id)
                        }}
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        install(i.id)
                      }}
                    >
                      Install
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </>
      ) : (
        /* Empty state */
        <div className="rounded-xl border border-dashed">
          <EmptyState
            icon={SearchX}
            title="No integrations found"
            description="Nothing matches your current search and filters."
          >
            <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>
              Clear filters
            </Button>
          </EmptyState>
        </div>
      )}

      {/* Detail dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        {activeDetail && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-start gap-4">
                <span
                  className="bg-primary/10 text-primary flex size-14 shrink-0 items-center justify-center rounded-xl"
                  aria-hidden="true"
                >
                  <activeDetail.icon className="size-7" />
                </span>
                <div className="min-w-0">
                  <DialogTitle className="text-base tracking-tight">{activeDetail.name}</DialogTitle>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <Chip variant="outline" size="sm">
                      {categoryLabel(activeDetail.category)}
                    </Chip>
                    <span className="text-muted-foreground text-xs">by {activeDetail.author}</span>
                  </div>
                </div>
              </div>
            </DialogHeader>
            <DialogDescription className="leading-relaxed">{activeDetail.detail}</DialogDescription>
            <div>
              <p className="text-muted-foreground text-xs font-semibold tracking-widest uppercase">Permissions</p>
              <ul className="mt-2 space-y-1.5">
                {activeDetail.permissions.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm">
                    <Check className="text-success mt-0.5 size-4 shrink-0" aria-hidden="true" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-border flex items-center gap-2 border-t pt-4">
              {activeDetail.connected ? (
                <>
                  <Badge variant="success">
                    <Check aria-hidden="true" /> Connected
                  </Badge>
                  <Button variant="ghost" size="sm" className="ml-auto" onClick={() => disconnect(activeDetail.id)}>
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button className="w-full" onClick={() => install(activeDetail.id)}>
                  Install
                </Button>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}

import { useState } from 'react'
import Story from '../../components/story/Story'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataExplorer } from '@react-registry-blocks/data-explorer/DataExplorer'
import { createMockSource } from '@react-registry-blocks/data-explorer/data-explorer-core'
import {
  PIPELINE_RUN_COLUMNS,
  createSampleRuns,
  type PipelineRun,
} from '@react-registry-blocks/data-explorer/data-explorer-data'
import { ArrowRight, Copy, FileText, RotateCw, X } from '@react-registry-blocks/data-explorer/data-explorer-icons'
import type {
  ExplorerCellEdit,
  ExplorerColumn,
  ExplorerRowAction,
  ExplorerSource,
} from '@react-registry-blocks/data-explorer/data-explorer-types'

const sample = createSampleRuns()
const bigSample = createSampleRuns(new Date(), 5000)

// Only the runs that went wrong -- every row carries an error message to read
// in the detail sheet.
const troubledRuns: PipelineRun[] = sample.filter((r) => r.status === 'failed' || r.status === 'partial')

// Async: the same rows behind a mock server with 600ms latency. Search,
// filters, sort and paging are sent as a query; the block renders the page.
const source = createMockSource(sample, PIPELINE_RUN_COLUMNS, { latency: 600, facetColumn: 'status' })
const infiniteSource = createMockSource(bigSample, PIPELINE_RUN_COLUMNS, { latency: 350, facetColumn: 'status' })

// Fails the first call, then behaves -- so the story opens on the error banner
// and Retry recovers.
let flakyCalls = 0
const flakySource: ExplorerSource<PipelineRun> = (query) => {
  flakyCalls++
  if (flakyCalls === 1) return Promise.reject(new Error('Warehouse returned 503 (upstream connection timed out).'))
  return source(query)
}

// Pinned: identifier stays put on the left, cost on the right.
const pinnedColumns: ExplorerColumn<PipelineRun>[] = PIPELINE_RUN_COLUMNS.map((c) =>
  c.key === 'id' ? { ...c, pin: 'left' } : c.key === 'costUsd' ? { ...c, pin: 'right' } : c,
)

// Tree rows: each run nests its extract / transform / load tasks under a
// `tasks` array; column groups title the header runs.
const STAGES = ['extract', 'transform', 'load'] as const
const treeRuns: PipelineRun[] = sample.slice(0, 12).map((run) => ({
  ...run,
  tasks: STAGES.map((stage, i) => ({
    ...run,
    id: `${run.id}/${stage}`,
    pipeline: `${run.pipeline} · ${stage}`,
    status:
      run.status === 'failed' && i === 2 ? 'failed' : run.status === 'running' && i === 2 ? 'running' : 'succeeded',
    durationMinutes: run.durationMinutes === null ? null : Math.round((run.durationMinutes / 3) * 10) / 10,
    baselineMinutes: Math.round((run.baselineMinutes / 3) * 10) / 10,
    rowsWritten: Math.round(run.rowsWritten / 3),
    rowsRead: Math.round(run.rowsRead / 3),
    bytesWritten: Math.round(run.bytesWritten / 3),
    costUsd: Math.round((run.costUsd / 3) * 100) / 100,
    throughput: run.throughput.map((v) => Math.round(v / 3)),
    tasks: undefined,
  })),
}))
const GROUP_OF: Record<string, string> = {
  id: 'Run',
  route: 'Run',
  ownerName: 'Run',
  status: 'Health',
  progress: 'Health',
  throughput: 'Health',
  finishedAt: 'Timing',
  delta: 'Timing',
  startedAt: 'Timing',
  rowsWritten: 'Volume',
  bytesWritten: 'Volume',
  costUsd: 'Volume',
}
const groupedColumns: ExplorerColumn<PipelineRun>[] = PIPELINE_RUN_COLUMNS.map((c) => ({
  ...c,
  group: GROUP_OF[c.key],
}))

// A second, unrelated dataset to show the column config is generic.
interface Deployment {
  id: string
  service: string
  version: string
  environment: 'production' | 'staging' | 'preview'
  healthy: boolean
  errorRate: number
  latency: number[]
  owner: { name: string }
  deployedAt: string
  url: string
  budget: number
  [key: string]: unknown
}

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString()
const deployments: Deployment[] = [
  {
    id: 'd1',
    service: 'checkout-api',
    version: 'v4.12.0',
    environment: 'production',
    healthy: true,
    errorRate: 0.4,
    latency: [210, 205, 198, 240, 231, 225, 219, 214],
    owner: { name: 'Charlotte Reeves' },
    deployedAt: hoursAgo(3),
    url: 'https://checkout.example.com',
    budget: 4200,
  },
  {
    id: 'd2',
    service: 'search-indexer',
    version: 'v2.3.7',
    environment: 'production',
    healthy: false,
    errorRate: 6.8,
    latency: [320, 380, 410, 520, 690, 740, 810, 905],
    owner: { name: 'James Whitfield' },
    deployedAt: hoursAgo(9),
    url: 'https://search.example.com',
    budget: 1800,
  },
  {
    id: 'd3',
    service: 'billing-worker',
    version: 'v1.9.2',
    environment: 'staging',
    healthy: true,
    errorRate: 1.1,
    latency: [140, 138, 151, 149, 144, 142, 147, 139],
    owner: { name: 'Emily Hartmann' },
    deployedAt: hoursAgo(26),
    url: 'https://billing.staging.example.com',
    budget: 950,
  },
  {
    id: 'd4',
    service: 'web-frontend',
    version: 'v18.2.1',
    environment: 'production',
    healthy: true,
    errorRate: 0.2,
    latency: [88, 91, 87, 95, 90, 86, 89, 92],
    owner: { name: 'Charlotte Reeves' },
    deployedAt: hoursAgo(1),
    url: 'https://www.example.com',
    budget: 6100,
  },
  {
    id: 'd5',
    service: 'notifications',
    version: 'v3.0.0-rc.2',
    environment: 'preview',
    healthy: true,
    errorRate: 2.9,
    latency: [260, 240, 235, 250, 228, 221, 230, 226],
    owner: { name: 'Thomas Lindgren' },
    deployedAt: hoursAgo(0.5),
    url: 'https://pr-482.preview.example.com',
    budget: 120,
  },
  {
    id: 'd6',
    service: 'reporting-etl',
    version: 'v7.4.3',
    environment: 'staging',
    healthy: false,
    errorRate: 12.5,
    latency: [1200, 1350, 1500, 1480, 1620, 1710, 1800, 1955],
    owner: { name: 'James Whitfield' },
    deployedAt: hoursAgo(48),
    url: 'https://reports.staging.example.com',
    budget: 2300,
  },
]

const deployColumns: ExplorerColumn<Deployment>[] = [
  { key: 'service', label: 'Service', mono: true, sub: 'version', subMono: true, copyable: true, width: 208 },
  {
    key: 'environment',
    label: 'Environment',
    type: 'badge',
    badgeMap: {
      production: { label: 'Production', tone: 'ok' },
      staging: { label: 'Staging', tone: 'info' },
      preview: { label: 'Preview', tone: 'muted' },
    },
    width: 132,
  },
  { key: 'healthy', label: 'Healthy', type: 'boolean', align: 'center', width: 88 },
  { key: 'errorRate', label: 'Error rate', type: 'percent', aggregate: 'avg', width: 104 },
  { key: 'latency', label: 'p95 latency', type: 'sparkline', description: 'Last eight samples, ms', width: 128 },
  { key: 'owner', label: 'Owner', type: 'avatar', width: 176 },
  { key: 'deployedAt', label: 'Deployed', type: 'relative', width: 112 },
  { key: 'url', label: 'URL', type: 'link', format: (v) => String(v).replace('https://', ''), width: 208 },
  { key: 'budget', label: 'Monthly budget', type: 'currency', currency: 'EUR', aggregate: 'sum', width: 136 },
]

export default function DataExplorerDemo() {
  // Selection.
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  // Row actions.
  const [lastAction, setLastAction] = useState('')
  const rowActions = (run: PipelineRun): ExplorerRowAction<PipelineRun>[] => [
    { label: 'View logs', icon: FileText, onSelect: (r) => setLastAction(`Opened logs for ${r.id}`) },
    { label: 'Copy run ID', icon: Copy, onSelect: (r) => setLastAction(`Copied ${r.id}`) },
    {
      label: 'Retry run',
      icon: RotateCw,
      disabled: run.status === 'running' || run.status === 'queued',
      onSelect: (r) => setLastAction(`Retried ${r.pipeline}`),
    },
    {
      label: 'Cancel run',
      icon: X,
      variant: 'destructive',
      disabled: run.status !== 'running' && run.status !== 'queued',
      onSelect: (r) => setLastAction(`Cancelled ${r.id}`),
    },
  ]

  // Inline edit.
  const [lastEdit, setLastEdit] = useState('')
  function onCellEdit(e: ExplorerCellEdit<PipelineRun>) {
    setLastEdit(`${e.row.id} · ${e.key}: ${String(e.previous)} → ${String(e.value)}`)
  }

  return (
    <>
      <Story
        title="Default"
        description="64 sample pipeline runs with the full column set: two-line identifier, avatar, badge, progress, sparkline, delta, currency and dates. Search, per-column sort + filter, facets, columns menu, density, export, fullscreen and pagination are live; click a row for the detail sheet, whose header takes a #detail-actions slot."
      >
        <DataExplorer<PipelineRun>
          className="h-[34rem]"
          renderDetailActions={(row) => (
            <Button variant="outline" size="xs" onClick={() => setLastAction(`Opened logs for ${row?.id}`)}>
              <FileText className="text-muted-foreground size-3" aria-hidden="true" />
              View logs
            </Button>
          )}
        />
      </Story>

      <Story
        title="Async source"
        description="Pass `source(query)` instead of rows. Search, filters, sort, facet and page go to the source (here a mock server with 600ms latency); the first load shows the skeleton, later loads keep the rows under a progress line."
      >
        <DataExplorer source={source} className="h-[34rem]" />
      </Story>

      <Story
        title="Infinite scroll"
        description="pagination=infinite appends the next page as you near the bottom, using the cursor the source hands back. 5,000 rows behind a 350ms mock."
      >
        <DataExplorer source={infiniteSource} pagination="infinite" className="h-[34rem]" />
      </Story>

      <Story
        title="Virtualized 5,000 rows"
        description="virtual mounts only the rows on screen (row height measured from the first row). Sort, filter and search still run over all 5,000 rows client-side."
      >
        <DataExplorer rows={bigSample} virtual pagination="none" footer className="h-[34rem]" />
      </Story>

      <Story
        title="Row selection and bulk actions"
        description="selectable adds a checkbox column with a tri-state select-all; shift-click selects a range, ⌘/Ctrl+A selects the page and Esc clears. v-model:selected holds the keys across pages, and the bulk bar takes a #bulk-actions slot."
      >
        <div className="space-y-2">
          <DataExplorer<PipelineRun>
            selected={selectedKeys}
            onSelectedChange={setSelectedKeys}
            selectable
            className="h-[30rem]"
            renderBulkActions={({ rows, clear }) => (
              <>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => {
                    setLastAction(`Retried ${rows.length} runs`)
                    clear()
                  }}
                >
                  <RotateCw className="text-muted-foreground size-3" aria-hidden="true" />
                  Retry selected
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  className="text-destructive hover:text-destructive"
                  onClick={() => {
                    setLastAction(`Cancelled ${rows.length} runs`)
                    clear()
                  }}
                >
                  <X className="size-3" aria-hidden="true" />
                  Cancel selected
                </Button>
              </>
            )}
          />
          <p className="text-muted-foreground text-xs">
            Selected keys: {selectedKeys.length ? selectedKeys.join(', ') : '—'}
          </p>
        </div>
      </Story>

      <Story
        title="Expandable rows"
        description="expandable adds a chevron column; each row opens an inset #expanded panel. Here it plots the throughput series and surfaces the error message. detail=false so a row click expands instead of opening the sheet."
      >
        <DataExplorer
          expandable
          detail={false}
          rows={troubledRuns}
          className="h-[34rem]"
          renderExpanded={(row) => (
            <div className="grid gap-4 text-xs sm:grid-cols-[1fr_2fr]">
              <div className="space-y-1">
                <p className="text-muted-foreground font-medium tracking-wide uppercase">Error</p>
                <p className="text-destructive font-mono">{row.errorMessage}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground font-medium tracking-wide uppercase">Rows per minute</p>
                <div className="flex h-12 items-end gap-1">
                  {row.throughput.map((v, i) => (
                    <span
                      key={i}
                      className="bg-primary/70 w-4 rounded-sm"
                      style={{ height: `${Math.max(4, (v / Math.max(...row.throughput, 1)) * 100)}%` }}
                      title={`${v.toLocaleString()} rows/min`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        />
      </Story>

      <Story
        title="Custom cells and headers"
        description="A #cell-<key> slot replaces the typed renderer for a column and #header-<key> swaps the label inside the header control while sort, filter, pin and hide keep working. Route becomes source → target with an arrow and a retry marker; Throughput gets a live badge."
      >
        <DataExplorer<PipelineRun>
          className="h-[30rem]"
          renderCell={{
            route: ({ row }) => (
              <>
                <div className="flex min-w-0 items-center gap-1.5">
                  <span className="truncate">{row.source}</span>
                  <ArrowRight className="text-muted-foreground size-3 shrink-0" aria-hidden="true" />
                  <span className="sr-only">to</span>
                  <span className="truncate">{row.target}</span>
                  {row.trigger === 'retry' ? (
                    <>
                      <RotateCw className="text-muted-foreground size-3 shrink-0" aria-hidden="true" />
                      <span className="sr-only">Retry, attempt {row.attempt}</span>
                    </>
                  ) : null}
                </div>
                <span className="text-muted-foreground block truncate text-xs">
                  {row.sourceKind} → {row.targetKind}
                </span>
              </>
            ),
          }}
          renderHeader={{
            throughput: () => (
              <span className="inline-flex items-center gap-1">
                Rows/min
                <Badge variant="secondary" className="px-1 py-0 text-[10px]">
                  live
                </Badge>
              </span>
            ),
          }}
        />
      </Story>

      <Story
        title="Custom column set"
        description="The config is domain-agnostic: a deployments dataset with mono service + version, environment badge, boolean health, percent, sparkline, avatar object, relative time, link and EUR currency with footer aggregates."
      >
        <DataExplorer
          columns={deployColumns}
          rows={deployments}
          footer
          pagination="none"
          emptyTitle="No deployments"
          detailSections={[
            {
              title: 'Deployment',
              fields: ['service', 'version', 'environment', 'owner', 'deployedAt', 'url', 'budget'],
            },
          ]}
        />
      </Story>

      <Story
        title="Grouped by owner"
        description="group-by nests rows under collapsible group headers with counts. The header menu offers Group by on text, badge and avatar columns; the toolbar chip clears it."
      >
        <DataExplorer groupBy="ownerName" initialSort={{ key: 'startedAt', dir: 'desc' }} className="h-[34rem]" />
      </Story>

      <Story
        title="Tree rows and column groups"
        description="children-key nests child rows under a parent with a chevron and indent (tasks under each run here); a column `group` draws a spanning title row over adjacent columns."
      >
        <DataExplorer
          rows={treeRuns}
          columns={groupedColumns}
          childrenKey="tasks"
          pagination="none"
          className="h-[34rem]"
        />
      </Story>

      <Story
        title="Multi-sort, filters and facets"
        description="initial-sort takes a stack (each sorted header shows its rank; shift-click a header's sort option to add a level), initial-filters puts an operator rule on a column (solid funnel), and initial-facet preselects the status facet. Active rules are spelled out as removable chips under the toolbar."
      >
        <DataExplorer
          initialSort={[
            { key: 'delta', dir: 'desc' },
            { key: 'rowsWritten', dir: 'desc' },
          ]}
          initialFilters={[{ column: 'delta', operator: 'gt', value: '0' }]}
          initialFacet="succeeded"
          className="h-[30rem]"
        />
      </Story>

      <Story
        title="Pinned, resizable and hideable columns"
        description="pin=left/right keeps a column in view while the rest scroll (a divider shadow marks the edge). Drag a header's right edge to resize, double-click to reset. The Columns menu shows, hides, pins and reorders every column -- Bytes, Tags, Runbook and Scheduled start hidden."
      >
        <DataExplorer columns={pinnedColumns} className="h-[30rem]" />
      </Story>

      <Story
        title="Row actions menu"
        description="row-actions returns per-row items and adds a pinned actions column with a menu; the same items open on right-click. Items can be disabled or destructive per row."
      >
        <div className="space-y-2">
          <DataExplorer rowActions={rowActions} className="h-[30rem]" />
          <p className="text-muted-foreground text-xs" role="status">
            {lastAction || 'Open a row menu…'}
          </p>
        </div>
      </Story>

      <Story
        title="Inline editing"
        description="editable columns show a pencil on hover (or double-click); Enter commits and emits cellEdit with the previous value, Escape cancels. The Cost column is editable here."
      >
        <div className="space-y-2">
          <DataExplorer<PipelineRun> className="h-[30rem]" onCellEdit={onCellEdit} />
          <p className="text-muted-foreground text-xs" role="status">
            {lastEdit || 'Double-click a Cost cell…'}
          </p>
        </div>
      </Story>

      <Story
        title="Persisted state"
        description="persist-key stores sort, filters, hidden/order/pinned columns, widths, density and page size in localStorage and restores them on the next visit."
      >
        <DataExplorer persistKey="demo-explorer" className="h-[30rem]" />
      </Story>

      <Story
        title="Compact, striped and conditional rows"
        description="density=compact tightens rows to py-1 while type stays text-xs (the density menu switches at runtime); striped alternates row backgrounds; row-class returns extra classes per row -- failed runs get a destructive tint."
      >
        <DataExplorer<PipelineRun>
          density="compact"
          striped
          rowClass={(r) => (r.status === 'failed' ? 'bg-destructive/5 hover:bg-destructive/10' : undefined)}
          className="h-[30rem]"
        />
      </Story>

      <Story
        title="Loading"
        description="Skeleton rows capped at twelve, leading column wider so the placeholder reads as a table rather than a spreadsheet. Export is disabled while loading."
      >
        <DataExplorer loading className="h-[30rem]" />
      </Story>

      <Story
        title="Error with retry"
        description="A rejected source (or an error prop) replaces the body with an alert banner and a Retry action that re-issues the same query, showing the skeleton meanwhile. This mock fails once, then recovers."
      >
        <DataExplorer source={flakySource} className="h-[30rem]" />
      </Story>

      <Story
        title="Empty dataset"
        description="Pass rows=[] for the first-run empty state: an invitation rather than a dead end, with no reset button because nothing is filtered. Override it with the #empty slot."
      >
        <DataExplorer
          rows={[]}
          emptyTitle="No runs yet"
          emptyDescription="Runs appear here as soon as a pipeline is scheduled."
          className="h-[30rem]"
        />
      </Story>

      <Story
        title="Minimal chrome"
        description="Toolbar, pagination and detail sheet off -- just the table with its header controls, for embedding inside another card."
      >
        <DataExplorer toolbar={false} pagination="none" detail={false} rows={sample.slice(0, 6)} />
      </Story>
    </>
  )
}

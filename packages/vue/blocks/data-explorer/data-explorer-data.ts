// Sample dataset for the DataExplorer block: pipeline runs, deterministic, with
// a column config that exercises every cell type. Swap `createSampleRuns()` and
// `PIPELINE_RUN_COLUMNS` for your own source + columns.
import type { BadgeMapping, ExplorerColumn, ExplorerDetailSection, StatusTone } from './data-explorer-types'

export type RunStatus = 'succeeded' | 'running' | 'failed' | 'queued' | 'skipped' | 'partial'

export type RunTrigger = 'schedule' | 'manual' | 'retry' | 'backfill'

export interface PipelineRun {
  id: string
  pipeline: string
  source: string
  sourceKind: string
  target: string
  targetKind: string
  /** Owning team (slug). */
  owner: string
  /** On-call engineer for the run -- the avatar column. */
  ownerName: string
  status: RunStatus
  trigger: RunTrigger
  attempt: number
  region: string
  version: string
  scheduledFor: string
  startedAt: string
  /** Set once the run has reached a terminal state. */
  finishedAt: string | null
  /** The scheduler's projection while the run is still in flight. */
  expectedFinishAt: string | null
  baselineMinutes: number
  durationMinutes: number | null
  rowsRead: number
  rowsWritten: number
  bytesWritten: number
  /** Rows/min sampled twelve times across the run -- the sparkline column. */
  throughput: number[]
  costUsd: number
  errorMessage: string | null
  tags: string[]
  docsUrl: string
  [key: string]: unknown
}

export const STATUS_LABELS: Record<RunStatus, string> = {
  succeeded: 'Succeeded',
  running: 'Running',
  failed: 'Failed',
  queued: 'Queued',
  skipped: 'Skipped',
  partial: 'Partial',
}

/** Statuses map onto the semantic tone vocabulary, never onto raw colours. */
export const STATUS_TONES: Record<RunStatus, StatusTone> = {
  succeeded: 'ok',
  running: 'running',
  failed: 'danger',
  queued: 'warn',
  skipped: 'muted',
  partial: 'warn',
}

export const RUN_STATUS_BADGES: Record<string, BadgeMapping> = Object.fromEntries(
  (Object.keys(STATUS_LABELS) as RunStatus[]).map((s) => [s, { label: STATUS_LABELS[s], tone: STATUS_TONES[s] }]),
)

export function deltaMinutes(run: PipelineRun): number | null {
  if (run.durationMinutes === null) return null
  return run.durationMinutes - run.baselineMinutes
}

/** Which of the two finish timestamps the Finished column is showing. */
export function finishSource(run: PipelineRun): 'Actual' | 'Estimated' | '' {
  if (run.finishedAt) return 'Actual'
  if (run.expectedFinishAt) return 'Estimated'
  return ''
}

// ── Column config ───────────────────────────────────────────────────────

export const PIPELINE_RUN_COLUMNS: ExplorerColumn<PipelineRun>[] = [
  {
    key: 'id',
    label: 'Run',
    description: 'Run id with the pipeline it belongs to',
    sub: 'pipeline',
    subMono: true,
    copyable: true,
    width: 224,
    minWidth: 160,
  },
  {
    key: 'route',
    label: 'Route',
    accessor: (r) => `${r.source} → ${r.target}`,
    sub: (r) => `${r.sourceKind} → ${r.targetKind}`,
    width: 208,
  },
  {
    key: 'ownerName',
    label: 'Owner',
    type: 'avatar',
    description: 'On-call engineer for this run',
    sub: 'owner',
    width: 192,
  },
  {
    key: 'status',
    label: 'Status',
    type: 'badge',
    badgeMap: RUN_STATUS_BADGES,
    width: 132,
  },
  {
    key: 'progress',
    label: 'Progress',
    type: 'progress',
    description: 'Rows written as a share of rows read',
    accessor: (r) => (r.rowsRead ? Math.min(100, Math.round((r.rowsWritten / r.rowsRead) * 100)) : 0),
    width: 144,
  },
  {
    key: 'throughput',
    label: 'Throughput',
    type: 'sparkline',
    description: 'Rows per minute across the run',
    width: 136,
  },
  {
    key: 'finishedAt',
    label: 'Finished',
    type: 'datetime',
    accessor: (r) => r.finishedAt ?? r.expectedFinishAt,
    sub: (r) => finishSource(r),
    cellClass: (_, r) => (r.finishedAt ? '' : 'text-muted-foreground'),
    width: 160,
  },
  {
    key: 'delta',
    label: 'Δ Duration',
    type: 'number',
    delta: true,
    description: 'Minutes over (+) or under (−) the pipeline baseline',
    accessor: (r) => deltaMinutes(r),
    format: (v) =>
      v === null || v === undefined
        ? '—'
        : `${Number(v) > 0 ? '+' : ''}${(Math.round(Number(v) * 10) / 10).toFixed(1)}m`,
    aggregate: 'avg',
    width: 112,
  },
  {
    key: 'rowsWritten',
    label: 'Rows written',
    type: 'number',
    aggregate: 'sum',
    width: 128,
  },
  {
    key: 'bytesWritten',
    label: 'Bytes',
    type: 'bytes',
    aggregate: 'sum',
    hidden: true,
    width: 104,
  },
  {
    key: 'costUsd',
    label: 'Cost',
    type: 'currency',
    aggregate: 'sum',
    editable: 'number',
    description: 'Compute cost -- double-click to correct',
    width: 104,
  },
  {
    key: 'tags',
    label: 'Tags',
    type: 'tags',
    hidden: true,
    width: 176,
  },
  {
    key: 'docsUrl',
    label: 'Runbook',
    type: 'link',
    href: (r) => r.docsUrl,
    format: () => 'Runbook',
    hidden: true,
    sortable: false,
    width: 104,
  },
  {
    key: 'startedAt',
    label: 'Started',
    type: 'datetime',
    cellClass: 'text-muted-foreground',
    width: 160,
  },
  {
    key: 'scheduledFor',
    label: 'Scheduled',
    type: 'relative',
    hidden: true,
    width: 112,
  },
]

export const PIPELINE_RUN_SECTIONS: ExplorerDetailSection[] = [
  { title: 'Identity', fields: ['id', 'pipeline', 'owner', 'ownerName', 'trigger', 'attempt', 'version'] },
  { title: 'Source & target', fields: ['source', 'sourceKind', 'target', 'targetKind', 'region'] },
  { title: 'Status', fields: ['status', 'errorMessage'] },
  {
    title: 'Timing',
    fields: ['scheduledFor', 'startedAt', 'finishedAt', 'expectedFinishAt', 'durationMinutes', 'baselineMinutes'],
  },
  { title: 'Volume & cost', fields: ['rowsRead', 'rowsWritten', 'bytesWritten', 'costUsd'] },
]

// ── Sample data ─────────────────────────────────────────────────────────
//
// Deterministic: a seeded generator so every render (and both frameworks'
// demos) show the same runs.

const PIPELINES: { name: string; owner: string; ownerName: string; baseline: number; rows: number }[] = [
  { name: 'orders.daily_rollup', owner: 'data-platform', ownerName: 'Maya Lindqvist', baseline: 14, rows: 1_204_551 },
  { name: 'billing.invoice_snapshots', owner: 'finance-eng', ownerName: 'Oliver Brandt', baseline: 9, rows: 88_310 },
  { name: 'events.sessionize', owner: 'growth', ownerName: 'Sophie Marchand', baseline: 42, rows: 19_882_004 },
  { name: 'crm.contacts_sync', owner: 'revops', ownerName: 'Daniel Whitaker', baseline: 6, rows: 41_920 },
  {
    name: 'warehouse.dim_customers',
    owner: 'data-platform',
    ownerName: 'Maya Lindqvist',
    baseline: 11,
    rows: 2_311_408,
  },
  { name: 'search.reindex_products', owner: 'search', ownerName: 'Lucas Ferreira', baseline: 27, rows: 640_119 },
  { name: 'ml.features_hourly', owner: 'ml-infra', ownerName: 'Hannah Kowalski', baseline: 18, rows: 5_430_772 },
  { name: 'finance.fx_rates', owner: 'finance-eng', ownerName: 'Oliver Brandt', baseline: 2, rows: 1_440 },
  { name: 'support.ticket_metrics', owner: 'revops', ownerName: 'Daniel Whitaker', baseline: 7, rows: 120_664 },
  { name: 'marketing.attribution', owner: 'growth', ownerName: 'Sophie Marchand', baseline: 33, rows: 7_002_318 },
  { name: 'auth.login_audit', owner: 'data-platform', ownerName: 'Ethan Caldwell', baseline: 5, rows: 3_118_902 },
  { name: 'inventory.stock_levels', owner: 'data-platform', ownerName: 'Ethan Caldwell', baseline: 12, rows: 402_775 },
]

const ROUTES: { source: string; sourceKind: string; target: string; targetKind: string }[] = [
  { source: 'pg-main', sourceKind: 'Postgres', target: 'ch-analytics', targetKind: 'ClickHouse' },
  { source: 'mysql-billing', sourceKind: 'MySQL', target: 'snowflake-core', targetKind: 'Snowflake' },
  { source: 'kafka-events', sourceKind: 'Kafka', target: 'ch-events', targetKind: 'ClickHouse' },
  { source: 's3-raw', sourceKind: 'S3', target: 'bq-warehouse', targetKind: 'BigQuery' },
  { source: 'hubspot', sourceKind: 'HubSpot API', target: 'pg-crm', targetKind: 'Postgres' },
  { source: 'pg-main', sourceKind: 'Postgres', target: 'opensearch-products', targetKind: 'OpenSearch' },
]

const REGIONS = ['us-east-1', 'eu-west-1', 'ap-southeast-1']

const ERRORS = [
  'Connection reset by peer while streaming batch 31/48',
  'Schema drift: column `discount_code` missing in source',
  'Target rejected 2,114 rows: value out of range for UInt32',
  'Upstream extract timed out after 1800s',
  'Snapshot lock could not be acquired (held by run_2c81f0)',
]

/** mulberry32 -- small, seedable, good enough for sample data. */
function seeded(seed: number) {
  let t = seed >>> 0
  return () => {
    t = (t + 0x6d2b79f5) >>> 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(rand: () => number, list: readonly T[]): T {
  return list[Math.floor(rand() * list.length)] as T
}

function hex(rand: () => number, len: number): string {
  let out = ''
  for (let i = 0; i < len; i++) out += Math.floor(rand() * 16).toString(16)
  return out
}

function pickStatus(rand: () => number, index: number): RunStatus {
  // Most recent rows are more likely to still be in flight.
  if (index < 3) return index === 1 ? 'queued' : 'running'
  const r = rand()
  if (r < 0.58) return 'succeeded'
  if (r < 0.72) return 'failed'
  if (r < 0.8) return 'partial'
  if (r < 0.88) return 'skipped'
  if (r < 0.94) return 'queued'
  return 'running'
}

/**
 * Pipeline runs, newest first, spread back in time from `now`. Deterministic
 * for a given `now` + `count`; pass a fixed date for snapshots. `count` above
 * a few thousand is what the virtualised demo uses.
 */
export function createSampleRuns(now: Date = new Date(), count = 64): PipelineRun[] {
  // Round the clock to the minute so a server render and its client hydration
  // (a few hundred ms apart) print the same timestamps.
  now = new Date(Math.floor(now.getTime() / 60_000) * 60_000)
  const rand = seeded(20260909)
  const runs: PipelineRun[] = []
  let cursor = now.getTime() - 6 * 60_000

  for (let i = 0; i < count; i++) {
    const pipeline = PIPELINES[i % PIPELINES.length]!
    const route = ROUTES[(i * 7 + Math.floor(i / PIPELINES.length)) % ROUTES.length]!
    const status = pickStatus(rand, i)
    const trigger: RunTrigger =
      rand() < 0.74 ? 'schedule' : rand() < 0.5 ? 'manual' : rand() < 0.5 ? 'retry' : 'backfill'
    const attempt = trigger === 'retry' ? 2 + Math.floor(rand() * 2) : 1

    // Gaps between runs: 20-140 minutes, so the list reads as a real schedule.
    cursor -= (20 + Math.floor(rand() * 120)) * 60_000
    const scheduledFor = new Date(cursor)
    const startedAt = new Date(cursor + Math.floor(rand() * 90) * 1000)

    // Duration drifts around the baseline; failures cut short, partials run long.
    const drift = (rand() - 0.45) * pipeline.baseline * 0.6
    let durationMinutes: number | null = Math.max(0.4, pipeline.baseline + drift)
    if (status === 'failed') durationMinutes = Math.max(0.3, durationMinutes * rand() * 0.8)
    if (status === 'partial') durationMinutes = durationMinutes * (1.3 + rand() * 0.6)
    if (status === 'skipped') durationMinutes = 0.1
    if (status === 'running' || status === 'queued') durationMinutes = null

    const finishedAt = durationMinutes === null ? null : new Date(startedAt.getTime() + durationMinutes * 60_000)
    const expectedFinishAt =
      status === 'running' || status === 'queued'
        ? new Date(startedAt.getTime() + pipeline.baseline * 60_000 * (1 + rand() * 0.2))
        : null

    const ratio =
      status === 'succeeded' ? 1 : status === 'partial' ? 0.55 + rand() * 0.35 : status === 'failed' ? rand() * 0.5 : 0
    const rowsRead = Math.round(pipeline.rows * (0.92 + rand() * 0.16))
    const rowsWritten = status === 'running' ? Math.round(rowsRead * rand() * 0.7) : Math.round(rowsRead * ratio)
    const bytesWritten = rowsWritten * (180 + Math.floor(rand() * 240))

    // Throughput ramps up, holds, then tails off; failures fall off a cliff.
    const peak = Math.max(1, Math.round(rowsRead / Math.max(1, pipeline.baseline)))
    const throughput = Array.from({ length: 12 }, (_, k) => {
      const shape = k < 3 ? (k + 1) / 3 : k > 9 ? (12 - k) / 3 : 1
      const noise = 0.85 + rand() * 0.3
      const cliff = status === 'failed' && k > 6 ? 0 : 1
      return Math.round(peak * shape * noise * cliff)
    })

    const minutesBilled = durationMinutes ?? pipeline.baseline * 0.4
    const costUsd = Math.round(minutesBilled * (0.18 + rand() * 0.22) * 100) / 100

    runs.push({
      id: `run_${hex(rand, 6)}_${i}`,
      pipeline: pipeline.name,
      source: route.source,
      sourceKind: route.sourceKind,
      target: route.target,
      targetKind: route.targetKind,
      owner: pipeline.owner,
      ownerName: pipeline.ownerName,
      status,
      trigger,
      attempt,
      region: pick(rand, REGIONS),
      version: `v${2 + Math.floor(rand() * 2)}.${Math.floor(rand() * 14)}.${Math.floor(rand() * 9)}`,
      scheduledFor: scheduledFor.toISOString(),
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt ? finishedAt.toISOString() : null,
      expectedFinishAt: expectedFinishAt ? expectedFinishAt.toISOString() : null,
      baselineMinutes: pipeline.baseline,
      durationMinutes: durationMinutes === null ? null : Math.round(durationMinutes * 10) / 10,
      rowsRead,
      rowsWritten,
      bytesWritten,
      throughput,
      costUsd,
      errorMessage: status === 'failed' || status === 'partial' ? pick(rand, ERRORS) : null,
      tags: [
        pipeline.name.split('.')[0]!,
        route.targetKind.toLowerCase(),
        ...(trigger === 'backfill' ? ['backfill'] : []),
      ],
      docsUrl: `https://runbooks.example.com/pipelines/${pipeline.name.replace('.', '/')}`,
    })
  }

  return runs
}

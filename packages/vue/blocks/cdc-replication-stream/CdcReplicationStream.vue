<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  Activity,
  ArrowRight,
  ArrowRightLeft,
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  Database,
  Download,
  Filter,
  Layers,
  Pause,
  Play,
  RefreshCw,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export type CdcOperation = 'INSERT' | 'UPDATE' | 'DELETE'

export interface CdcTableMetric {
  name: string
  schema: string
  primaryKey: string
  syncedRows: number
  replicationDelayMs: number
  status: 'synchronized' | 'syncing' | 'paused'
  operations: {
    insertPercent: number
    updatePercent: number
    deletePercent: number
  }
  mode: string
}

export interface CdcStreamEvent {
  id: string
  timestamp: string
  table: string
  operation: CdcOperation
  primaryKey: string
  binlogPosition: string
  lsn: string
  txId: string
  summary: string
  modifiedFields?: string[]
  before?: Record<string, unknown>
  after?: Record<string, unknown>
}

interface Props {
  initialEvents?: CdcStreamEvent[]
  initialTables?: CdcTableMetric[]
  initialPaused?: boolean
  initialOperationFilter?: 'all' | CdcOperation
  initialSearch?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  initialPaused: false,
  initialOperationFilter: 'all',
  initialSearch: '',
})

const defaultTables: CdcTableMetric[] = [
  {
    name: 'users',
    schema: 'public',
    primaryKey: 'id [UUID]',
    syncedRows: 1842910,
    replicationDelayMs: 12,
    status: 'synchronized',
    operations: {
      insertPercent: 65,
      updatePercent: 30,
      deletePercent: 5,
    },
    mode: 'Continuous WAL',
  },
  {
    name: 'orders',
    schema: 'public',
    primaryKey: 'order_id [BIGINT]',
    syncedRows: 2145820,
    replicationDelayMs: 16,
    status: 'synchronized',
    operations: {
      insertPercent: 78,
      updatePercent: 20,
      deletePercent: 2,
    },
    mode: 'Continuous WAL',
  },
  {
    name: 'transactions',
    schema: 'public',
    primaryKey: 'tx_hash [VARCHAR]',
    syncedRows: 624300,
    replicationDelayMs: 18,
    status: 'synchronized',
    operations: {
      insertPercent: 92,
      updatePercent: 7,
      deletePercent: 1,
    },
    mode: 'Continuous WAL',
  },
  {
    name: 'subscriptions',
    schema: 'public',
    primaryKey: 'sub_id [UUID]',
    syncedRows: 208440,
    replicationDelayMs: 14,
    status: 'synchronized',
    operations: {
      insertPercent: 45,
      updatePercent: 50,
      deletePercent: 5,
    },
    mode: 'Continuous WAL',
  },
]

const defaultEvents: CdcStreamEvent[] = [
  {
    id: 'evt-cdc-104',
    timestamp: '2026-08-21T14:32:05.812Z',
    table: 'public.subscriptions',
    operation: 'UPDATE',
    primaryKey: 'sub_99a8b1c4',
    binlogPosition: 'mysql-bin.000412 : 8492014',
    lsn: '0/16B38E0',
    txId: 'tx_883019',
    summary: 'status: "trialing" → "active", plan: "starter_monthly" → "enterprise_annual", seats: 5 → 25',
    modifiedFields: ['status', 'plan', 'seats', 'monthly_amount', 'trial_ends_at', 'updated_at'],
    before: {
      id: 'sub_99a8b1c4',
      user_id: 'usr_44018',
      plan: 'starter_monthly',
      status: 'trialing',
      seats: 5,
      monthly_amount: 49.0,
      auto_renew: true,
      trial_ends_at: '2026-08-21T23:59:59Z',
      updated_at: '2026-08-14T10:00:00Z',
    },
    after: {
      id: 'sub_99a8b1c4',
      user_id: 'usr_44018',
      plan: 'enterprise_annual',
      status: 'active',
      seats: 25,
      monthly_amount: 490.0,
      auto_renew: true,
      trial_ends_at: null,
      updated_at: '2026-08-21T14:32:05Z',
    },
  },
  {
    id: 'evt-cdc-103',
    timestamp: '2026-08-21T14:32:04.195Z',
    table: 'public.orders',
    operation: 'INSERT',
    primaryKey: 'ord_8819203',
    binlogPosition: 'mysql-bin.000412 : 8491820',
    lsn: '0/16B3698',
    txId: 'tx_883018',
    summary: 'New checkout order created for $1,280.00 (Customer: usr_99120, 3 line items)',
    modifiedFields: [],
    after: {
      order_id: 'ord_8819203',
      customer_id: 'usr_99120',
      currency: 'USD',
      total_amount: 1280.0,
      tax_amount: 102.4,
      status: 'paid',
      payment_gateway: 'stripe_card',
      shipping_country: 'US',
      created_at: '2026-08-21T14:32:04Z',
    },
  },
  {
    id: 'evt-cdc-102',
    timestamp: '2026-08-21T14:31:59.604Z',
    table: 'public.transactions',
    operation: 'UPDATE',
    primaryKey: 'tx_0x99b1f41',
    binlogPosition: 'mysql-bin.000412 : 8491412',
    lsn: '0/16B3440',
    txId: 'tx_883017',
    summary: 'status: "processing" → "settled", settled_at timestamp set',
    modifiedFields: ['status', 'settled_at'],
    before: {
      tx_hash: 'tx_0x99b1f41',
      order_id: 'ord_8819198',
      amount: 349.5,
      status: 'processing',
      settled_at: null,
      fee_cents: 1045,
    },
    after: {
      tx_hash: 'tx_0x99b1f41',
      order_id: 'ord_8819198',
      amount: 349.5,
      status: 'settled',
      settled_at: '2026-08-21T14:31:59Z',
      fee_cents: 1045,
    },
  },
  {
    id: 'evt-cdc-101',
    timestamp: '2026-08-21T14:31:52.410Z',
    table: 'public.users',
    operation: 'INSERT',
    primaryKey: 'usr_99304',
    binlogPosition: 'mysql-bin.000412 : 8490980',
    lsn: '0/16B31F0',
    txId: 'tx_883016',
    summary: 'New user registration: elena.rostova@cloudscale.io (Org: org_7720)',
    modifiedFields: [],
    after: {
      id: 'usr_99304',
      email: 'elena.rostova@cloudscale.io',
      full_name: 'Elena Rostova',
      org_id: 'org_7720',
      role: 'data_engineer',
      email_verified: true,
      mfa_enabled: true,
      created_at: '2026-08-21T14:31:52Z',
    },
  },
  {
    id: 'evt-cdc-100',
    timestamp: '2026-08-21T14:31:40.118Z',
    table: 'public.subscriptions',
    operation: 'DELETE',
    primaryKey: 'sub_7718021',
    binlogPosition: 'mysql-bin.000412 : 8490410',
    lsn: '0/16B2FA0',
    txId: 'tx_883015',
    summary: 'Hard purge of cancelled expired trial subscription sub_7718021',
    modifiedFields: [],
    before: {
      id: 'sub_7718021',
      user_id: 'usr_22910',
      plan: 'developer_free',
      status: 'cancelled',
      seats: 1,
      deleted_at: '2026-08-21T14:31:40Z',
    },
  },
]

const tables = ref<CdcTableMetric[]>(props.initialTables ? [...props.initialTables] : [...defaultTables])
const events = ref<CdcStreamEvent[]>(props.initialEvents ? [...props.initialEvents] : [...defaultEvents])
const isPaused = ref(props.initialPaused)
const isSnapshotting = ref(false)
const snapshotNotice = ref(false)
const selectedOperation = ref<'all' | CdcOperation>(props.initialOperationFilter)
const searchQuery = ref(props.initialSearch)
const expandedIds = ref<Record<string, boolean>>({
  'evt-cdc-104': true,
})
const copiedEventId = ref<string | null>(null)
const copiedBinlog = ref(false)
const exportedNotice = ref(false)

const currentBinlog = 'mysql-bin.000412 : 8492014'

function matchesSearch(event: CdcStreamEvent, query: string): boolean {
  if (!query.trim()) return true
  const q = query.trim()

  if (q.startsWith('/') && q.length > 1) {
    const lastSlash = q.lastIndexOf('/')
    if (lastSlash > 0) {
      const pattern = q.slice(1, lastSlash)
      const flags = q.slice(lastSlash + 1)
      try {
        const re = new RegExp(pattern, flags)
        return (
          re.test(event.table) ||
          re.test(event.operation) ||
          re.test(event.primaryKey) ||
          re.test(event.binlogPosition) ||
          re.test(event.lsn) ||
          re.test(event.txId) ||
          re.test(event.summary) ||
          re.test(JSON.stringify(event.before ?? {})) ||
          re.test(JSON.stringify(event.after ?? {}))
        )
      } catch {
        // Fall back to plain search on invalid regex
      }
    }
  }

  const lower = q.toLowerCase()
  return (
    event.table.toLowerCase().includes(lower) ||
    event.operation.toLowerCase().includes(lower) ||
    event.primaryKey.toLowerCase().includes(lower) ||
    event.binlogPosition.toLowerCase().includes(lower) ||
    event.lsn.toLowerCase().includes(lower) ||
    event.txId.toLowerCase().includes(lower) ||
    event.summary.toLowerCase().includes(lower) ||
    JSON.stringify(event.before ?? {})
      .toLowerCase()
      .includes(lower) ||
    JSON.stringify(event.after ?? {})
      .toLowerCase()
      .includes(lower)
  )
}

const filteredEvents = computed(() => {
  return events.value.filter((event) => {
    const matchesOp = selectedOperation.value === 'all' || event.operation === selectedOperation.value
    const matchesText = matchesSearch(event, searchQuery.value)
    return matchesOp && matchesText
  })
})

const operationCounts = computed(() => {
  return {
    all: events.value.length,
    INSERT: events.value.filter((e) => e.operation === 'INSERT').length,
    UPDATE: events.value.filter((e) => e.operation === 'UPDATE').length,
    DELETE: events.value.filter((e) => e.operation === 'DELETE').length,
  }
})

const allExpanded = computed(() => {
  return filteredEvents.value.length > 0 && filteredEvents.value.every((e) => expandedIds.value[e.id])
})

function togglePause() {
  isPaused.value = !isPaused.value
}

function toggleExpand(id: string) {
  expandedIds.value[id] = !expandedIds.value[id]
}

function toggleAllExpand() {
  if (allExpanded.value) {
    expandedIds.value = {}
  } else {
    const next: Record<string, boolean> = {}
    filteredEvents.value.forEach((e) => {
      next[e.id] = true
    })
    expandedIds.value = next
  }
}

function triggerSnapshot() {
  if (isSnapshotting.value) return
  isSnapshotting.value = true
  snapshotNotice.value = true

  setTimeout(() => {
    isSnapshotting.value = false
  }, 2200)

  setTimeout(() => {
    snapshotNotice.value = false
  }, 6000)
}

function clearStream() {
  events.value = []
  expandedIds.value = {}
}

function resetStream() {
  events.value = props.initialEvents ? [...props.initialEvents] : [...defaultEvents]
  searchQuery.value = ''
  selectedOperation.value = 'all'
  expandedIds.value = { 'evt-cdc-104': true }
}

function copyBinlogPosition() {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(currentBinlog)
    copiedBinlog.value = true
    setTimeout(() => {
      copiedBinlog.value = false
    }, 2000)
  }
}

function copyPayload(id: string, payload: Record<string, unknown>) {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
    copiedEventId.value = id
    setTimeout(() => {
      if (copiedEventId.value === id) {
        copiedEventId.value = null
      }
    }, 2000)
  }
}

function exportJson() {
  const dataStr =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(
      JSON.stringify(
        {
          pipeline: 'Postgres Source (OLTP) -> Snowflake DW (OLAP)',
          binlog_position: currentBinlog,
          timestamp: new Date().toISOString(),
          tables: tables.value,
          events: filteredEvents.value,
        },
        null,
        2,
      ),
    )
  if (typeof document !== 'undefined') {
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', dataStr)
    downloadAnchor.setAttribute(
      'download',
      `cdc-replication-stream-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`,
    )
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
    exportedNotice.value = true
    setTimeout(() => {
      exportedNotice.value = false
    }, 2000)
  }
}

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toISOString().replace('T', ' ').replace('Z', ' UTC')
  } catch {
    return iso
  }
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}
</script>

<template>
  <div data-slot="cdc-replication-stream" :class="cn('w-full space-y-4', props.class)">
    <!-- Header: Sync Pipeline Overview & Global Controls -->
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div class="flex items-start gap-3 sm:items-center">
        <div class="bg-card flex size-10 shrink-0 items-center justify-center rounded-lg border shadow-xs">
          <ArrowRightLeft class="text-primary size-5" aria-hidden="true" />
        </div>
        <div class="space-y-1">
          <div class="flex flex-wrap items-center gap-2">
            <h2 class="text-foreground text-2xl font-bold tracking-tight">CDC Replication Stream</h2>

            <!-- Real-Time Status Badge -->
            <div
              v-if="isSnapshotting"
              class="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-xs font-medium text-sky-600 dark:text-sky-400"
            >
              <RefreshCw class="size-3 animate-spin" aria-hidden="true" />
              <span>Snapshot Ingest Active</span>
            </div>
            <div
              v-else-if="!isPaused"
              class="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
            >
              <span class="relative flex size-2 shrink-0">
                <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span class="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span>Replication Streaming · 18ms Latency</span>
            </div>
            <div
              v-else
              class="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400"
            >
              <span class="relative inline-flex size-2 rounded-full bg-amber-500" />
              <span>Replication Paused</span>
            </div>
          </div>

          <!-- Pipeline Architecture Breadcrumb -->
          <div class="flex flex-wrap items-center gap-1.5 text-xs">
            <span class="text-foreground font-semibold">Postgres Source (OLTP)</span>
            <ArrowRight class="text-muted-foreground size-3.5" aria-hidden="true" />
            <span class="text-primary font-semibold">Snowflake DW (OLAP)</span>
            <span class="text-muted-foreground hidden font-mono sm:inline">Debezium 2.7 · Apache Kafka · pgoutput</span>
          </div>
        </div>
      </div>

      <!-- Header Action Controls & Binlog Pointer -->
      <div class="flex flex-wrap items-center gap-2">
        <!-- Binlog Position Indicator Chip -->
        <button
          type="button"
          aria-label="Copy current binlog position"
          class="bg-muted/50 hover:bg-muted focus-visible:ring-ring flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
          @click="copyBinlogPosition"
        >
          <Terminal class="text-muted-foreground size-3.5" aria-hidden="true" />
          <span class="text-muted-foreground">Binlog:</span>
          <span class="text-foreground font-mono font-medium">{{ currentBinlog }}</span>
          <Check v-if="copiedBinlog" class="size-3 text-emerald-500" aria-hidden="true" />
          <Copy v-else class="text-muted-foreground size-3 opacity-70" aria-hidden="true" />
        </button>

        <Button variant="outline" size="sm" :disabled="isSnapshotting" class="gap-1.5" @click="triggerSnapshot">
          <RefreshCw :class="cn('size-3.5', isSnapshotting && 'text-primary animate-spin')" aria-hidden="true" />
          <span>{{ isSnapshotting ? 'Syncing Snapshot...' : 'Force Sync Snapshot' }}</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          :class="isPaused ? 'border-amber-500/40 text-amber-600 dark:text-amber-400' : ''"
          @click="togglePause"
        >
          <Play v-if="isPaused" class="size-3.5 fill-current" aria-hidden="true" />
          <Pause v-else class="size-3.5" aria-hidden="true" />
          <span>{{ isPaused ? 'Resume Stream' : 'Pause Stream' }}</span>
        </Button>

        <Button aria-label="Download attachment" variant="default" size="sm" class="gap-1.5" @click="exportJson">
          <Check v-if="exportedNotice" class="size-3.5 text-emerald-300" aria-hidden="true" />
          <Download v-else class="size-3.5" aria-hidden="true" />
          <span>{{ exportedNotice ? 'Exported' : 'Export JSON' }}</span>
        </Button>
      </div>
    </div>

    <!-- Snapshot Notification Banner -->
    <div
      v-if="snapshotNotice"
      class="text-foreground flex items-center justify-between rounded-lg border border-sky-500/30 bg-sky-500/10 p-3 text-xs shadow-xs"
    >
      <div class="flex items-center gap-2.5">
        <Sparkles class="size-4 shrink-0 text-sky-500" aria-hidden="true" />
        <div>
          <span class="font-semibold text-sky-600 dark:text-sky-400">Snapshot sync initiated:</span>
          <span>
            Executing non-blocking logical schema snapshot across 4 tables at WAL offset
            <code class="font-mono font-medium">mysql-bin.000412 : 8492014</code>.
          </span>
        </div>
      </div>
      <Badge variant="outline" class="font-mono text-xs">LSN: 0/16B38E0</Badge>
    </div>

    <!-- 4 CDC Telemetry Metric Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- 1. Replication Lag -->
      <Card class="border-border shadow-xs">
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-xs font-medium">Replication Lag</span>
            <div
              class="bg-primary/10 text-primary border-primary/20 flex size-8 items-center justify-center rounded-md border"
            >
              <Zap class="size-4" aria-hidden="true" />
            </div>
          </div>
          <div class="mt-3 space-y-1.5">
            <div class="flex items-baseline gap-2">
              <span class="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">18ms</span>
              <span class="text-muted-foreground text-xs">p99: 24ms</span>
            </div>
            <div class="flex items-center gap-2">
              <Badge variant="success" class="font-mono text-xs"> Sub-second real-time </Badge>
            </div>
            <div class="pt-1">
              <div class="text-muted-foreground flex justify-between text-xs">
                <span>SLA Headroom</span>
                <span class="font-mono">96.4%</span>
              </div>
              <Progress :model-value="3.6" class="mt-1 h-1.5" />
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 2. Throughput -->
      <Card class="border-border shadow-xs">
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-xs font-medium">Throughput</span>
            <div
              class="flex size-8 items-center justify-center rounded-md border border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400"
            >
              <Activity class="size-4" aria-hidden="true" />
            </div>
          </div>
          <div class="mt-3 space-y-1.5">
            <div class="flex items-baseline gap-1.5">
              <span class="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">1,420</span>
              <span class="text-muted-foreground text-xs">events/sec</span>
            </div>
            <div class="flex items-center gap-2">
              <Badge variant="info" class="font-mono text-xs"> 380 KB/s bandwidth </Badge>
            </div>
            <div class="text-muted-foreground flex items-center justify-between pt-1 text-xs">
              <span>Hourly Pace</span>
              <span class="text-foreground font-mono font-medium">5.11M evts/hr</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 3. Total Synced Today -->
      <Card class="border-border shadow-xs">
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-xs font-medium">Total Synced Today</span>
            <div
              class="flex size-8 items-center justify-center rounded-md border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            >
              <Database class="size-4" aria-hidden="true" />
            </div>
          </div>
          <div class="mt-3 space-y-1.5">
            <div class="flex items-baseline gap-1.5">
              <span class="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">4.82M</span>
              <span class="text-muted-foreground text-xs">Row Changes</span>
            </div>
            <div class="flex items-center gap-2">
              <Badge
                variant="outline"
                class="border-emerald-500/30 font-mono text-xs text-emerald-600 dark:text-emerald-400"
              >
                +14.2% vs yesterday
              </Badge>
            </div>
            <div class="text-muted-foreground flex items-center justify-between pt-1 text-xs">
              <span>WAL Integrity</span>
              <span class="font-mono font-medium text-emerald-600 dark:text-emerald-400">100% Consistent</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 4. Error / Dead Letter Queue -->
      <Card class="border-border shadow-xs">
        <CardContent class="p-4">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-xs font-medium">Error / DLQ</span>
            <div
              class="flex size-8 items-center justify-center rounded-md border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            >
              <ShieldCheck class="size-4" aria-hidden="true" />
            </div>
          </div>
          <div class="mt-3 space-y-1.5">
            <div class="flex items-baseline gap-1.5">
              <span class="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">0</span>
              <span class="text-muted-foreground text-xs">Failed Events</span>
            </div>
            <div class="flex items-center gap-2">
              <Badge variant="success" class="font-mono text-xs"> DLQ Empty · Healthy </Badge>
            </div>
            <div class="text-muted-foreground flex items-center justify-between pt-1 text-xs">
              <span>Schema Drift</span>
              <span class="text-foreground font-mono font-medium">0 Violations</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Active Synced Tables Table -->
    <Card class="border-border shadow-xs">
      <CardHeader class="pb-3">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle class="text-base font-semibold">Active Synced Tables ({{ tables.length }})</CardTitle>
            <CardDescription class="text-xs">
              Per-table WAL change capture distribution, row synchronization counts, and per-table replication latency
            </CardDescription>
          </div>
          <div class="text-muted-foreground flex items-center gap-2 text-xs">
            <span class="flex items-center gap-1">
              <span class="size-2 rounded-full bg-emerald-500" />
              INSERT
            </span>
            <span class="flex items-center gap-1">
              <span class="size-2 rounded-full bg-sky-500" />
              UPDATE
            </span>
            <span class="flex items-center gap-1">
              <span class="size-2 rounded-full bg-rose-500" />
              DELETE
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <Table density="cozy">
            <TableHeader>
              <TableRow>
                <TableHead class="text-xs font-semibold">Table Name & Schema</TableHead>
                <TableHead class="text-xs font-semibold">Change Operations Breakdown</TableHead>
                <TableHead class="text-right text-xs font-semibold">Synced Rows Count</TableHead>
                <TableHead class="text-right text-xs font-semibold">Replication Delay</TableHead>
                <TableHead class="text-center text-xs font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="table in tables" :key="table.name" class="group">
                <!-- Table Name & Schema -->
                <TableCell class="py-3">
                  <div class="space-y-0.5">
                    <div class="flex items-center gap-2">
                      <span class="text-foreground font-mono text-xs font-semibold">
                        {{ table.schema }}.{{ table.name }}
                      </span>
                      <Badge variant="outline" class="font-mono text-xs">
                        {{ table.primaryKey }}
                      </Badge>
                    </div>
                    <p class="text-muted-foreground text-xs font-normal">Mode: {{ table.mode }}</p>
                  </div>
                </TableCell>

                <!-- Operations Multi-Segment Stacked Progress Bar & Percentages -->
                <TableCell class="py-3">
                  <div class="w-full max-w-xs space-y-1.5">
                    <!-- Stacked Progress Bar -->
                    <div class="bg-muted flex h-2 w-full overflow-hidden rounded-full border">
                      <div
                        class="bg-emerald-500 transition-all duration-300"
                        :style="{ width: `${table.operations.insertPercent}%` }"
                        :title="`INSERT: ${table.operations.insertPercent}%`"
                      />
                      <div
                        class="bg-sky-500 transition-all duration-300"
                        :style="{ width: `${table.operations.updatePercent}%` }"
                        :title="`UPDATE: ${table.operations.updatePercent}%`"
                      />
                      <div
                        class="bg-rose-500 transition-all duration-300"
                        :style="{ width: `${table.operations.deletePercent}%` }"
                        :title="`DELETE: ${table.operations.deletePercent}%`"
                      />
                    </div>

                    <!-- Breakdown Text -->
                    <div class="flex items-center gap-2 font-mono text-xs">
                      <span class="font-medium text-emerald-600 dark:text-emerald-400">
                        INS {{ table.operations.insertPercent }}%
                      </span>
                      <span class="font-medium text-sky-600 dark:text-sky-400">
                        UPD {{ table.operations.updatePercent }}%
                      </span>
                      <span class="font-medium text-rose-600 dark:text-rose-400">
                        DEL {{ table.operations.deletePercent }}%
                      </span>
                    </div>
                  </div>
                </TableCell>

                <!-- Synced Rows Count -->
                <TableCell class="py-3 text-right">
                  <span class="text-foreground font-mono text-xs font-semibold tabular-nums">
                    {{ formatNumber(table.syncedRows) }}
                  </span>
                  <p class="text-muted-foreground text-xs">rows committed</p>
                </TableCell>

                <!-- Replication Delay -->
                <TableCell class="py-3 text-right">
                  <span class="font-mono text-xs font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                    {{ table.replicationDelayMs }}ms
                  </span>
                  <p class="text-muted-foreground text-xs">sub-second</p>
                </TableCell>

                <!-- Status Badge -->
                <TableCell class="py-3 text-center">
                  <Badge variant="success" class="gap-1 font-mono text-xs">
                    <span class="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                    Synchronized
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <!-- Live CDC Event Stream Ticker Card -->
    <Card class="border-border shadow-xs">
      <!-- Terminal Header Bar -->
      <div class="bg-muted/40 flex flex-col gap-3 border-b p-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-1.5">
            <span class="size-2.5 rounded-full bg-red-500/80" />
            <span class="size-2.5 rounded-full bg-amber-500/80" />
            <span class="size-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div>
            <span class="text-foreground text-xs font-semibold">Live CDC Event Stream Ticker</span>
            <span class="text-muted-foreground hidden font-mono text-xs sm:inline">
              · wal_level=logical · slot: debezium_cdc_01
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="text-muted-foreground hidden font-mono text-xs sm:inline">
            Matches: {{ filteredEvents.length }} / {{ events.length }}
          </span>
          <Button
            variant="ghost"
            size="xs"
            class="h-7 gap-1 px-2 text-xs"
            :disabled="filteredEvents.length === 0"
            @click="toggleAllExpand"
          >
            <ChevronDown v-if="allExpanded" class="size-3.5" aria-hidden="true" />
            <ChevronRight v-else class="size-3.5" aria-hidden="true" />
            <span>{{ allExpanded ? 'Collapse All' : 'Expand All' }}</span>
          </Button>
        </div>
      </div>

      <!-- Stream Filter Toolbar -->
      <div class="border-b p-3">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <!-- Search Input -->
          <div class="relative flex-1">
            <Search
              class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
              aria-hidden="true"
            />
            <Input
              v-model="searchQuery"
              placeholder="Search table, operation, primary key, column, or /regex/..."
              class="pl-9 text-xs"
            />
          </div>

          <!-- Operation Filter Buttons -->
          <div class="flex flex-wrap items-center gap-1.5">
            <span class="text-muted-foreground mr-1 flex items-center gap-1 text-xs font-medium">
              <Filter class="size-3" aria-hidden="true" />
              Op:
            </span>

            <button
              type="button"
              :class="
                cn(
                  'focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  selectedOperation === 'all'
                    ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                    : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground',
                )
              "
              @click="selectedOperation = 'all'"
            >
              All
              <span
                :class="
                  cn(
                    'py-0.2 rounded-full px-1.5 text-xs',
                    selectedOperation === 'all'
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-muted text-muted-foreground',
                  )
                "
              >
                {{ operationCounts.all }}
              </span>
            </button>

            <button
              type="button"
              :class="
                cn(
                  'focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  selectedOperation === 'INSERT'
                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                    : 'border-border bg-card text-muted-foreground hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400',
                )
              "
              @click="selectedOperation = 'INSERT'"
            >
              <span class="size-1.5 rounded-full bg-emerald-400" />
              INSERT
              <span
                :class="
                  cn(
                    'py-0.2 rounded-full px-1.5 text-xs',
                    selectedOperation === 'INSERT'
                      ? 'bg-white/20 text-white'
                      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                  )
                "
              >
                {{ operationCounts.INSERT }}
              </span>
            </button>

            <button
              type="button"
              :class="
                cn(
                  'focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  selectedOperation === 'UPDATE'
                    ? 'border-sky-600 bg-sky-600 text-white shadow-xs'
                    : 'border-border bg-card text-muted-foreground hover:border-sky-500/40 hover:text-sky-600 dark:hover:text-sky-400',
                )
              "
              @click="selectedOperation = 'UPDATE'"
            >
              <span class="size-1.5 rounded-full bg-sky-400" />
              UPDATE
              <span
                :class="
                  cn(
                    'py-0.2 rounded-full px-1.5 text-xs',
                    selectedOperation === 'UPDATE'
                      ? 'bg-white/20 text-white'
                      : 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
                  )
                "
              >
                {{ operationCounts.UPDATE }}
              </span>
            </button>

            <button
              type="button"
              :class="
                cn(
                  'focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  selectedOperation === 'DELETE'
                    ? 'border-rose-600 bg-rose-600 text-white shadow-xs'
                    : 'border-border bg-card text-muted-foreground hover:border-rose-500/40 hover:text-rose-600 dark:hover:text-rose-400',
                )
              "
              @click="selectedOperation = 'DELETE'"
            >
              <span class="size-1.5 rounded-full bg-rose-400" />
              DELETE
              <span
                :class="
                  cn(
                    'py-0.2 rounded-full px-1.5 text-xs',
                    selectedOperation === 'DELETE'
                      ? 'bg-white/20 text-white'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
                  )
                "
              >
                {{ operationCounts.DELETE }}
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- Event Rows Feed -->
      <CardContent class="p-0">
        <!-- Empty State -->
        <div
          v-if="filteredEvents.length === 0"
          class="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center"
        >
          <div class="bg-muted flex size-12 items-center justify-center rounded-full">
            <Database class="text-muted-foreground size-6 opacity-60" aria-hidden="true" />
          </div>
          <div class="space-y-1">
            <p class="text-foreground text-sm font-semibold">No CDC events match current criteria</p>
            <p class="text-muted-foreground text-xs">
              {{
                events.length === 0
                  ? 'The replication event stream buffer was cleared.'
                  : 'Try adjusting your operation filter or search query.'
              }}
            </p>
          </div>
          <Button variant="outline" size="sm" class="mt-2 text-xs" @click="resetStream">
            <RefreshCw class="size-3.5" aria-hidden="true" />
            Restore CDC stream data
          </Button>
        </div>

        <!-- Event List -->
        <ul v-else class="divide-border/60 divide-y">
          <li
            v-for="event in filteredEvents"
            :key="event.id"
            :class="cn('group transition-colors', expandedIds[event.id] ? 'bg-muted/30' : 'hover:bg-muted/20')"
          >
            <!-- Primary Row Trigger -->
            <div
              role="button"
              tabindex="0"
              :aria-expanded="!!expandedIds[event.id]"
              class="focus-visible:ring-ring flex cursor-pointer flex-col gap-3 p-3.5 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset sm:flex-row sm:items-center sm:justify-between"
              @click="toggleExpand(event.id)"
              @keydown.enter.prevent="toggleExpand(event.id)"
              @keydown.space.prevent="toggleExpand(event.id)"
            >
              <!-- Left Rail: Chevron + Timestamp + Operation Badge + Table + Summary -->
              <div class="flex min-w-0 items-start gap-3 sm:items-center">
                <button
                  type="button"
                  aria-label="Toggle before and after payload diff"
                  class="text-muted-foreground group-hover:text-foreground mt-0.5 shrink-0 transition-transform sm:mt-0"
                  :class="expandedIds[event.id] ? 'text-foreground rotate-90' : ''"
                >
                  <ChevronRight class="size-4" aria-hidden="true" />
                </button>

                <div class="space-y-1 sm:space-y-0.5">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="text-muted-foreground font-mono text-xs whitespace-nowrap">
                      {{ formatTimestamp(event.timestamp) }}
                    </span>

                    <Badge
                      v-if="event.operation === 'INSERT'"
                      class="border-transparent bg-emerald-500/10 font-mono text-xs text-emerald-600 dark:text-emerald-400"
                    >
                      INSERT
                    </Badge>
                    <Badge
                      v-else-if="event.operation === 'UPDATE'"
                      class="border-transparent bg-sky-500/10 font-mono text-xs text-sky-600 dark:text-sky-400"
                    >
                      UPDATE
                    </Badge>
                    <Badge
                      v-else
                      class="border-transparent bg-rose-500/10 font-mono text-xs text-rose-600 dark:text-rose-400"
                    >
                      DELETE
                    </Badge>

                    <span class="text-foreground font-mono text-xs font-semibold">
                      {{ event.table }}
                    </span>

                    <span class="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-mono text-xs">
                      {{ event.primaryKey }}
                    </span>
                  </div>

                  <p class="text-muted-foreground text-xs font-normal">
                    {{ event.summary }}
                  </p>
                </div>
              </div>

              <!-- Right Rail: Binlog Offset & Tx ID -->
              <div class="flex shrink-0 flex-wrap items-center gap-3 sm:justify-end">
                <div class="bg-muted/60 flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-xs">
                  <span class="text-muted-foreground">Tx:</span>
                  <span class="text-foreground font-medium">{{ event.txId }}</span>
                </div>

                <div class="text-muted-foreground flex items-center gap-1.5 font-mono text-xs">
                  <span>{{ event.binlogPosition }}</span>
                  <span class="opacity-50">·</span>
                  <span class="text-foreground/80 font-medium">{{ event.lsn }}</span>
                </div>
              </div>
            </div>

            <!-- Expanded Payload Diff View -->
            <div v-if="expandedIds[event.id]" class="bg-muted/15 border-t px-4 py-3.5">
              <div class="space-y-3">
                <!-- Modified Fields Tag Bar -->
                <div
                  v-if="event.modifiedFields && event.modifiedFields.length > 0"
                  class="bg-card flex flex-wrap items-center gap-1.5 rounded-md border p-2.5 text-xs"
                >
                  <span class="text-muted-foreground font-medium">Modified Columns:</span>
                  <Badge
                    v-for="field in event.modifiedFields"
                    :key="field"
                    variant="outline"
                    class="font-mono text-xs text-sky-600 dark:text-sky-400"
                  >
                    {{ field }}
                  </Badge>
                </div>

                <!-- Side-by-Side or Stacked JSON Diff -->
                <div class="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  <!-- Before Payload (For UPDATE and DELETE) -->
                  <div
                    v-if="event.before"
                    class="overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 font-mono text-xs text-zinc-100 shadow-inner"
                  >
                    <div class="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-3 py-1.5">
                      <div class="flex items-center gap-2">
                        <span class="size-2 rounded-full bg-rose-500" />
                        <span class="text-xs font-semibold text-rose-400">before_image.json</span>
                        <span class="text-xs font-normal text-zinc-400">(Previous State)</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="xs"
                        class="h-6 gap-1 px-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                        @click="copyPayload(event.id + '-before', event.before)"
                      >
                        <Check
                          v-if="copiedEventId === event.id + '-before'"
                          class="size-3 text-emerald-400"
                          aria-hidden="true"
                        />
                        <Copy v-else class="size-3" aria-hidden="true" />
                        <span>{{ copiedEventId === event.id + '-before' ? 'Copied' : 'Copy' }}</span>
                      </Button>
                    </div>

                    <pre
                      class="max-h-60 overflow-x-auto overflow-y-auto p-3 text-xs leading-relaxed select-text"
                    ><code class="text-rose-300/90">{{ JSON.stringify(event.before, null, 2) }}</code></pre>
                  </div>

                  <!-- After Payload (For INSERT and UPDATE) -->
                  <div
                    v-if="event.after"
                    :class="
                      cn(
                        'overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 font-mono text-xs text-zinc-100 shadow-inner',
                        !event.before && 'lg:col-span-2',
                      )
                    "
                  >
                    <div class="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-3 py-1.5">
                      <div class="flex items-center gap-2">
                        <span class="size-2 rounded-full bg-emerald-500" />
                        <span class="text-xs font-semibold text-emerald-400">after_image.json</span>
                        <span class="text-xs font-normal text-zinc-400">(Replicated Target State)</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="xs"
                        class="h-6 gap-1 px-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                        @click="copyPayload(event.id + '-after', event.after)"
                      >
                        <Check
                          v-if="copiedEventId === event.id + '-after'"
                          class="size-3 text-emerald-400"
                          aria-hidden="true"
                        />
                        <Copy v-else class="size-3" aria-hidden="true" />
                        <span>{{ copiedEventId === event.id + '-after' ? 'Copied' : 'Copy' }}</span>
                      </Button>
                    </div>

                    <pre
                      class="max-h-60 overflow-x-auto overflow-y-auto p-3 text-xs leading-relaxed select-text"
                    ><code class="text-emerald-400">{{ JSON.stringify(event.after, null, 2) }}</code></pre>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </CardContent>

      <!-- Bottom Engine & Ingest Protocol Telemetry Bar -->
      <div
        class="bg-muted/40 flex flex-col gap-2.5 border-t px-4 py-3 text-xs sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="text-muted-foreground flex flex-wrap items-center gap-4">
          <div class="text-foreground flex items-center gap-1.5 font-medium">
            <Activity class="size-3.5 text-emerald-500" aria-hidden="true" />
            <span>CDC Pipeline:</span>
            <span class="font-mono">{{ isPaused ? '0 evt/s (Paused)' : '1,420 events/sec' }}</span>
          </div>

          <Separator orientation="vertical" class="hidden h-3.5 sm:block" />

          <div class="flex items-center gap-1.5">
            <Layers class="size-3.5" aria-hidden="true" />
            <span>Sink Topic:</span>
            <span class="text-foreground font-mono">snowflake.cdc.raw_events</span>
          </div>

          <Separator orientation="vertical" class="hidden h-3.5 sm:block" />

          <div class="flex items-center gap-1.5">
            <Server class="size-3.5 text-sky-500" aria-hidden="true" />
            <span>Format:</span>
            <span class="text-foreground font-mono">JSON + Schema Registry (v2)</span>
          </div>
        </div>

        <div class="text-muted-foreground flex items-center gap-2 font-mono">
          <span class="size-1.5 rounded-full bg-emerald-500" />
          <span>Postgres WAL2JSON · TLS 1.3 · Heartbeat: 1,000ms OK</span>
        </div>
      </div>
    </Card>
  </div>
</template>

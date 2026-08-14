<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  ArrowDownRight,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Database,
  FileCode2,
  FileText,
  FolderArchive,
  HardDrive,
  History,
  Layers,
  RefreshCw,
  Search,
  Server,
  Sparkles,
  Terminal,
  Trash2,
  Workflow,
  Zap,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export type SnapshotOperation = 'MERGE' | 'APPEND' | 'OPTIMIZE' | 'REPLACE_PARTITION'
export type SqlSyntaxMode = 'system_time' | 'system_version' | 'pyspark' | 'trino'

export interface TableSnapshot {
  id: string
  numericId: string
  timestamp: string
  relativeTime: string
  operation: SnapshotOperation
  rowsAdded: string
  rowsDeleted: string
  author: string
  summary: string
  manifestFile: string
  filesAdded: number
  filesRemoved: number
  byteDelta: string
}

export interface PartitionRecord {
  partitionKey: string
  fileCount: number
  avgFileSize: string
  totalSize: string
  skippedPercentage: number
  zOrderScore: string
  status: 'Optimized' | 'Compacting' | 'Needs Z-Order'
  lastClustered: string
}

export interface TableDetails {
  name: string
  format: string
  totalSize: string
  rowCount: string
  statusText: string
  catalog: string
  storageLocation: string
  lastCompacted: string
  compressionCodec: string
}

interface Props {
  initialTable?: TableDetails
  initialSnapshots?: TableSnapshot[]
  initialPartitions?: PartitionRecord[]
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const defaultTable: TableDetails = {
  name: 'lakehouse.silver_customer_events',
  format: 'Apache Iceberg v2 · Parquet',
  totalSize: '4.2 TB',
  rowCount: '1.48B Rows',
  statusText: 'Table Optimized · 0 Small Files',
  catalog: 'AWS Glue Data Catalog (us-east-1)',
  storageLocation: 's3://lakehouse-data-prod/silver/customer_events/',
  lastCompacted: '28 mins ago',
  compressionCodec: 'ZSTD (Level 7)',
}

const defaultSnapshots: TableSnapshot[] = [
  {
    id: 'snap_84920194821',
    numericId: '84920194821',
    timestamp: '2026-08-21 09:30:00 UTC',
    relativeTime: '12 mins ago',
    operation: 'MERGE',
    rowsAdded: '+142,500',
    rowsDeleted: '-18,200',
    author: 'spark-streaming-pipeline',
    summary: "Upserted late-arriving customer clickstream events from Kafka topic 'customer.events.prod'",
    manifestFile: 'snap-84920194821-1-m0.avro',
    filesAdded: 4,
    filesRemoved: 3,
    byteDelta: '+128 MB',
  },
  {
    id: 'snap_84920183104',
    numericId: '84920183104',
    timestamp: '2026-08-21 08:00:00 UTC',
    relativeTime: '1 hour ago',
    operation: 'OPTIMIZE',
    rowsAdded: '+0',
    rowsDeleted: '-0',
    author: 'iceberg-compactor-daemon',
    summary: 'Bin-pack compaction rewrote 4,210 small files into 42 optimal 128MB Parquet data files',
    manifestFile: 'snap-84920183104-1-m0.avro',
    filesAdded: 42,
    filesRemoved: 4210,
    byteDelta: '-4.1 GB (compaction gain)',
  },
  {
    id: 'snap_84920152918',
    numericId: '84920152918',
    timestamp: '2026-08-21 06:15:00 UTC',
    relativeTime: '3 hours ago',
    operation: 'APPEND',
    rowsAdded: '+890,200',
    rowsDeleted: '-0',
    author: 'batch-ingest-hourly',
    summary: 'Micro-batch append for EMEA checkout and cart telemetry session events',
    manifestFile: 'snap-84920152918-1-m0.avro',
    filesAdded: 18,
    filesRemoved: 0,
    byteDelta: '+2.2 GB',
  },
  {
    id: 'snap_84920120195',
    numericId: '84920120195',
    timestamp: '2026-08-20 23:45:00 UTC',
    relativeTime: '9 hours ago',
    operation: 'REPLACE_PARTITION',
    rowsAdded: '+3,410,000',
    rowsDeleted: '-3,398,000',
    author: 'dbt-backfill-runner',
    summary: "Replaced partition 'event_date=2026-08-20' following upstream IP geolocation schema enrichment",
    manifestFile: 'snap-84920120195-1-m0.avro',
    filesAdded: 28,
    filesRemoved: 28,
    byteDelta: '+140 MB',
  },
  {
    id: 'snap_84919984120',
    numericId: '84919984120',
    timestamp: '2026-08-20 18:30:00 UTC',
    relativeTime: '15 hours ago',
    operation: 'APPEND',
    rowsAdded: '+1,205,400',
    rowsDeleted: '-0',
    author: 'batch-ingest-hourly',
    summary: 'Hourly ingestion run for US-East customer checkout telemetry records',
    manifestFile: 'snap-84919984120-1-m0.avro',
    filesAdded: 24,
    filesRemoved: 0,
    byteDelta: '+3.1 GB',
  },
]

const defaultPartitions: PartitionRecord[] = [
  {
    partitionKey: 'event_date=2026-08-21',
    fileCount: 42,
    avgFileSize: '128.2 MB',
    totalSize: '5.38 GB',
    skippedPercentage: 98.4,
    zOrderScore: '98.4%',
    status: 'Optimized',
    lastClustered: '28m ago',
  },
  {
    partitionKey: 'event_date=2026-08-20',
    fileCount: 40,
    avgFileSize: '127.9 MB',
    totalSize: '5.12 GB',
    skippedPercentage: 97.8,
    zOrderScore: '97.8%',
    status: 'Optimized',
    lastClustered: '9h ago',
  },
  {
    partitionKey: 'event_date=2026-08-19',
    fileCount: 38,
    avgFileSize: '128.0 MB',
    totalSize: '4.86 GB',
    skippedPercentage: 96.9,
    zOrderScore: '96.9%',
    status: 'Optimized',
    lastClustered: '1d ago',
  },
  {
    partitionKey: 'event_date=2026-08-18',
    fileCount: 44,
    avgFileSize: '126.8 MB',
    totalSize: '5.58 GB',
    skippedPercentage: 95.8,
    zOrderScore: '95.8%',
    status: 'Optimized',
    lastClustered: '2d ago',
  },
  {
    partitionKey: 'event_date=2026-08-17',
    fileCount: 36,
    avgFileSize: '128.5 MB',
    totalSize: '4.62 GB',
    skippedPercentage: 97.1,
    zOrderScore: '97.1%',
    status: 'Optimized',
    lastClustered: '3d ago',
  },
  {
    partitionKey: 'event_date=2026-08-16',
    fileCount: 39,
    avgFileSize: '127.4 MB',
    totalSize: '4.97 GB',
    skippedPercentage: 96.5,
    zOrderScore: '96.5%',
    status: 'Optimized',
    lastClustered: '4d ago',
  },
]

const table = computed(() => props.initialTable ?? defaultTable)
const snapshots = computed(() => props.initialSnapshots ?? defaultSnapshots)
const partitions = computed(() => props.initialPartitions ?? defaultPartitions)

const selectedSnapshotId = ref<string>('snap_84920194821')
const sqlSyntaxMode = ref<SqlSyntaxMode>('system_time')
const snapshotFilter = ref<string>('ALL')
const snapshotSearch = ref<string>('')
const partitionSearch = ref<string>('')
const activeTab = ref<string>('snapshots')

const isCompacting = ref<boolean>(false)
const isExpiring = ref<boolean>(false)
const actionNotification = ref<string | null>(null)
const copiedQuery = ref<boolean>(false)

const selectedSnapshot = computed(() => {
  return snapshots.value.find((s) => s.id === selectedSnapshotId.value) ?? snapshots.value[0]
})

const filteredSnapshots = computed(() => {
  return snapshots.value.filter((snap) => {
    const matchesOp = snapshotFilter.value === 'ALL' || snap.operation === snapshotFilter.value
    const query = snapshotSearch.value.toLowerCase().trim()
    const matchesSearch =
      query === '' ||
      snap.id.toLowerCase().includes(query) ||
      snap.author.toLowerCase().includes(query) ||
      snap.summary.toLowerCase().includes(query) ||
      snap.operation.toLowerCase().includes(query)
    return matchesOp && matchesSearch
  })
})

const filteredPartitions = computed(() => {
  const query = partitionSearch.value.toLowerCase().trim()
  if (!query) return partitions.value
  return partitions.value.filter((p) => p.partitionKey.toLowerCase().includes(query))
})

const generatedQuery = computed(() => {
  const currentSnap = selectedSnapshot.value
  const tableName = table.value.name

  switch (sqlSyntaxMode.value) {
    case 'system_time':
      return `SELECT * FROM ${tableName}\nFOR SYSTEM_TIME AS OF '${currentSnap.timestamp}';`
    case 'system_version':
      return `SELECT * FROM ${tableName}\nFOR SYSTEM_VERSION AS OF ${currentSnap.numericId};`
    case 'pyspark':
      return `# PySpark Iceberg time-travel query\ndf = spark.read \\\n  .format("iceberg") \\\n  .option("as-of-timestamp", "${currentSnap.timestamp}") \\\n  .load("${tableName}")\n\ndf.filter("customer_id = 'cust_98241'") \\\n  .select("event_id", "event_type", "event_date", "payload") \\\n  .show(10)`
    case 'trino':
      return `SELECT event_id, customer_id, event_type, event_date\nFROM ${tableName}\nFOR VERSION AS OF ${currentSnap.numericId}\nWHERE event_type = 'CHECKOUT_COMPLETED'\nLIMIT 50;`
    default:
      return `SELECT * FROM ${tableName}\nFOR SYSTEM_TIME AS OF '${currentSnap.timestamp}';`
  }
})

function selectSnapshot(id: string) {
  selectedSnapshotId.value = id
}

function handleCopyQuery() {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(generatedQuery.value)
    copiedQuery.value = true
    setTimeout(() => {
      copiedQuery.value = false
    }, 2000)
  }
}

function runCompaction() {
  if (isCompacting.value) return
  isCompacting.value = true
  actionNotification.value = null

  setTimeout(() => {
    isCompacting.value = false
    actionNotification.value =
      'Compaction & Vacuum complete: 14,280 small files compacted into 142 optimal 128MB Parquet files. Reclaimed 1.2 TB storage.'
    setTimeout(() => {
      actionNotification.value = null
    }, 6000)
  }, 1800)
}

function expireSnapshots() {
  if (isExpiring.value) return
  isExpiring.value = true
  actionNotification.value = null

  setTimeout(() => {
    isExpiring.value = false
    actionNotification.value =
      'Snapshot expiration finished: Removed 12 stale snapshots older than 30-day retention window. Purged 872 GB metadata & unreferenced parquet files.'
    setTimeout(() => {
      actionNotification.value = null
    }, 6000)
  }, 1400)
}

function getOperationBadgeVariant(
  op: SnapshotOperation,
): 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'info' {
  switch (op) {
    case 'OPTIMIZE':
      return 'success'
    case 'MERGE':
      return 'info'
    case 'APPEND':
      return 'secondary'
    case 'REPLACE_PARTITION':
      return 'warning'
    default:
      return 'outline'
  }
}
</script>

<template>
  <div :class="cn('text-foreground w-full space-y-6', props.class)">
    <!-- Header Section -->
    <div class="border-border bg-card rounded-xl border p-5 shadow-xs sm:p-6">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <!-- Table Identity -->
        <div class="flex items-start gap-4">
          <div
            class="border-primary/20 bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-lg border shadow-xs"
          >
            <Database class="size-6" />
          </div>
          <div class="space-y-2">
            <div class="flex flex-wrap items-center gap-2">
              <h1 class="text-foreground font-mono text-lg font-bold tracking-tight break-all sm:text-xl">
                {{ table.name }}
              </h1>
              <Badge variant="success" class="gap-1.5 font-medium">
                <span class="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                {{ table.statusText }}
              </Badge>
            </div>
            <div class="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
              <Badge variant="outline" class="gap-1 font-mono">
                <Layers class="text-muted-foreground size-3" />
                {{ table.format }}
              </Badge>
              <Badge variant="secondary" class="gap-1 font-mono font-medium">
                <HardDrive class="text-muted-foreground size-3" />
                {{ table.totalSize }} · {{ table.rowCount }}
              </Badge>
              <span class="hidden items-center gap-1 sm:inline-flex">
                <Server class="size-3" />
                {{ table.catalog }}
              </span>
            </div>
          </div>
        </div>

        <!-- Header Actions -->
        <div class="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            class="h-9 gap-1.5 shadow-xs"
            :disabled="isExpiring"
            @click="expireSnapshots"
          >
            <Clock v-if="!isExpiring" class="text-muted-foreground size-3.5" />
            <RefreshCw v-else class="text-muted-foreground size-3.5 animate-spin" />
            <span>{{ isExpiring ? 'Expiring Stale...' : 'Expire Snapshots' }}</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            class="h-9 gap-1.5 shadow-xs"
            :disabled="isCompacting"
            @click="runCompaction"
          >
            <Sparkles v-if="!isCompacting" class="size-3.5" />
            <RefreshCw v-else class="size-3.5 animate-spin" />
            <span>{{ isCompacting ? 'Compacting Table...' : 'Run Compaction & Vacuum' }}</span>
          </Button>
        </div>
      </div>

      <!-- Action Toast / Banner -->
      <div
        v-if="actionNotification"
        class="mt-4 flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-700 dark:text-emerald-300"
      >
        <div class="flex items-center gap-2">
          <CheckCircle2 class="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>{{ actionNotification }}</span>
        </div>
        <button
          type="button"
          class="rounded p-1 text-emerald-700/70 hover:bg-emerald-500/20 hover:text-emerald-700 dark:text-emerald-300/70 dark:hover:text-emerald-200"
          @click="actionNotification = null"
        >
          <span class="sr-only">Dismiss</span>
          &times;
        </button>
      </div>
    </div>

    <!-- 4 Table Health & Storage Telemetry Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Card 1: Total Partitions -->
      <Card class="border-border bg-card shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Total Partitions
          </CardTitle>
          <div
            class="border-border bg-muted/50 text-muted-foreground flex size-7 items-center justify-center rounded-md border"
          >
            <FolderArchive class="size-3.5" />
          </div>
        </CardHeader>
        <CardContent class="space-y-2">
          <div class="flex flex-wrap items-baseline justify-between gap-2">
            <div class="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">1,420</div>
            <Badge variant="success" class="text-xs">100% Healthy</Badge>
          </div>
          <p class="text-muted-foreground text-xs">1,420 Partitions · Date Partitioned</p>
          <div class="space-y-1 pt-1">
            <Progress :model-value="100" class="bg-muted h-1.5" />
            <div class="text-muted-foreground flex justify-between text-xs">
              <span>event_date (YYYY-MM-DD)</span>
              <span class="font-mono tabular-nums">0 unpartitioned</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Card 2: Small Files Neutralized -->
      <Card class="border-border bg-card shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Small Files Neutralized
          </CardTitle>
          <div
            class="border-border bg-muted/50 text-muted-foreground flex size-7 items-center justify-center rounded-md border"
          >
            <HardDrive class="size-3.5" />
          </div>
        </CardHeader>
        <CardContent class="space-y-2">
          <div class="flex flex-wrap items-baseline justify-between gap-2">
            <div class="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">14,280</div>
            <Badge variant="success" class="font-mono text-xs">99.0% Reduction</Badge>
          </div>
          <p class="text-muted-foreground text-xs">14,280 small files compacted -> 142 optimal 128MB files</p>
          <div class="space-y-1 pt-1">
            <Progress :model-value="99" class="bg-muted h-1.5" />
            <div class="text-muted-foreground flex justify-between text-xs">
              <span>Target: 128 MB</span>
              <span class="font-mono tabular-nums">0 files &lt;32MB</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Card 3: Snapshot History Count -->
      <Card class="border-border bg-card shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Snapshot History
          </CardTitle>
          <div
            class="border-border bg-muted/50 text-muted-foreground flex size-7 items-center justify-center rounded-md border"
          >
            <History class="size-3.5" />
          </div>
        </CardHeader>
        <CardContent class="space-y-2">
          <div class="flex flex-wrap items-baseline justify-between gap-2">
            <div class="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">48</div>
            <Badge variant="info" class="font-mono text-xs">30-Day Window</Badge>
          </div>
          <p class="text-muted-foreground text-xs">48 Active Snapshots · 30-Day Time Travel</p>
          <div class="space-y-1 pt-1">
            <Progress :model-value="64" class="bg-muted h-1.5" />
            <div class="text-muted-foreground flex justify-between text-xs">
              <span>Oldest: Jul 22, 2026</span>
              <span class="font-mono tabular-nums">4.8 MB metadata</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Card 4: Storage Optimization Savings -->
      <Card class="border-border bg-card shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Storage Optimization
          </CardTitle>
          <div
            class="border-border bg-muted/50 text-muted-foreground flex size-7 items-center justify-center rounded-md border"
          >
            <Zap class="size-3.5" />
          </div>
        </CardHeader>
        <CardContent class="space-y-2">
          <div class="flex flex-wrap items-baseline justify-between gap-2">
            <div class="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">1.2 TB</div>
            <Badge variant="success" class="font-mono text-xs">$240/mo Saved</Badge>
          </div>
          <p class="text-muted-foreground text-xs">1.2 TB freed via Vacuum · $240/mo saved</p>
          <div class="space-y-1 pt-1">
            <Progress :model-value="85" class="bg-muted h-1.5" />
            <div class="text-muted-foreground flex justify-between text-xs">
              <span>872 GB stale · 328 GB orphan</span>
              <span class="font-mono tabular-nums">-28.5% S3 Cost</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Main Lakehouse Inspection & Control Tabs -->
    <Tabs v-model="activeTab" class="w-full space-y-5">
      <TabsList class="grid w-full grid-cols-2 md:grid-cols-4">
        <TabsTrigger value="snapshots" class="gap-1.5 text-xs font-medium">
          <History class="size-3.5" />
          <span>Snapshots & Time-Travel</span>
        </TabsTrigger>
        <TabsTrigger value="partitions" class="gap-1.5 text-xs font-medium">
          <Layers class="size-3.5" />
          <span>Partitions & Z-Ordering</span>
        </TabsTrigger>
        <TabsTrigger value="maintenance" class="gap-1.5 text-xs font-medium">
          <Sparkles class="size-3.5" />
          <span>Compaction & Vacuum</span>
        </TabsTrigger>
        <TabsTrigger value="files" class="gap-1.5 text-xs font-medium">
          <HardDrive class="size-3.5" />
          <span>File Sizing & Distribution</span>
        </TabsTrigger>
      </TabsList>

      <!-- TAB 1: SNAPSHOTS & TIME-TRAVEL QUERY PICKER -->
      <TabsContent value="snapshots" class="space-y-5">
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <!-- Left: Interactive Timeline (7 Cols) -->
          <div class="space-y-4 lg:col-span-7">
            <Card class="border-border bg-card shadow-xs">
              <CardHeader class="p-4 pb-3 sm:p-5 sm:pb-3">
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle class="text-sm font-semibold sm:text-base"> Snapshot Commit History </CardTitle>
                    <CardDescription class="text-xs">
                      Select any snapshot to generate reproducible time-travel queries
                    </CardDescription>
                  </div>
                  <!-- Filter Pill Buttons -->
                  <div class="flex flex-wrap items-center gap-1">
                    <button
                      v-for="op in ['ALL', 'MERGE', 'OPTIMIZE', 'APPEND', 'REPLACE_PARTITION'] as const"
                      :key="op"
                      type="button"
                      :class="
                        cn(
                          'rounded-md px-2 py-1 font-mono text-xs transition-colors',
                          snapshotFilter === op
                            ? 'bg-primary text-primary-foreground font-semibold'
                            : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground',
                        )
                      "
                      @click="snapshotFilter = op"
                    >
                      {{ op }}
                    </button>
                  </div>
                </div>

                <!-- Search Filter -->
                <div class="relative pt-2">
                  <Search class="text-muted-foreground absolute top-5 left-2.5 size-3.5" />
                  <input
                    v-model="snapshotSearch"
                    type="text"
                    placeholder="Search snapshot ID, author, summary..."
                    class="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border py-1.5 pr-3 pl-8 text-xs focus-visible:ring-2 focus-visible:outline-none"
                  />
                </div>
              </CardHeader>

              <Separator />

              <CardContent class="p-4 sm:p-5">
                <div
                  class="before:bg-border relative space-y-4 before:absolute before:top-3 before:bottom-3 before:left-[17px] before:w-0.5"
                >
                  <div
                    v-for="snap in filteredSnapshots"
                    :key="snap.id"
                    :class="
                      cn(
                        'group relative flex cursor-pointer flex-col gap-3 rounded-lg border p-3.5 transition-all sm:flex-row sm:items-start sm:gap-4',
                        selectedSnapshotId === snap.id
                          ? 'border-primary/60 bg-primary/[0.03] ring-primary/30 shadow-xs ring-1'
                          : 'border-border bg-card/60 hover:border-border hover:bg-accent/40',
                      )
                    "
                    @click="selectSnapshot(snap.id)"
                  >
                    <!-- Timeline Dot Indicator -->
                    <div
                      class="border-border bg-card text-foreground group-hover:border-primary/50 relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border shadow-xs"
                    >
                      <History v-if="snap.operation === 'MERGE'" class="size-4 text-blue-500" />
                      <Sparkles v-else-if="snap.operation === 'OPTIMIZE'" class="size-4 text-emerald-500" />
                      <ArrowDownRight v-else-if="snap.operation === 'APPEND'" class="size-4 text-violet-500" />
                      <RefreshCw v-else class="size-4 text-amber-500" />
                    </div>

                    <!-- Snapshot Details -->
                    <div class="min-w-0 flex-1 space-y-2">
                      <div class="flex flex-wrap items-center justify-between gap-2">
                        <div class="flex flex-wrap items-center gap-2">
                          <span class="text-foreground font-mono text-xs font-bold">
                            {{ snap.id }}
                          </span>
                          <Badge :variant="getOperationBadgeVariant(snap.operation)" class="font-mono text-xs">
                            {{ snap.operation }}
                          </Badge>
                          <Badge v-if="selectedSnapshotId === snap.id" variant="default" class="text-xs">
                            Active Time-Travel Target
                          </Badge>
                        </div>
                        <span class="text-muted-foreground font-mono text-xs tabular-nums">
                          {{ snap.relativeTime }}
                        </span>
                      </div>

                      <p class="text-muted-foreground text-xs">
                        {{ snap.summary }}
                      </p>

                      <!-- Metric Badges Row -->
                      <div class="flex flex-wrap items-center gap-3 pt-1 text-xs">
                        <div class="text-muted-foreground flex items-center gap-1 font-mono">
                          <span class="font-semibold text-emerald-600 dark:text-emerald-400">{{ snap.rowsAdded }}</span>
                          <span>/</span>
                          <span class="font-semibold text-rose-600 dark:text-rose-400"
                            >{{ snap.rowsDeleted }} rows</span
                          >
                        </div>
                        <div class="text-muted-foreground flex items-center gap-1 font-mono">
                          <FileCode2 class="text-muted-foreground size-3" />
                          <span>{{ snap.byteDelta }}</span>
                        </div>
                        <div class="text-muted-foreground flex items-center gap-1 font-mono">
                          <span>Author:</span>
                          <span class="text-foreground font-medium">{{ snap.author }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <!-- Right: Time-Travel Query Generator & Helper (5 Cols) -->
          <div class="space-y-4 lg:col-span-5">
            <Card class="border-border bg-card shadow-xs">
              <CardHeader class="p-4 pb-3 sm:p-5 sm:pb-3">
                <div class="flex items-center justify-between">
                  <div class="space-y-1">
                    <CardTitle class="text-sm font-semibold sm:text-base"> Time-Travel Query Picker </CardTitle>
                    <CardDescription class="text-xs">
                      Instant query generator for snapshot audit & reconciliation
                    </CardDescription>
                  </div>
                  <Badge variant="outline" class="font-mono text-xs">
                    {{ selectedSnapshot.numericId }}
                  </Badge>
                </div>

                <!-- Syntax Mode Buttons -->
                <div class="grid grid-cols-2 gap-1 pt-3 sm:grid-cols-4">
                  <button
                    type="button"
                    :class="
                      cn(
                        'rounded-md px-2 py-1.5 text-center font-mono text-xs transition-colors',
                        sqlSyntaxMode === 'system_time'
                          ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                          : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground',
                      )
                    "
                    @click="sqlSyntaxMode = 'system_time'"
                  >
                    SYSTEM_TIME
                  </button>
                  <button
                    type="button"
                    :class="
                      cn(
                        'rounded-md px-2 py-1.5 text-center font-mono text-xs transition-colors',
                        sqlSyntaxMode === 'system_version'
                          ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                          : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground',
                      )
                    "
                    @click="sqlSyntaxMode = 'system_version'"
                  >
                    VERSION
                  </button>
                  <button
                    type="button"
                    :class="
                      cn(
                        'rounded-md px-2 py-1.5 text-center font-mono text-xs transition-colors',
                        sqlSyntaxMode === 'pyspark'
                          ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                          : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground',
                      )
                    "
                    @click="sqlSyntaxMode = 'pyspark'"
                  >
                    PySpark
                  </button>
                  <button
                    type="button"
                    :class="
                      cn(
                        'rounded-md px-2 py-1.5 text-center font-mono text-xs transition-colors',
                        sqlSyntaxMode === 'trino'
                          ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                          : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground',
                      )
                    "
                    @click="sqlSyntaxMode = 'trino'"
                  >
                    Trino SQL
                  </button>
                </div>
              </CardHeader>

              <Separator />

              <CardContent class="space-y-4 p-4 sm:p-5">
                <!-- Target Snapshot Meta Summary -->
                <div class="border-border bg-muted/40 space-y-1.5 rounded-lg border p-3 text-xs">
                  <div class="text-muted-foreground flex items-center justify-between">
                    <span>Target Snapshot:</span>
                    <span class="text-foreground font-mono font-semibold">{{ selectedSnapshot.id }}</span>
                  </div>
                  <div class="text-muted-foreground flex items-center justify-between">
                    <span>Point-in-Time:</span>
                    <span class="text-foreground font-mono">{{ selectedSnapshot.timestamp }}</span>
                  </div>
                  <div class="text-muted-foreground flex items-center justify-between">
                    <span>Commit Operation:</span>
                    <Badge :variant="getOperationBadgeVariant(selectedSnapshot.operation)" class="font-mono text-xs">
                      {{ selectedSnapshot.operation }}
                    </Badge>
                  </div>
                </div>

                <!-- Code Block with Copy -->
                <div class="border-border bg-muted/70 relative overflow-hidden rounded-lg border font-mono">
                  <div
                    class="border-border bg-muted/90 text-muted-foreground flex items-center justify-between border-b px-3 py-2 text-xs"
                  >
                    <span class="text-foreground flex items-center gap-1.5 font-semibold">
                      <Terminal class="text-primary size-3.5" />
                      Query table as of snapshot:
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      class="hover:bg-background hover:text-foreground h-7 gap-1 px-2 text-xs"
                      @click="handleCopyQuery"
                    >
                      <Check v-if="copiedQuery" class="size-3.5 text-emerald-500" />
                      <Copy v-else class="text-muted-foreground size-3.5" />
                      <span>{{ copiedQuery ? 'Copied' : 'Copy' }}</span>
                    </Button>
                  </div>
                  <pre
                    class="text-foreground overflow-x-auto p-3 text-xs leading-relaxed"
                  ><code>{{ generatedQuery }}</code></pre>
                </div>

                <!-- Telemetry Stats about Query -->
                <div class="border-border bg-card space-y-2 rounded-lg border p-3 text-xs">
                  <div class="text-muted-foreground flex items-center justify-between">
                    <span>Estimated Scan Overhead:</span>
                    <span class="font-mono font-semibold text-emerald-600 dark:text-emerald-400"
                      >42ms · 96.4% skipped</span
                    >
                  </div>
                  <div class="text-muted-foreground flex items-center justify-between">
                    <span>Manifest Avro File:</span>
                    <span class="text-foreground font-mono text-xs">{{ selectedSnapshot.manifestFile }}</span>
                  </div>
                  <div class="text-muted-foreground flex items-center justify-between">
                    <span>Storage Engine:</span>
                    <span class="text-foreground">Apache Iceberg Native Parquet Reader</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>

      <!-- TAB 2: PARTITIONS & Z-ORDER CLUSTERING -->
      <TabsContent value="partitions" class="space-y-5">
        <!-- Table Partition Maintenance & Z-Order Clustering Status Card -->
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="p-5 pb-4">
            <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle class="flex items-center gap-2 text-base font-semibold">
                  <Workflow class="text-primary size-4" />
                  Partition Health & Multidimensional Z-Order Clustering
                </CardTitle>
                <CardDescription class="text-xs">
                  Z-Order clustered by <code class="text-foreground font-mono font-semibold">customer_id</code>,
                  <code class="text-foreground font-mono font-semibold">event_type</code> to maximize Parquet min/max
                  statistics pruning.
                </CardDescription>
              </div>

              <!-- Search Partitions -->
              <div class="relative w-full md:w-64">
                <Search class="text-muted-foreground absolute top-2.5 left-2.5 size-3.5" />
                <input
                  v-model="partitionSearch"
                  type="text"
                  placeholder="Filter partitions..."
                  class="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border py-1.5 pr-3 pl-8 text-xs focus-visible:ring-2 focus-visible:outline-none"
                />
              </div>
            </div>

            <!-- Clustering Telemetry Overview Grid -->
            <div
              class="border-border bg-muted/30 mt-4 grid grid-cols-1 gap-3 rounded-lg border p-3 text-xs sm:grid-cols-2 lg:grid-cols-4"
            >
              <div>
                <span class="text-muted-foreground">Clustered Columns:</span>
                <div class="text-foreground font-mono font-semibold">customer_id, event_type</div>
              </div>
              <div>
                <span class="text-muted-foreground">Data Skipping Efficiency:</span>
                <div class="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  96.4% Row-Groups Skipped
                </div>
              </div>
              <div>
                <span class="text-muted-foreground">Clustering Curve Algorithm:</span>
                <div class="text-foreground font-mono font-semibold">Hilbert Space-Filling (Depth 16)</div>
              </div>
              <div>
                <span class="text-muted-foreground">Compression Codec:</span>
                <div class="text-foreground font-mono font-semibold">ZSTD Level 7 · Parquet v2</div>
              </div>
            </div>
          </CardHeader>

          <Separator />

          <CardContent class="p-0">
            <div class="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow class="hover:bg-transparent">
                    <TableHead class="text-xs">Partition Key</TableHead>
                    <TableHead class="text-xs">File Count</TableHead>
                    <TableHead class="text-xs">Avg File Size</TableHead>
                    <TableHead class="text-xs">Total Data Size</TableHead>
                    <TableHead class="text-xs">Data Skipping</TableHead>
                    <TableHead class="text-xs">Z-Order Status</TableHead>
                    <TableHead class="text-right text-xs">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow
                    v-for="partition in filteredPartitions"
                    :key="partition.partitionKey"
                    class="hover:bg-muted/50"
                  >
                    <TableCell class="text-foreground font-mono text-xs font-semibold">
                      {{ partition.partitionKey }}
                    </TableCell>
                    <TableCell class="font-mono text-xs tabular-nums"> {{ partition.fileCount }} files </TableCell>
                    <TableCell class="font-mono text-xs tabular-nums">
                      {{ partition.avgFileSize }}
                    </TableCell>
                    <TableCell class="font-mono text-xs tabular-nums">
                      {{ partition.totalSize }}
                    </TableCell>
                    <TableCell>
                      <div class="w-32 space-y-1">
                        <div class="text-muted-foreground flex justify-between font-mono text-xs tabular-nums">
                          <span>{{ partition.skippedPercentage }}%</span>
                        </div>
                        <Progress :model-value="partition.skippedPercentage" class="bg-muted h-1.5" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="success" class="gap-1 font-mono text-xs">
                        <CheckCircle2 class="size-3" />
                        {{ partition.status }}
                      </Badge>
                    </TableCell>
                    <TableCell class="text-right">
                      <Button variant="ghost" size="sm" class="h-7 text-xs font-medium"> Re-cluster </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- TAB 3: COMPACTION & VACUUM MAINTENANCE RULES -->
      <TabsContent value="maintenance" class="space-y-5">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <!-- Bin-Pack Compaction Rule -->
          <Card class="border-border bg-card shadow-xs">
            <CardHeader class="p-4 pb-2 sm:p-5 sm:pb-2">
              <div class="flex items-center justify-between">
                <CardTitle class="flex items-center gap-2 text-sm font-semibold">
                  <Sparkles class="size-4 text-emerald-500" />
                  Bin-Pack Data File Compaction
                </CardTitle>
                <Badge variant="success" class="text-xs">Enabled · Auto</Badge>
              </div>
              <CardDescription class="text-xs">
                Merges small files into optimized 128MB Parquet chunks to prevent small file bottleneck
              </CardDescription>
            </CardHeader>
            <CardContent class="space-y-3 p-4 pt-3 text-xs sm:p-5">
              <div class="border-border bg-muted/40 space-y-2 rounded-lg border p-3">
                <div class="text-muted-foreground flex justify-between">
                  <span>Target File Size:</span>
                  <span class="text-foreground font-mono font-semibold">128 MB</span>
                </div>
                <div class="text-muted-foreground flex justify-between">
                  <span>Small File Threshold:</span>
                  <span class="text-foreground font-mono font-semibold">&lt; 32 MB</span>
                </div>
                <div class="text-muted-foreground flex justify-between">
                  <span>Execution Schedule:</span>
                  <span class="text-foreground font-mono">Every 2 Hours (cron: 0 */2 * * *)</span>
                </div>
                <div class="text-muted-foreground flex justify-between">
                  <span>Engine:</span>
                  <span class="text-foreground">Apache Spark Iceberg RewriteDataFiles Action</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Vacuum & Orphan File Removal -->
          <Card class="border-border bg-card shadow-xs">
            <CardHeader class="p-4 pb-2 sm:p-5 sm:pb-2">
              <div class="flex items-center justify-between">
                <CardTitle class="flex items-center gap-2 text-sm font-semibold">
                  <Trash2 class="size-4 text-rose-500" />
                  Vacuum & Orphan File Purger
                </CardTitle>
                <Badge variant="success" class="text-xs">Enabled · Daily</Badge>
              </div>
              <CardDescription class="text-xs">
                Hard-deletes unreferenced data files and uncommitted multi-part upload orphans in S3
              </CardDescription>
            </CardHeader>
            <CardContent class="space-y-3 p-4 pt-3 text-xs sm:p-5">
              <div class="border-border bg-muted/40 space-y-2 rounded-lg border p-3">
                <div class="text-muted-foreground flex justify-between">
                  <span>Retention Grace Period:</span>
                  <span class="text-foreground font-mono font-semibold">7 Days (168 Hours)</span>
                </div>
                <div class="text-muted-foreground flex justify-between">
                  <span>Storage Reclaimed (30d):</span>
                  <span class="font-mono font-semibold text-emerald-600 dark:text-emerald-400">1.2 TB freed</span>
                </div>
                <div class="text-muted-foreground flex justify-between">
                  <span>Execution Schedule:</span>
                  <span class="text-foreground font-mono">Daily at 02:00 UTC</span>
                </div>
                <div class="text-muted-foreground flex justify-between">
                  <span>Safety Guard:</span>
                  <span class="text-foreground">Explicit dry-run verification check</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Snapshot Expiration Policy -->
          <Card class="border-border bg-card shadow-xs">
            <CardHeader class="p-4 pb-2 sm:p-5 sm:pb-2">
              <div class="flex items-center justify-between">
                <CardTitle class="flex items-center gap-2 text-sm font-semibold">
                  <Clock class="size-4 text-blue-500" />
                  Snapshot Expiration Policy
                </CardTitle>
                <Badge variant="info" class="text-xs">30-Day Window</Badge>
              </div>
              <CardDescription class="text-xs">
                Controls metadata table history retention for time-travel queries and rollback safety
              </CardDescription>
            </CardHeader>
            <CardContent class="space-y-3 p-4 pt-3 text-xs sm:p-5">
              <div class="border-border bg-muted/40 space-y-2 rounded-lg border p-3">
                <div class="text-muted-foreground flex justify-between">
                  <span>Retention Window:</span>
                  <span class="text-foreground font-mono font-semibold">30 Days</span>
                </div>
                <div class="text-muted-foreground flex justify-between">
                  <span>Min Snapshots Retained:</span>
                  <span class="text-foreground font-mono font-semibold">20 Snapshots</span>
                </div>
                <div class="text-muted-foreground flex justify-between">
                  <span>Clean Expired Metadata:</span>
                  <span class="text-foreground font-mono">Yes (Purge orphan Avro manifests)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Manifest Consolidation -->
          <Card class="border-border bg-card shadow-xs">
            <CardHeader class="p-4 pb-2 sm:p-5 sm:pb-2">
              <div class="flex items-center justify-between">
                <CardTitle class="flex items-center gap-2 text-sm font-semibold">
                  <FileText class="size-4 text-violet-500" />
                  Manifest File Consolidation
                </CardTitle>
                <Badge variant="success" class="text-xs">Optimized</Badge>
              </div>
              <CardDescription class="text-xs">
                Rewrites small manifest files to accelerate query planning and metadata scanning
              </CardDescription>
            </CardHeader>
            <CardContent class="space-y-3 p-4 pt-3 text-xs sm:p-5">
              <div class="border-border bg-muted/40 space-y-2 rounded-lg border p-3">
                <div class="text-muted-foreground flex justify-between">
                  <span>Active Manifest Count:</span>
                  <span class="text-foreground font-mono font-semibold">6 Manifests</span>
                </div>
                <div class="text-muted-foreground flex justify-between">
                  <span>Rewrite Trigger Threshold:</span>
                  <span class="text-foreground font-mono">&gt; 50 Small Manifests</span>
                </div>
                <div class="text-muted-foreground flex justify-between">
                  <span>Query Planning Overhead:</span>
                  <span class="font-mono font-semibold text-emerald-600 dark:text-emerald-400">&lt; 15ms</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <!-- TAB 4: FILE SIZING & I/O DISTRIBUTION -->
      <TabsContent value="files" class="space-y-5">
        <Card class="border-border bg-card shadow-xs">
          <CardHeader class="p-5 pb-3">
            <CardTitle class="text-base font-semibold"> File Size Distribution & I/O Amplification Analysis </CardTitle>
            <CardDescription class="text-xs">
              Comparison of storage layout before vs. after Iceberg automatic compaction
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent class="space-y-6 p-5">
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
              <!-- Before Compaction -->
              <div class="border-border bg-muted/20 space-y-3 rounded-xl border p-4">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold text-rose-600 dark:text-rose-400"
                    >Before Compaction (Small File Problem)</span
                  >
                  <Badge variant="destructive" class="font-mono text-xs">18.4x I/O Amplification</Badge>
                </div>
                <div class="space-y-2 text-xs">
                  <div class="text-muted-foreground flex justify-between">
                    <span>Total Small Files (&lt;4MB):</span>
                    <span class="text-foreground font-mono font-bold">14,280 Files</span>
                  </div>
                  <div class="text-muted-foreground flex justify-between">
                    <span>Average File Size:</span>
                    <span class="text-foreground font-mono">2.4 MB</span>
                  </div>
                  <div class="text-muted-foreground flex justify-between">
                    <span>Query Scan Latency (P95):</span>
                    <span class="font-mono font-semibold text-rose-600 dark:text-rose-400">8.4 seconds</span>
                  </div>
                  <div class="text-muted-foreground flex justify-between">
                    <span>S3 GET Request Cost:</span>
                    <span class="text-foreground font-mono">$380 / month</span>
                  </div>
                </div>
              </div>

              <!-- After Compaction -->
              <div class="space-y-3 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.03] p-4">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                    >After Compaction (Optimal Bin-Pack)</span
                  >
                  <Badge variant="success" class="font-mono text-xs">1.02x Near-Ideal</Badge>
                </div>
                <div class="space-y-2 text-xs">
                  <div class="text-muted-foreground flex justify-between">
                    <span>Total Target Files (128MB):</span>
                    <span class="text-foreground font-mono font-bold">142 Files</span>
                  </div>
                  <div class="text-muted-foreground flex justify-between">
                    <span>Average File Size:</span>
                    <span class="text-foreground font-mono">128.2 MB</span>
                  </div>
                  <div class="text-muted-foreground flex justify-between">
                    <span>Query Scan Latency (P95):</span>
                    <span class="font-mono font-semibold text-emerald-600 dark:text-emerald-400"
                      >220 milliseconds (38x speedup)</span
                    >
                  </div>
                  <div class="text-muted-foreground flex justify-between">
                    <span>S3 GET Request Cost:</span>
                    <span class="text-foreground font-mono">$12 / month</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>

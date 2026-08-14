<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  ArrowDown,
  ArrowRightLeft,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Cpu,
  Database,
  Download,
  Flame,
  Gauge,
  Layers,
  Server,
  ShieldAlert,
  Sparkles,
  Workflow,
  X,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export type StageStatus = 'succeeded' | 'running' | 'failed' | 'pending'
export type ExecutorStatus = 'active' | 'dead' | 'excluded'

export interface TaskQuantiles {
  min: number
  p25: number
  median: number
  p75: number
  p95: number
  max: number
}

export interface TaskBreakdownMetrics {
  executorRunTime: string
  jvmGcTime: string
  shuffleFetchWait: string
  serializationTime: string
  deserializationTime: string
  peakMemory: string
}

export interface SparkStage {
  id: number
  name: string
  callSite: string
  operator: string
  status: StageStatus
  tasksTotal: number
  tasksSucceeded: number
  tasksFailed: number
  duration: string
  durationSec: number
  inputBytes: string
  inputRecords: string
  outputBytes: string
  outputRecords: string
  shuffleReadBytes: string
  shuffleWriteBytes: string
  spillMemory: string
  spillDisk: string
  skewRatio: number
  quantiles: TaskQuantiles
  taskBreakdown: TaskBreakdownMetrics
  details: string
  upstreamStageIds: number[]
  downstreamStageIds: number[]
  branch: 'left' | 'right' | 'join'
}

export interface SparkExecutor {
  id: string
  host: string
  role: 'driver' | 'executor'
  status: ExecutorStatus
  cores: number
  memoryUsedGB: number
  memoryTotalGB: number
  memoryPercent: number
  gcTimeSec: number
  gcPercent: number
  tasksCompleted: number
  tasksTotal: number
  tasksFailed: number
  shuffleReadGB: number
  shuffleWriteGB: number
  spillGB: number
}

export interface AqeRule {
  id: string
  name: string
  status: 'applied' | 'skipped'
  description: string
  impact: string
}

interface Props {
  initialStageId?: number
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  initialStageId: 2,
})

const stages: SparkStage[] = [
  {
    id: 0,
    name: 'FileScan parquet',
    callSite: 'spark.read.parquet("s3://warehouse/customer_transactions")',
    operator: 'FileScan parquet default.customer_transactions [customer_id#42, amount#43, txn_date#44]',
    status: 'succeeded',
    tasksTotal: 540,
    tasksSucceeded: 540,
    tasksFailed: 0,
    duration: '18s',
    durationSec: 18,
    inputBytes: '14.2 GB',
    inputRecords: '14,820,400',
    outputBytes: '14.2 GB',
    outputRecords: '14,820,400',
    shuffleReadBytes: '0 B',
    shuffleWriteBytes: '0 B',
    spillMemory: '0 B',
    spillDisk: '0 B',
    skewRatio: 1.12,
    quantiles: { min: 0.8, p25: 1.2, median: 1.6, p75: 1.8, p95: 2.0, max: 2.1 },
    taskBreakdown: {
      executorRunTime: '1.52s',
      jvmGcTime: '32ms',
      shuffleFetchWait: '0ms',
      serializationTime: '14ms',
      deserializationTime: '28ms',
      peakMemory: '128 MB',
    },
    details:
      'Read partitioned parquet files from AWS S3 bucket s3://warehouse/customer_transactions. Pushed filters: [IsNotNull(customer_id), GreaterThanOrEqual(txn_date, 2026-01-01)].',
    upstreamStageIds: [],
    downstreamStageIds: [1],
    branch: 'left',
  },
  {
    id: 1,
    name: 'Exchange hashpartitioning',
    callSite: 'df.repartitionByRange(200, col("customer_id"))',
    operator: 'Exchange hashpartitioning(customer_id#42, 200), ENSURE_REQUIREMENTS, [plan_id=108]',
    status: 'succeeded',
    tasksTotal: 200,
    tasksSucceeded: 200,
    tasksFailed: 0,
    duration: '42s',
    durationSec: 42,
    inputBytes: '0 B',
    inputRecords: '14,820,400',
    outputBytes: '8.4 GB',
    outputRecords: '14,820,400',
    shuffleReadBytes: '14.2 GB',
    shuffleWriteBytes: '8.4 GB',
    spillMemory: '0 B',
    spillDisk: '0 B',
    skewRatio: 1.15,
    quantiles: { min: 1.8, p25: 2.4, median: 2.9, p75: 3.2, p95: 3.4, max: 3.6 },
    taskBreakdown: {
      executorRunTime: '2.74s',
      jvmGcTime: '58ms',
      shuffleFetchWait: '92ms',
      serializationTime: '18ms',
      deserializationTime: '22ms',
      peakMemory: '240 MB',
    },
    details:
      'Shuffle exchange hash-partitioning 14.82M rows across 200 AQE-coalesced partition buckets based on Murmur3 hash of customer_id column.',
    upstreamStageIds: [0],
    downstreamStageIds: [2],
    branch: 'left',
  },
  {
    id: 2,
    name: 'HashAggregate & Filter',
    callSite: 'df.groupBy("customer_id").agg(sum("amount").as("total_spend"), count("txn_id").as("tx_count"))',
    operator: 'HashAggregate(keys=[customer_id#42], functions=[sum(amount#43), count(txn_id#45)])',
    status: 'succeeded',
    tasksTotal: 200,
    tasksSucceeded: 200,
    tasksFailed: 0,
    duration: '1m 12s',
    durationSec: 72,
    inputBytes: '0 B',
    inputRecords: '14,820,400',
    outputBytes: '4.6 GB',
    outputRecords: '1,480,000',
    shuffleReadBytes: '8.4 GB',
    shuffleWriteBytes: '4.6 GB',
    spillMemory: '420 MB',
    spillDisk: '0 B',
    skewRatio: 1.18,
    quantiles: { min: 2.1, p25: 2.8, median: 3.5, p75: 3.9, p95: 4.1, max: 4.2 },
    taskBreakdown: {
      executorRunTime: '3.42s',
      jvmGcTime: '74ms',
      shuffleFetchWait: '110ms',
      serializationTime: '14ms',
      deserializationTime: '24ms',
      peakMemory: '342 MB',
    },
    details:
      'Aggregated raw transaction events down to 1.48M unique customer lifetime metrics. In-memory hash aggregation spilled 420 MB into JVM execution memory off-heap storage.',
    upstreamStageIds: [1],
    downstreamStageIds: [3],
    branch: 'left',
  },
  {
    id: 4,
    name: 'FileScan customer_dim',
    callSite: 'spark.read.parquet("s3://warehouse/customer_dim")',
    operator: 'FileScan parquet default.customer_dim [customer_id#98, full_name#99, tier#100, signup_date#101]',
    status: 'succeeded',
    tasksTotal: 120,
    tasksSucceeded: 120,
    tasksFailed: 0,
    duration: '12s',
    durationSec: 12,
    inputBytes: '3.1 GB',
    inputRecords: '2,400,000',
    outputBytes: '3.1 GB',
    outputRecords: '2,400,000',
    shuffleReadBytes: '0 B',
    shuffleWriteBytes: '0 B',
    spillMemory: '0 B',
    spillDisk: '0 B',
    skewRatio: 1.09,
    quantiles: { min: 0.6, p25: 0.9, median: 1.1, p75: 1.3, p95: 1.4, max: 1.5 },
    taskBreakdown: {
      executorRunTime: '1.04s',
      jvmGcTime: '22ms',
      shuffleFetchWait: '0ms',
      serializationTime: '10ms',
      deserializationTime: '18ms',
      peakMemory: '96 MB',
    },
    details: 'Read customer demographic and subscription tier metadata from AWS S3 parquet catalog.',
    upstreamStageIds: [],
    downstreamStageIds: [5],
    branch: 'right',
  },
  {
    id: 5,
    name: 'Exchange customer_dim',
    callSite: 'customerDim.repartition(200, col("customer_id"))',
    operator: 'Exchange hashpartitioning(customer_id#98, 200), ENSURE_REQUIREMENTS, [plan_id=142]',
    status: 'succeeded',
    tasksTotal: 120,
    tasksSucceeded: 120,
    tasksFailed: 0,
    duration: '16s',
    durationSec: 16,
    inputBytes: '0 B',
    inputRecords: '2,400,000',
    outputBytes: '3.1 GB',
    outputRecords: '2,400,000',
    shuffleReadBytes: '3.1 GB',
    shuffleWriteBytes: '3.1 GB',
    spillMemory: '0 B',
    spillDisk: '0 B',
    skewRatio: 1.11,
    quantiles: { min: 0.8, p25: 1.1, median: 1.3, p75: 1.5, p95: 1.7, max: 1.8 },
    taskBreakdown: {
      executorRunTime: '1.24s',
      jvmGcTime: '26ms',
      shuffleFetchWait: '48ms',
      serializationTime: '12ms',
      deserializationTime: '16ms',
      peakMemory: '160 MB',
    },
    details:
      'Shuffle partitioned customer dimension records across 200 partitions matching left transaction dataset partition key.',
    upstreamStageIds: [4],
    downstreamStageIds: [3],
    branch: 'right',
  },
  {
    id: 3,
    name: 'SortMergeJoin',
    callSite: 'txnAgg.join(customerDim, col("customer_id#42") === col("customer_id#98"), "inner")',
    operator: 'SortMergeJoin [customer_id#42], [customer_id#98], Inner',
    status: 'succeeded',
    tasksTotal: 200,
    tasksSucceeded: 200,
    tasksFailed: 0,
    duration: '1m 20s',
    durationSec: 80,
    inputBytes: '0 B',
    inputRecords: '1,480,000',
    outputBytes: '29.8 GB',
    outputRecords: '1,240,000 (Joined 14.8M keys)',
    shuffleReadBytes: '7.7 GB',
    shuffleWriteBytes: '29.8 GB',
    spillMemory: '1.06 GB',
    spillDisk: '0 B',
    skewRatio: 1.21,
    quantiles: { min: 2.4, p25: 3.1, median: 3.8, p75: 4.3, p95: 4.6, max: 4.8 },
    taskBreakdown: {
      executorRunTime: '3.72s',
      jvmGcTime: '82ms',
      shuffleFetchWait: '140ms',
      serializationTime: '22ms',
      deserializationTime: '32ms',
      peakMemory: '480 MB',
    },
    details:
      'Executed distributed SortMergeJoin matching customer_id keys across left aggregated metrics and right dimension tables. AQE coalesced skewed partitions and eliminated full table broadcast risk.',
    upstreamStageIds: [2, 5],
    downstreamStageIds: [],
    branch: 'join',
  },
]

const executors: SparkExecutor[] = [
  {
    id: 'driver',
    host: '10.0.12.4',
    role: 'driver',
    status: 'active',
    cores: 16,
    memoryUsedGB: 24.2,
    memoryTotalGB: 32,
    memoryPercent: 75.6,
    gcTimeSec: 4.2,
    gcPercent: 1.8,
    tasksCompleted: 285,
    tasksTotal: 285,
    tasksFailed: 0,
    shuffleReadGB: 10.8,
    shuffleWriteGB: 10.8,
    spillGB: 0.36,
  },
  {
    id: 'exec-1',
    host: '10.0.12.18',
    role: 'executor',
    status: 'active',
    cores: 32,
    memoryUsedGB: 28.8,
    memoryTotalGB: 32,
    memoryPercent: 90.0,
    gcTimeSec: 5.1,
    gcPercent: 2.2,
    tasksCompleted: 284,
    tasksTotal: 284,
    tasksFailed: 0,
    shuffleReadGB: 11.2,
    shuffleWriteGB: 11.2,
    spillGB: 0.42,
  },
  {
    id: 'exec-2',
    host: '10.0.12.29',
    role: 'executor',
    status: 'active',
    cores: 32,
    memoryUsedGB: 21.4,
    memoryTotalGB: 32,
    memoryPercent: 66.8,
    gcTimeSec: 4.8,
    gcPercent: 2.3,
    tasksCompleted: 286,
    tasksTotal: 286,
    tasksFailed: 0,
    shuffleReadGB: 10.4,
    shuffleWriteGB: 10.4,
    spillGB: 0.34,
  },
  {
    id: 'exec-3',
    host: '10.0.12.44',
    role: 'executor',
    status: 'active',
    cores: 32,
    memoryUsedGB: 18.6,
    memoryTotalGB: 32,
    memoryPercent: 58.1,
    gcTimeSec: 4.3,
    gcPercent: 2.1,
    tasksCompleted: 285,
    tasksTotal: 285,
    tasksFailed: 0,
    shuffleReadGB: 10.4,
    shuffleWriteGB: 10.4,
    spillGB: 0.36,
  },
]

const aqeRules: AqeRule[] = [
  {
    id: 'aqe-1',
    name: 'CoalesceShufflePartitions',
    status: 'applied',
    description:
      'Coalesced 540 initial map partitions down to 200 target shuffle partitions based on target partition size (64 MB).',
    impact: 'Reduced network RPC overhead by 63% and avoided 340 small shuffle partition files.',
  },
  {
    id: 'aqe-2',
    name: 'OptimizeSkewedJoin',
    status: 'applied',
    description: 'Dynamic skew detection evaluated all 200 partition sizes against the 5x median threshold.',
    impact: 'Max partition skew ratio remained well balanced at 1.18x. No partition splitting required.',
  },
  {
    id: 'aqe-3',
    name: 'DemoteBroadcastHashJoin',
    status: 'skipped',
    description: 'Evaluated right dimension relation size (3.1 GB) against auto-broadcast threshold (10 MB).',
    impact: 'Relation exceeded broadcast threshold; preserved robust SortMergeJoin strategy.',
  },
  {
    id: 'aqe-4',
    name: 'EliminateSubqueryAliases',
    status: 'applied',
    description: 'Inlined and pruned unused redundant subquery attribute references from execution DAG.',
    impact: 'Streamlined Catalyst physical plan tree depth from 14 nodes down to 8 nodes.',
  },
]

const selectedStageId = ref<number>(props.initialStageId)
const activeTab = ref<string>('dag')
const copiedAppId = ref<boolean>(false)
const showKillConfirm = ref<boolean>(false)
const downloadStarted = ref<boolean>(false)
const stageSearch = ref<string>('')

const selectedStage = computed(() => {
  return stages.find((s) => s.id === selectedStageId.value) ?? stages[2]
})

const filteredStages = computed(() => {
  if (!stageSearch.value.trim()) return stages
  const q = stageSearch.value.toLowerCase()
  return stages.filter((s) => s.name.toLowerCase().includes(q) || s.operator.toLowerCase().includes(q))
})

const leftBranchStages = computed(() => stages.filter((s) => s.branch === 'left'))
const rightBranchStages = computed(() => stages.filter((s) => s.branch === 'right'))
const joinStage = computed(() => stages.find((s) => s.branch === 'join')!)

function selectStage(id: number) {
  selectedStageId.value = id
}

function copyAppId() {
  navigator.clipboard?.writeText('app-20260821-142850-0042')
  copiedAppId.value = true
  setTimeout(() => {
    copiedAppId.value = false
  }, 2000)
}

function triggerDownload() {
  downloadStarted.value = true
  setTimeout(() => {
    downloadStarted.value = false
  }, 2500)
}

function getQuantilePosition(val: number, max: number = 5.0) {
  return Math.min(100, Math.max(0, (val / max) * 100))
}
</script>

<template>
  <div :class="cn('text-foreground w-full space-y-6 font-sans antialiased', props.class)">
    <!-- Header Section -->
    <div class="border-border bg-card rounded-xl border p-5 shadow-xs transition-colors">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <!-- Title & Identifiers -->
        <div class="space-y-1.5">
          <div class="flex flex-wrap items-center gap-2.5">
            <div
              class="flex size-9 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400"
            >
              <Flame class="size-5" />
            </div>
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h1 class="text-base font-semibold tracking-tight sm:text-lg">AggregatedCustomerLTVJob</h1>
                <Badge wrap variant="outline" class="text-muted-foreground font-mono text-xs">
                  app-20260821-142850-0042
                </Badge>
                <Button
                  variant="ghost"
                  size="xs"
                  class="text-muted-foreground hover:text-foreground h-6 px-1.5 text-xs"
                  aria-label="Copy Spark Application ID"
                  @click="copyAppId"
                >
                  <Check v-if="copiedAppId" class="size-3 text-emerald-500" />
                  <Copy v-else class="size-3" />
                  <span class="sr-only">Copy Application ID</span>
                </Button>
              </div>
              <p class="text-muted-foreground text-xs">Apache Spark 3.5.1 · Adaptive Query Execution (AQE) Enabled</p>
            </div>
          </div>

          <!-- Metadata Tags -->
          <div class="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs">
            <div class="flex items-center gap-1.5">
              <span class="size-2 rounded-full bg-emerald-500" />
              <span class="text-foreground font-medium">Job Succeeded</span>
              <span>·</span>
              <span class="font-mono tabular-nums">03m:42s</span>
            </div>
            <div class="flex items-center gap-1">
              <Server class="size-3.5" />
              <span
                >Cluster: <strong class="text-foreground font-medium">c5d.4xlarge (4 nodes · 112 vCPUs)</strong></span
              >
            </div>
            <div class="flex items-center gap-1">
              <Clock class="size-3.5" />
              <span>Started: <strong class="text-foreground font-medium">14:28:50 UTC</strong></span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center gap-2">
          <Button
            aria-label="Download attachment"
            variant="outline"
            size="sm"
            class="h-8 gap-1.5 text-xs"
            :disabled="downloadStarted"
            @click="triggerDownload"
          >
            <CheckCircle2 v-if="downloadStarted" class="size-3.5 text-emerald-500" />
            <Download v-else class="size-3.5" />
            <span>{{ downloadStarted ? 'Log Exported' : 'Download EventLog' }}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            class="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 gap-1.5 text-xs"
            @click="showKillConfirm = !showKillConfirm"
          >
            <X class="size-3.5" />
            <span>Kill Application</span>
          </Button>
        </div>
      </div>

      <!-- Kill Confirmation Alert (Collapsible) -->
      <div
        v-if="showKillConfirm"
        class="border-destructive/30 bg-destructive/5 text-destructive mt-4 flex items-center justify-between rounded-lg border p-3 text-xs"
      >
        <div class="flex flex-wrap items-center gap-2">
          <ShieldAlert class="size-4 shrink-0" />
          <span
            >This application is in finished state (SUCCEEDED). Terminating an inactive application will release log
            retention locks.</span
          >
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <Button size="xs" variant="destructive" @click="showKillConfirm = false"> Confirm Release </Button>
          <Button size="xs" variant="ghost" @click="showKillConfirm = false"> Cancel </Button>
        </div>
      </div>
    </div>

    <!-- 4 Spark Job Execution KPI Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- KPI 1: Stages -->
      <Card class="border-border shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium"> Total Stages Completed </CardTitle>
          <div
            class="flex size-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          >
            <CheckCircle2 class="size-4" />
          </div>
        </CardHeader>
        <CardContent class="space-y-2">
          <div class="text-foreground font-mono text-2xl font-bold tracking-tight">6 / 6</div>
          <div class="flex flex-wrap items-center gap-2">
            <Badge wrap variant="success" class="text-xs"> 6 / 6 Stages Succeeded </Badge>
          </div>
          <p class="text-muted-foreground text-xs">0 failed · 0 skipped · 4 stages active in DAG</p>
        </CardContent>
      </Card>

      <!-- KPI 2: Shuffle & Spill -->
      <Card class="border-border shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium"> Shuffle Read / Write Volume </CardTitle>
          <div
            class="flex size-7 items-center justify-center rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400"
          >
            <ArrowRightLeft class="size-4" />
          </div>
        </CardHeader>
        <CardContent class="space-y-2">
          <div class="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">42.8 GB</div>
          <div class="text-muted-foreground flex items-center gap-1.5 text-xs">
            <span class="text-foreground font-medium">42.8 GB Shuffle Write</span>
            <span>·</span>
            <span class="font-mono text-amber-600 dark:text-amber-400">1.48 GB Spill (Memory)</span>
          </div>
          <p class="text-muted-foreground text-xs">38.6 GB shuffle read · 0 B disk spill</p>
        </CardContent>
      </Card>

      <!-- KPI 3: Task Skew Ratio -->
      <Card class="border-border shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium"> Task Skew Max/Median Ratio </CardTitle>
          <div
            class="flex size-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          >
            <Gauge class="size-4" />
          </div>
        </CardHeader>
        <CardContent class="space-y-2">
          <div class="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">1.18x</div>
          <div class="flex flex-wrap items-center gap-2">
            <Badge wrap variant="success" class="text-xs"> 1.18x Ratio · Well Balanced </Badge>
          </div>
          <p class="text-muted-foreground text-xs">
            Max task: <span class="text-foreground font-mono font-medium">4.2s</span> · Median:
            <span class="text-foreground font-mono font-medium">3.5s</span>
          </p>
        </CardContent>
      </Card>

      <!-- KPI 4: JVM GC Overhead -->
      <Card class="border-border shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-muted-foreground text-xs font-medium"> Executor JVM GC Time </CardTitle>
          <div
            class="flex size-7 items-center justify-center rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400"
          >
            <Cpu class="size-4" />
          </div>
        </CardHeader>
        <CardContent class="space-y-2">
          <div class="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">2.1%</div>
          <div class="flex flex-wrap items-center gap-2">
            <Badge wrap variant="success" class="text-xs"> 2.1% of Total CPU Time · Healthy </Badge>
          </div>
          <p class="text-muted-foreground text-xs">18.4s GC time across 880s CPU total</p>
        </CardContent>
      </Card>
    </div>

    <!-- Main Content Tabs -->
    <Tabs v-model="activeTab" class="space-y-4">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TabsList class="grid w-full grid-cols-2 sm:w-auto sm:grid-cols-4">
          <TabsTrigger value="dag" class="text-xs"> Stages DAG Flow </TabsTrigger>
          <TabsTrigger value="skew" class="text-xs"> Task Skew & Quantiles </TabsTrigger>
          <TabsTrigger value="executors" class="text-xs"> Executors (4) </TabsTrigger>
          <TabsTrigger value="aqe" class="text-xs"> AQE Optimizer </TabsTrigger>
        </TabsList>

        <div class="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
          <span class="bg-primary inline-block size-2 rounded-full" />
          <span>Active Selection:</span>
          <span class="text-foreground font-medium">Stage {{ selectedStage.id }} ({{ selectedStage.name }})</span>
        </div>
      </div>

      <!-- TAB 1: INTERACTIVE SPARK STAGES DAG FLOW -->
      <TabsContent value="dag" class="space-y-6 focus-visible:outline-none">
        <Card class="border-border shadow-xs">
          <CardHeader class="border-border/60 border-b pb-4">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle class="text-base font-semibold"> Distributed Job Execution DAG </CardTitle>
                <CardDescription class="text-xs">
                  Interactive stage graph showing task parallelization, shuffle boundaries, and operator fusion. Click
                  any stage to inspect.
                </CardDescription>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <Badge wrap variant="outline" class="font-mono text-xs"> AQE Coalesced: 540 → 200 Partitions </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent class="p-6">
            <!-- DAG Topology Container -->
            <div class="space-y-8">
              <!-- Two parallel branches joining together -->
              <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <!-- Left Branch: Transactions -->
                <div class="border-border/80 bg-muted/20 space-y-4 rounded-xl border p-4">
                  <div class="border-border/60 flex items-center justify-between border-b pb-2">
                    <div class="flex flex-wrap items-center gap-2">
                      <Database class="size-4 text-orange-500" />
                      <span class="text-muted-foreground text-xs font-semibold">
                        Branch 1: Customer Transactions Pipeline
                      </span>
                    </div>
                    <Badge wrap variant="outline" class="font-mono text-xs">14.8M records</Badge>
                  </div>

                  <!-- Stage 0 -->
                  <div
                    tabindex="0"
                    role="button"
                    :aria-pressed="selectedStageId === 0"
                    :class="
                      cn(
                        'group focus-visible:ring-ring relative cursor-pointer rounded-lg border p-4 transition-all duration-150 focus-visible:ring-2 focus-visible:outline-none',
                        selectedStageId === 0
                          ? 'border-primary bg-primary/5 ring-primary shadow-xs ring-1'
                          : 'border-border bg-card hover:border-border/80 hover:bg-muted/40',
                      )
                    "
                    @click="selectStage(0)"
                    @keydown.enter="selectStage(0)"
                    @keydown.space.prevent="selectStage(0)"
                  >
                    <div class="flex items-start justify-between gap-3">
                      <div class="space-y-1">
                        <div class="flex flex-wrap items-center gap-2">
                          <Badge wrap variant="secondary" class="font-mono text-xs">Stage 0</Badge>
                          <span class="text-foreground text-sm font-semibold">FileScan parquet</span>
                        </div>
                        <p class="text-muted-foreground font-mono text-xs">540 tasks · 18s · 14.2 GB read</p>
                      </div>
                      <Badge wrap variant="success" class="text-xs">Succeeded</Badge>
                    </div>
                    <div class="text-muted-foreground mt-3 flex items-center justify-between text-xs">
                      <span>Operator: FileScan parquet</span>
                      <span class="text-foreground font-mono tabular-nums">14.82M rows</span>
                    </div>
                  </div>

                  <!-- Connector Arrow -->
                  <div class="text-muted-foreground flex items-center justify-center py-0.5">
                    <div
                      class="border-border bg-card flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-xs"
                    >
                      <ArrowDown class="text-muted-foreground size-3" />
                      <span>14.2 GB in-memory scan</span>
                    </div>
                  </div>

                  <!-- Stage 1 -->
                  <div
                    tabindex="0"
                    role="button"
                    :aria-pressed="selectedStageId === 1"
                    :class="
                      cn(
                        'group focus-visible:ring-ring relative cursor-pointer rounded-lg border p-4 transition-all duration-150 focus-visible:ring-2 focus-visible:outline-none',
                        selectedStageId === 1
                          ? 'border-primary bg-primary/5 ring-primary shadow-xs ring-1'
                          : 'border-border bg-card hover:border-border/80 hover:bg-muted/40',
                      )
                    "
                    @click="selectStage(1)"
                    @keydown.enter="selectStage(1)"
                    @keydown.space.prevent="selectStage(1)"
                  >
                    <div class="flex items-start justify-between gap-3">
                      <div class="space-y-1">
                        <div class="flex flex-wrap items-center gap-2">
                          <Badge wrap variant="secondary" class="font-mono text-xs">Stage 1</Badge>
                          <span class="text-foreground text-sm font-semibold">Exchange hashpartitioning</span>
                        </div>
                        <p class="text-muted-foreground font-mono text-xs">200 tasks · 42s · 8.4 GB shuffle write</p>
                      </div>
                      <Badge wrap variant="success" class="text-xs">Succeeded</Badge>
                    </div>
                    <div class="text-muted-foreground mt-3 flex items-center justify-between text-xs">
                      <span>Key: Murmur3(customer_id)</span>
                      <span class="text-foreground font-mono tabular-nums">200 partitions</span>
                    </div>
                  </div>

                  <!-- Connector Arrow -->
                  <div class="text-muted-foreground flex items-center justify-center py-0.5">
                    <div
                      class="border-border bg-card flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-xs"
                    >
                      <ArrowDown class="text-muted-foreground size-3" />
                      <span>8.4 GB shuffle transfer</span>
                    </div>
                  </div>

                  <!-- Stage 2 -->
                  <div
                    tabindex="0"
                    role="button"
                    :aria-pressed="selectedStageId === 2"
                    :class="
                      cn(
                        'group focus-visible:ring-ring relative cursor-pointer rounded-lg border p-4 transition-all duration-150 focus-visible:ring-2 focus-visible:outline-none',
                        selectedStageId === 2
                          ? 'border-primary bg-primary/5 ring-primary shadow-xs ring-1'
                          : 'border-border bg-card hover:border-border/80 hover:bg-muted/40',
                      )
                    "
                    @click="selectStage(2)"
                    @keydown.enter="selectStage(2)"
                    @keydown.space.prevent="selectStage(2)"
                  >
                    <div class="flex items-start justify-between gap-3">
                      <div class="space-y-1">
                        <div class="flex flex-wrap items-center gap-2">
                          <Badge wrap variant="secondary" class="font-mono text-xs">Stage 2</Badge>
                          <span class="text-foreground text-sm font-semibold">HashAggregate & Filter</span>
                        </div>
                        <p class="text-muted-foreground font-mono text-xs">200 tasks · 1m 12s · 4.6 GB write</p>
                      </div>
                      <Badge wrap variant="success" class="text-xs">Succeeded</Badge>
                    </div>
                    <div class="text-muted-foreground mt-3 flex items-center justify-between text-xs">
                      <span>Aggregations: sum(amount), count(1)</span>
                      <span class="font-mono text-amber-600 tabular-nums dark:text-amber-400">420 MB spill</span>
                    </div>
                  </div>
                </div>

                <!-- Right Branch: Customer Dim -->
                <div class="border-border/80 bg-muted/20 space-y-4 rounded-xl border p-4">
                  <div class="border-border/60 flex items-center justify-between border-b pb-2">
                    <div class="flex flex-wrap items-center gap-2">
                      <Layers class="size-4 text-blue-500" />
                      <span class="text-muted-foreground text-xs font-semibold">
                        Branch 2: Customer Dimension Pipeline
                      </span>
                    </div>
                    <Badge wrap variant="outline" class="font-mono text-xs">2.4M records</Badge>
                  </div>

                  <!-- Stage 4 -->
                  <div
                    tabindex="0"
                    role="button"
                    :aria-pressed="selectedStageId === 4"
                    :class="
                      cn(
                        'group focus-visible:ring-ring relative cursor-pointer rounded-lg border p-4 transition-all duration-150 focus-visible:ring-2 focus-visible:outline-none',
                        selectedStageId === 4
                          ? 'border-primary bg-primary/5 ring-primary shadow-xs ring-1'
                          : 'border-border bg-card hover:border-border/80 hover:bg-muted/40',
                      )
                    "
                    @click="selectStage(4)"
                    @keydown.enter="selectStage(4)"
                    @keydown.space.prevent="selectStage(4)"
                  >
                    <div class="flex items-start justify-between gap-3">
                      <div class="space-y-1">
                        <div class="flex flex-wrap items-center gap-2">
                          <Badge wrap variant="secondary" class="font-mono text-xs">Stage 4</Badge>
                          <span class="text-foreground text-sm font-semibold">FileScan customer_dim</span>
                        </div>
                        <p class="text-muted-foreground font-mono text-xs">120 tasks · 12s · 3.1 GB read</p>
                      </div>
                      <Badge wrap variant="success" class="text-xs">Succeeded</Badge>
                    </div>
                    <div class="text-muted-foreground mt-3 flex items-center justify-between text-xs">
                      <span>Operator: FileScan parquet</span>
                      <span class="text-foreground font-mono tabular-nums">2.40M rows</span>
                    </div>
                  </div>

                  <!-- Connector Arrow -->
                  <div class="text-muted-foreground flex items-center justify-center py-0.5">
                    <div
                      class="border-border bg-card flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-xs"
                    >
                      <ArrowDown class="text-muted-foreground size-3" />
                      <span>3.1 GB dimension scan</span>
                    </div>
                  </div>

                  <!-- Stage 5 -->
                  <div
                    tabindex="0"
                    role="button"
                    :aria-pressed="selectedStageId === 5"
                    :class="
                      cn(
                        'group focus-visible:ring-ring relative cursor-pointer rounded-lg border p-4 transition-all duration-150 focus-visible:ring-2 focus-visible:outline-none',
                        selectedStageId === 5
                          ? 'border-primary bg-primary/5 ring-primary shadow-xs ring-1'
                          : 'border-border bg-card hover:border-border/80 hover:bg-muted/40',
                      )
                    "
                    @click="selectStage(5)"
                    @keydown.enter="selectStage(5)"
                    @keydown.space.prevent="selectStage(5)"
                  >
                    <div class="flex items-start justify-between gap-3">
                      <div class="space-y-1">
                        <div class="flex flex-wrap items-center gap-2">
                          <Badge wrap variant="secondary" class="font-mono text-xs">Stage 5</Badge>
                          <span class="text-foreground text-sm font-semibold">Exchange customer_dim</span>
                        </div>
                        <p class="text-muted-foreground font-mono text-xs">120 tasks · 16s · 3.1 GB shuffle write</p>
                      </div>
                      <Badge wrap variant="success" class="text-xs">Succeeded</Badge>
                    </div>
                    <div class="text-muted-foreground mt-3 flex items-center justify-between text-xs">
                      <span>Key: Murmur3(customer_id)</span>
                      <span class="text-foreground font-mono tabular-nums">200 partitions</span>
                    </div>
                  </div>

                  <!-- Branch alignment spacer -->
                  <div class="text-muted-foreground hidden items-center justify-center py-5 lg:flex">
                    <div class="text-muted-foreground flex items-center gap-1 text-xs">
                      <Workflow class="size-3.5" />
                      <span>Ready for hash join</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Convergence Flow Indicator -->
              <div class="flex flex-col items-center justify-center gap-2">
                <div
                  class="border-border bg-muted/60 text-muted-foreground flex flex-wrap items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs"
                >
                  <Workflow class="text-primary size-3.5" />
                  <span>Shuffle Partition Alignment (200 Partitions × 2 Inputs)</span>
                </div>
                <ArrowDown class="text-muted-foreground size-4" />
              </div>

              <!-- Joined Final Stage: Stage 3 -->
              <div
                tabindex="0"
                role="button"
                :aria-pressed="selectedStageId === 3"
                :class="
                  cn(
                    'group focus-visible:ring-ring relative cursor-pointer rounded-xl border p-5 transition-all duration-150 focus-visible:ring-2 focus-visible:outline-none',
                    selectedStageId === 3
                      ? 'border-primary bg-primary/5 ring-primary shadow-sm ring-1'
                      : 'border-border bg-card hover:border-border/80 hover:bg-muted/40',
                  )
                "
                @click="selectStage(3)"
                @keydown.enter="selectStage(3)"
                @keydown.space.prevent="selectStage(3)"
              >
                <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div class="space-y-1">
                    <div class="flex flex-wrap items-center gap-2">
                      <Badge wrap variant="default" class="font-mono text-xs">Stage 3</Badge>
                      <h3 class="text-foreground text-base font-semibold">SortMergeJoin (Final Reduction)</h3>
                      <Badge wrap variant="outline" class="font-mono text-xs">Terminal Stage</Badge>
                    </div>
                    <p class="text-muted-foreground font-mono text-xs">
                      200 tasks · 1m 20s · Joined 14.8M keys · 1.24M output rows
                    </p>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="text-right text-xs">
                      <div class="text-foreground font-mono font-medium">29.8 GB Output</div>
                      <div class="font-mono text-amber-600 dark:text-amber-400">1.06 GB Mem Spill</div>
                    </div>
                    <Badge wrap variant="success" class="text-xs">Succeeded</Badge>
                  </div>
                </div>

                <div class="border-border/60 mt-4 grid grid-cols-2 gap-2 border-t pt-3 text-xs sm:grid-cols-4">
                  <div>
                    <span class="text-muted-foreground">Join Type:</span>
                    <p class="text-foreground font-mono font-medium">Inner SortMergeJoin</p>
                  </div>
                  <div>
                    <span class="text-muted-foreground">Join Key:</span>
                    <p class="text-foreground font-mono font-medium">customer_id#42 = customer_id#98</p>
                  </div>
                  <div>
                    <span class="text-muted-foreground">Tasks:</span>
                    <p class="text-foreground font-mono font-medium">200 / 200 (100%)</p>
                  </div>
                  <div>
                    <span class="text-muted-foreground">Skew Max/Median:</span>
                    <p class="font-mono font-medium text-emerald-600 dark:text-emerald-400">1.21x (Balanced)</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Selected Stage Deep Inspector -->
        <Card class="border-border shadow-xs">
          <CardHeader class="border-border/60 border-b pb-3">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex flex-wrap items-center gap-2">
                <Badge wrap variant="secondary" class="font-mono text-xs">Selected Stage {{ selectedStage.id }}</Badge>
                <CardTitle class="text-sm font-semibold">{{ selectedStage.name }} Details</CardTitle>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-muted-foreground text-xs">Duration:</span>
                <Badge wrap variant="outline" class="font-mono text-xs">{{ selectedStage.duration }}</Badge>
                <Badge wrap variant="success" class="text-xs">Completed</Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent class="space-y-4 p-5">
            <!-- Call Site Code Box -->
            <div class="space-y-1.5">
              <span class="text-muted-foreground text-xs font-medium">Catalyst Operator Expression</span>
              <div class="border-border bg-muted/40 text-foreground rounded-md border p-3 font-mono text-xs">
                <code>{{ selectedStage.operator }}</code>
              </div>
            </div>

            <!-- Stage Metrics Grid -->
            <div class="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4 lg:grid-cols-6">
              <div class="border-border/80 bg-card rounded-lg border p-3">
                <span class="text-muted-foreground">Tasks</span>
                <p class="text-foreground mt-1 font-mono text-sm font-semibold">
                  {{ selectedStage.tasksSucceeded }} / {{ selectedStage.tasksTotal }}
                </p>
              </div>
              <div class="border-border/80 bg-card rounded-lg border p-3">
                <span class="text-muted-foreground">Input Data</span>
                <p class="text-foreground mt-1 font-mono text-sm font-semibold">{{ selectedStage.inputBytes }}</p>
              </div>
              <div class="border-border/80 bg-card rounded-lg border p-3">
                <span class="text-muted-foreground">Shuffle Read</span>
                <p class="text-foreground mt-1 font-mono text-sm font-semibold">{{ selectedStage.shuffleReadBytes }}</p>
              </div>
              <div class="border-border/80 bg-card rounded-lg border p-3">
                <span class="text-muted-foreground">Shuffle Write</span>
                <p class="text-foreground mt-1 font-mono text-sm font-semibold">
                  {{ selectedStage.shuffleWriteBytes }}
                </p>
              </div>
              <div class="border-border/80 bg-card rounded-lg border p-3">
                <span class="text-muted-foreground">Spill (Memory)</span>
                <p class="mt-1 font-mono text-sm font-semibold text-amber-600 dark:text-amber-400">
                  {{ selectedStage.spillMemory }}
                </p>
              </div>
              <div class="border-border/80 bg-card rounded-lg border p-3">
                <span class="text-muted-foreground">Task Skew Ratio</span>
                <p class="mt-1 font-mono text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {{ selectedStage.skewRatio }}x
                </p>
              </div>
            </div>

            <p class="text-muted-foreground text-xs leading-relaxed">
              {{ selectedStage.details }}
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- TAB 2: TASK SKEW & QUANTILES DISTRIBUTION -->
      <TabsContent value="skew" class="space-y-6 focus-visible:outline-none">
        <Card class="border-border shadow-xs">
          <CardHeader class="border-border/60 border-b pb-4">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle class="text-base font-semibold"> Stage Task Duration Skew & Quantiles </CardTitle>
                <CardDescription class="text-xs">
                  Distribution of task execution time across executor cores for the selected stage.
                </CardDescription>
              </div>

              <!-- Quick Stage Selector Buttons -->
              <div class="flex flex-wrap items-center gap-1.5">
                <Button
                  v-for="s in stages"
                  :key="s.id"
                  size="xs"
                  :variant="selectedStageId === s.id ? 'default' : 'outline'"
                  class="font-mono text-xs"
                  @click="selectStage(s.id)"
                >
                  Stage {{ s.id }}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent class="space-y-6 p-6">
            <!-- Stage Title & Skew Ratio Banner -->
            <div
              class="border-border bg-muted/20 flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div class="space-y-0.5">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-foreground text-sm font-semibold"
                    >Stage {{ selectedStage.id }}: {{ selectedStage.name }}</span
                  >
                  <Badge wrap variant="outline" class="font-mono text-xs">{{ selectedStage.tasksTotal }} Tasks</Badge>
                </div>
                <p class="text-muted-foreground text-xs">
                  Duration: <span class="text-foreground font-mono font-medium">{{ selectedStage.duration }}</span> ·
                  Peak task memory:
                  <span class="text-foreground font-mono">{{ selectedStage.taskBreakdown.peakMemory }}</span>
                </p>
              </div>

              <div class="flex items-center gap-3">
                <div class="text-right">
                  <span class="text-muted-foreground text-xs">Max / Median Skew:</span>
                  <div class="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">
                    {{ selectedStage.skewRatio }}x
                  </div>
                </div>
                <Badge wrap variant="success" class="text-xs"> Well Balanced (&lt; 1.5x) </Badge>
              </div>
            </div>

            <!-- Quantiles Metric Row (Min, P25, Median, P75, P95, Max) -->
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <div class="border-border bg-card rounded-lg border p-3 text-center">
                <span class="text-muted-foreground text-xs font-medium">Min (0%)</span>
                <p class="text-foreground mt-1 font-mono text-lg font-bold tabular-nums">
                  {{ selectedStage.quantiles.min }}s
                </p>
                <span class="text-muted-foreground text-xs">Fastest task</span>
              </div>

              <div class="border-border bg-card rounded-lg border p-3 text-center">
                <span class="text-muted-foreground text-xs font-medium">25th Percentile</span>
                <p class="text-foreground mt-1 font-mono text-lg font-bold tabular-nums">
                  {{ selectedStage.quantiles.p25 }}s
                </p>
                <span class="text-muted-foreground text-xs">Q1 boundary</span>
              </div>

              <div class="border-primary/40 bg-primary/5 ring-primary/20 rounded-lg border p-3 text-center ring-1">
                <span class="text-primary text-xs font-medium">Median (P50)</span>
                <p class="text-primary mt-1 font-mono text-lg font-bold tabular-nums">
                  {{ selectedStage.quantiles.median }}s
                </p>
                <span class="text-muted-foreground text-xs">Midpoint baseline</span>
              </div>

              <div class="border-border bg-card rounded-lg border p-3 text-center">
                <span class="text-muted-foreground text-xs font-medium">75th Percentile</span>
                <p class="text-foreground mt-1 font-mono text-lg font-bold tabular-nums">
                  {{ selectedStage.quantiles.p75 }}s
                </p>
                <span class="text-muted-foreground text-xs">Q3 boundary</span>
              </div>

              <div class="border-border bg-card rounded-lg border p-3 text-center">
                <span class="text-muted-foreground text-xs font-medium">95th Percentile</span>
                <p class="text-foreground mt-1 font-mono text-lg font-bold tabular-nums">
                  {{ selectedStage.quantiles.p95 }}s
                </p>
                <span class="text-muted-foreground text-xs">Tail latency</span>
              </div>

              <div class="border-border bg-card rounded-lg border p-3 text-center">
                <span class="text-muted-foreground text-xs font-medium">Max (100%)</span>
                <p class="text-foreground mt-1 font-mono text-lg font-bold tabular-nums">
                  {{ selectedStage.quantiles.max }}s
                </p>
                <span class="text-muted-foreground text-xs">Straggler peak</span>
              </div>
            </div>

            <!-- Visual Distribution Bar -->
            <div class="border-border bg-muted/10 space-y-3 rounded-lg border p-5">
              <div class="text-muted-foreground flex items-center justify-between text-xs">
                <span class="text-foreground font-medium">Task Duration Quantiles Scale (0.0s – 5.0s)</span>
                <span class="font-mono"
                  >IQR: {{ (selectedStage.quantiles.p75 - selectedStage.quantiles.p25).toFixed(1) }}s</span
                >
              </div>

              <!-- Custom Box & Whisker Horizontal Bar -->
              <div class="relative pt-6 pb-2">
                <!-- Background track -->
                <div class="bg-muted relative h-4 w-full overflow-hidden rounded-full">
                  <!-- Min to Max Range Bar -->
                  <div
                    class="bg-primary/20 absolute top-0 bottom-0 rounded-full"
                    :style="{
                      left: `${getQuantilePosition(selectedStage.quantiles.min)}%`,
                      width: `${getQuantilePosition(selectedStage.quantiles.max) - getQuantilePosition(selectedStage.quantiles.min)}%`,
                    }"
                  />
                  <!-- P25 to P75 Interquartile Core -->
                  <div
                    class="bg-primary/70 absolute top-0 bottom-0"
                    :style="{
                      left: `${getQuantilePosition(selectedStage.quantiles.p25)}%`,
                      width: `${getQuantilePosition(selectedStage.quantiles.p75) - getQuantilePosition(selectedStage.quantiles.p25)}%`,
                    }"
                  />
                  <!-- Median Marker -->
                  <div
                    class="absolute top-0 bottom-0 z-10 w-1 bg-white dark:bg-black"
                    :style="{
                      left: `${getQuantilePosition(selectedStage.quantiles.median)}%`,
                    }"
                  />
                </div>

                <!-- Markers with Pin Labels -->
                <div
                  class="text-muted-foreground absolute top-0 -translate-x-1/2 font-mono text-xs"
                  :style="{ left: `${getQuantilePosition(selectedStage.quantiles.min)}%` }"
                >
                  Min {{ selectedStage.quantiles.min }}s
                </div>
                <div
                  class="text-primary absolute top-0 -translate-x-1/2 font-mono text-xs font-semibold"
                  :style="{ left: `${getQuantilePosition(selectedStage.quantiles.median)}%` }"
                >
                  Med {{ selectedStage.quantiles.median }}s
                </div>
                <div
                  class="text-muted-foreground absolute top-0 -translate-x-1/2 font-mono text-xs"
                  :style="{ left: `${getQuantilePosition(selectedStage.quantiles.max)}%` }"
                >
                  Max {{ selectedStage.quantiles.max }}s
                </div>
              </div>

              <div
                class="border-border/60 text-muted-foreground flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs"
              >
                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-1.5">
                    <span class="bg-primary/20 size-2.5 rounded" />
                    <span>Full Range (Min - Max)</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="bg-primary/70 size-2.5 rounded" />
                    <span>IQR Core (P25 - P75)</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="bg-foreground h-2.5 w-0.5" />
                    <span>Median Point</span>
                  </div>
                </div>
                <span
                  >Skew status:
                  <strong class="font-medium text-emerald-600 dark:text-emerald-400">Optimal Partitioning</strong></span
                >
              </div>
            </div>

            <!-- Task Internal Execution Time Breakdown -->
            <div class="space-y-3">
              <h3 class="text-muted-foreground text-xs font-semibold">
                Task Execution Phase Breakdown (Average per Task)
              </h3>

              <div class="grid grid-cols-2 gap-3 text-xs sm:grid-cols-3 lg:grid-cols-6">
                <div class="border-border bg-card rounded-lg border p-3">
                  <span class="text-muted-foreground">CPU Run Time</span>
                  <p class="text-foreground mt-1 font-mono text-sm font-semibold">
                    {{ selectedStage.taskBreakdown.executorRunTime }}
                  </p>
                  <span class="text-muted-foreground text-xs">Active calculation</span>
                </div>

                <div class="border-border bg-card rounded-lg border p-3">
                  <span class="text-muted-foreground">JVM GC Overhead</span>
                  <p class="mt-1 font-mono text-sm font-semibold text-purple-600 dark:text-purple-400">
                    {{ selectedStage.taskBreakdown.jvmGcTime }}
                  </p>
                  <span class="text-muted-foreground text-xs">Young Gen sweeps</span>
                </div>

                <div class="border-border bg-card rounded-lg border p-3">
                  <span class="text-muted-foreground">Shuffle Fetch Wait</span>
                  <p class="mt-1 font-mono text-sm font-semibold text-blue-600 dark:text-blue-400">
                    {{ selectedStage.taskBreakdown.shuffleFetchWait }}
                  </p>
                  <span class="text-muted-foreground text-xs">Network remote blocks</span>
                </div>

                <div class="border-border bg-card rounded-lg border p-3">
                  <span class="text-muted-foreground">Deserialization</span>
                  <p class="text-foreground mt-1 font-mono text-sm font-semibold">
                    {{ selectedStage.taskBreakdown.deserializationTime }}
                  </p>
                  <span class="text-muted-foreground text-xs">Task definition</span>
                </div>

                <div class="border-border bg-card rounded-lg border p-3">
                  <span class="text-muted-foreground">Result Serialization</span>
                  <p class="text-foreground mt-1 font-mono text-sm font-semibold">
                    {{ selectedStage.taskBreakdown.serializationTime }}
                  </p>
                  <span class="text-muted-foreground text-xs">Map output buffers</span>
                </div>

                <div class="border-border bg-card rounded-lg border p-3">
                  <span class="text-muted-foreground">Peak Memory</span>
                  <p class="mt-1 font-mono text-sm font-semibold text-amber-600 dark:text-amber-400">
                    {{ selectedStage.taskBreakdown.peakMemory }}
                  </p>
                  <span class="text-muted-foreground text-xs">Off-heap aggregate</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- TAB 3: EXECUTORS TELEMETRY (4 NODES) -->
      <TabsContent value="executors" class="space-y-6 focus-visible:outline-none">
        <Card class="border-border shadow-xs">
          <CardHeader class="border-border/60 border-b pb-4">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle class="text-base font-semibold">
                  Active Cluster Executors (4 Nodes · 112 Cores Total)
                </CardTitle>
                <CardDescription class="text-xs">
                  Real-time worker telemetry: CPU utilization, JVM heap memory, garbage collection pauses, and task
                  throughput.
                </CardDescription>
              </div>

              <div class="flex flex-wrap items-center gap-2">
                <Badge wrap variant="outline" class="font-mono text-xs"> Total Memory: 93.0 / 128 GB (72.7%) </Badge>
                <Badge wrap variant="success" class="text-xs">4/4 Nodes Active</Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent class="p-0">
            <div class="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow class="hover:bg-transparent">
                    <TableHead class="text-xs font-semibold">Executor ID & Host</TableHead>
                    <TableHead class="text-xs font-semibold">Role & Status</TableHead>
                    <TableHead class="text-xs font-semibold">Cores</TableHead>
                    <TableHead class="text-xs font-semibold">Memory Used</TableHead>
                    <TableHead class="text-xs font-semibold">GC Pause Time</TableHead>
                    <TableHead class="text-xs font-semibold">Tasks Completed</TableHead>
                    <TableHead class="text-xs font-semibold">Shuffle I/O</TableHead>
                    <TableHead class="text-xs font-semibold">Memory Spill</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="exec in executors" :key="exec.id" class="text-xs">
                    <!-- Executor ID & Host -->
                    <TableCell class="font-medium">
                      <div class="flex flex-wrap items-center gap-2">
                        <Server class="text-muted-foreground size-4" />
                        <div>
                          <div class="text-foreground font-mono font-semibold">{{ exec.id }}</div>
                          <div class="text-muted-foreground font-mono">{{ exec.host }}</div>
                        </div>
                      </div>
                    </TableCell>

                    <!-- Role & Status -->
                    <TableCell>
                      <div class="flex items-center gap-1.5">
                        <Badge
                          :variant="exec.role === 'driver' ? 'secondary' : 'outline'"
                          class="font-mono text-xs whitespace-normal capitalize"
                        >
                          {{ exec.role }}
                        </Badge>
                        <span class="inline-block size-2 rounded-full bg-emerald-500" />
                      </div>
                    </TableCell>

                    <!-- Cores -->
                    <TableCell class="font-mono tabular-nums"> {{ exec.cores }} cores </TableCell>

                    <!-- Memory Used -->
                    <TableCell>
                      <div class="min-w-[140px] space-y-1">
                        <div class="flex items-center justify-between font-mono text-xs">
                          <span>{{ exec.memoryUsedGB }} / {{ exec.memoryTotalGB }} GB</span>
                          <span
                            :class="
                              exec.memoryPercent > 85
                                ? 'font-semibold text-amber-600 dark:text-amber-400'
                                : 'text-muted-foreground'
                            "
                          >
                            {{ exec.memoryPercent }}%
                          </span>
                        </div>
                        <Progress :model-value="exec.memoryPercent" class="h-1.5" />
                      </div>
                    </TableCell>

                    <!-- GC Time -->
                    <TableCell class="font-mono tabular-nums">
                      <div class="flex items-center gap-1.5">
                        <Badge wrap variant="success" class="font-mono text-xs">
                          {{ exec.gcTimeSec }}s ({{ exec.gcPercent }}%)
                        </Badge>
                      </div>
                    </TableCell>

                    <!-- Tasks Completed -->
                    <TableCell class="font-mono tabular-nums">
                      <span class="text-foreground font-medium">{{ exec.tasksCompleted }}</span>
                      <span class="text-muted-foreground"> / {{ exec.tasksTotal }}</span>
                      <span class="ml-1 text-emerald-600 dark:text-emerald-400">(0 failed)</span>
                    </TableCell>

                    <!-- Shuffle I/O -->
                    <TableCell class="font-mono tabular-nums"> {{ exec.shuffleReadGB }} GB </TableCell>

                    <!-- Spill -->
                    <TableCell class="text-muted-foreground font-mono tabular-nums"> {{ exec.spillGB }} GB </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- TAB 4: AQE OPTIMIZATION RULES -->
      <TabsContent value="aqe" class="space-y-6 focus-visible:outline-none">
        <Card class="border-border shadow-xs">
          <CardHeader class="border-border/60 border-b pb-4">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle class="text-base font-semibold"> Adaptive Query Execution (AQE) Rules Engine </CardTitle>
                <CardDescription class="text-xs">
                  Runtime Catalyst optimizer decisions made dynamically based on actual stage map output partition
                  statistics.
                </CardDescription>
              </div>

              <Badge wrap variant="success" class="font-mono text-xs"> AQE Status: Active (3 Rules Applied) </Badge>
            </div>
          </CardHeader>

          <CardContent class="p-6">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div
                v-for="rule in aqeRules"
                :key="rule.id"
                class="border-border bg-card space-y-3 rounded-xl border p-4"
              >
                <div class="flex items-center justify-between">
                  <div class="flex flex-wrap items-center gap-2">
                    <Sparkles class="size-4 text-amber-500" />
                    <span class="text-foreground font-mono text-sm font-semibold">{{ rule.name }}</span>
                  </div>
                  <Badge
                    :variant="rule.status === 'applied' ? 'success' : 'outline'"
                    class="text-xs whitespace-normal capitalize"
                  >
                    {{ rule.status }}
                  </Badge>
                </div>

                <p class="text-muted-foreground text-xs">
                  {{ rule.description }}
                </p>

                <div class="border-border/60 bg-muted/40 rounded-md border p-2.5 text-xs">
                  <span class="text-foreground font-medium">Query Plan Impact: </span>
                  <span class="text-muted-foreground">{{ rule.impact }}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
</template>

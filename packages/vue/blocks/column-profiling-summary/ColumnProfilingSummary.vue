<script setup lang="ts">
import { ref, computed, type HTMLAttributes } from 'vue'
import {
  Database,
  Download,
  CheckCircle2,
  AlertCircle,
  Hash,
  Tag,
  Binary,
  Search,
  BarChart2,
  Copy,
  Check,
  Table as TableIcon,
  LayoutGrid,
} from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

interface Props {
  class?: HTMLAttributes['class']
  tableName?: string
  totalRows?: string
  totalColumns?: number
  memoryFootprint?: string
  datasetVersion?: string
}

const props = withDefaults(defineProps<Props>(), {
  tableName: 'customer_churn_features_v2',
  totalRows: '148,290',
  totalColumns: 18,
  memoryFootprint: '24.2 MB',
  datasetVersion: 'v2.4.1',
})

const activeTypeFilter = ref<'all' | 'numeric' | 'categorical' | 'boolean'>('all')
const searchQuery = ref('')
const viewMode = ref<'cards' | 'table'>('cards')
const isExporting = ref(false)
const showExportSuccess = ref(false)
const copiedColumn = ref<string | null>(null)
const hoveredHistBin = ref<number | null>(null)

// Column 1: monthly_spend_usd (Numeric Float64)
const monthlySpendStats = {
  name: 'monthly_spend_usd',
  type: 'Numeric Float64',
  category: 'numeric',
  min: '$0.00',
  mean: '$142.50',
  median: '$120.00',
  max: '$2,450.00',
  stdDev: '48.2',
  iqr: '$115.00',
  zerosCount: 1420,
  zerosPct: '0.96%',
  missingCount: 0,
  missingPct: '0.0%',
  distinctCount: '12,410',
  distinctPct: '8.37%',
  memory: '1.19 MB',
}

const histogramBins = [
  { bin: '$0 - $245', count: 58400, pct: 39.4, height: 95 },
  { bin: '$245 - $490', count: 42100, pct: 28.4, height: 68 },
  { bin: '$490 - $735', count: 22500, pct: 15.2, height: 36 },
  { bin: '$735 - $980', count: 12800, pct: 8.6, height: 21 },
  { bin: '$980 - $1,225', count: 6400, pct: 4.3, height: 10 },
  { bin: '$1,225 - $1,470', count: 3100, pct: 2.1, height: 5 },
  { bin: '$1,470 - $1,715', count: 1650, pct: 1.1, height: 3 },
  { bin: '$1,715 - $1,960', count: 840, pct: 0.6, height: 2 },
  { bin: '$1,960 - $2,205', count: 380, pct: 0.3, height: 1 },
  { bin: '$2,205 - $2,450', count: 120, pct: 0.1, height: 1 },
]

// Column 2: subscription_tier (Categorical)
const subscriptionTierStats = {
  name: 'subscription_tier',
  type: 'Categorical',
  category: 'categorical',
  distinctCount: 4,
  missingCount: 0,
  missingPct: '0.0%',
  memory: '1.19 MB',
  topValue: 'Starter',
  topFreqPct: '45.0%',
}

const subscriptionTiers = [
  { name: 'Starter', count: 66730, pct: 45.0, colorClass: 'bg-primary', badgeClass: 'border-primary/30 text-primary' },
  {
    name: 'Pro',
    count: 51901,
    pct: 35.0,
    colorClass: 'bg-emerald-500',
    badgeClass: 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
  },
  {
    name: 'Enterprise',
    count: 22243,
    pct: 15.0,
    colorClass: 'bg-sky-500',
    badgeClass: 'border-sky-500/30 text-sky-600 dark:text-sky-400',
  },
  {
    name: 'Custom',
    count: 7416,
    pct: 5.0,
    colorClass: 'bg-amber-500',
    badgeClass: 'border-amber-500/30 text-amber-600 dark:text-amber-400',
  },
]

// Column 3: account_age_days (Numeric Int32)
const accountAgeStats = {
  name: 'account_age_days',
  type: 'Numeric Int32',
  category: 'numeric',
  min: '1d',
  p25: '42d',
  p50: '180d',
  p75: '365d',
  p95: '580d',
  p99: '720d',
  max: '850d',
  iqr: '323d',
  mean: '214.6d',
  stdDev: '142.1',
  missingCount: 42,
  missingPct: '0.03%',
  distinctCount: '820',
  distinctPct: '0.55%',
  memory: '593.2 KB',
}

// Column 4: has_cancelled (Boolean)
const hasCancelledStats = {
  name: 'has_cancelled',
  type: 'Boolean',
  category: 'boolean',
  missingCount: 0,
  missingPct: '0.0%',
  distinctCount: 2,
  memory: '144.8 KB',
  trueCount: 21057,
  truePct: 14.2,
  falseCount: 127233,
  falsePct: 85.8,
}

// Schema overview for compact table view
const allSchemaColumns = [
  {
    name: 'monthly_spend_usd',
    type: 'Numeric Float64',
    category: 'numeric',
    missing: '0 (0.0%)',
    distinct: '12,410 (8.4%)',
    summary: 'Mean: $142.50 · Median: $120.00 · Max: $2,450.00',
    status: 'Clean',
  },
  {
    name: 'subscription_tier',
    type: 'Categorical',
    category: 'categorical',
    missing: '0 (0.0%)',
    distinct: '4 values',
    summary: 'Starter (45%) > Pro (35%) > Enterprise (15%)',
    status: 'Clean',
  },
  {
    name: 'account_age_days',
    type: 'Numeric Int32',
    category: 'numeric',
    missing: '42 (0.03%)',
    distinct: '820 (0.6%)',
    summary: 'P25: 42d · P50: 180d · P75: 365d · P99: 720d',
    status: '99.97% Complete',
  },
  {
    name: 'has_cancelled',
    type: 'Boolean',
    category: 'boolean',
    missing: '0 (0.0%)',
    distinct: '2 values',
    summary: 'False: 85.8% (127.2k) · True: 14.2% (21.1k)',
    status: 'Clean',
  },
  {
    name: 'customer_id',
    type: 'Categorical UUID',
    category: 'categorical',
    missing: '0 (0.0%)',
    distinct: '148,290 (100%)',
    summary: 'Primary Key · Unique identifier',
    status: 'Unique Index',
  },
  {
    name: 'support_tickets_count',
    type: 'Numeric Int16',
    category: 'numeric',
    missing: '0 (0.0%)',
    distinct: '18 values',
    summary: 'Mean: 1.4 · Median: 1.0 · Max: 16.0',
    status: 'Clean',
  },
  {
    name: 'last_login_epoch',
    type: 'Numeric Int64',
    category: 'numeric',
    missing: '112 (0.08%)',
    distinct: '114,200',
    summary: 'Min: 1770000000 · Max: 1787313600',
    status: 'Clean',
  },
  {
    name: 'signup_channel',
    type: 'Categorical',
    category: 'categorical',
    missing: '439 (0.30%)',
    distinct: '7 values',
    summary: 'Organic (42%) > Google Ads (28%) > Partner (16%)',
    status: 'Clean',
  },
]

const filteredColumns = computed(() => {
  return allSchemaColumns.filter((col) => {
    const matchesCategory = activeTypeFilter.value === 'all' || col.category === activeTypeFilter.value
    const matchesSearch =
      col.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      col.type.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesCategory && matchesSearch
  })
})

function handleExportReport() {
  if (isExporting.value) return
  isExporting.value = true
  setTimeout(() => {
    isExporting.value = false
    showExportSuccess.value = true
    setTimeout(() => {
      showExportSuccess.value = false
    }, 3500)
  }, 600)
}

function handleCopy(name: string) {
  navigator.clipboard?.writeText(name)
  copiedColumn.value = name
  setTimeout(() => {
    if (copiedColumn.value === name) {
      copiedColumn.value = null
    }
  }, 2000)
}
</script>

<template>
  <div data-slot="column-profiling-summary" :class="cn('mx-auto w-full max-w-6xl space-y-6', props.class)">
    <!-- Header Section -->
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div class="space-y-1.5">
        <div class="flex flex-wrap items-center gap-2.5">
          <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
            <Database class="size-4" />
          </div>
          <h1 class="text-foreground text-2xl font-bold tracking-tight break-all sm:text-3xl">
            Table: {{ props.tableName }}
          </h1>
          <Badge variant="outline" class="gap-1.5 font-mono text-xs font-normal">
            <span class="size-1.5 rounded-full bg-emerald-500" />
            <span>Apache Parquet</span>
          </Badge>
          <Badge variant="secondary" class="font-mono text-xs font-normal">
            {{ props.datasetVersion }}
          </Badge>
        </div>
        <p class="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <span>Profiled: 2026-08-21 14:30 UTC</span>
          <span>•</span>
          <span>Snappy Compressed</span>
          <span>•</span>
          <span class="text-foreground font-medium">EDA Engine: ydata-profiler v4.8</span>
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <!-- Quick Meta Pills -->
        <div class="bg-card border-border/80 flex items-center divide-x rounded-lg border text-xs shadow-xs">
          <div class="px-3 py-1.5">
            <span class="text-muted-foreground">Rows: </span>
            <span class="text-foreground font-semibold tabular-nums">{{ props.totalRows }}</span>
          </div>
          <div class="px-3 py-1.5">
            <span class="text-muted-foreground">Cols: </span>
            <span class="text-foreground font-semibold tabular-nums">{{ props.totalColumns }}</span>
          </div>
          <div class="px-3 py-1.5">
            <span class="text-muted-foreground">Memory: </span>
            <span class="text-foreground font-semibold tabular-nums">{{ props.memoryFootprint }}</span>
          </div>
        </div>

        <!-- Export EDA Report Button -->
        <Button
          aria-label="Download attachment"
          size="sm"
          class="gap-1.5 shadow-xs"
          :disabled="isExporting"
          @click="handleExportReport"
        >
          <Download v-if="!isExporting" class="size-3.5" />
          <span v-else class="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>{{ isExporting ? 'Generating HTML Report...' : 'Export EDA Report' }}</span>
        </Button>
      </div>
    </div>

    <!-- Export Success Banner -->
    <div
      v-if="showExportSuccess"
      class="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-950 shadow-xs dark:text-emerald-50"
      role="status"
    >
      <div class="flex items-center gap-2">
        <CheckCircle2 class="size-4 shrink-0 text-emerald-500" />
        <span class="font-medium">
          Exploratory Data Analysis report exported. HTML summary & JSON schema bundle ready for download.
        </span>
      </div>
      <button
        type="button"
        class="text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-300"
        @click="showExportSuccess = false"
      >
        Dismiss
      </button>
    </div>

    <!-- 4 Dataset Overview KPI Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- 1. Numeric Columns -->
      <Card class="flex flex-col justify-between">
        <CardHeader class="pb-2">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <div class="bg-muted text-foreground flex size-7 items-center justify-center rounded-md border">
                <Hash class="size-3.5 text-sky-500" />
              </div>
              <CardTitle class="text-sm font-medium">Numeric Columns</CardTitle>
            </div>
            <Badge variant="outline" class="font-mono text-xs tabular-nums">55.6%</Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-2 pt-1">
          <div class="flex items-baseline gap-1.5">
            <span class="text-foreground text-3xl font-bold tracking-tight tabular-nums">10</span>
            <span class="text-muted-foreground text-xs font-medium">Columns</span>
          </div>
          <div class="border-border/60 border-t pt-2 text-xs">
            <div class="text-muted-foreground flex items-center justify-between">
              <span>Types Breakdown:</span>
              <span class="text-foreground font-medium tabular-nums">8 Float64 · 2 Int32</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 2. Categorical Columns -->
      <Card class="flex flex-col justify-between">
        <CardHeader class="pb-2">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <div class="bg-muted text-foreground flex size-7 items-center justify-center rounded-md border">
                <Tag class="size-3.5 text-violet-500" />
              </div>
              <CardTitle class="text-sm font-medium">Categorical Columns</CardTitle>
            </div>
            <Badge variant="outline" class="font-mono text-xs tabular-nums">33.3%</Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-2 pt-1">
          <div class="flex items-baseline gap-1.5">
            <span class="text-foreground text-3xl font-bold tracking-tight tabular-nums">6</span>
            <span class="text-muted-foreground text-xs font-medium">Columns</span>
          </div>
          <div class="border-border/60 border-t pt-2 text-xs">
            <div class="text-muted-foreground flex items-center justify-between">
              <span>High Cardinality:</span>
              <span class="text-foreground font-medium tabular-nums">1 (customer_id)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 3. Missing Values % -->
      <Card class="flex flex-col justify-between">
        <CardHeader class="pb-2">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <div class="bg-muted text-foreground flex size-7 items-center justify-center rounded-md border">
                <AlertCircle class="size-3.5 text-emerald-500" />
              </div>
              <CardTitle class="text-sm font-medium">Missing Values</CardTitle>
            </div>
            <Badge variant="success" class="text-xs">Clean</Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-2 pt-1">
          <div class="flex items-baseline gap-1.5">
            <span class="text-foreground text-3xl font-bold tracking-tight tabular-nums">0.4%</span>
            <span class="text-muted-foreground text-xs font-medium">Missing</span>
          </div>
          <div class="border-border/60 border-t pt-2 text-xs">
            <div class="text-muted-foreground flex items-center justify-between">
              <span>Total Null Cells:</span>
              <span class="text-foreground font-medium tabular-nums">593 / 2,669,220</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 4. Duplicate Rows -->
      <Card class="flex flex-col justify-between">
        <CardHeader class="pb-2">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <div class="bg-muted text-foreground flex size-7 items-center justify-center rounded-md border">
                <CheckCircle2 class="size-3.5 text-emerald-500" />
              </div>
              <CardTitle class="text-sm font-medium">Duplicate Rows</CardTitle>
            </div>
            <Badge variant="success" class="text-xs">100% Unique</Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-2 pt-1">
          <div class="flex items-baseline gap-1.5">
            <span class="text-foreground text-3xl font-bold tracking-tight tabular-nums">0</span>
            <span class="text-muted-foreground text-xs font-medium">Duplicates</span>
          </div>
          <div class="border-border/60 border-t pt-2 text-xs">
            <div class="text-muted-foreground flex items-center justify-between">
              <span>Primary Key Integrity:</span>
              <span class="text-foreground font-medium">100.0% Valid</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Filter & Toolbar Controls -->
    <Card className="border-border bg-card shadow-xs">
      <CardContent class="p-3">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <!-- Type Filter Tabs -->
          <div class="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              :class="[
                'cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                activeTypeFilter === 'all'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground',
              ]"
              @click="activeTypeFilter = 'all'"
            >
              All Types (18)
            </button>
            <button
              type="button"
              :class="[
                'cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                activeTypeFilter === 'numeric'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground',
              ]"
              @click="activeTypeFilter = 'numeric'"
            >
              Numeric (10)
            </button>
            <button
              type="button"
              :class="[
                'cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                activeTypeFilter === 'categorical'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground',
              ]"
              @click="activeTypeFilter = 'categorical'"
            >
              Categorical (6)
            </button>
            <button
              type="button"
              :class="[
                'cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                activeTypeFilter === 'boolean'
                  ? 'bg-primary text-primary-foreground shadow-xs'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground',
              ]"
              @click="activeTypeFilter = 'boolean'"
            >
              Boolean (2)
            </button>
          </div>

          <!-- Search & View Mode Switcher -->
          <div class="flex items-center gap-2">
            <div class="relative flex items-center">
              <Search class="text-muted-foreground pointer-events-none absolute left-2.5 size-3.5" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Filter column name..."
                class="border-border bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-44 rounded-md border pr-2.5 pl-8 text-xs focus-visible:ring-2 focus-visible:outline-none sm:w-56"
              />
            </div>

            <div class="bg-muted border-border flex items-center rounded-md border p-0.5 text-xs">
              <button
                type="button"
                :class="[
                  'cursor-pointer rounded px-2 py-1 transition-colors',
                  viewMode === 'cards'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                ]"
                aria-label="Card deep dive view"
                @click="viewMode = 'cards'"
              >
                <LayoutGrid class="size-3.5" />
              </button>
              <button
                type="button"
                :class="[
                  'cursor-pointer rounded px-2 py-1 transition-colors',
                  viewMode === 'table'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                ]"
                aria-label="Compact table view"
                @click="viewMode = 'table'"
              >
                <TableIcon class="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Compact Table View -->
    <Card v-if="viewMode === 'table'">
      <CardHeader class="pb-3">
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="text-base font-semibold">Dataset Schema & Profiling Matrix</CardTitle>
            <CardDescription class="text-xs">
              Tabular view of all columns with inferred types, missingness, cardinality, and distribution summary.
            </CardDescription>
          </div>
          <Badge variant="outline" class="font-mono text-xs tabular-nums">
            {{ filteredColumns.length }} of 18 columns
          </Badge>
        </div>
      </CardHeader>
      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="min-w-[180px]">Column Name</TableHead>
                <TableHead class="min-w-[140px]">Data Type</TableHead>
                <TableHead class="min-w-[110px]">Missing Values</TableHead>
                <TableHead class="min-w-[120px]">Distinct Values</TableHead>
                <TableHead class="min-w-[280px]">Distribution / Quantiles</TableHead>
                <TableHead class="text-right">Health Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow v-for="col in filteredColumns" :key="col.name">
                <TableCell class="font-mono text-xs font-medium">
                  <div class="flex items-center gap-1.5">
                    <span>{{ col.name }}</span>
                    <button
                      type="button"
                      class="text-muted-foreground hover:text-foreground cursor-pointer"
                      :aria-label="`Copy column ${col.name}`"
                      @click="handleCopy(col.name)"
                    >
                      <Check v-if="copiedColumn === col.name" class="size-3 text-emerald-500" />
                      <Copy v-else class="size-3" />
                    </button>
                  </div>
                </TableCell>
                <TableCell class="text-xs">
                  <Badge variant="secondary" class="font-mono text-xs font-normal">
                    {{ col.type }}
                  </Badge>
                </TableCell>
                <TableCell class="text-muted-foreground font-mono text-xs tabular-nums">
                  {{ col.missing }}
                </TableCell>
                <TableCell class="text-foreground font-mono text-xs tabular-nums">
                  {{ col.distinct }}
                </TableCell>
                <TableCell class="text-muted-foreground text-xs">
                  {{ col.summary }}
                </TableCell>
                <TableCell class="text-right">
                  <Badge :variant="col.status.includes('Unique') ? 'default' : 'success'" class="text-xs font-normal">
                    {{ col.status }}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <!-- 4 Detailed Column Deep-Dive Cards -->
    <div v-else class="space-y-6">
      <!-- 1. Column 1: monthly_spend_usd (Numeric Float64 + 10-bar SVG Histogram) -->
      <Card v-if="activeTypeFilter === 'all' || activeTypeFilter === 'numeric'" class="border-border bg-card shadow-xs">
        <CardHeader class="pb-3">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <div
                  class="flex size-6 items-center justify-center rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400"
                >
                  <Hash class="size-3.5" />
                </div>
                <CardTitle class="font-mono text-base font-semibold">
                  {{ monthlySpendStats.name }}
                </CardTitle>
                <Badge variant="secondary" class="font-mono text-xs font-normal">
                  {{ monthlySpendStats.type }}
                </Badge>
                <button
                  type="button"
                  class="text-muted-foreground hover:text-foreground cursor-pointer"
                  :aria-label="`Copy ${monthlySpendStats.name}`"
                  @click="handleCopy(monthlySpendStats.name)"
                >
                  <Check v-if="copiedColumn === monthlySpendStats.name" class="size-3 text-emerald-500" />
                  <Copy v-else class="size-3" />
                </button>
              </div>
              <CardDescription class="text-xs">
                Monthly billed subscription and add-on expenditure in USD. Right-skewed distribution with long tail.
              </CardDescription>
            </div>

            <!-- Meta Badges -->
            <div class="flex flex-wrap items-center gap-2">
              <Badge variant="outline" class="text-xs font-normal">
                Missing:
                <span class="ml-1 font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">{{
                  monthlySpendStats.missingPct
                }}</span>
              </Badge>
              <Badge variant="outline" class="text-xs font-normal">
                Distinct:
                <span class="text-foreground ml-1 font-semibold tabular-nums">{{
                  monthlySpendStats.distinctCount
                }}</span>
              </Badge>
              <Badge variant="outline" class="text-xs font-normal">
                Memory:
                <span class="text-foreground ml-1 font-semibold tabular-nums">{{ monthlySpendStats.memory }}</span>
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent class="space-y-6 pt-1">
          <!-- Summary Metrics Grid -->
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <div class="border-border bg-muted/30 rounded-lg border p-2.5">
              <span class="text-muted-foreground text-xs">Minimum</span>
              <p class="text-foreground font-mono text-sm font-semibold tabular-nums">{{ monthlySpendStats.min }}</p>
            </div>
            <div class="border-border bg-muted/30 rounded-lg border p-2.5">
              <span class="text-muted-foreground text-xs">Mean (Avg)</span>
              <p class="text-foreground font-mono text-sm font-semibold tabular-nums">{{ monthlySpendStats.mean }}</p>
            </div>
            <div class="border-border bg-muted/30 rounded-lg border p-2.5">
              <span class="text-muted-foreground text-xs">Median (P50)</span>
              <p class="text-foreground font-mono text-sm font-semibold tabular-nums">{{ monthlySpendStats.median }}</p>
            </div>
            <div class="border-border bg-muted/30 rounded-lg border p-2.5">
              <span class="text-muted-foreground text-xs">Maximum</span>
              <p class="text-foreground font-mono text-sm font-semibold tabular-nums">{{ monthlySpendStats.max }}</p>
            </div>
            <div class="border-border bg-muted/30 rounded-lg border p-2.5">
              <span class="text-muted-foreground text-xs">Std. Deviation</span>
              <p class="text-foreground font-mono text-sm font-semibold tabular-nums">{{ monthlySpendStats.stdDev }}</p>
            </div>
            <div class="border-border bg-muted/30 rounded-lg border p-2.5">
              <span class="text-muted-foreground text-xs">Interquartile (IQR)</span>
              <p class="text-foreground font-mono text-sm font-semibold tabular-nums">{{ monthlySpendStats.iqr }}</p>
            </div>
          </div>

          <!-- 10-Bar SVG Histogram -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center gap-2">
                <BarChart2 class="text-primary size-3.5" />
                <span class="text-foreground font-medium">10-Bin Distribution Frequency Histogram</span>
              </div>
              <span v-if="hoveredHistBin !== null" class="text-foreground font-mono tabular-nums">
                {{ histogramBins[hoveredHistBin].bin }}:
                <strong class="text-primary">{{ histogramBins[hoveredHistBin].count.toLocaleString() }} rows</strong>
                ({{ histogramBins[hoveredHistBin].pct }}%)
              </span>
              <span v-else class="text-muted-foreground">Hover bar to inspect bin interval</span>
            </div>

            <!-- SVG Histogram Visual -->
            <div class="border-border bg-muted/20 w-full overflow-x-auto rounded-lg border p-4">
              <div class="h-44 w-full max-w-[420px] min-w-full">
                <svg
                  class="h-full w-full overflow-visible"
                  viewBox="0 0 520 140"
                  preserveAspectRatio="none"
                  role="img"
                  aria-label="10-bar distribution histogram for monthly spend in USD"
                >
                  <!-- Background Grid Lines -->
                  <line
                    x1="0"
                    y1="20"
                    x2="520"
                    y2="20"
                    stroke="currentColor"
                    class="text-border/40"
                    stroke-dasharray="3 3"
                  />
                  <line
                    x1="0"
                    y1="65"
                    x2="520"
                    y2="65"
                    stroke="currentColor"
                    class="text-border/40"
                    stroke-dasharray="3 3"
                  />
                  <line x1="0" y1="110" x2="520" y2="110" stroke="currentColor" class="text-border" />

                  <!-- 10 Bars -->
                  <g v-for="(bin, idx) in histogramBins" :key="idx">
                    <!-- Bar rect -->
                    <rect
                      :x="idx * 52 + 6"
                      :y="110 - bin.height"
                      width="40"
                      :height="bin.height"
                      rx="3"
                      :class="[
                        'cursor-pointer transition-colors duration-150',
                        hoveredHistBin === idx
                          ? 'fill-primary text-primary'
                          : 'fill-primary/75 hover:fill-primary text-primary/75',
                      ]"
                      @mouseenter="hoveredHistBin = idx"
                      @mouseleave="hoveredHistBin = null"
                    />

                    <!-- Percentage Label on top of high bars -->
                    <text
                      v-if="bin.pct >= 5"
                      :x="idx * 52 + 26"
                      :y="104 - bin.height"
                      text-anchor="middle"
                      class="fill-foreground font-mono text-xs font-medium select-none"
                    >
                      {{ bin.pct }}%
                    </text>
                  </g>
                </svg>
              </div>

              <!-- Bin Axis Ticks -->
              <div class="text-muted-foreground mt-2 grid grid-cols-5 text-center font-mono text-xs tabular-nums">
                <span class="text-left">$0.00</span>
                <span>$490</span>
                <span>$980</span>
                <span>$1,715</span>
                <span class="text-right">$2,450</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 2. Column 2: subscription_tier (Categorical + Horizontal Distribution Bars) -->
      <Card
        v-if="activeTypeFilter === 'all' || activeTypeFilter === 'categorical'"
        class="border-border bg-card shadow-xs"
      >
        <CardHeader class="pb-3">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <div
                  class="flex size-6 items-center justify-center rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-400"
                >
                  <Tag class="size-3.5" />
                </div>
                <CardTitle class="font-mono text-base font-semibold">
                  {{ subscriptionTierStats.name }}
                </CardTitle>
                <Badge variant="secondary" class="font-mono text-xs font-normal">
                  {{ subscriptionTierStats.type }}
                </Badge>
                <button
                  type="button"
                  class="text-muted-foreground hover:text-foreground cursor-pointer"
                  :aria-label="`Copy ${subscriptionTierStats.name}`"
                  @click="handleCopy(subscriptionTierStats.name)"
                >
                  <Check v-if="copiedColumn === subscriptionTierStats.name" class="size-3 text-emerald-500" />
                  <Copy v-else class="size-3" />
                </button>
              </div>
              <CardDescription class="text-xs">
                Active customer plan classification tier. Clean categorical distribution across 4 discrete levels.
              </CardDescription>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <Badge variant="outline" class="text-xs font-normal">
                Missing:
                <span class="ml-1 font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">{{
                  subscriptionTierStats.missingPct
                }}</span>
              </Badge>
              <Badge variant="outline" class="text-xs font-normal">
                Distinct:
                <span class="text-foreground ml-1 font-semibold tabular-nums"
                  >{{ subscriptionTierStats.distinctCount }} values</span
                >
              </Badge>
              <Badge variant="outline" class="text-xs font-normal">
                Memory:
                <span class="text-foreground ml-1 font-semibold tabular-nums">{{ subscriptionTierStats.memory }}</span>
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent class="space-y-6 pt-1">
          <!-- Segmented Composite Stacked Bar -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="text-foreground font-medium">Category Proportions</span>
              <span class="text-muted-foreground font-mono tabular-nums">148,290 total instances</span>
            </div>

            <!-- Stacked bar -->
            <div class="border-border flex h-4 w-full overflow-hidden rounded-full border">
              <div
                v-for="tier in subscriptionTiers"
                :key="tier.name"
                :class="tier.colorClass"
                :style="{ width: `${tier.pct}%` }"
                :title="`${tier.name}: ${tier.pct}% (${tier.count.toLocaleString()} rows)`"
              />
            </div>
          </div>

          <!-- Detailed Breakdown Rows -->
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div
              v-for="tier in subscriptionTiers"
              :key="tier.name"
              class="border-border bg-muted/20 flex flex-col justify-between rounded-lg border p-3.5"
            >
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-foreground font-mono text-xs font-semibold">{{ tier.name }}</span>
                  <Badge variant="outline" :class="cn('font-mono text-xs font-medium tabular-nums', tier.badgeClass)">
                    {{ tier.pct.toFixed(1) }}%
                  </Badge>
                </div>
                <p class="text-muted-foreground font-mono text-xs tabular-nums">
                  {{ tier.count.toLocaleString() }} rows
                </p>
              </div>

              <div class="mt-3">
                <div class="bg-muted relative h-1.5 w-full overflow-hidden rounded-full">
                  <div :class="cn('h-full rounded-full', tier.colorClass)" :style="{ width: `${tier.pct}%` }" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 3. Column 3: account_age_days (Numeric Int32 + Quantiles Box Plot) -->
      <Card v-if="activeTypeFilter === 'all' || activeTypeFilter === 'numeric'" class="border-border bg-card shadow-xs">
        <CardHeader class="pb-3">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <div
                  class="flex size-6 items-center justify-center rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400"
                >
                  <Hash class="size-3.5" />
                </div>
                <CardTitle class="font-mono text-base font-semibold">
                  {{ accountAgeStats.name }}
                </CardTitle>
                <Badge variant="secondary" class="font-mono text-xs font-normal">
                  {{ accountAgeStats.type }}
                </Badge>
                <button
                  type="button"
                  class="text-muted-foreground hover:text-foreground cursor-pointer"
                  :aria-label="`Copy ${accountAgeStats.name}`"
                  @click="handleCopy(accountAgeStats.name)"
                >
                  <Check v-if="copiedColumn === accountAgeStats.name" class="size-3 text-emerald-500" />
                  <Copy v-else class="size-3" />
                </button>
              </div>
              <CardDescription class="text-xs">
                Total account tenure in days since initial signup. Box plot shows median at 180d with Q1-Q3
                interquartile band.
              </CardDescription>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <Badge variant="outline" class="text-xs font-normal">
                Missing:
                <span class="ml-1 font-semibold text-emerald-600 tabular-nums dark:text-emerald-400"
                  >{{ accountAgeStats.missingPct }} (42 rows)</span
                >
              </Badge>
              <Badge variant="outline" class="text-xs font-normal">
                Distinct:
                <span class="text-foreground ml-1 font-semibold tabular-nums">{{ accountAgeStats.distinctCount }}</span>
              </Badge>
              <Badge variant="outline" class="text-xs font-normal">
                Memory:
                <span class="text-foreground ml-1 font-semibold tabular-nums">{{ accountAgeStats.memory }}</span>
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent class="space-y-6 pt-1">
          <!-- Quantile Stats Grid -->
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            <div class="border-border bg-muted/30 rounded-lg border p-2.5 text-center">
              <span class="text-muted-foreground text-xs">Min (0%)</span>
              <p class="text-foreground font-mono text-sm font-semibold tabular-nums">{{ accountAgeStats.min }}</p>
            </div>
            <div class="border-border bg-muted/30 rounded-lg border p-2.5 text-center">
              <span class="text-muted-foreground text-xs">Q1 (P25)</span>
              <p class="text-foreground font-mono text-sm font-semibold tabular-nums">{{ accountAgeStats.p25 }}</p>
            </div>
            <div class="border-primary/40 bg-primary/5 rounded-lg border p-2.5 text-center shadow-xs">
              <span class="text-primary text-xs font-medium">Median (P50)</span>
              <p class="text-primary font-mono text-sm font-bold tabular-nums">{{ accountAgeStats.p50 }}</p>
            </div>
            <div class="border-border bg-muted/30 rounded-lg border p-2.5 text-center">
              <span class="text-muted-foreground text-xs">Q3 (P75)</span>
              <p class="text-foreground font-mono text-sm font-semibold tabular-nums">{{ accountAgeStats.p75 }}</p>
            </div>
            <div class="border-border bg-muted/30 rounded-lg border p-2.5 text-center">
              <span class="text-muted-foreground text-xs">P95</span>
              <p class="text-foreground font-mono text-sm font-semibold tabular-nums">{{ accountAgeStats.p95 }}</p>
            </div>
            <div class="border-border bg-muted/30 rounded-lg border p-2.5 text-center">
              <span class="text-muted-foreground text-xs">P99</span>
              <p class="text-foreground font-mono text-sm font-semibold tabular-nums">{{ accountAgeStats.p99 }}</p>
            </div>
            <div class="border-border bg-muted/30 rounded-lg border p-2.5 text-center">
              <span class="text-muted-foreground text-xs">Max</span>
              <p class="text-foreground font-mono text-sm font-semibold tabular-nums">{{ accountAgeStats.max }}</p>
            </div>
          </div>

          <!-- Box Plot SVG Representation -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="text-foreground font-medium">Quantile Box & Whisker Plot</span>
              <span class="text-muted-foreground font-mono tabular-nums">IQR = 323 days (P75 - P25)</span>
            </div>

            <div class="border-border bg-muted/20 w-full overflow-x-auto rounded-lg border p-4">
              <div class="h-28 w-full max-w-[420px] min-w-full">
                <svg
                  class="h-full w-full overflow-visible"
                  viewBox="0 0 500 90"
                  preserveAspectRatio="none"
                  role="img"
                  aria-label="Box plot visualization of account age quantiles"
                >
                  <!-- Whisker line (Min 1d to Whisker Max 720d) -->
                  <!-- Scale: 0d -> x=30, 900d -> x=470 (width=440, ratio=440/900 = 0.4888) -->
                  <!-- Min 1d: x=30.5 -->
                  <!-- P25 42d: x=50.5 -->
                  <!-- P50 180d: x=118 -->
                  <!-- P75 365d: x=208.4 -->
                  <!-- P99 720d: x=382 -->
                  <!-- Max 850d: x=445.5 -->

                  <!-- Axis Baseline -->
                  <line x1="30" y1="72" x2="470" y2="72" stroke="currentColor" class="text-border" />

                  <!-- Left Whisker: Min to Q1 -->
                  <line
                    x1="31"
                    y1="36"
                    x2="51"
                    y2="36"
                    stroke="currentColor"
                    class="text-foreground"
                    stroke-width="2"
                  />
                  <!-- Min Cap -->
                  <line
                    x1="31"
                    y1="24"
                    x2="31"
                    y2="48"
                    stroke="currentColor"
                    class="text-foreground"
                    stroke-width="2"
                  />

                  <!-- Right Whisker: Q3 to P99 -->
                  <line
                    x1="208"
                    y1="36"
                    x2="382"
                    y2="36"
                    stroke="currentColor"
                    class="text-foreground"
                    stroke-width="2"
                  />
                  <!-- P99 Cap -->
                  <line
                    x1="382"
                    y1="24"
                    x2="382"
                    y2="48"
                    stroke="currentColor"
                    class="text-foreground"
                    stroke-width="2"
                  />

                  <!-- Interquartile Box (Q1 to Q3) -->
                  <rect
                    x="51"
                    y="18"
                    width="157"
                    height="36"
                    rx="3"
                    class="fill-primary/20 stroke-primary"
                    stroke-width="2"
                  />

                  <!-- Median (P50) Line -->
                  <line x1="118" y1="18" x2="118" y2="54" class="stroke-primary" stroke-width="3" />

                  <!-- Outlier Points (P99 to Max: 780d, 820d, 850d) -->
                  <circle cx="411" cy="36" r="3.5" class="fill-muted-foreground/60 stroke-foreground" />
                  <circle cx="431" cy="36" r="3.5" class="fill-muted-foreground/60 stroke-foreground" />
                  <circle cx="446" cy="36" r="3.5" class="fill-muted-foreground/60 stroke-foreground" />

                  <!-- Tick Labels on Axis -->
                  <text x="31" y="86" text-anchor="middle" class="fill-muted-foreground font-mono text-xs">
                    1d (Min)
                  </text>
                  <text x="51" y="86" text-anchor="middle" class="fill-muted-foreground font-mono text-xs">42d</text>
                  <text x="118" y="86" text-anchor="middle" class="fill-primary font-mono text-xs font-bold">
                    180d (Med)
                  </text>
                  <text x="208" y="86" text-anchor="middle" class="fill-muted-foreground font-mono text-xs">365d</text>
                  <text x="382" y="86" text-anchor="middle" class="fill-muted-foreground font-mono text-xs">
                    720d (P99)
                  </text>
                  <text x="446" y="86" text-anchor="middle" class="fill-muted-foreground font-mono text-xs">
                    850d (Max)
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 4. Column 4: has_cancelled (Boolean) -->
      <Card v-if="activeTypeFilter === 'all' || activeTypeFilter === 'boolean'" class="border-border bg-card shadow-xs">
        <CardHeader class="pb-3">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div class="space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <div
                  class="flex size-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400"
                >
                  <Binary class="size-3.5" />
                </div>
                <CardTitle class="font-mono text-base font-semibold">
                  {{ hasCancelledStats.name }}
                </CardTitle>
                <Badge variant="secondary" class="font-mono text-xs font-normal">
                  {{ hasCancelledStats.type }}
                </Badge>
                <button
                  type="button"
                  class="text-muted-foreground hover:text-foreground cursor-pointer"
                  :aria-label="`Copy ${hasCancelledStats.name}`"
                  @click="handleCopy(hasCancelledStats.name)"
                >
                  <Check v-if="copiedColumn === hasCancelledStats.name" class="size-3 text-emerald-500" />
                  <Copy v-else class="size-3" />
                </button>
              </div>
              <CardDescription class="text-xs">
                Binary churn indicator flag. 14.2% positive cancellation rate against 85.8% retained base.
              </CardDescription>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <Badge variant="outline" class="text-xs font-normal">
                Missing:
                <span class="ml-1 font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">{{
                  hasCancelledStats.missingPct
                }}</span>
              </Badge>
              <Badge variant="outline" class="text-xs font-normal">
                Distinct:
                <span class="text-foreground ml-1 font-semibold tabular-nums"
                  >{{ hasCancelledStats.distinctCount }} values</span
                >
              </Badge>
              <Badge variant="outline" class="text-xs font-normal">
                Memory:
                <span class="text-foreground ml-1 font-semibold tabular-nums">{{ hasCancelledStats.memory }}</span>
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent class="space-y-6 pt-1">
          <!-- Boolean Split Bar -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="text-foreground font-medium">Boolean Ratio Distribution</span>
              <span class="text-muted-foreground font-mono tabular-nums">Class Imbalance: 1 : 6.04</span>
            </div>

            <!-- Two-Tone Split Bar -->
            <div class="border-border flex h-4 w-full overflow-hidden rounded-full border">
              <div
                class="bg-emerald-500 transition-all"
                :style="{ width: `${hasCancelledStats.falsePct}%` }"
                :title="`False: ${hasCancelledStats.falsePct}% (${hasCancelledStats.falseCount.toLocaleString()} rows)`"
              />
              <div
                class="bg-rose-500 transition-all"
                :style="{ width: `${hasCancelledStats.truePct}%` }"
                :title="`True: ${hasCancelledStats.truePct}% (${hasCancelledStats.trueCount.toLocaleString()} rows)`"
              />
            </div>
          </div>

          <!-- Value Breakdown Cards -->
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <!-- False / Active -->
            <div class="border-border bg-muted/20 flex flex-col justify-between rounded-lg border p-4">
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="size-2 rounded-full bg-emerald-500" />
                    <span class="text-foreground font-mono text-xs font-semibold">False (Active / Retained)</span>
                  </div>
                  <Badge
                    variant="outline"
                    class="border-emerald-500/30 font-mono text-xs font-medium text-emerald-600 tabular-nums dark:text-emerald-400"
                  >
                    {{ hasCancelledStats.falsePct }}%
                  </Badge>
                </div>
                <p class="text-muted-foreground font-mono text-xs tabular-nums">
                  {{ hasCancelledStats.falseCount.toLocaleString() }} instances
                </p>
              </div>
              <div class="mt-3">
                <Progress
                  :model-value="hasCancelledStats.falsePct"
                  class="h-1.5 [&_[data-slot=progress-indicator]]:bg-emerald-500"
                />
              </div>
            </div>

            <!-- True / Cancelled -->
            <div class="border-border bg-muted/20 flex flex-col justify-between rounded-lg border p-4">
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="size-2 rounded-full bg-rose-500" />
                    <span class="text-foreground font-mono text-xs font-semibold">True (Cancelled / Churned)</span>
                  </div>
                  <Badge
                    variant="outline"
                    class="border-rose-500/30 font-mono text-xs font-medium text-rose-600 tabular-nums dark:text-rose-400"
                  >
                    {{ hasCancelledStats.truePct }}%
                  </Badge>
                </div>
                <p class="text-muted-foreground font-mono text-xs tabular-nums">
                  {{ hasCancelledStats.trueCount.toLocaleString() }} instances
                </p>
              </div>
              <div class="mt-3">
                <Progress
                  :model-value="hasCancelledStats.truePct"
                  class="h-1.5 [&_[data-slot=progress-indicator]]:bg-rose-500"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

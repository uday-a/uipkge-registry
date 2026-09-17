<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Database,
  Download,
  FileCode2,
  Filter,
  GitBranch,
  Layers,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export type AssertionStatus = 'Passing' | 'Warning' | 'Failed'
export type AssertionCategory = 'Completeness' | 'Uniqueness' | 'Validity' | 'Volume' | 'Schema'

export interface AnomalyRecord {
  recordId: string
  column: string
  value: string
  reason: string
}

export interface AssertionItem {
  id: string
  assertionType: string
  columnName: string
  category: AssertionCategory
  ruleDefinition: string
  targetThreshold: string
  observedValue: string
  observedPercent: number
  failedCount: number
  totalEvaluated: number
  status: AssertionStatus
  statusVariant: 'success' | 'warning' | 'destructive'
  executionTime: string
  expectationConfig: Record<string, unknown>
  remediationQuery: string
  anomalies: AnomalyRecord[]
}

export interface DataQualityMetricsProps {
  datasetTitle?: string
  suiteName?: string
  qualityScore?: number
  lastRun?: string
  passedAssertions?: string
  failedWarnings?: string
  schemaDriftStatus?: string
  totalRowsAudited?: string
  assertions?: AssertionItem[]
  class?: HTMLAttributes['class']
}

const defaultAssertions: AssertionItem[] = [
  {
    id: 'dq-assert-1',
    assertionType: 'expect_column_values_to_not_be_null',
    columnName: 'user_id',
    category: 'Completeness',
    ruleDefinition: 'Primary key non-null identity constraint verification across all partition shards.',
    targetThreshold: '100.0%',
    observedValue: '100.0%',
    observedPercent: 100.0,
    failedCount: 0,
    totalEvaluated: 1480000,
    status: 'Passing',
    statusVariant: 'success',
    executionTime: '142ms',
    expectationConfig: {
      expectation_type: 'expect_column_values_to_not_be_null',
      kwargs: {
        column: 'user_id',
        mostly: 1.0,
      },
    },
    remediationQuery: `-- Primary key check passed cleanly. No quarantine needed.\nSELECT COUNT(*) FROM production_analytics.dim_users WHERE user_id IS NULL;`,
    anomalies: [],
  },
  {
    id: 'dq-assert-2',
    assertionType: 'expect_column_values_to_be_unique',
    columnName: 'email',
    category: 'Uniqueness',
    ruleDefinition: 'Global case-insensitive deduplication check across customer directory.',
    targetThreshold: '100.0%',
    observedValue: '100.0%',
    observedPercent: 100.0,
    failedCount: 0,
    totalEvaluated: 1480000,
    status: 'Passing',
    statusVariant: 'success',
    executionTime: '380ms',
    expectationConfig: {
      expectation_type: 'expect_column_values_to_be_unique',
      kwargs: {
        column: 'email',
        mostly: 1.0,
      },
    },
    remediationQuery: `-- Zero duplicate emails detected in active partition.\nSELECT LOWER(email), COUNT(*) FROM production_analytics.dim_users GROUP BY 1 HAVING COUNT(*) > 1;`,
    anomalies: [],
  },
  {
    id: 'dq-assert-3',
    assertionType: 'expect_column_values_to_match_regex',
    columnName: 'phone_e164',
    category: 'Validity',
    ruleDefinition: 'International telecommunications ITU-T E.164 format pattern matching (^\\+[1-9]\\d{1,14}$).',
    targetThreshold: '≥ 98.0%',
    observedValue: '98.8%',
    observedPercent: 98.8,
    failedCount: 17760,
    totalEvaluated: 1480000,
    status: 'Warning',
    statusVariant: 'warning',
    executionTime: '890ms',
    expectationConfig: {
      expectation_type: 'expect_column_values_to_match_regex',
      kwargs: {
        column: 'phone_e164',
        regex: '^\\+[1-9]\\d{1,14}$',
        mostly: 0.98,
      },
    },
    remediationQuery: `-- Quarantine 17,760 legacy unformatted phone numbers for libphonenumber normalization:\nCREATE OR REPLACE TABLE staging.unformatted_phones AS\nSELECT user_id, email, phone_e164, 'MALFORMED_E164' AS failure_reason\nFROM production_analytics.dim_users\nWHERE phone_e164 NOT RLIKE '^\\+[1-9]\\d{1,14}$';`,
    anomalies: [
      {
        recordId: 'usr_9941a8',
        column: 'phone_e164',
        value: '+1-555-019',
        reason: 'Invalid E.164 length (incomplete national number)',
      },
      {
        recordId: 'usr_1082fc',
        column: 'phone_e164',
        value: '0784910293',
        reason: 'Missing international country dial prefix (+)',
      },
      {
        recordId: 'usr_7729de',
        column: 'phone_e164',
        value: '+44 (0)20 7946',
        reason: 'Unstripped parentheses and whitespace delimiter',
      },
      {
        recordId: 'usr_4019ab',
        column: 'phone_e164',
        value: 'NULL',
        reason: 'Unexpected empty field on SMS-enrolled user',
      },
    ],
  },
  {
    id: 'dq-assert-4',
    assertionType: 'expect_table_row_count_to_be_between',
    columnName: 'table: dim_users',
    category: 'Volume',
    ruleDefinition: 'Daily snapshot table row count volumetric boundary expectation between 1.0M and 2.0M rows.',
    targetThreshold: '1.0M .. 2.0M',
    observedValue: '1,480,000',
    observedPercent: 100.0,
    failedCount: 0,
    totalEvaluated: 1480000,
    status: 'Passing',
    statusVariant: 'success',
    executionTime: '95ms',
    expectationConfig: {
      expectation_type: 'expect_table_row_count_to_be_between',
      kwargs: {
        min_value: 1000000,
        max_value: 2000000,
      },
    },
    remediationQuery: `-- Row count volumetric validation passed within safety boundaries (1.48M in [1.0M, 2.0M]).\nSELECT COUNT(*) AS total_rows FROM production_analytics.dim_users;`,
    anomalies: [],
  },
  {
    id: 'dq-assert-5',
    assertionType: 'expect_column_values_to_be_between',
    columnName: 'age',
    category: 'Validity',
    ruleDefinition: 'Demographic account age boundary distribution constraint between 18 and 120 years.',
    targetThreshold: '100.0%',
    observedValue: '100.0%',
    observedPercent: 100.0,
    failedCount: 0,
    totalEvaluated: 1480000,
    status: 'Passing',
    statusVariant: 'success',
    executionTime: '210ms',
    expectationConfig: {
      expectation_type: 'expect_column_values_to_be_between',
      kwargs: {
        column: 'age',
        min_value: 18,
        max_value: 120,
        mostly: 1.0,
      },
    },
    remediationQuery: `-- All verified user ages lie cleanly between min 18 and max 94 (100.0% compliant).\nSELECT MIN(age), MAX(age), AVG(age) FROM production_analytics.dim_users;`,
    anomalies: [],
  },
]

const props = withDefaults(defineProps<DataQualityMetricsProps>(), {
  datasetTitle: 'production_analytics.dim_users',
  suiteName: 'user_profile_integrity_v3',
  qualityScore: 98.4,
  lastRun: 'Ran 14m ago · 48 assertions evaluated',
  passedAssertions: '47 / 48 Passing · 98%',
  failedWarnings: '1 Warning · Null phone numbers 1.2%',
  schemaDriftStatus: '0 breaking schema changes',
  totalRowsAudited: '1,480,000 rows',
})

const activeAssertions = computed(() => props.assertions ?? defaultAssertions)

const searchQuery = ref('')
const selectedStatus = ref<string>('all')
const selectedCategory = ref<string>('all')
const isRunningSuite = ref(false)
const currentLastRun = ref(props.lastRun)
const selectedAssertion = ref<AssertionItem | null>(null)
const isDrawerOpen = ref(false)
const copiedSnippetKey = ref<string | null>(null)
const exportSuccess = ref(false)
const anomalyExportSuccess = ref(false)

const availableCategories = computed(() => {
  const categories = new Set<string>()
  activeAssertions.value.forEach((item) => categories.add(item.category))
  return ['all', ...Array.from(categories)]
})

const filteredAssertions = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  const statusFilter = selectedStatus.value
  const categoryFilter = selectedCategory.value

  return activeAssertions.value.filter((item) => {
    const matchesStatus = statusFilter === 'all' || item.status.toLowerCase() === statusFilter.toLowerCase()
    const matchesCategory = categoryFilter === 'all' || item.category.toLowerCase() === categoryFilter.toLowerCase()
    const matchesQuery =
      !query ||
      item.assertionType.toLowerCase().includes(query) ||
      item.columnName.toLowerCase().includes(query) ||
      item.ruleDefinition.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)

    return matchesStatus && matchesCategory && matchesQuery
  })
})

function handleRunSuite() {
  if (isRunningSuite.value) return
  isRunningSuite.value = true

  setTimeout(() => {
    isRunningSuite.value = false
    currentLastRun.value = 'Ran just now · 48 assertions evaluated'
  }, 750)
}

function handleInspectAnomalies(assertion: AssertionItem) {
  selectedAssertion.value = assertion
  isDrawerOpen.value = true
}

function copyCodeSnippet(key: string, content: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(content)
    copiedSnippetKey.value = key
    setTimeout(() => {
      if (copiedSnippetKey.value === key) {
        copiedSnippetKey.value = null
      }
    }, 2000)
  }
}

function exportQualityReport() {
  const report = {
    dataset: props.datasetTitle,
    suite: props.suiteName,
    overallQualityScore: props.qualityScore,
    evaluatedAt: new Date().toISOString(),
    engine: 'Great Expectations v0.18 / SodaCL',
    summary: {
      passed: props.passedAssertions,
      warnings: props.failedWarnings,
      schemaDrift: props.schemaDriftStatus,
      totalRows: props.totalRowsAudited,
    },
    assertions: activeAssertions.value,
  }

  const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2))
  if (typeof document !== 'undefined') {
    const link = document.createElement('a')
    link.setAttribute('href', jsonStr)
    link.setAttribute('download', `dq-report-${props.suiteName}-${new Date().toISOString().slice(0, 10)}.json`)
    document.body.appendChild(link)
    link.click()
    link.remove()

    exportSuccess.value = true
    setTimeout(() => {
      exportSuccess.value = false
    }, 2000)
  }
}

function exportAnomalyCsv() {
  if (!selectedAssertion.value || selectedAssertion.value.anomalies.length === 0) return

  const headers = ['Record ID', 'Column', 'Observed Value', 'Failure Reason']
  const rows = selectedAssertion.value.anomalies.map((a) => [a.recordId, a.column, `"${a.value}"`, `"${a.reason}"`])
  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `anomalies-${selectedAssertion.value.columnName}.csv`)
  document.body.appendChild(link)
  link.click()
  link.remove()

  anomalyExportSuccess.value = true
  setTimeout(() => {
    anomalyExportSuccess.value = false
  }, 2000)
}
</script>

<template>
  <div data-slot="data-quality-metrics" :class="cn('w-full space-y-6', props.class)">
    <!-- Header Section -->
    <Card class="border-border bg-card shadow-xs">
      <CardContent class="p-5 sm:p-6">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <!-- Left: Dataset and Suite Metadata -->
          <div class="space-y-2">
            <div class="flex flex-wrap items-center gap-2.5">
              <div
                class="bg-muted text-foreground border-border flex size-9 shrink-0 items-center justify-center rounded-lg border shadow-xs"
              >
                <Database class="size-4.5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h1 class="text-foreground font-mono text-lg font-bold tracking-tight break-all sm:text-xl">
                    {{ props.datasetTitle }}
                  </h1>
                  <Badge wrap variant="secondary" class="font-mono text-xs">
                    {{ props.suiteName }}
                  </Badge>
                </div>
                <div class="text-muted-foreground flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span class="flex items-center gap-1">
                    <Clock class="size-3.5" />
                    {{ currentLastRun }}
                  </span>
                  <span class="opacity-40">·</span>
                  <span class="font-mono">Snowflake DW</span>
                  <span class="opacity-40">·</span>
                  <span class="font-mono">dbt Core v1.8</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Overall Score Card & Action Buttons -->
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center">
            <!-- Overall Score Pill Card -->
            <div
              class="flex flex-wrap items-center gap-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 shadow-xs"
            >
              <div
                class="flex size-11 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle2 class="size-6" />
              </div>
              <div class="min-w-0 space-y-0.5">
                <div class="flex flex-wrap items-baseline gap-2">
                  <span
                    class="text-2xl font-bold tracking-tight text-emerald-600 tabular-nums sm:text-3xl dark:text-emerald-400"
                  >
                    {{ props.qualityScore }}%
                  </span>
                  <Badge wrap variant="success" class="gap-1 px-2 text-xs font-semibold">
                    <Sparkles class="size-3" />
                    Quality Score
                  </Badge>
                </div>
                <p class="text-muted-foreground text-xs">Automated Sodacl / GX Engine</p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-wrap gap-2.5 sm:flex-col">
              <Button
                variant="default"
                size="sm"
                class="gap-2 shadow-xs"
                :disabled="isRunningSuite"
                @click="handleRunSuite"
              >
                <RefreshCw :class="['size-4', isRunningSuite ? 'animate-spin' : '']" />
                <span>{{ isRunningSuite ? 'Evaluating Suite...' : 'Run Assertions Suite' }}</span>
              </Button>

              <Button variant="outline" size="sm" class="gap-2 shadow-xs" @click="exportQualityReport">
                <Check v-if="exportSuccess" class="text-success size-4" />
                <Download v-else class="size-4" />
                <span>{{ exportSuccess ? 'Report Downloaded!' : 'Export Quality Report' }}</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>

      <!-- Sub-bar Contract Guarantee -->
      <div
        class="bg-muted/40 border-border text-muted-foreground flex flex-col gap-2 border-t px-5 py-2.5 text-xs sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="flex items-center gap-2 font-mono">
          <span class="size-2 rounded-full bg-emerald-500" />
          <span>Schema Contract: Locked v3.2 · Zero Breaking Schema Drift</span>
        </div>
        <div class="flex items-center gap-3">
          <span>Engine SLA: <strong class="text-foreground font-medium">Strict Production</strong></span>
          <Separator orientation="vertical" class="hidden h-3 sm:block" />
          <span>48 assertions evaluated</span>
        </div>
      </div>
    </Card>

    <!-- 4 Assertion Metric Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Card 1: Passed Assertions -->
      <Card class="border-border bg-card hover:border-border shadow-xs transition-colors">
        <CardHeader class="p-4 pb-2">
          <div class="flex items-start justify-between gap-2">
            <p class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Passed Assertions</p>
            <div
              class="flex size-7 items-center justify-center rounded-md border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            >
              <CheckCircle2 class="size-4" />
            </div>
          </div>
          <div class="flex items-baseline gap-2 pt-1">
            <span class="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">47 / 48</span>
            <Badge wrap variant="success" class="text-xs font-medium">98% Passing</Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-2 p-4 pt-1">
          <Progress :model-value="98" class="h-1.5 w-full" />
          <p class="text-muted-foreground text-xs">{{ props.passedAssertions }}</p>
        </CardContent>
      </Card>

      <!-- Card 2: Failed / Warnings -->
      <Card class="border-border bg-card hover:border-border shadow-xs transition-colors">
        <CardHeader class="p-4 pb-2">
          <div class="flex items-start justify-between gap-2">
            <p class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Failed / Warnings</p>
            <div
              class="flex size-7 items-center justify-center rounded-md border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
            >
              <AlertTriangle class="size-4" />
            </div>
          </div>
          <div class="flex items-baseline gap-2 pt-1">
            <span class="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">1 Warning</span>
            <Badge wrap variant="warning" class="text-xs font-medium">1.2% Non-conformant</Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-2 p-4 pt-1">
          <Progress :model-value="1.2" class="h-1.5 w-full" />
          <p class="text-muted-foreground text-xs">{{ props.failedWarnings }}</p>
        </CardContent>
      </Card>

      <!-- Card 3: Schema Drift Status -->
      <Card class="border-border bg-card hover:border-border shadow-xs transition-colors">
        <CardHeader class="p-4 pb-2">
          <div class="flex items-start justify-between gap-2">
            <p class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Schema Drift Status</p>
            <div
              class="flex size-7 items-center justify-center rounded-md border border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400"
            >
              <GitBranch class="size-4" />
            </div>
          </div>
          <div class="flex items-baseline gap-2 pt-1">
            <span class="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">0 Breaking</span>
            <Badge wrap variant="outline" class="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              No Drift
            </Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-2 p-4 pt-1">
          <div class="bg-muted/40 flex items-center justify-between gap-x-2 rounded-md px-2 py-1 text-xs">
            <span class="text-muted-foreground">Columns Synced</span>
            <span class="text-foreground font-mono font-medium">14 / 14 matched</span>
          </div>
          <p class="text-muted-foreground text-xs">{{ props.schemaDriftStatus }}</p>
        </CardContent>
      </Card>

      <!-- Card 4: Total Rows Audited -->
      <Card class="border-border bg-card hover:border-border shadow-xs transition-colors">
        <CardHeader class="p-4 pb-2">
          <div class="flex items-start justify-between gap-2">
            <p class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Total Rows Audited</p>
            <div
              class="bg-muted text-foreground border-border flex size-7 items-center justify-center rounded-md border"
            >
              <Layers class="size-4" />
            </div>
          </div>
          <div class="flex items-baseline gap-2 pt-1">
            <span class="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">1,480,000</span>
            <Badge wrap variant="outline" class="font-mono text-xs font-normal">1.48M Rows</Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-2 p-4 pt-1">
          <div class="bg-muted/40 flex items-center justify-between gap-x-2 rounded-md px-2 py-1 text-xs">
            <span class="text-muted-foreground">Partition Range</span>
            <span class="text-foreground font-mono font-medium">1.0M .. 2.0M</span>
          </div>
          <p class="text-muted-foreground text-xs">{{ props.totalRowsAudited }}</p>
        </CardContent>
      </Card>
    </div>

    <!-- Data Quality Test Assertions Table Card -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div class="flex items-center gap-2">
            <CardTitle class="text-base font-semibold">Data Quality Test Assertions</CardTitle>
            <Badge wrap variant="secondary" class="font-mono text-xs">
              {{ filteredAssertions.length }} of {{ activeAssertions.length }} Assertions
            </Badge>
          </div>
          <CardDescription class="text-xs">
            Automated expectations, boundary validations, regex format rules, and volume anomaly checks.
          </CardDescription>
        </div>

        <!-- Filter Pills by Status -->
        <div class="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            :class="[
              'focus-visible:ring-ring inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
              selectedStatus === 'all'
                ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground',
            ]"
            @click="selectedStatus = 'all'"
          >
            All Assertions ({{ activeAssertions.length }})
          </button>
          <button
            type="button"
            :class="[
              'focus-visible:ring-ring inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
              selectedStatus === 'passing'
                ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs dark:bg-emerald-600'
                : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground',
            ]"
            @click="selectedStatus = 'passing'"
          >
            Passing (4)
          </button>
          <button
            type="button"
            :class="[
              'focus-visible:ring-ring inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
              selectedStatus === 'warning'
                ? 'border-amber-600 bg-amber-600 text-white shadow-xs dark:bg-amber-600'
                : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground',
            ]"
            @click="selectedStatus = 'warning'"
          >
            Warnings (1)
          </button>
        </div>
      </CardHeader>

      <!-- Filter & Search Toolbar -->
      <div class="border-border/60 border-t p-4 pt-3 pb-3">
        <div class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div class="relative flex-1">
            <Search
              class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2"
            />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by assertion type, column name, or rule definition..."
              class="border-border bg-background placeholder:text-muted-foreground focus-visible:ring-ring h-8 w-full rounded-md border px-3 pl-8 text-xs focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>

          <div class="flex flex-wrap items-center gap-1.5">
            <span class="text-muted-foreground mr-1 flex items-center gap-1 text-xs font-medium">
              <Filter class="size-3" />
              Category:
            </span>
            <button
              v-for="cat in availableCategories"
              :key="cat"
              type="button"
              :class="[
                'focus-visible:ring-ring inline-flex items-center rounded-md border px-2 py-1 font-mono text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                selectedCategory === cat
                  ? 'border-foreground bg-foreground text-background shadow-xs'
                  : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground',
              ]"
              @click="selectedCategory = cat"
            >
              {{ cat === 'all' ? 'All Categories' : cat }}
            </button>
          </div>
        </div>
      </div>

      <!-- Table Container -->
      <CardContent class="p-0">
        <div class="border-border/60 overflow-x-auto border-t">
          <Table>
            <TableHeader class="bg-muted/50">
              <TableRow>
                <TableHead class="min-w-[260px] text-xs">Assertion & Target Column</TableHead>
                <TableHead class="min-w-[100px] text-xs">Category</TableHead>
                <TableHead class="min-w-[120px] text-xs">Target Threshold</TableHead>
                <TableHead class="min-w-[120px] text-xs">Observed Value</TableHead>
                <TableHead class="min-w-[110px] text-xs">Status</TableHead>
                <TableHead class="min-w-[130px] text-right text-xs">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="assertion in filteredAssertions"
                :key="assertion.id"
                class="hover:bg-muted/20 transition-colors"
              >
                <!-- Assertion Type & Target Column -->
                <TableCell class="py-3">
                  <div class="space-y-1">
                    <div class="flex flex-wrap items-center gap-2">
                      <Badge wrap variant="outline" class="border-border font-mono text-xs font-semibold">
                        {{ assertion.columnName }}
                      </Badge>
                      <span class="text-foreground font-mono text-xs font-medium">{{ assertion.assertionType }}</span>
                    </div>
                    <p class="text-muted-foreground max-w-sm text-xs leading-relaxed sm:max-w-md">
                      {{ assertion.ruleDefinition }}
                    </p>
                  </div>
                </TableCell>

                <!-- Category -->
                <TableCell class="py-3">
                  <Badge wrap variant="secondary" class="font-normal">
                    {{ assertion.category }}
                  </Badge>
                </TableCell>

                <!-- Target Threshold -->
                <TableCell class="py-3">
                  <span class="text-muted-foreground font-mono text-xs font-medium">
                    {{ assertion.targetThreshold }}
                  </span>
                </TableCell>

                <!-- Observed Value -->
                <TableCell class="py-3">
                  <div class="space-y-0.5 font-mono text-xs">
                    <span
                      :class="[
                        'font-bold tabular-nums',
                        assertion.status === 'Passing'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-amber-600 dark:text-amber-400',
                      ]"
                    >
                      {{ assertion.observedValue }}
                    </span>
                    <span class="text-muted-foreground/70 block text-xs"> {{ assertion.executionTime }} eval </span>
                  </div>
                </TableCell>

                <!-- Status Badge -->
                <TableCell class="py-3">
                  <Badge wrap :variant="assertion.statusVariant" class="gap-1 text-xs font-medium">
                    <CheckCircle2 v-if="assertion.status === 'Passing'" class="size-3" />
                    <AlertTriangle v-else-if="assertion.status === 'Warning'" class="size-3" />
                    <AlertCircle v-else class="size-3" />
                    {{ assertion.status }}
                  </Badge>
                </TableCell>

                <!-- Action Button -->
                <TableCell class="py-3 text-right">
                  <Button
                    variant="outline"
                    size="xs"
                    class="h-7 gap-1 text-xs font-medium shadow-xs"
                    @click="handleInspectAnomalies(assertion)"
                  >
                    <Activity class="size-3" />
                    <span>Inspect Anomalies</span>
                  </Button>
                </TableCell>
              </TableRow>

              <TableRow v-if="filteredAssertions.length === 0">
                <TableCell colspan="6" class="py-8 text-center">
                  <div class="flex flex-col items-center justify-center gap-1.5">
                    <ShieldCheck class="size-7 text-emerald-500" />
                    <p class="text-foreground text-sm font-medium">No assertions match your filter query</p>
                    <p class="text-muted-foreground text-xs">All assertions meet standard quality constraints.</p>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <!-- Table Footer -->
        <div
          class="border-border/60 bg-muted/20 text-muted-foreground flex flex-col gap-2 border-t px-4 py-2.5 text-xs sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex items-center gap-2">
            <span class="size-2 rounded-full bg-emerald-500" />
            <span>Great Expectations Assertions Runner: 100% evaluated</span>
          </div>
          <span class="font-mono text-xs"> Dataset: {{ props.datasetTitle }} · Last Batch: 1,480,000 rows </span>
        </div>
      </CardContent>
    </Card>

    <!-- Anomaly Inspector Drawer / Sheet -->
    <Sheet v-model:open="isDrawerOpen">
      <SheetContent class="w-full space-y-6 overflow-y-auto p-6 sm:max-w-xl md:max-w-2xl">
        <SheetHeader v-if="selectedAssertion" class="space-y-2 p-0 text-left">
          <div class="flex items-center justify-between gap-3 pr-6">
            <div class="flex items-center gap-2">
              <Badge wrap :variant="selectedAssertion.statusVariant" class="gap-1 font-mono text-xs font-semibold">
                <CheckCircle2 v-if="selectedAssertion.status === 'Passing'" class="size-3" />
                <AlertTriangle v-else class="size-3" />
                {{ selectedAssertion.status.toUpperCase() }}
              </Badge>
              <Badge wrap variant="outline" class="font-mono text-xs font-semibold">
                {{ selectedAssertion.category }}
              </Badge>
            </div>

            <span class="text-muted-foreground font-mono text-xs">
              Latency: {{ selectedAssertion.executionTime }}
            </span>
          </div>

          <SheetTitle class="text-lg font-bold tracking-tight">
            {{ selectedAssertion.assertionType }}
          </SheetTitle>
          <SheetDescription class="text-foreground/90 font-mono text-xs">
            Target Column: <strong class="text-foreground font-semibold">{{ selectedAssertion.columnName }}</strong>
          </SheetDescription>
        </SheetHeader>

        <div v-if="selectedAssertion" class="space-y-5 text-xs">
          <!-- Summary Metrics Cards Grid -->
          <div class="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <div class="bg-muted/40 border-border/80 rounded-lg border p-3">
              <span class="text-muted-foreground text-xs">Target Threshold</span>
              <p class="text-foreground mt-1 font-mono text-sm font-bold">{{ selectedAssertion.targetThreshold }}</p>
            </div>
            <div class="bg-muted/40 border-border/80 rounded-lg border p-3">
              <span class="text-muted-foreground text-xs">Observed Pass Rate</span>
              <p
                :class="[
                  'mt-1 font-mono text-sm font-bold tabular-nums',
                  selectedAssertion.status === 'Passing'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-600 dark:text-amber-400',
                ]"
              >
                {{ selectedAssertion.observedValue }}
              </p>
            </div>
            <div class="bg-muted/40 border-border/80 rounded-lg border p-3">
              <span class="text-muted-foreground text-xs">Audited Records</span>
              <p class="text-foreground mt-1 font-mono text-sm font-bold tabular-nums">
                {{ selectedAssertion.totalEvaluated.toLocaleString() }}
              </p>
            </div>
            <div class="bg-muted/40 border-border/80 rounded-lg border p-3">
              <span class="text-muted-foreground text-xs">Failed Anomalies</span>
              <p
                :class="[
                  'mt-1 font-mono text-sm font-bold tabular-nums',
                  selectedAssertion.failedCount > 0
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-emerald-600 dark:text-emerald-400',
                ]"
              >
                {{ selectedAssertion.failedCount.toLocaleString() }}
              </p>
            </div>
          </div>

          <!-- Expectation Configuration DSL Box -->
          <div class="space-y-2">
            <div class="flex items-center justify-between gap-x-2">
              <h3 class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Great Expectations Specification
              </h3>
              <Button
                variant="ghost"
                size="xs"
                class="h-6 gap-1 px-2 text-xs"
                @click="copyCodeSnippet('dsl', JSON.stringify(selectedAssertion.expectationConfig, null, 2))"
              >
                <Check v-if="copiedSnippetKey === 'dsl'" class="size-3 text-emerald-500" />
                <Copy v-else class="size-3" />
                <span>{{ copiedSnippetKey === 'dsl' ? 'Copied' : 'Copy Config' }}</span>
              </Button>
            </div>
            <div class="overflow-hidden rounded-md border bg-zinc-950 font-mono text-xs text-zinc-100 shadow-inner">
              <div
                class="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs text-zinc-400"
              >
                <FileCode2 class="size-3.5" />
                <span>expectation_suite.json</span>
              </div>
              <pre class="overflow-x-auto p-3 text-xs leading-relaxed text-zinc-300 select-text">{{
                JSON.stringify(selectedAssertion.expectationConfig, null, 2)
              }}</pre>
            </div>
          </div>

          <!-- Anomalous Samples Table or Clean Pass State -->
          <div class="space-y-2">
            <div class="flex items-center justify-between gap-x-2">
              <h3 class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Anomalous Sample Records
              </h3>
              <span v-if="selectedAssertion.anomalies.length > 0" class="text-muted-foreground font-mono text-xs">
                Showing {{ selectedAssertion.anomalies.length }} failure samples
              </span>
            </div>

            <div
              v-if="selectedAssertion.anomalies.length > 0"
              class="border-border/80 overflow-hidden rounded-md border shadow-xs"
            >
              <Table>
                <TableHeader class="bg-muted/40">
                  <TableRow>
                    <TableHead class="text-xs">Record ID</TableHead>
                    <TableHead class="text-xs">Column</TableHead>
                    <TableHead class="text-xs">Observed Value</TableHead>
                    <TableHead class="text-xs">Diagnostic Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow v-for="anomaly in selectedAssertion.anomalies" :key="anomaly.recordId">
                    <TableCell class="font-mono text-xs font-medium">{{ anomaly.recordId }}</TableCell>
                    <TableCell class="font-mono text-xs">{{ anomaly.column }}</TableCell>
                    <TableCell class="font-mono text-xs font-semibold text-rose-600 dark:text-rose-400">
                      {{ anomaly.value }}
                    </TableCell>
                    <TableCell class="text-muted-foreground text-xs">{{ anomaly.reason }}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div
              v-else
              class="bg-muted/20 border-border/80 flex flex-col items-center justify-center gap-1.5 rounded-md border p-6 text-center"
            >
              <CheckCircle2 class="size-6 text-emerald-500" />
              <p class="text-foreground text-xs font-semibold">Zero Anomalies Detected</p>
              <p class="text-muted-foreground text-xs">
                All {{ selectedAssertion.totalEvaluated.toLocaleString() }} audited records strictly satisfied the
                expectation rule.
              </p>
            </div>
          </div>

          <!-- Quarantine SQL Script -->
          <div class="space-y-2">
            <div class="flex items-center justify-between gap-x-2">
              <h3 class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Quarantine & Remediation SQL
              </h3>
              <Button
                variant="ghost"
                size="xs"
                class="h-6 gap-1 px-2 text-xs"
                @click="copyCodeSnippet('sql', selectedAssertion.remediationQuery)"
              >
                <Check v-if="copiedSnippetKey === 'sql'" class="size-3 text-emerald-500" />
                <Copy v-else class="size-3" />
                <span>{{ copiedSnippetKey === 'sql' ? 'Copied' : 'Copy SQL' }}</span>
              </Button>
            </div>
            <div class="border-border bg-muted/60 rounded-md border p-3 font-mono text-xs leading-relaxed select-text">
              <pre class="text-foreground overflow-x-auto whitespace-pre-wrap">{{
                selectedAssertion.remediationQuery
              }}</pre>
            </div>
          </div>
        </div>

        <SheetFooter
          v-if="selectedAssertion"
          class="border-border/80 flex flex-row items-center justify-end gap-2 border-t pt-4"
        >
          <SheetClose as-child>
            <Button variant="outline" size="sm" class="text-xs"> Close </Button>
          </SheetClose>

          <Button
            v-if="selectedAssertion.anomalies.length > 0"
            variant="default"
            size="sm"
            class="gap-1.5 text-xs font-medium shadow-xs"
            @click="exportAnomalyCsv"
          >
            <Check v-if="anomalyExportSuccess" class="size-3.5 text-emerald-300" />
            <Download v-else class="size-3.5" />
            <span>{{ anomalyExportSuccess ? 'Anomalies Exported!' : 'Export Anomaly CSV' }}</span>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  </div>
</template>

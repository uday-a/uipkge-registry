<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  Activity,
  ArrowRightLeft,
  BarChart3,
  Check,
  CheckCircle2,
  Clock,
  Coins,
  Copy,
  CreditCard,
  Database,
  FileCode2,
  GitFork,
  Key,
  Landmark,
  Layers,
  LineChart,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Table2,
  Terminal,
  Users,
  Workflow,
  X,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ColumnDef {
  name: string
  type: string
  nullable: boolean
  isPrimaryKey?: boolean
  description: string
  sampleValue: string
  distinctPct: string
  constraints?: string
}

interface QualityAssertion {
  id: string
  name: string
  type: string
  targetColumn: string
  description: string
  executionTime: string
  lastRun: string
  status: 'passed' | 'warning' | 'failed'
  ruleDefinition: string
}

interface LineageSourceNode {
  id: string
  name: string
  schema: string
  connector: string
  type: string
  rowCount: string
  latency: string
  status: 'fresh' | 'syncing' | 'delayed'
  iconName: 'CreditCard' | 'Users' | 'Landmark'
  description: string
}

interface LineageTransformNode {
  id: string
  name: string
  modelType: string
  engine: string
  runtime: string
  lastRun: string
  testsPassed: string
  status: 'passed' | 'running' | 'failed'
  iconName: 'Layers' | 'Coins'
  description: string
}

interface LineageConsumerNode {
  id: string
  name: string
  category: string
  tool: string
  frequency: string
  audience: string
  status: 'active' | 'syncing'
  iconName: 'BarChart3' | 'ArrowRightLeft' | 'LineChart'
  description: string
}

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

function resetLineageFocus() {
  selectedNodeId.value = 'target-table'
  activeTab.value = 'lineage'
}

const activeTab = ref('schema')
const searchQuery = ref('')
const copiedRef = ref(false)
const copiedQuery = ref(false)
const isRunningTests = ref(false)
const testsPassedCount = ref(6)
const isQueryModalOpen = ref(false)
const selectedNodeId = ref<string | null>('target-table')
const filterSeverity = ref<'all' | 'critical' | 'schema'>('all')

const sourceNodes: LineageSourceNode[] = [
  {
    id: 'src-stripe',
    name: 'raw_stripe.charges',
    schema: 'raw_stripe',
    connector: 'Fivetran CDC',
    type: 'PostgreSQL Raw',
    rowCount: '1.42M rows',
    latency: '~5m sync',
    status: 'fresh',
    iconName: 'CreditCard',
    description: 'Direct transactional charge events, currency conversions, refunds, and card processing fees.',
  },
  {
    id: 'src-salesforce',
    name: 'raw_salesforce.accounts',
    schema: 'raw_salesforce',
    connector: 'Airbyte Cloud',
    type: 'CRM Extract',
    rowCount: '84.5k rows',
    latency: '~15m sync',
    status: 'fresh',
    iconName: 'Users',
    description: 'Enterprise accounts, contract values, billing contacts, and subscription tier assignments.',
  },
  {
    id: 'src-bank',
    name: 'raw_bank.transfers',
    schema: 'raw_bank',
    connector: 'Kafka Stream',
    type: 'Banking API',
    rowCount: '620k rows',
    latency: '<1m latency',
    status: 'fresh',
    iconName: 'Landmark',
    description: 'Direct bank wire settlement entries, ACH clearances, and treasury reconciliation logs.',
  },
]

const transformNodes: LineageTransformNode[] = [
  {
    id: 'tr-daily-revenue',
    name: 'dbt.int_daily_revenue',
    modelType: 'dbt Incremental',
    engine: 'dbt Core 1.8',
    runtime: '1m 24s',
    lastRun: '22m ago',
    testsPassed: '14/14 Passed',
    status: 'passed',
    iconName: 'Layers',
    description: 'Aggregates daily charge events into standardized GAAP revenue recognized per customer.',
  },
  {
    id: 'tr-fx-rates',
    name: 'dbt.int_fx_normalized_rates',
    modelType: 'dbt View',
    engine: 'dbt Core 1.8',
    runtime: '18s',
    lastRun: '25m ago',
    testsPassed: '6/6 Passed',
    status: 'passed',
    iconName: 'Coins',
    description: 'Normalized exchange rate matrix cross-referencing European Central Bank & Federal Reserve feeds.',
  },
]

const consumerNodes: LineageConsumerNode[] = [
  {
    id: 'cons-metabase',
    name: 'Executive Board Metabase Dashboard',
    category: 'BI Dashboard',
    tool: 'Metabase Enterprise',
    frequency: 'Hourly auto-refresh',
    audience: '42 active executives',
    status: 'active',
    iconName: 'BarChart3',
    description: 'C-Suite executive dashboard tracking recurring revenue, net burn rate, and board deck slide metrics.',
  },
  {
    id: 'cons-netsuite',
    name: 'Finance NetSuite Sync',
    category: 'Reverse ETL',
    tool: 'Census Reverse ETL',
    frequency: 'Hourly batch',
    audience: 'Accounting ERP Ledger',
    status: 'active',
    iconName: 'ArrowRightLeft',
    description: 'Automated journal entry creation and revenue recognition schedules into NetSuite ERP.',
  },
  {
    id: 'cons-looker',
    name: 'Looker ARR Report',
    category: 'Looker Model',
    tool: 'Looker Explore',
    frequency: 'Live semantic model',
    audience: '18 connected reports',
    status: 'active',
    iconName: 'LineChart',
    description: 'Self-service exploration model for RevOps, cohort retention, contraction, and expansion ARR.',
  },
]

const columns: ColumnDef[] = [
  {
    name: 'month_id',
    type: 'varchar(7)',
    nullable: false,
    isPrimaryKey: true,
    description: 'YYYY-MM billing calendar interval identifier (e.g. 2026-03) representing fiscal calendar close.',
    sampleValue: "'2026-03'",
    distinctPct: '100% Unique',
    constraints: 'PRIMARY KEY, ISO-8601',
  },
  {
    name: 'gross_revenue',
    type: 'decimal(18,2)',
    nullable: false,
    description:
      'Total unadjusted transaction volume processed across all payment gateways before churn and discounts.',
    sampleValue: '$1,842,500.00',
    distinctPct: '99.8% Distinct',
    constraints: 'CHECK (gross_revenue >= 0)',
  },
  {
    name: 'net_arr',
    type: 'decimal(18,2)',
    nullable: false,
    description:
      'Annualized recurring revenue normalized across all active multi-year and monthly enterprise contracts.',
    sampleValue: '$14,680,240.00',
    distinctPct: '98.9% Distinct',
    constraints: 'CHECK (net_arr >= 0)',
  },
  {
    name: 'churned_mrr',
    type: 'decimal(18,2)',
    nullable: true,
    description:
      'Monthly recurring revenue lost in the period due to voluntary cancellations or involuntary card downgrades.',
    sampleValue: '-$12,450.00',
    distinctPct: '42.1% Distinct',
    constraints: 'CHECK (churned_mrr <= 0)',
  },
  {
    name: 'active_subscriptions',
    type: 'integer',
    nullable: false,
    description: 'Total count of distinct active paying enterprise accounts and self-serve team workspaces.',
    sampleValue: '3,842',
    distinctPct: '100% Integer',
    constraints: 'CHECK (active_subscriptions > 0)',
  },
]

const qualityAssertions: QualityAssertion[] = [
  {
    id: 'test-1',
    name: 'assert_unique_month_id',
    type: 'Primary Key Uniqueness',
    targetColumn: 'month_id',
    description: 'Verifies that every monthly fiscal partition key is strictly unique with 0 duplicate rows.',
    executionTime: '420ms',
    lastRun: '18m ago',
    status: 'passed',
    ruleDefinition: 'dbt_expectations.expect_compound_columns_to_be_unique(month_id)',
  },
  {
    id: 'test-2',
    name: 'assert_positive_gross_revenue',
    type: 'Value Range Check',
    targetColumn: 'gross_revenue',
    description: 'Ensures that processed monthly gross revenue cannot be negative under GAAP rules.',
    executionTime: '380ms',
    lastRun: '18m ago',
    status: 'passed',
    ruleDefinition: 'dbt_expectations.expect_column_values_to_be_between(min_value=0)',
  },
  {
    id: 'test-3',
    name: 'assert_foreign_key_accounts_integrity',
    type: 'Referential Integrity',
    targetColumn: 'account_id (upstream join)',
    description: 'Validates that 100% of underlying subscription revenue lines match valid accounts in Salesforce CRM.',
    executionTime: '890ms',
    lastRun: '18m ago',
    status: 'passed',
    ruleDefinition: "dbt_utils.relationships(to=ref('raw_salesforce_accounts'), field='id')",
  },
  {
    id: 'test-4',
    name: 'assert_not_null_critical_metrics',
    type: 'Completeness / Non-Null',
    targetColumn: 'month_id, gross_revenue, net_arr',
    description: 'Guarantees zero null occurrences across high-priority C-Suite revenue and ARR metrics.',
    executionTime: '310ms',
    lastRun: '18m ago',
    status: 'passed',
    ruleDefinition: 'dbt.test_not_null_composite(columns=[month_id, gross_revenue, net_arr])',
  },
  {
    id: 'test-5',
    name: 'assert_valid_iso_month_format',
    type: 'Regex Format Validation',
    targetColumn: 'month_id',
    description: 'Asserts all month partition tokens adhere to standard ISO format regex `^\\d{4}-(0[1-9]|1[0-2])$`.',
    executionTime: '240ms',
    lastRun: '18m ago',
    status: 'passed',
    ruleDefinition: 'dbt_expectations.expect_column_values_to_match_regex(pattern="^\\\\d{4}-(0[1-9]|1[0-2])$")',
  },
  {
    id: 'test-6',
    name: 'assert_monotonic_active_subscriptions',
    type: 'Anomaly Detection (3-Sigma)',
    targetColumn: 'active_subscriptions',
    description:
      'Monte Carlo ML rule checking month-over-month subscription volatility is within 3-sigma confidence bounds.',
    executionTime: '610ms',
    lastRun: '18m ago',
    status: 'passed',
    ruleDefinition: 'monte_carlo.metric_anomaly_detector(threshold_sigma=3.0, sensitivity=0.95)',
  },
]

const filteredColumns = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return columns
  return columns.filter(
    (col) =>
      col.name.toLowerCase().includes(query) ||
      col.type.toLowerCase().includes(query) ||
      col.description.toLowerCase().includes(query),
  )
})

const filteredQualityTests = computed(() => {
  if (filterSeverity.value === 'critical') {
    return qualityAssertions.filter((t) => t.type.includes('Primary') || t.type.includes('Referential'))
  }
  if (filterSeverity.value === 'schema') {
    return qualityAssertions.filter((t) => t.type.includes('Format') || t.type.includes('Completeness'))
  }
  return qualityAssertions
})

const selectedNodeDetails = computed(() => {
  if (selectedNodeId.value === 'target-table') {
    return {
      title: 'analytics.fct_monthly_financials',
      badge: 'Active Target Table',
      description:
        'Gold-tier core financial mart consolidating Stripe billing, FX rates, and Salesforce CRM accounts for executive reporting.',
      metadata: [
        { label: 'Layer', value: 'Marts / Core Analytics' },
        { label: 'Schema', value: 'production_dw' },
        { label: 'Total Rows', value: '240,000' },
        { label: 'Freshness SLA', value: '60 mins (Current: 18m)' },
      ],
    }
  }

  const src = sourceNodes.find((n) => n.id === selectedNodeId.value)
  if (src) {
    return {
      title: src.name,
      badge: 'Source Table',
      description: src.description,
      metadata: [
        { label: 'Connector', value: src.connector },
        { label: 'Ingestion Type', value: src.type },
        { label: 'Volume', value: src.rowCount },
        { label: 'Sync Cadence', value: src.latency },
      ],
    }
  }

  const tr = transformNodes.find((n) => n.id === selectedNodeId.value)
  if (tr) {
    return {
      title: tr.name,
      badge: 'dbt Intermediate Model',
      description: tr.description,
      metadata: [
        { label: 'Engine', value: tr.engine },
        { label: 'Materialization', value: tr.modelType },
        { label: 'Build Duration', value: tr.runtime },
        { label: 'Test Suite', value: tr.testsPassed },
      ],
    }
  }

  const cons = consumerNodes.find((n) => n.id === selectedNodeId.value)
  if (cons) {
    return {
      title: cons.name,
      badge: 'Downstream Consumer',
      description: cons.description,
      metadata: [
        { label: 'Tool Platform', value: cons.tool },
        { label: 'Type', value: cons.category },
        { label: 'Audience / Usage', value: cons.audience },
        { label: 'Sync Schedule', value: cons.frequency },
      ],
    }
  }

  return null
})

function copyRef(text: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(text)
    copiedRef.value = true
    setTimeout(() => {
      copiedRef.value = false
    }, 2000)
  }
}

const dbtModelSnippet = `{{ config(
    materialized='incremental',
    unique_key='month_id',
    schema='production_dw',
    tags=['finance', 'tier_1_gold', 'executive_kpi']
) }}

WITH daily_rev AS (
    SELECT * FROM {{ ref('int_daily_revenue') }}
    {% if is_incremental() %}
    WHERE event_date >= dateadd(day, -3, current_date)
    {% endif %}
),

fx_rates AS (
    SELECT * FROM {{ ref('int_fx_normalized_rates') }}
),

monthly_aggregates AS (
    SELECT
        TO_CHAR(d.event_date, 'YYYY-MM') AS month_id,
        SUM(d.gross_amount_usd) AS gross_revenue,
        SUM(d.annualized_contract_val) AS net_arr,
        SUM(CASE WHEN d.is_churned THEN d.mrr_impact ELSE 0 END) AS churned_mrr,
        COUNT(DISTINCT d.customer_account_id) AS active_subscriptions
    FROM daily_rev d
    LEFT JOIN fx_rates fx ON d.currency = fx.currency AND d.event_date = fx.rate_date
    GROUP BY 1
)

SELECT
    month_id,
    ROUND(gross_revenue, 2) AS gross_revenue,
    ROUND(net_arr, 2) AS net_arr,
    ROUND(churned_mrr, 2) AS churned_mrr,
    active_subscriptions
FROM monthly_aggregates
ORDER BY month_id DESC;`

function copyCompiledSQL() {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(dbtModelSnippet)
    copiedQuery.value = true
    setTimeout(() => {
      copiedQuery.value = false
    }, 2000)
  }
}

function runSimulatedTests() {
  isRunningTests.value = true
  setTimeout(() => {
    isRunningTests.value = false
  }, 1200)
}
</script>

<template>
  <div
    data-slot="data-catalog-lineage"
    :class="
      cn(
        'bg-background text-foreground border-border w-full space-y-6 rounded-xl border p-4 shadow-xs sm:p-6',
        props.class,
      )
    "
  >
    <!-- Header Section -->
    <header class="border-border bg-card/60 rounded-xl border p-4 sm:p-5">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div class="space-y-2.5">
          <!-- Cluster / Warehouse breadcrumbs -->
          <div class="flex flex-wrap items-center gap-2 text-xs">
            <div class="bg-primary/10 text-primary flex size-6 items-center justify-center rounded-md">
              <Database class="size-3.5" />
            </div>
            <span class="text-muted-foreground font-mono">snowflake-dw-production.us-east-1</span>
            <span class="text-muted-foreground">/</span>
            <Badge variant="outline" class="font-mono text-xs font-normal"> schema: production_dw </Badge>
            <Badge variant="secondary" class="font-mono text-xs"> Tier 1 Core Mart </Badge>
          </div>

          <!-- Table Title and Badges -->
          <div class="flex flex-wrap items-center gap-3">
            <h1 class="text-foreground font-mono text-xl font-bold tracking-tight break-all sm:text-2xl">
              analytics.fct_monthly_financials
            </h1>
            <Button
              variant="ghost"
              size="sm"
              class="h-7 gap-1 px-2 text-xs"
              @click="copyRef('analytics.fct_monthly_financials')"
            >
              <Check v-if="copiedRef" class="size-3 text-emerald-500" />
              <Copy v-else class="size-3" />
              <span class="font-mono">{{ copiedRef ? 'Copied Ref!' : 'Copy Name' }}</span>
            </Button>
          </div>

          <!-- Metadata Badges: Freshness, SLA, Owner -->
          <div class="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
            <!-- Data Freshness -->
            <div class="border-border bg-background inline-flex items-center gap-2 rounded-md border px-2.5 py-1">
              <span class="relative flex size-2">
                <span class="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-75" />
                <span class="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              <span class="text-muted-foreground">Freshness:</span>
              <span class="text-foreground font-medium">Updated 18m ago</span>
              <span class="font-medium text-emerald-600 dark:text-emerald-400">SLA: Healthy</span>
            </div>

            <!-- Table Owner -->
            <div class="border-border bg-background inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1">
              <Users class="text-muted-foreground size-3.5" />
              <span class="text-muted-foreground">Owner:</span>
              <span class="text-foreground font-medium">Data Platform Squad</span>
              <Badge variant="secondary" class="h-4.5 px-1 font-mono text-xs">#data-eng-core</Badge>
            </div>

            <!-- Stats -->
            <div class="border-border bg-background inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1">
              <Table2 class="text-muted-foreground size-3.5" />
              <span class="text-muted-foreground">Rows:</span>
              <span class="text-foreground font-mono font-medium">240,000</span>
              <span class="text-foreground font-mono font-medium">5 columns</span>
            </div>
          </div>
        </div>

        <!-- Header Actions -->
        <div class="flex flex-wrap items-center gap-2.5 pt-1 lg:pt-0">
          <Button variant="outline" size="sm" class="h-9 gap-1.5 text-xs" @click="resetLineageFocus">
            <GitFork class="size-3.5 text-sky-500" />
            <span>View Upstream Lineage</span>
          </Button>

          <Button
            aria-label="Close query modal"
            variant="default"
            size="sm"
            class="h-9 gap-1.5 text-xs font-medium"
            @click="isQueryModalOpen = !isQueryModalOpen"
          >
            <Terminal class="size-3.5" />
            <span>Query Table</span>
          </Button>
        </div>
      </div>
    </header>

    <!-- Interactive SQL Query Drawer / Bar -->
    <div v-if="isQueryModalOpen" class="border-border bg-muted/30 overflow-hidden rounded-xl border transition-all">
      <div class="border-border bg-card flex items-center justify-between border-b px-4 py-2.5">
        <div class="flex items-center gap-2">
          <Terminal class="text-primary size-4" />
          <span class="text-foreground font-mono text-xs font-semibold"
            >Snowflake SQL Console · Interactive Query Runner</span
          >
          <Badge variant="outline" class="font-mono text-xs">Snowflake XS Warehouse</Badge>
        </div>
        <div class="flex items-center gap-2">
          <Button variant="ghost" size="sm" class="h-7 text-xs" @click="copyCompiledSQL">
            <Check v-if="copiedQuery" class="size-3 text-emerald-500" />
            <Copy v-else class="size-3" />
            <span>{{ copiedQuery ? 'Copied' : 'Copy SQL' }}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            class="size-7 p-0"
            aria-label="Close query modal"
            @click="isQueryModalOpen = false"
          >
            <X class="size-4" />
          </Button>
        </div>
      </div>
      <div class="space-y-3 p-4">
        <div
          class="overflow-x-auto rounded-lg bg-neutral-950 p-3 font-mono text-xs text-neutral-100 dark:bg-neutral-950"
        >
          <pre class="leading-relaxed whitespace-pre"><code>SELECT
  month_id,
  gross_revenue,
  net_arr,
  churned_mrr,
  active_subscriptions
FROM production_dw.analytics.fct_monthly_financials
ORDER BY month_id DESC
LIMIT 5;</code></pre>
        </div>
        <!-- Query Results Preview -->
        <div class="border-border bg-card overflow-hidden rounded-lg border">
          <div class="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow class="bg-muted/50 hover:bg-muted/50">
                  <TableHead class="font-mono text-xs">month_id (varchar)</TableHead>
                  <TableHead class="text-right font-mono text-xs">gross_revenue (decimal)</TableHead>
                  <TableHead class="text-right font-mono text-xs">net_arr (decimal)</TableHead>
                  <TableHead class="text-right font-mono text-xs">churned_mrr (decimal)</TableHead>
                  <TableHead class="text-right font-mono text-xs">active_subscriptions (int)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow class="font-mono text-xs">
                  <TableCell class="font-semibold text-amber-500">2026-03</TableCell>
                  <TableCell class="text-right">$1,842,500.00</TableCell>
                  <TableCell class="text-right font-medium text-emerald-600 dark:text-emerald-400"
                    >$14,680,240.00</TableCell
                  >
                  <TableCell class="text-right text-rose-500">-$12,450.00</TableCell>
                  <TableCell class="text-right">3,842</TableCell>
                </TableRow>
                <TableRow class="font-mono text-xs">
                  <TableCell class="font-semibold text-amber-500">2026-02</TableCell>
                  <TableCell class="text-right">$1,798,200.00</TableCell>
                  <TableCell class="text-right font-medium text-emerald-600 dark:text-emerald-400"
                    >$14,350,100.00</TableCell
                  >
                  <TableCell class="text-right text-rose-500">-$14,100.00</TableCell>
                  <TableCell class="text-right">3,780</TableCell>
                </TableRow>
                <TableRow class="font-mono text-xs">
                  <TableCell class="font-semibold text-amber-500">2026-01</TableCell>
                  <TableCell class="text-right">$1,720,000.00</TableCell>
                  <TableCell class="text-right font-medium text-emerald-600 dark:text-emerald-400"
                    >$13,920,400.00</TableCell
                  >
                  <TableCell class="text-right text-rose-500">-$9,800.00</TableCell>
                  <TableCell class="text-right">3,712</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>

    <!-- 3-Column Lineage Pipeline Map Section -->
    <section class="border-border bg-card/40 space-y-4 rounded-xl border p-4 sm:p-5">
      <div class="border-border/80 flex flex-col gap-2 border-b pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-0.5">
          <div class="flex items-center gap-2">
            <Workflow class="text-primary size-4" />
            <h2 class="text-foreground text-sm font-semibold tracking-tight">End-to-End Data Lineage Graph</h2>
            <Badge variant="secondary" class="font-mono text-xs">DAG Depth: 3 Tiers</Badge>
          </div>
          <p class="text-muted-foreground text-xs">
            Interactive trace of upstream ingest sources, dbt intermediate transformations, and active downstream BI
            consumers.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <div class="border-border bg-background inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs">
            <span class="size-2 rounded-full bg-emerald-500" />
            <span class="text-muted-foreground">Pipeline State:</span>
            <span class="text-foreground font-medium">All 3 Tiers Fresh</span>
          </div>
        </div>
      </div>

      <!-- 3-Column Pipeline Map Grid -->
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <!-- COLUMN 1: Source Tables (Left 1/3) -->
        <div class="space-y-3">
          <div class="flex items-center justify-between px-1">
            <div class="flex items-center gap-1.5">
              <Database class="text-muted-foreground size-3.5" />
              <span class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                1. Source Tables (3)
              </span>
            </div>
            <Badge variant="outline" class="font-mono text-xs">Upstream Raw</Badge>
          </div>

          <div class="space-y-2.5">
            <button
              v-for="source in sourceNodes"
              :key="source.id"
              type="button"
              :class="
                cn(
                  'group focus-visible:ring-ring relative w-full cursor-pointer rounded-lg border p-3 text-left text-xs shadow-xs transition-all focus-visible:ring-2 focus-visible:outline-none',
                  selectedNodeId === source.id
                    ? 'border-primary bg-primary/5 ring-primary/30 ring-1'
                    : 'border-border bg-card hover:border-border/80 hover:bg-muted/40',
                )
              "
              :aria-pressed="selectedNodeId === source.id"
              @click="selectedNodeId = source.id"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-2">
                  <div
                    class="bg-muted text-foreground border-border/60 flex size-7 shrink-0 items-center justify-center rounded-md border"
                  >
                    <CreditCard v-if="source.iconName === 'CreditCard'" class="size-3.5 text-indigo-500" />
                    <Users v-else-if="source.iconName === 'Users'" class="size-3.5 text-sky-500" />
                    <Landmark v-else class="size-3.5 text-amber-500" />
                  </div>
                  <div class="min-w-0">
                    <span class="text-foreground block truncate font-mono font-semibold">{{ source.name }}</span>
                    <span class="text-muted-foreground text-xs">{{ source.connector }}</span>
                  </div>
                </div>
                <Badge
                  class="shrink-0 border-emerald-500/20 bg-emerald-500/10 font-mono text-xs text-emerald-700 dark:text-emerald-300"
                >
                  {{ source.status }}
                </Badge>
              </div>

              <div
                class="border-border/50 text-muted-foreground mt-2.5 flex items-center justify-between border-t pt-2"
              >
                <span class="font-mono">{{ source.rowCount }}</span>
                <span class="flex items-center gap-1 font-mono">
                  <Clock class="size-3" />
                  {{ source.latency }}
                </span>
              </div>
            </button>
          </div>
        </div>

        <!-- COLUMN 2: Transform Models (Center 1/3) -->
        <div class="space-y-3">
          <div class="flex items-center justify-between px-1">
            <div class="flex items-center gap-1.5">
              <Layers class="text-muted-foreground size-3.5" />
              <span class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                2. Transform Models (2)
              </span>
            </div>
            <Badge variant="outline" class="font-mono text-xs">dbt Models</Badge>
          </div>

          <div class="space-y-2.5">
            <button
              v-for="transform in transformNodes"
              :key="transform.id"
              type="button"
              :class="
                cn(
                  'group focus-visible:ring-ring relative w-full cursor-pointer rounded-lg border p-3 text-left text-xs shadow-xs transition-all focus-visible:ring-2 focus-visible:outline-none',
                  selectedNodeId === transform.id
                    ? 'border-primary bg-primary/5 ring-primary/30 ring-1'
                    : 'border-border bg-card hover:border-border/80 hover:bg-muted/40',
                )
              "
              :aria-pressed="selectedNodeId === transform.id"
              @click="selectedNodeId = transform.id"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-2">
                  <div
                    class="bg-primary/10 text-primary border-primary/20 flex size-7 shrink-0 items-center justify-center rounded-md border"
                  >
                    <Layers v-if="transform.iconName === 'Layers'" class="size-3.5" />
                    <Coins v-else class="size-3.5" />
                  </div>
                  <div class="min-w-0">
                    <span class="text-foreground block truncate font-mono font-semibold">{{ transform.name }}</span>
                    <span class="text-muted-foreground text-xs">{{ transform.modelType }}</span>
                  </div>
                </div>
                <Badge variant="secondary" class="shrink-0 font-mono text-xs">
                  {{ transform.runtime }}
                </Badge>
              </div>

              <div
                class="border-border/50 text-muted-foreground mt-2.5 flex items-center justify-between border-t pt-2"
              >
                <span class="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 class="size-3" />
                  {{ transform.testsPassed }}
                </span>
                <span class="font-mono">{{ transform.lastRun }}</span>
              </div>
            </button>
          </div>
        </div>

        <!-- COLUMN 3: Downstream Consumers & Active Target (Right 1/3) -->
        <div class="space-y-3">
          <div class="flex items-center justify-between px-1">
            <div class="flex items-center gap-1.5">
              <BarChart3 class="text-muted-foreground size-3.5" />
              <span class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                3. Downstream & Target
              </span>
            </div>
            <Badge variant="outline" class="font-mono text-xs">Marts & Consumers</Badge>
          </div>

          <div class="space-y-2.5">
            <!-- Active Target Node Highlight -->
            <button
              type="button"
              :class="
                cn(
                  'focus-visible:ring-ring relative w-full cursor-pointer rounded-lg border-2 p-3 text-left text-xs shadow-xs transition-all focus-visible:ring-2 focus-visible:outline-none',
                  selectedNodeId === 'target-table'
                    ? 'border-primary bg-primary/10 ring-primary/20 ring-2'
                    : 'border-primary/60 bg-primary/5 hover:border-primary',
                )
              "
              :aria-pressed="selectedNodeId === 'target-table'"
              @click="selectedNodeId = 'target-table'"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-2">
                  <div
                    class="bg-primary text-primary-foreground flex size-7 shrink-0 items-center justify-center rounded-md"
                  >
                    <Sparkles class="size-3.5" />
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-1.5">
                      <span class="text-foreground truncate font-mono font-bold">fct_monthly_financials</span>
                    </div>
                    <span class="text-primary text-xs font-medium">Active Catalog Target</span>
                  </div>
                </div>
                <Badge class="bg-primary text-primary-foreground shrink-0 text-xs font-medium"> Current </Badge>
              </div>
            </button>

            <!-- Downstream Consumers -->
            <button
              v-for="consumer in consumerNodes"
              :key="consumer.id"
              type="button"
              :class="
                cn(
                  'group focus-visible:ring-ring relative w-full cursor-pointer rounded-lg border p-3 text-left text-xs shadow-xs transition-all focus-visible:ring-2 focus-visible:outline-none',
                  selectedNodeId === consumer.id
                    ? 'border-primary bg-primary/5 ring-primary/30 ring-1'
                    : 'border-border bg-card hover:border-border/80 hover:bg-muted/40',
                )
              "
              :aria-pressed="selectedNodeId === consumer.id"
              @click="selectedNodeId = consumer.id"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-2">
                  <div
                    class="bg-muted text-foreground border-border/60 flex size-7 shrink-0 items-center justify-center rounded-md border"
                  >
                    <BarChart3 v-if="consumer.iconName === 'BarChart3'" class="size-3.5 text-blue-500" />
                    <ArrowRightLeft
                      v-else-if="consumer.iconName === 'ArrowRightLeft'"
                      class="size-3.5 text-purple-500"
                    />
                    <LineChart v-else class="size-3.5 text-emerald-500" />
                  </div>
                  <div class="min-w-0">
                    <span class="text-foreground block truncate font-medium">{{ consumer.name }}</span>
                    <span class="text-muted-foreground text-xs">{{ consumer.category }} · {{ consumer.tool }}</span>
                  </div>
                </div>
                <Badge variant="secondary" class="shrink-0 text-xs">
                  {{ consumer.status }}
                </Badge>
              </div>

              <div
                class="border-border/50 text-muted-foreground mt-2.5 flex items-center justify-between border-t pt-2"
              >
                <span class="truncate">{{ consumer.audience }}</span>
                <span class="shrink-0 font-mono text-xs">{{ consumer.frequency }}</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Interactive Node Inspector Drawer / Card -->
      <div v-if="selectedNodeDetails" class="border-border/80 bg-muted/40 rounded-lg border p-3.5 text-xs">
        <div class="border-border/60 flex flex-col gap-2 border-b pb-2 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-2">
            <span class="text-foreground font-mono font-bold">{{ selectedNodeDetails.title }}</span>
            <Badge variant="outline" class="font-mono text-xs">{{ selectedNodeDetails.badge }}</Badge>
          </div>
          <span class="text-muted-foreground text-xs">Node Inspector</span>
        </div>
        <p class="text-muted-foreground mt-2">{{ selectedNodeDetails.description }}</p>
        <div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div
            v-for="item in selectedNodeDetails.metadata"
            :key="item.label"
            class="border-border/60 bg-card rounded-md border px-2.5 py-1.5"
          >
            <span class="text-muted-foreground block text-xs">{{ item.label }}:</span>
            <span class="text-foreground block truncate font-mono font-medium">{{ item.value }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Table Schema, Quality Tests & Governance Tabs -->
    <Tabs v-model="activeTab" default-value="schema" class="w-full">
      <TabsList class="grid h-10 w-full grid-cols-2 p-1 sm:grid-cols-4">
        <TabsTrigger value="schema" class="gap-1.5 text-xs">
          <Table2 class="size-3.5" />
          <span>Schema & Columns</span>
          <span class="bg-muted rounded-full px-1.5 font-mono text-xs">{{ columns.length }}</span>
        </TabsTrigger>

        <TabsTrigger value="tests" class="gap-1.5 text-xs">
          <ShieldCheck class="size-3.5 text-emerald-500" />
          <span>Quality Tests</span>
          <span
            class="rounded-full bg-emerald-500/10 px-1.5 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400"
          >
            6/6
          </span>
        </TabsTrigger>

        <TabsTrigger value="sql" class="gap-1.5 text-xs">
          <FileCode2 class="size-3.5" />
          <span>dbt Model SQL</span>
        </TabsTrigger>

        <TabsTrigger value="governance" class="gap-1.5 text-xs">
          <Activity class="size-3.5" />
          <span>SLA & Governance</span>
        </TabsTrigger>
      </TabsList>

      <!-- TAB 1: Schema & Column Definitions -->
      <TabsContent value="schema" class="mt-4 space-y-4">
        <!-- Controls Bar -->
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div class="relative w-full sm:w-72">
            <Search class="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
            <Input v-model="searchQuery" placeholder="Search columns, types, or terms..." class="h-8.5 pl-8 text-xs" />
          </div>

          <div class="flex items-center gap-2">
            <div class="text-muted-foreground text-xs">
              Showing <span class="text-foreground font-mono font-medium">{{ filteredColumns.length }}</span> of
              {{ columns.length }} columns
            </div>
            <Button
              variant="outline"
              size="sm"
              class="h-8.5 gap-1.5 text-xs"
              @click="copyRef(columns.map((c) => c.name).join(', '))"
            >
              <Copy class="size-3.5" />
              <span>Copy Columns</span>
            </Button>
          </div>
        </div>

        <!-- Columns Table Card -->
        <Card class="border-border overflow-hidden border shadow-none">
          <div class="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow class="bg-muted/40 hover:bg-muted/40">
                  <TableHead class="text-xs font-semibold">Column Name</TableHead>
                  <TableHead class="text-xs font-semibold">Data Type</TableHead>
                  <TableHead class="text-xs font-semibold">Nullability</TableHead>
                  <TableHead class="text-xs font-semibold">Key / Constraint</TableHead>
                  <TableHead class="text-xs font-semibold">Sample Value</TableHead>
                  <TableHead class="text-xs font-semibold">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="col in filteredColumns" :key="col.name" class="text-xs">
                  <TableCell class="font-mono font-medium">
                    <div class="flex items-center gap-1.5">
                      <Key v-if="col.isPrimaryKey" class="size-3.5 shrink-0 text-amber-500" />
                      <span :class="cn(col.isPrimaryKey && 'font-bold text-amber-600 dark:text-amber-400')">
                        {{ col.name }}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary" class="font-mono text-xs font-normal">
                      {{ col.type }}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <Badge
                      v-if="!col.nullable"
                      variant="outline"
                      class="text-muted-foreground font-mono text-xs font-normal"
                    >
                      NOT NULL
                    </Badge>
                    <span v-else class="text-muted-foreground font-mono">NULLABLE</span>
                  </TableCell>

                  <TableCell>
                    <div class="flex flex-wrap items-center gap-1">
                      <Badge
                        v-if="col.isPrimaryKey"
                        class="border-amber-500/30 bg-amber-500/15 text-xs font-semibold text-amber-700 dark:text-amber-300"
                      >
                        PRIMARY KEY
                      </Badge>
                      <Badge v-else-if="col.constraints" variant="secondary" class="font-mono text-xs">
                        {{ col.constraints }}
                      </Badge>
                      <span v-else class="text-muted-foreground">—</span>
                    </div>
                  </TableCell>

                  <TableCell class="text-muted-foreground font-mono">
                    {{ col.sampleValue }}
                  </TableCell>

                  <TableCell class="text-muted-foreground max-w-sm">
                    {{ col.description }}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </Card>

        <!-- Summary Stat Cards -->
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div class="border-border bg-card space-y-1 rounded-lg border p-3 text-xs">
            <span class="text-muted-foreground">Total Schema Columns</span>
            <span class="text-foreground block font-mono text-base font-bold">5</span>
            <span class="text-muted-foreground text-xs">1 Primary Key, 4 Measures</span>
          </div>

          <div class="border-border bg-card space-y-1 rounded-lg border p-3 text-xs">
            <span class="text-muted-foreground">Completeness Score</span>
            <span class="block font-mono text-base font-bold text-emerald-600 dark:text-emerald-400">97.5%</span>
            <span class="text-muted-foreground text-xs">4/5 Non-Nullable fields</span>
          </div>

          <div class="border-border bg-card space-y-1 rounded-lg border p-3 text-xs">
            <span class="text-muted-foreground">Table Storage Volume</span>
            <span class="text-foreground block font-mono text-base font-bold">48.6 MB</span>
            <span class="text-muted-foreground text-xs">Micro-partition compressed</span>
          </div>

          <div class="border-border bg-card space-y-1 rounded-lg border p-3 text-xs">
            <span class="text-muted-foreground">Governance Tier</span>
            <span class="text-primary block font-mono text-base font-bold">Gold Tier 1</span>
            <span class="text-muted-foreground text-xs">Certified Financial Source</span>
          </div>
        </div>
      </TabsContent>

      <!-- TAB 2: Data Quality Tests Card (6 Passing Assertions) -->
      <TabsContent value="tests" class="mt-4 space-y-4">
        <!-- Quality Health Summary Card -->
        <Card class="border-border bg-card overflow-hidden border shadow-none">
          <CardHeader class="border-border/80 border-b p-4 sm:p-5">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <ShieldCheck class="size-5 text-emerald-500" />
                  <CardTitle class="text-base font-semibold">Data Quality & Integrity Assertions</CardTitle>
                  <Badge
                    class="border-emerald-500/20 bg-emerald-500/10 font-mono text-xs text-emerald-700 dark:text-emerald-300"
                  >
                    100% Passing (6/6)
                  </Badge>
                </div>
                <CardDescription class="text-xs">
                  Automated dbt-expectations, Monte Carlo ML anomaly detection, and referential integrity test suite.
                </CardDescription>
              </div>

              <Button
                variant="outline"
                size="sm"
                class="h-8.5 shrink-0 gap-1.5 self-start text-xs sm:self-auto"
                :disabled="isRunningTests"
                @click="runSimulatedTests"
              >
                <RefreshCw :class="cn('size-3.5', isRunningTests && 'text-primary animate-spin')" />
                <span>{{ isRunningTests ? 'Running 6 Tests...' : 'Re-run Test Suite' }}</span>
              </Button>
            </div>
          </CardHeader>

          <CardContent class="space-y-4 p-4 sm:p-5">
            <!-- Filter Pills -->
            <div class="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                :class="cn('h-7 text-xs', filterSeverity === 'all' && 'bg-muted font-semibold')"
                @click="filterSeverity = 'all'"
              >
                All Assertions (6)
              </Button>
              <Button
                variant="outline"
                size="sm"
                :class="cn('h-7 text-xs', filterSeverity === 'critical' && 'bg-muted font-semibold')"
                @click="filterSeverity = 'critical'"
              >
                Primary Key & Referential (2)
              </Button>
              <Button
                variant="outline"
                size="sm"
                :class="cn('h-7 text-xs', filterSeverity === 'schema' && 'bg-muted font-semibold')"
                @click="filterSeverity = 'schema'"
              >
                Format & Completeness (2)
              </Button>
            </div>

            <!-- Assertions List -->
            <div class="space-y-2.5">
              <div
                v-for="assertion in filteredQualityTests"
                :key="assertion.id"
                class="border-border bg-muted/20 hover:bg-muted/40 rounded-lg border p-3.5 transition-colors"
              >
                <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div class="flex items-start gap-2.5">
                    <div
                      class="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    >
                      <Check class="size-3.5" />
                    </div>
                    <div class="space-y-1">
                      <div class="flex flex-wrap items-center gap-2">
                        <span class="text-foreground font-mono text-xs font-bold">{{ assertion.name }}</span>
                        <Badge variant="secondary" class="font-mono text-xs">{{ assertion.type }}</Badge>
                        <span class="text-muted-foreground text-xs"
                          >target: <code class="text-foreground font-mono">{{ assertion.targetColumn }}</code></span
                        >
                      </div>
                      <p class="text-muted-foreground text-xs">{{ assertion.description }}</p>
                      <div
                        class="text-muted-foreground bg-background/80 border-border/50 inline-block rounded border px-2 py-0.5 font-mono text-xs"
                      >
                        {{ assertion.ruleDefinition }}
                      </div>
                    </div>
                  </div>

                  <div class="flex shrink-0 items-center gap-3 self-end text-xs sm:self-center">
                    <div class="text-right">
                      <span class="text-muted-foreground block text-xs">Duration</span>
                      <span class="text-foreground font-mono font-medium">{{ assertion.executionTime }}</span>
                    </div>
                    <Badge
                      class="border-emerald-500/20 bg-emerald-500/10 font-mono text-xs text-emerald-700 dark:text-emerald-300"
                    >
                      Passed
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- TAB 3: Compiled SQL / dbt Model -->
      <TabsContent value="sql" class="mt-4">
        <div class="border-border bg-muted/40 overflow-hidden rounded-xl border">
          <div class="border-border bg-card flex items-center justify-between border-b px-4 py-2.5">
            <div class="flex items-center gap-2">
              <FileCode2 class="text-primary size-4" />
              <span class="text-foreground font-mono text-xs font-semibold"
                >models/marts/finance/fct_monthly_financials.sql</span
              >
              <Badge variant="secondary" class="font-mono text-xs">dbt v1.8 Incremental</Badge>
            </div>
            <Button variant="ghost" size="sm" class="h-7 gap-1 text-xs" @click="copyCompiledSQL">
              <Check v-if="copiedQuery" class="size-3 text-emerald-500" />
              <Copy v-else class="size-3" />
              <span>{{ copiedQuery ? 'Copied Model' : 'Copy dbt Code' }}</span>
            </Button>
          </div>

          <div
            class="overflow-x-auto bg-neutral-950 p-4 font-mono text-xs leading-relaxed text-neutral-100 dark:bg-neutral-950"
          >
            <pre class="whitespace-pre"><code>{{ dbtModelSnippet }}</code></pre>
          </div>
        </div>
      </TabsContent>

      <!-- TAB 4: SLA & Governance -->
      <TabsContent value="governance" class="mt-4 space-y-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <!-- Ownership & Contacts -->
          <Card class="border-border space-y-3 border p-4 shadow-none">
            <div class="border-border/80 flex items-center gap-2 border-b pb-2">
              <Users class="text-primary size-4" />
              <h3 class="text-foreground text-sm font-semibold">Table Ownership & Escalation</h3>
            </div>
            <div class="space-y-2 text-xs">
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Owning Team:</span>
                <span class="text-foreground font-semibold">Data Platform Squad</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Technical Lead:</span>
                <span class="text-foreground font-mono">@sarah.lin (Principal Data Eng)</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Slack Channel:</span>
                <Badge variant="secondary" class="font-mono text-xs">#data-platform-alerts</Badge>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">On-Call Rotation:</span>
                <span class="text-foreground">PagerDuty · Tier 1 High Severity</span>
              </div>
            </div>
          </Card>

          <!-- Freshness SLA Target -->
          <Card class="border-border space-y-3 border p-4 shadow-none">
            <div class="border-border/80 flex items-center gap-2 border-b pb-2">
              <Clock class="size-4 text-emerald-500" />
              <h3 class="text-foreground text-sm font-semibold">Freshness SLA & Cadence</h3>
            </div>
            <div class="space-y-2 text-xs">
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Target SLA Threshold:</span>
                <span class="text-foreground font-mono font-medium">&lt; 60 minutes</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Current Latency:</span>
                <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400">18 minutes (Compliant)</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Cron Schedule:</span>
                <code class="text-foreground bg-muted rounded px-1.5 py-0.5 font-mono text-xs">0 * * * * (Hourly)</code>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted-foreground">Historical Uptime:</span>
                <span class="text-foreground font-mono font-medium">99.98% (Last 90 days)</span>
              </div>
            </div>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>

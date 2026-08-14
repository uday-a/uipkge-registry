'use client'

import * as React from 'react'
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Copy,
  Database,
  FileCode,
  GitBranch,
  HardDrive,
  Info,
  Key,
  Layers,
  Link2,
  Loader2,
  Play,
  Search,
  ShieldCheck,
  Table2,
  Tag,
  User,
  Workflow,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface ModelColumn {
  name: string
  dataType: string
  nullable: boolean
  isPrimaryKey?: boolean
  isForeignKey?: boolean
  foreignKeyRef?: string
  isClusterKey?: boolean
  tests: Array<{
    name: 'unique' | 'not_null' | 'relationships' | 'accepted_values'
    status: 'pass' | 'warn' | 'fail'
    detail?: string
  }>
  testDuration: string
  description: string
}

export interface UpstreamNode {
  id: string
  name: string
  type: 'view' | 'table' | 'source'
  package: string
  rowCount: string
  freshness: string
  freshnessStatus: 'pass' | 'warn'
  description: string
}

export interface DownstreamNode {
  id: string
  name: string
  type: 'table' | 'incremental' | 'exposure'
  package: string
  consumers: string
  sla: string
  description: string
}

export interface DbtModelGraphProps {
  className?: string
}

const modelSqlSource = `{{
  config(
    materialized = 'incremental',
    unique_key = 'order_id',
    on_schema_change = 'sync_all_columns',
    incremental_strategy = 'merge',
    cluster_by = ['order_date', 'customer_id'],
    tags = ['finance', 'core', 'daily_sla']
  )
}}

WITH payments AS (
  SELECT
    payment_id,
    order_id,
    payment_method,
    amount_usd,
    gateway_fee_usd,
    status AS payment_status,
    created_at AS payment_created_at
  FROM {{ ref('stg_stripe__payments') }}
  {% if is_incremental() %}
    WHERE updated_at >= (SELECT coalesce(max(payment_created_at), '1970-01-01') FROM {{ this }})
  {% endif %}
),

orders_source AS (
  SELECT
    order_id,
    customer_id,
    order_number,
    order_status,
    total_amount_usd,
    tax_amount_usd,
    discount_amount_usd,
    currency_code,
    order_date,
    created_at,
    updated_at
  FROM {{ ref('stg_shopify__orders') }}
  {% if is_incremental() %}
    WHERE updated_at >= (SELECT coalesce(max(updated_at), '1970-01-01') FROM {{ this }})
  {% endif %}
),

customers AS (
  SELECT
    customer_id,
    customer_tier,
    country_code,
    lifetime_order_count
  FROM {{ ref('dim_customers') }}
),

aggregated_payments AS (
  SELECT
    order_id,
    sum(case when payment_status = 'succeeded' then amount_usd else 0 end) as total_paid_usd,
    sum(gateway_fee_usd) as total_fees_usd,
    count(payment_id) as payment_attempts_count,
    max(payment_created_at) as last_payment_at
  FROM payments
  GROUP BY 1
),

final_model AS (
  SELECT
    ord.order_id,
    ord.order_number,
    ord.customer_id,
    cust.customer_tier,
    cust.country_code,
    ord.order_status,
    ord.order_date,
    ord.currency_code,
    ord.total_amount_usd,
    ord.tax_amount_usd,
    ord.discount_amount_usd,
    coalesce(pay.total_paid_usd, 0.00) as total_paid_usd,
    coalesce(pay.total_fees_usd, 0.00) as payment_fees_usd,
    round(ord.total_amount_usd - coalesce(pay.total_fees_usd, 0.00), 2) as net_revenue_usd,
    case
      when pay.total_paid_usd >= ord.total_amount_usd then 'fully_paid'
      when pay.total_paid_usd > 0 then 'partially_paid'
      else 'unpaid'
    end as payment_settlement_status,
    coalesce(pay.payment_attempts_count, 0) as payment_attempts,
    ord.created_at,
    ord.updated_at
  FROM orders_source ord
  LEFT JOIN aggregated_payments pay ON ord.order_id = pay.order_id
  LEFT JOIN customers cust ON ord.customer_id = cust.customer_id
)

SELECT * FROM final_model`

const compiledSqlSource = `-- Compiled target warehouse query: Snowflake / AWS us-east-1
-- Execution target: "ANALYTICS_PROD"."MARTS"."fct_orders"
-- Incremental Merge Strategy with cluster keys [order_date, customer_id]

MERGE INTO "ANALYTICS_PROD"."MARTS"."fct_orders" AS target
USING (
  WITH payments AS (
    SELECT
      payment_id,
      order_id,
      payment_method,
      amount_usd,
      gateway_fee_usd,
      status AS payment_status,
      created_at AS payment_created_at
    FROM "ANALYTICS_PROD"."STAGING"."stg_stripe__payments"
    WHERE updated_at >= (SELECT coalesce(max(payment_created_at), '1970-01-01') FROM "ANALYTICS_PROD"."MARTS"."fct_orders")
  ),

  orders_source AS (
    SELECT
      order_id,
      customer_id,
      order_number,
      order_status,
      total_amount_usd,
      tax_amount_usd,
      discount_amount_usd,
      currency_code,
      order_date,
      created_at,
      updated_at
    FROM "ANALYTICS_PROD"."STAGING"."stg_shopify__orders"
    WHERE updated_at >= (SELECT coalesce(max(updated_at), '1970-01-01') FROM "ANALYTICS_PROD"."MARTS"."fct_orders")
  ),

  customers AS (
    SELECT
      customer_id,
      customer_tier,
      country_code,
      lifetime_order_count
    FROM "ANALYTICS_PROD"."CORE"."dim_customers"
  ),

  aggregated_payments AS (
    SELECT
      order_id,
      sum(case when payment_status = 'succeeded' then amount_usd else 0 end) as total_paid_usd,
      sum(gateway_fee_usd) as total_fees_usd,
      count(payment_id) as payment_attempts_count,
      max(payment_created_at) as last_payment_at
    FROM payments
    GROUP BY 1
  ),

  final_model AS (
    SELECT
      ord.order_id,
      ord.order_number,
      ord.customer_id,
      cust.customer_tier,
      cust.country_code,
      ord.order_status,
      ord.order_date,
      ord.currency_code,
      ord.total_amount_usd,
      ord.tax_amount_usd,
      ord.discount_amount_usd,
      coalesce(pay.total_paid_usd, 0.00) as total_paid_usd,
      coalesce(pay.total_fees_usd, 0.00) as payment_fees_usd,
      round(ord.total_amount_usd - coalesce(pay.total_fees_usd, 0.00), 2) as net_revenue_usd,
      case
        when pay.total_paid_usd >= ord.total_amount_usd then 'fully_paid'
        when pay.total_paid_usd > 0 then 'partially_paid'
        else 'unpaid'
      end as payment_settlement_status,
      coalesce(pay.payment_attempts_count, 0) as payment_attempts,
      ord.created_at,
      ord.updated_at
    FROM orders_source ord
    LEFT JOIN aggregated_payments pay ON ord.order_id = pay.order_id
    LEFT JOIN customers cust ON ord.customer_id = cust.customer_id
  )

  SELECT * FROM final_model
) AS source
ON target.order_id = source.order_id
WHEN MATCHED THEN UPDATE SET
  order_number = source.order_number,
  customer_id = source.customer_id,
  customer_tier = source.customer_tier,
  country_code = source.country_code,
  order_status = source.order_status,
  order_date = source.order_date,
  total_amount_usd = source.total_amount_usd,
  tax_amount_usd = source.tax_amount_usd,
  discount_amount_usd = source.discount_amount_usd,
  total_paid_usd = source.total_paid_usd,
  payment_fees_usd = source.payment_fees_usd,
  net_revenue_usd = source.net_revenue_usd,
  payment_settlement_status = source.payment_settlement_status,
  payment_attempts = source.payment_attempts,
  updated_at = source.updated_at
WHEN NOT MATCHED THEN INSERT (
  order_id, order_number, customer_id, customer_tier, country_code,
  order_status, order_date, currency_code, total_amount_usd, tax_amount_usd,
  discount_amount_usd, total_paid_usd, payment_fees_usd, net_revenue_usd,
  payment_settlement_status, payment_attempts, created_at, updated_at
) VALUES (
  source.order_id, source.order_number, source.customer_id, source.customer_tier, source.country_code,
  source.order_status, source.order_date, source.currency_code, source.total_amount_usd, source.tax_amount_usd,
  source.discount_amount_usd, source.total_paid_usd, source.payment_fees_usd, source.net_revenue_usd,
  source.payment_settlement_status, source.payment_attempts, source.created_at, source.updated_at
);`

const upstreamNodes: UpstreamNode[] = [
  {
    id: 'stg_stripe__payments',
    name: 'stg_stripe__payments',
    type: 'view',
    package: 'analytics_dw.staging.stripe',
    rowCount: '1,420,800 rows',
    freshness: 'Pass · 12m ago',
    freshnessStatus: 'pass',
    description: 'Raw webhook payment charges, refunds, and gateway fee captures from Stripe API.',
  },
  {
    id: 'stg_shopify__orders',
    name: 'stg_shopify__orders',
    type: 'view',
    package: 'analytics_dw.staging.shopify',
    rowCount: '984,200 rows',
    freshness: 'Pass · 5m ago',
    freshnessStatus: 'pass',
    description: 'E-commerce transactional headers, tax summaries, discount allocations, and checkout states.',
  },
  {
    id: 'dim_customers',
    name: 'dim_customers',
    type: 'table',
    package: 'analytics_dw.core',
    rowCount: '248,500 rows',
    freshness: 'Pass · 1h ago',
    freshnessStatus: 'pass',
    description: 'Type-2 slowly changing dimension master record for authenticated customer accounts.',
  },
]

const downstreamNodes: DownstreamNode[] = [
  {
    id: 'mart_finance_mrr',
    name: 'mart_finance_mrr',
    type: 'table',
    package: 'analytics_dw.marts.finance',
    consumers: 'Finance Team & NetSuite Sync',
    sla: 'Tier 1 · Daily 06:00 UTC',
    description: 'Monthly recurring revenue waterfall and cohort retention analysis table.',
  },
  {
    id: 'mart_executive_kpis',
    name: 'mart_executive_kpis',
    type: 'table',
    package: 'analytics_dw.marts.executive',
    consumers: 'Executive Dashboard & Board Reports',
    sla: 'Tier 1 · Daily 07:00 UTC',
    description: 'High-level business health rollup metrics: GMV, net revenue, CAC payback, and refund rates.',
  },
  {
    id: 'tableau_revenue_dashboard',
    name: 'tableau_revenue_dashboard',
    type: 'exposure',
    package: 'exposures.bi.tableau',
    consumers: '120 Active BI Users',
    sla: 'Hourly Sync',
    description: 'Production executive revenue tracking workbook and daily pacing alerts.',
  },
]

const columns: ModelColumn[] = [
  {
    name: 'order_id',
    dataType: 'STRING (VARCHAR)',
    nullable: false,
    isPrimaryKey: true,
    tests: [
      { name: 'unique', status: 'pass' },
      { name: 'not_null', status: 'pass' },
    ],
    testDuration: '12.4ms',
    description: 'Surrogate primary key generated for each transactional order record.',
  },
  {
    name: 'order_number',
    dataType: 'STRING (VARCHAR)',
    nullable: false,
    tests: [
      { name: 'unique', status: 'pass' },
      { name: 'not_null', status: 'pass' },
    ],
    testDuration: '14.1ms',
    description: 'Human-readable sequential invoice reference number from checkout.',
  },
  {
    name: 'customer_id',
    dataType: 'STRING (VARCHAR)',
    nullable: false,
    isForeignKey: true,
    foreignKeyRef: 'dim_customers.customer_id',
    tests: [
      { name: 'not_null', status: 'pass' },
      { name: 'relationships', status: 'pass', detail: 'dim_customers' },
    ],
    testDuration: '28.6ms',
    description: 'Foreign key reference linking order to the verified master customer account.',
  },
  {
    name: 'customer_tier',
    dataType: 'STRING (VARCHAR)',
    nullable: true,
    tests: [
      {
        name: 'accepted_values',
        status: 'pass',
        detail: 'enterprise, pro, starter, free',
      },
    ],
    testDuration: '9.2ms',
    description: 'Customer loyalty and billing subscription tier at the time of purchase.',
  },
  {
    name: 'country_code',
    dataType: 'STRING (CHAR(2))',
    nullable: false,
    tests: [{ name: 'not_null', status: 'pass' }],
    testDuration: '8.4ms',
    description: 'ISO 3166-1 alpha-2 two-letter billing destination country code.',
  },
  {
    name: 'order_status',
    dataType: 'STRING (VARCHAR)',
    nullable: false,
    tests: [
      {
        name: 'accepted_values',
        status: 'pass',
        detail: 'completed, processing, shipped, cancelled, refunded',
      },
      { name: 'not_null', status: 'pass' },
    ],
    testDuration: '15.3ms',
    description: 'Current order fulfillment and delivery lifecycle state.',
  },
  {
    name: 'order_date',
    dataType: 'DATE',
    nullable: false,
    isClusterKey: true,
    tests: [{ name: 'not_null', status: 'pass' }],
    testDuration: '7.9ms',
    description: 'Calendar transaction date used as primary cluster and pruning key.',
  },
  {
    name: 'currency_code',
    dataType: 'STRING (CHAR(3))',
    nullable: false,
    tests: [
      {
        name: 'accepted_values',
        status: 'pass',
        detail: 'USD, EUR, GBP, CAD',
      },
    ],
    testDuration: '6.8ms',
    description: 'ISO 4217 three-letter currency code in which the charge was denominated.',
  },
  {
    name: 'total_amount_usd',
    dataType: 'DECIMAL(12,2)',
    nullable: false,
    tests: [{ name: 'not_null', status: 'pass' }],
    testDuration: '10.1ms',
    description: 'Gross order amount in base USD currency including tax and discounts.',
  },
  {
    name: 'tax_amount_usd',
    dataType: 'DECIMAL(10,2)',
    nullable: false,
    tests: [{ name: 'not_null', status: 'pass' }],
    testDuration: '9.0ms',
    description: 'Total sales tax and VAT amount captured for remittance.',
  },
  {
    name: 'discount_amount_usd',
    dataType: 'DECIMAL(10,2)',
    nullable: false,
    tests: [{ name: 'not_null', status: 'pass' }],
    testDuration: '8.1ms',
    description: 'Promotional discount and coupon deductions applied at checkout.',
  },
  {
    name: 'total_paid_usd',
    dataType: 'DECIMAL(12,2)',
    nullable: false,
    tests: [{ name: 'not_null', status: 'pass' }],
    testDuration: '11.3ms',
    description: 'Sum of all verified cleared customer payments from Stripe ledger.',
  },
  {
    name: 'payment_fees_usd',
    dataType: 'DECIMAL(10,2)',
    nullable: false,
    tests: [{ name: 'not_null', status: 'pass' }],
    testDuration: '9.8ms',
    description: 'Merchant interchange and gateway transaction processing fees.',
  },
  {
    name: 'net_revenue_usd',
    dataType: 'DECIMAL(12,2)',
    nullable: false,
    tests: [{ name: 'not_null', status: 'pass' }],
    testDuration: '10.5ms',
    description: 'Net recognized revenue after deducting gateway processing fees.',
  },
  {
    name: 'payment_settlement_status',
    dataType: 'STRING (VARCHAR)',
    nullable: false,
    tests: [
      {
        name: 'accepted_values',
        status: 'pass',
        detail: 'fully_paid, partially_paid, unpaid',
      },
      { name: 'not_null', status: 'pass' },
    ],
    testDuration: '8.7ms',
    description: 'Payment clearing and reconciliation flag calculated against order total.',
  },
  {
    name: 'payment_attempts',
    dataType: 'INTEGER',
    nullable: false,
    tests: [{ name: 'not_null', status: 'pass' }],
    testDuration: '6.2ms',
    description: 'Number of authorization attempts recorded in the payment gateway.',
  },
  {
    name: 'created_at',
    dataType: 'TIMESTAMP_TZ',
    nullable: false,
    tests: [{ name: 'not_null', status: 'pass' }],
    testDuration: '8.0ms',
    description: 'Initial order creation timestamp in UTC timezone.',
  },
  {
    name: 'updated_at',
    dataType: 'TIMESTAMP_TZ',
    nullable: false,
    tests: [{ name: 'not_null', status: 'pass' }],
    testDuration: '8.3ms',
    description: 'Last modified timestamp used as incremental watermark boundary.',
  },
]

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function highlightJinjaSqlLine(line: string): string {
  if (!line) return ''
  const escaped = escapeHtml(line)

  // Comments
  if (escaped.trim().startsWith('--') || escaped.trim().startsWith('{#')) {
    return `<span class="text-muted-foreground/60 italic">${escaped}</span>`
  }

  // Highlight Jinja tags: {{ ... }} and {% ... %}
  let result = escaped.replace(/(\{\{[\s\S]*?\}\}|\{%[\s\S]*?%\})/g, (jinjaMatch) => {
    const inner = jinjaMatch
      .replace(
        /\b(config|ref|source|is_incremental|this|var|materialized|unique_key|on_schema_change|incremental_strategy|cluster_by|tags)\b/g,
        '<span class="text-amber-500 dark:text-amber-400 font-semibold">$1</span>',
      )
      .replace(/(\{\{|\}\}|\{%|%\})/g, '<span class="text-violet-500 dark:text-violet-400 font-bold">$1</span>')
    return `<span class="bg-violet-500/10 px-1 py-0.5 rounded text-violet-600 dark:text-violet-300">${inner}</span>`
  })

  // SQL Keywords
  result = result.replace(
    /\b(WITH|SELECT|FROM|JOIN|LEFT JOIN|INNER JOIN|RIGHT JOIN|FULL JOIN|ON|WHERE|GROUP BY|ORDER BY|AND|OR|NOT|AS|CASE|WHEN|THEN|ELSE|END|MERGE INTO|USING|WHEN MATCHED|WHEN NOT MATCHED|INSERT|UPDATE|SET|VALUES|OVER|PARTITION BY)\b/g,
    '<span class="text-sky-600 dark:text-sky-400 font-semibold">$1</span>',
  )

  // SQL Functions
  result = result.replace(
    /\b(coalesce|sum|count|max|min|avg|round|cast|date_trunc|concat)\b/gi,
    '<span class="text-indigo-600 dark:text-indigo-400 font-medium">$1</span>',
  )

  // Strings
  result = result.replace(/(&#039;[^&#039;]*&#039;)/g, '<span class="text-emerald-600 dark:text-emerald-400">$1</span>')

  return result
}

function highlightCompiledSqlLine(line: string): string {
  if (!line) return ''
  const escaped = escapeHtml(line)

  // Comments
  if (escaped.trim().startsWith('--')) {
    return `<span class="text-muted-foreground/60 italic">${escaped}</span>`
  }

  let result = escaped.replace(
    /\b(MERGE INTO|USING|WHEN MATCHED|WHEN NOT MATCHED|THEN UPDATE SET|THEN INSERT|VALUES|WITH|SELECT|FROM|LEFT JOIN|INNER JOIN|RIGHT JOIN|JOIN|ON|WHERE|GROUP BY|ORDER BY|AND|OR|NOT|AS|CASE|WHEN|THEN|ELSE|END)\b/g,
    '<span class="text-sky-600 dark:text-sky-400 font-semibold">$1</span>',
  )

  result = result.replace(
    /\b(coalesce|sum|count|max|min|avg|round|cast)\b/gi,
    '<span class="text-indigo-600 dark:text-indigo-400 font-medium">$1</span>',
  )

  // Identifiers in quotes
  result = result.replace(
    /(&quot;[A-Z0-9_]+&quot;)/g,
    '<span class="text-amber-600 dark:text-amber-400 font-medium">$1</span>',
  )

  // Strings
  result = result.replace(/(&#039;[^&#039;]*&#039;)/g, '<span class="text-emerald-600 dark:text-emerald-400">$1</span>')

  return result
}

export function DbtModelGraph({ className }: DbtModelGraphProps) {
  const [activeTab, setActiveTab] = React.useState('model-sql')
  const [columnSearch, setColumnSearch] = React.useState('')
  const [isBuilding, setIsBuilding] = React.useState(false)
  const [isTesting, setIsTesting] = React.useState(false)
  const [copiedRef, setCopiedRef] = React.useState(false)
  const dbtMacroRef = "{{ ref('fct_orders') }}"
  const [copiedSql, setCopiedSql] = React.useState(false)
  const [copiedCompiled, setCopiedCompiled] = React.useState(false)
  const [buildStatusText, setBuildStatusText] = React.useState('Success · Built in 14.2s')
  const [lastBuildTime, setLastBuildTime] = React.useState('12 mins ago')
  const [selectedNodeId, setSelectedNodeId] = React.useState('fct_orders')

  const modelSqlLines = React.useMemo(() => modelSqlSource.split('\n'), [])
  const compiledSqlLines = React.useMemo(() => compiledSqlSource.split('\n'), [])

  const filteredColumns = React.useMemo(() => {
    const query = columnSearch.trim().toLowerCase()
    if (!query) return columns
    return columns.filter(
      (col) =>
        col.name.toLowerCase().includes(query) ||
        col.dataType.toLowerCase().includes(query) ||
        col.description.toLowerCase().includes(query) ||
        col.tests.some(
          (t) => t.name.toLowerCase().includes(query) || (t.detail && t.detail.toLowerCase().includes(query)),
        ),
    )
  }, [columnSearch])

  const passingTestsCount = React.useMemo(() => {
    return columns.reduce((acc, col) => acc + col.tests.filter((t) => t.status === 'pass').length, 0)
  }, [])

  const handleBuildModel = React.useCallback(() => {
    if (isBuilding) return
    setIsBuilding(true)
    setTimeout(() => {
      setIsBuilding(false)
      setBuildStatusText('Success · Built in 14.2s (Just now)')
      setLastBuildTime('Just now')
    }, 1200)
  }, [isBuilding])

  const handleTestModel = React.useCallback(() => {
    if (isTesting) return
    setIsTesting(true)
    setTimeout(() => {
      setIsTesting(false)
    }, 900)
  }, [isTesting])

  const copyModelRef = React.useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText("{{ ref('fct_orders') }}")
      setCopiedRef(true)
      setTimeout(() => {
        setCopiedRef(false)
      }, 2000)
    }
  }, [])

  const copySourceSql = React.useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(modelSqlSource)
      setCopiedSql(true)
      setTimeout(() => {
        setCopiedSql(false)
      }, 2000)
    }
  }, [])

  const copyCompiledSql = React.useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(compiledSqlSource)
      setCopiedCompiled(true)
      setTimeout(() => {
        setCopiedCompiled(false)
      }, 2000)
    }
  }, [])

  return (
    <div
      data-slot="dbt-model-graph"
      className={cn(
        'bg-background text-foreground border-border flex w-full flex-col overflow-hidden rounded-xl border shadow-xs',
        className,
      )}
    >
      {/* TOP HEADER */}
      <header className="border-border bg-card/70 border-b px-4 py-3 sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: Model Identity & Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg shadow-xs">
              <Workflow className="size-4" />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 font-mono text-sm font-semibold tracking-tight">
                <span className="text-muted-foreground font-normal">model.analytics.</span>
                <span className="text-foreground">fct_orders</span>
              </div>

              {/* Copy ref pill */}
              <button
                type="button"
                className="border-border bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted inline-flex min-h-6 items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-xs transition-colors"
                title="Copy dbt ref() macro"
                onClick={copyModelRef}
              >
                {copiedRef ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                <span>{copiedRef ? 'Copied Ref!' : dbtMacroRef}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {/* Materialization Badge */}
              <Badge wrap variant="outline" className="gap-1 font-mono text-xs font-normal">
                <Layers className="size-3 text-sky-500" />
                Table · Incremental
              </Badge>

              {/* dbt Package Badge */}
              <Badge wrap variant="secondary" className="font-mono text-xs font-normal">
                analytics_dw v1.8
              </Badge>

              {/* Build Status Badge */}
              <Badge
                wrap
                variant="outline"
                className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400"
              >
                <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                {buildStatusText}
              </Badge>
            </div>
          </div>

          {/* Right: Primary & Secondary Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs font-medium"
              disabled={isTesting}
              onClick={handleTestModel}
            >
              {isTesting ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="size-3.5 text-emerald-500" />
              )}
              {isTesting ? 'Running 7 Tests...' : 'Test Model (dbt test)'}
            </Button>

            <Button
              variant="default"
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 gap-1.5 text-xs font-semibold shadow-xs"
              disabled={isBuilding}
              onClick={handleBuildModel}
            >
              {isBuilding ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5 fill-current" />}
              {isBuilding ? 'Building (dbt run)...' : 'Build Model (dbt run)'}
            </Button>
          </div>
        </div>

        {/* Secondary Metadata Strip */}
        <div className="border-border/60 text-muted-foreground mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t pt-2.5 font-mono text-xs">
          <div className="flex items-center gap-1.5">
            <Database className="size-3 text-sky-500" />
            <span>Warehouse:</span>
            <span className="text-foreground font-medium">Snowflake PROD_WH (XS)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HardDrive className="size-3 text-amber-500" />
            <span>Target Schema:</span>
            <span className="text-foreground font-medium">ANALYTICS_PROD.MARTS</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="text-muted-foreground size-3" />
            <span>Last Built:</span>
            <span className="text-foreground">{lastBuildTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="size-3 text-emerald-500" />
            <span>Contract Tests:</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">7/7 Passing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Table2 className="size-3 text-violet-500" />
            <span>Row Count:</span>
            <span className="text-foreground">2,840,190 rows</span>
          </div>
        </div>
      </header>

      {/* 2-COLUMN MODEL STUDIO LAYOUT */}
      <div className="divide-border grid flex-1 grid-cols-1 divide-y lg:grid-cols-12 lg:divide-x lg:divide-y-0">
        {/* LEFT PANEL: METADATA & DAG LINEAGE (lg:col-span-5) */}
        <aside className="bg-muted/15 flex flex-col space-y-4 p-4 sm:p-5 lg:col-span-5">
          {/* Interactive Lineage DAG Card */}
          <Card className="border-border bg-card overflow-hidden border p-3.5 shadow-none">
            <div className="flex flex-wrap items-center justify-between pb-2.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <GitBranch className="text-primary size-3.5" />
                <span>DAG Lineage Dependency Graph</span>
              </div>
              <Badge wrap variant="secondary" className="font-mono text-xs font-normal">
                -1 Upstream · +1 Downstream
              </Badge>
            </div>

            {/* Visual DAG Node Canvas */}
            <div className="border-border/70 bg-muted/30 relative rounded-lg border p-3">
              <div className="grid grid-cols-3 items-center gap-2 text-xs">
                {/* Upstream Column (3 Nodes) */}
                <div className="space-y-1.5">
                  <span className="text-muted-foreground block text-center font-mono text-xs font-medium">
                    Upstream (3)
                  </span>
                  {upstreamNodes.map((node) => (
                    <button
                      key={node.id}
                      type="button"
                      className={cn(
                        'focus-visible:ring-ring flex w-full cursor-pointer flex-col rounded-md border p-1.5 text-left transition-all focus-visible:ring-2 focus-visible:outline-none',
                        selectedNodeId === node.id
                          ? 'border-primary bg-primary/10 text-primary shadow-xs'
                          : 'border-border bg-background hover:bg-muted/80 text-foreground',
                      )}
                      aria-pressed={selectedNodeId === node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                    >
                      <div className="flex flex-wrap items-center justify-between">
                        <span className="truncate font-mono text-xs font-medium">{node.name}</span>
                      </div>
                      <div className="text-muted-foreground flex flex-wrap items-center justify-between pt-0.5 font-mono text-xs">
                        <span className="uppercase">{node.type}</span>
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                      </div>
                    </button>
                  ))}
                </div>

                {/* Center Current Node */}
                <div className="flex flex-col items-center justify-center space-y-1 px-1">
                  <span className="text-primary font-mono text-xs font-semibold">Current Model</span>
                  <button
                    type="button"
                    className={cn(
                      'border-primary bg-primary/10 ring-primary/20 focus-visible:ring-ring flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 p-2.5 text-center shadow-xs ring-2 focus-visible:ring-2 focus-visible:outline-none',
                      selectedNodeId === 'fct_orders' && 'ring-primary/40',
                    )}
                    aria-pressed={selectedNodeId === 'fct_orders'}
                    onClick={() => setSelectedNodeId('fct_orders')}
                  >
                    <Workflow className="text-primary mb-1 size-4" />
                    <span className="text-foreground font-mono text-xs font-bold">fct_orders</span>
                    <Badge wrap variant="outline" className="border-primary/40 mt-1 font-mono text-xs">
                      incremental
                    </Badge>
                  </button>
                </div>

                {/* Downstream Column (3 Nodes) */}
                <div className="space-y-1.5">
                  <span className="text-muted-foreground block text-center font-mono text-xs font-medium">
                    Downstream (3)
                  </span>
                  {downstreamNodes.map((node) => (
                    <button
                      key={node.id}
                      type="button"
                      className={cn(
                        'focus-visible:ring-ring flex w-full cursor-pointer flex-col rounded-md border p-1.5 text-left transition-all focus-visible:ring-2 focus-visible:outline-none',
                        selectedNodeId === node.id
                          ? 'border-primary bg-primary/10 text-primary shadow-xs'
                          : 'border-border bg-background hover:bg-muted/80 text-foreground',
                      )}
                      aria-pressed={selectedNodeId === node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                    >
                      <div className="flex flex-wrap items-center justify-between">
                        <span className="truncate font-mono text-xs font-medium">{node.name}</span>
                      </div>
                      <div className="text-muted-foreground flex flex-wrap items-center justify-between pt-0.5 font-mono text-xs">
                        <span className="uppercase">{node.type}</span>
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Model Documentation & Metadata Card */}
          <Card className="border-border bg-card space-y-3 border p-4 shadow-none">
            <div className="border-border flex flex-wrap items-center justify-between border-b pb-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <Info className="text-primary size-3.5" />
                <span>Model Documentation & Metadata</span>
              </div>
              <Badge wrap variant="outline" className="font-mono text-xs">
                Contract Enforced
              </Badge>
            </div>

            <p className="text-muted-foreground text-xs leading-relaxed">
              Core transactional orders fact table at individual order grain. Captures gross revenue metrics, sales tax
              breakdowns, promotional discount allocations, payment gateway fees, and settlement lifecycle stages.
            </p>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="border-border/60 bg-muted/20 space-y-0.5 rounded-md border p-2 text-xs">
                <span className="text-muted-foreground text-xs">Model Owner</span>
                <div className="flex items-center gap-1.5 font-medium">
                  <User className="text-primary size-3" />
                  <span>Analytics Engineering</span>
                </div>
              </div>

              <div className="border-border/60 bg-muted/20 space-y-0.5 rounded-md border p-2 text-xs">
                <span className="text-muted-foreground text-xs">Freshness SLA</span>
                <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                  <Zap className="size-3 text-amber-500" />
                  <span>&lt; 2 hours (Compliant)</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-1.5 pt-1">
              <span className="text-muted-foreground flex items-center gap-1 text-xs">
                <Tag className="size-3" />
                Model Tags
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge wrap variant="secondary" className="font-mono text-xs font-normal">
                  #finance
                </Badge>
                <Badge wrap variant="secondary" className="font-mono text-xs font-normal">
                  #core
                </Badge>
                <Badge wrap variant="secondary" className="font-mono text-xs font-normal">
                  #daily_sla
                </Badge>
                <Badge wrap variant="secondary" className="font-mono text-xs font-normal">
                  #tier-1-kpi
                </Badge>
              </div>
            </div>

            {/* Cluster Keys & Strategy */}
            <div className="border-border/60 bg-muted/30 space-y-1.5 rounded-lg border p-2.5 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Incremental Strategy:</span>
                <span className="text-foreground font-semibold">Merge (unique_key: order_id)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cluster Keys:</span>
                <span className="text-foreground font-semibold">order_date, customer_id</span>
              </div>
            </div>
          </Card>

          {/* Upstream Sources & References List */}
          <Card className="border-border bg-card space-y-2.5 border p-4 shadow-none">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <Link2 className="size-3.5 text-sky-500" />
                <span>Upstream Sources & References ({upstreamNodes.length})</span>
              </div>
              <Badge wrap variant="secondary" className="font-mono text-xs font-normal">
                {upstreamNodes.length} models
              </Badge>
            </div>

            <div className="space-y-2">
              {upstreamNodes.map((node) => (
                <div
                  key={node.id}
                  className="border-border/70 bg-muted/20 hover:bg-muted/40 rounded-lg border p-2.5 text-xs transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between">
                    <span className="text-foreground font-mono font-semibold">{node.name}</span>
                    <Badge wrap variant="outline" className="font-mono text-xs uppercase">
                      {node.type}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">{node.description}</p>
                  <div className="text-muted-foreground mt-2 flex flex-wrap items-center justify-between font-mono text-xs">
                    <span>{node.rowCount}</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">{node.freshness}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Downstream Marts & BI Exporters List */}
          <Card className="border-border bg-card space-y-2.5 border p-4 shadow-none">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <ArrowUpRight className="size-3.5 text-amber-500" />
                <span>Downstream Marts & BI Exposures ({downstreamNodes.length})</span>
              </div>
              <Badge wrap variant="secondary" className="font-mono text-xs font-normal">
                {downstreamNodes.length} targets
              </Badge>
            </div>

            <div className="space-y-2">
              {downstreamNodes.map((node) => (
                <div
                  key={node.id}
                  className="border-border/70 bg-muted/20 hover:bg-muted/40 rounded-lg border p-2.5 text-xs transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between">
                    <span className="text-foreground font-mono font-semibold">{node.name}</span>
                    <Badge wrap variant="secondary" className="font-mono text-xs uppercase">
                      {node.type}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs">{node.description}</p>
                  <div className="text-muted-foreground mt-2 flex flex-wrap items-center justify-between font-mono text-xs">
                    <span className="truncate pr-2">Consumers: {node.consumers}</span>
                    <span className="text-foreground shrink-0 font-medium">{node.sla}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </aside>

        {/* RIGHT PANEL: TABS STUDIO (lg:col-span-7) */}
        <main className="bg-card flex flex-col overflow-hidden lg:col-span-7">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            defaultValue="model-sql"
            className="flex flex-1 flex-col"
          >
            {/* Right Tab Header */}
            <div className="border-border bg-muted/30 flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2">
              <TabsList className="grid h-8 grid-cols-3">
                <TabsTrigger value="model-sql" className="gap-1.5 text-xs">
                  <Code2 className="text-primary size-3.5" />
                  <span>Model SQL</span>
                </TabsTrigger>
                <TabsTrigger value="compiled-sql" className="gap-1.5 text-xs">
                  <FileCode className="size-3.5 text-sky-500" />
                  <span>Compiled SQL</span>
                </TabsTrigger>
                <TabsTrigger value="contract" className="gap-1.5 text-xs">
                  <ShieldCheck className="size-3.5 text-emerald-500" />
                  <span>Model Contract & Tests</span>
                </TabsTrigger>
              </TabsList>

              {/* Actions per active tab */}
              <div className="flex items-center gap-2">
                {activeTab === 'model-sql' && (
                  <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={copySourceSql}>
                    {copiedSql ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                    <span>{copiedSql ? 'Copied' : 'Copy SQL'}</span>
                  </Button>
                )}

                {activeTab === 'compiled-sql' && (
                  <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={copyCompiledSql}>
                    {copiedCompiled ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                    <span>{copiedCompiled ? 'Copied' : 'Copy Compiled'}</span>
                  </Button>
                )}

                {activeTab === 'contract' && (
                  <Badge wrap variant="outline" className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                    {passingTestsCount} Tests Passing
                  </Badge>
                )}
              </div>
            </div>

            {/* TAB 1: MODEL SQL */}
            <TabsContent value="model-sql" className="mt-0 flex flex-1 flex-col overflow-hidden">
              {/* Code Bar Meta */}
              <div className="border-border bg-muted/15 text-muted-foreground flex flex-wrap items-center justify-between border-b px-4 py-1.5 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-medium">fct_orders.sql</span>
                  <span>·</span>
                  <span>Jinja + Snowflake Dialect</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>
                    {modelSqlLines.length} lines · {modelSqlSource.length} chars
                  </span>
                </div>
              </div>

              {/* Code Gutter & Viewer */}
              <div className="relative flex flex-1 overflow-auto bg-neutral-950 text-neutral-100 dark:bg-neutral-950">
                {/* Line Numbers Gutter */}
                <div className="w-11 shrink-0 overflow-hidden border-r border-neutral-800 bg-neutral-900/60 py-3 pr-2 text-right font-mono text-xs leading-relaxed text-neutral-500 select-none">
                  {modelSqlLines.map((_, idx) => (
                    <div key={idx}>{idx + 1}</div>
                  ))}
                </div>

                {/* Highlighted Code Body */}
                <div className="flex-1 overflow-auto p-3 font-mono text-xs leading-relaxed">
                  {modelSqlLines.map((line, idx) => (
                    <div
                      key={idx}
                      className="font-mono whitespace-pre"
                      dangerouslySetInnerHTML={{ __html: highlightJinjaSqlLine(line) }}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: COMPILED SQL */}
            <TabsContent value="compiled-sql" className="mt-0 flex flex-1 flex-col overflow-hidden">
              {/* Code Bar Meta */}
              <div className="border-border bg-muted/15 text-muted-foreground flex flex-wrap items-center justify-between border-b px-4 py-1.5 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-medium">
                    target/compiled/analytics_dw/models/marts/fct_orders.sql
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge wrap variant="outline" className="font-mono text-xs">
                    Est. Cost: 0.14 Credits · 1.4 GB Scan
                  </Badge>
                </div>
              </div>

              {/* Code Gutter & Viewer */}
              <div className="relative flex flex-1 overflow-auto bg-neutral-950 text-neutral-100 dark:bg-neutral-950">
                {/* Line Numbers Gutter */}
                <div className="w-11 shrink-0 overflow-hidden border-r border-neutral-800 bg-neutral-900/60 py-3 pr-2 text-right font-mono text-xs leading-relaxed text-neutral-500 select-none">
                  {compiledSqlLines.map((_, idx) => (
                    <div key={idx}>{idx + 1}</div>
                  ))}
                </div>

                {/* Highlighted Code Body */}
                <div className="flex-1 overflow-auto p-3 font-mono text-xs leading-relaxed">
                  {compiledSqlLines.map((line, idx) => (
                    <div
                      key={idx}
                      className="font-mono whitespace-pre"
                      dangerouslySetInnerHTML={{ __html: highlightCompiledSqlLine(line) }}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: MODEL CONTRACT & TESTS */}
            <TabsContent value="contract" className="mt-0 flex flex-1 flex-col space-y-4 overflow-hidden p-4 sm:p-5">
              {/* Contract Control Bar */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:w-72">
                  <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
                  <Input
                    value={columnSearch}
                    onChange={(e) => setColumnSearch(e.target.value)}
                    placeholder="Filter columns or tests..."
                    className="h-8 pl-8 font-mono text-xs"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    wrap
                    variant="outline"
                    className="gap-1 font-mono text-xs text-emerald-600 dark:text-emerald-400"
                  >
                    <ShieldCheck className="size-3" />
                    contract.enforced: true
                  </Badge>
                  <Badge wrap variant="secondary" className="font-mono text-xs">
                    {filteredColumns.length} of {columns.length} columns
                  </Badge>
                </div>
              </div>

              {/* Specifications Table */}
              <Card className="border-border flex-1 overflow-hidden border shadow-none">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableHead className="text-xs font-semibold">Column Name</TableHead>
                        <TableHead className="text-xs font-semibold">Data Type</TableHead>
                        <TableHead className="text-xs font-semibold">Nullability</TableHead>
                        <TableHead className="text-xs font-semibold">Active Tests & Constraints</TableHead>
                        <TableHead className="text-xs font-semibold">Latency</TableHead>
                        <TableHead className="text-xs font-semibold">Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredColumns.map((col) => (
                        <TableRow key={col.name} className="text-xs">
                          <TableCell className="font-mono font-medium">
                            <div className="flex items-center gap-1.5">
                              {col.isPrimaryKey ? (
                                <Key className="size-3.5 shrink-0 text-amber-500" />
                              ) : col.isForeignKey ? (
                                <Link2 className="size-3.5 shrink-0 text-sky-500" />
                              ) : null}
                              <span
                                className={cn(col.isPrimaryKey && 'font-semibold text-amber-600 dark:text-amber-400')}
                              >
                                {col.name}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge wrap variant="secondary" className="font-mono text-xs font-normal">
                              {col.dataType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {!col.nullable ? (
                              <Badge wrap variant="outline" className="text-muted-foreground font-mono text-xs">
                                NOT NULL
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground font-mono text-xs">NULLABLE</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap items-center gap-1">
                              {col.isPrimaryKey && (
                                <Badge
                                  wrap
                                  className="border-amber-500/30 bg-amber-500/15 font-mono text-xs text-amber-700 dark:text-amber-300"
                                >
                                  PK
                                </Badge>
                              )}
                              {col.isClusterKey && (
                                <Badge
                                  wrap
                                  variant="secondary"
                                  className="border-violet-500/30 bg-violet-500/15 font-mono text-xs text-violet-700 dark:text-violet-300"
                                >
                                  CLUSTER
                                </Badge>
                              )}
                              {col.tests.map((test) => (
                                <Badge wrap key={test.name} variant="secondary" className="gap-1 font-mono text-xs">
                                  <span className="size-1.5 rounded-full bg-emerald-500" />
                                  {test.name}
                                  {test.detail ? ` (${test.detail})` : ''}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground font-mono text-xs">{col.testDuration}</TableCell>
                          <TableCell className="text-muted-foreground max-w-[220px] truncate text-xs">
                            {col.description}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>

              {/* Bottom Summary Banner */}
              <div className="border-border bg-muted/20 flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-emerald-500" />
                  <span className="text-foreground font-medium">Model Contract Coverage: 100% Enforced</span>
                </div>
                <div className="text-muted-foreground flex items-center gap-4 font-mono text-xs">
                  <span>18 Columns</span>
                  <span>·</span>
                  <span>21 Assertions</span>
                  <span>·</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">0 Failures</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

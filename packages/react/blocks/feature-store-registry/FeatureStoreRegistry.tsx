'use client'

import * as React from 'react'
import {
  Activity,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Copy,
  Cpu,
  Database,
  Download,
  Fingerprint,
  Key,
  Layers,
  Loader2,
  Search,
  ShieldCheck,
  Table2,
  Workflow,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface FeatureDefinition {
  name: string
  dtype: 'Float64' | 'Int32' | 'String'
  description: string
  aggregationWindow: string
  onlineCacheKey: string
  freshness: string
  status: 'Online & Batch Ready'
  sourceSql: string
  sampleValue: string
}

export interface MetricCard {
  title: string
  value: string
  subtitle: string
  badge: string
  icon: React.ComponentType<{ className?: string }>
}

export interface FeatureStoreRegistryProps {
  className?: string
}

const metrics: MetricCard[] = [
  {
    title: 'Total Features Registered',
    value: '18 Active Features',
    subtitle: '5 in this view · 4 views active',
    badge: '18 in Registry',
    icon: Layers,
  },
  {
    title: 'Online Cache Hit Rate',
    value: '99.8%',
    subtitle: '1.4ms p95 latency · Redis Cluster',
    badge: '< 2ms SLA',
    icon: Zap,
  },
  {
    title: 'Daily Ingestion Throughput',
    value: '14.8M Updates / Day',
    subtitle: '171.2 req/s avg · Stream + Batch',
    badge: 'Real-time CDC',
    icon: Activity,
  },
  {
    title: 'Max Point-in-Time TTL',
    value: '30 Days',
    subtitle: 'Lookback window · Anti-leakage safe',
    badge: 'AS-OF Safe',
    icon: Clock,
  },
]

const features: FeatureDefinition[] = [
  {
    name: 'avg_transaction_value_30d',
    dtype: 'Float64',
    description: '30-day sliding average transaction amount in base USD currency',
    aggregationWindow: '30-day sliding mean',
    onlineCacheKey: 'user:ft:avg_tx_val_30d',
    freshness: 'Synced 4m ago',
    status: 'Online & Batch Ready',
    sourceSql: 'AVG(amount_usd) OVER (PARTITION BY user_id ROWS BETWEEN 30 PRECEDING AND CURRENT ROW)',
    sampleValue: '$342.80',
  },
  {
    name: 'failed_logins_24h',
    dtype: 'Int32',
    description: 'Failed authentication attempts in rolling 24-hour security window',
    aggregationWindow: '24-hour count',
    onlineCacheKey: 'user:ft:fail_login_24h',
    freshness: 'Synced 2m ago',
    status: 'Online & Batch Ready',
    sourceSql: 'SUM(CASE WHEN auth_success = FALSE THEN 1 ELSE 0 END)',
    sampleValue: '0',
  },
  {
    name: 'lifetime_chargeback_count',
    dtype: 'Int32',
    description: 'Total historical dispute and payment chargeback occurrences',
    aggregationWindow: 'Cumulative lifetime',
    onlineCacheKey: 'user:ft:cb_cnt_lt',
    freshness: 'Synced 12m ago',
    status: 'Online & Batch Ready',
    sourceSql: 'COUNT(chargeback_id) OVER (PARTITION BY user_id)',
    sampleValue: '0',
  },
  {
    name: 'preferred_payment_method',
    dtype: 'String',
    description: 'Most frequently utilized payment method category across checkout sessions',
    aggregationWindow: 'Mode category',
    onlineCacheKey: 'user:ft:pref_pay_method',
    freshness: 'Synced 18m ago',
    status: 'Online & Batch Ready',
    sourceSql: 'MODE(payment_method_code) OVER (PARTITION BY user_id)',
    sampleValue: '"apple_pay"',
  },
  {
    name: 'risk_score_ml_v3',
    dtype: 'Float64',
    description: 'Real-time XGBoost inference fraud risk score probability [0.0 - 1.0]',
    aggregationWindow: 'Real-time inference',
    onlineCacheKey: 'user:ft:risk_score_v3',
    freshness: 'Synced 1m ago',
    status: 'Online & Batch Ready',
    sourceSql: 'MODEL_PREDICT_FRAUD_V3(features)',
    sampleValue: '0.042',
  },
]

const pythonFeastSource = `from datetime import timedelta
from feast import (
    BatchSource,
    Entity,
    FeatureView,
    Field,
    SnowflakeSource,
    ValueType,
)
from feast.types import Float64, Int32, String

# 1. Define Primary Entity
user_entity = Entity(
    name="user_id",
    value_type=ValueType.STRING,
    join_keys=["user_id"],
    description="Global UUID representing verified consumer and business accounts",
)

# 2. Snowflake Gold DW Batch Offline Source
transactions_batch_source = SnowflakeSource(
    database="ANALYTICS_PROD",
    schema="GOLD_MARTS",
    table="fct_user_transactions_daily",
    timestamp_field="event_timestamp",
    created_timestamp_column="created_at",
)

# 3. Dual-Store Feature View Definition (Redis Online + Snowflake Batch)
user_30d_transaction_aggregates = FeatureView(
    name="user_30d_transaction_aggregates",
    entities=[user_entity],
    ttl=timedelta(days=30),
    schema=[
        Field(
            name="avg_transaction_value_30d",
            dtype=Float64,
            description="30-day sliding average transaction amount in base USD currency",
        ),
        Field(
            name="failed_logins_24h",
            dtype=Int32,
            description="Failed authentication attempts in rolling 24-hour security window",
        ),
        Field(
            name="lifetime_chargeback_count",
            dtype=Int32,
            description="Total historical dispute and payment chargeback occurrences",
        ),
        Field(
            name="preferred_payment_method",
            dtype=String,
            description="Most frequently utilized payment method category across checkout sessions",
        ),
        Field(
            name="risk_score_ml_v3",
            dtype=Float64,
            description="Real-time XGBoost inference fraud risk score probability [0.0 - 1.0]",
        ),
    ],
    online=True,
    source=transactions_batch_source,
    tags={
        "team": "fraud-ml",
        "tier": "tier-1-prod",
        "online_store": "redis_cluster",
        "batch_store": "snowflake_gold",
        "sla": "sub-2ms",
    },
)`

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function highlightPythonLine(line: string): string {
  if (!line.trim()) return '&nbsp;'
  const escaped = escapeHtml(line)

  // Comments
  if (/^\s*#/.test(escaped)) {
    return `<span class="text-neutral-500 italic">${escaped}</span>`
  }

  // Each emitted <span> is parked behind a letter-only placeholder so a later
  // pass cannot match inside markup an earlier pass produced -- the numeric
  // pass used to rewrite the `400` inside `text-purple-400` and shred the tag.
  const parked: string[] = []
  const park = (html: string) => {
    const key = String(parked.length)
      .split('')
      .map((d) => String.fromCharCode(97 + Number(d)))
      .join('')
    parked.push(html)
    return `\u0000${key}\u0000`
  }

  let res = escaped

  // Strings
  res = res.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, (match) =>
    park(`<span class="text-emerald-400 font-normal">${match}</span>`),
  )

  // Keywords
  res = res.replace(
    /\b(from|import|def|class|return|as|True|False|None|with|for|in|and|or|not|is|if|else|elif)\b/g,
    (m) => park(`<span class="text-purple-400 font-semibold">${m}</span>`),
  )

  // Types / Feast Classes
  res = res.replace(
    /\b(Entity|FeatureView|Field|SnowflakeSource|BatchSource|ValueType|Float64|Int32|String|timedelta)\b/g,
    (m) => park(`<span class="text-amber-300 font-medium">${m}</span>`),
  )

  // Arguments
  res = res.replace(
    /\b(name|value_type|join_keys|description|database|schema|table|timestamp_field|created_timestamp_column|entities|ttl|dtype|online|source|tags|days)\b(?=\s*=)/g,
    (m) => park(`<span class="text-sky-300">${m}</span>`),
  )

  // Numbers
  res = res.replace(/\b(\d+)\b/g, (m) => park(`<span class="text-amber-400 font-medium">${m}</span>`))

  // Restore every parked span
  return res.replace(/\u0000([a-j]+)\u0000/g, (_, key: string) => {
    const idx = Number(
      key
        .split('')
        .map((c: string) => String(c.charCodeAt(0) - 97))
        .join(''),
    )
    return parked[idx] ?? ''
  })
}

export function FeatureStoreRegistry({ className }: FeatureStoreRegistryProps) {
  const [activeTab, setActiveTab] = React.useState<'features' | 'python-feast' | 'lineage'>('features')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedType, setSelectedType] = React.useState<'all' | 'Float64' | 'Int32' | 'String'>('all')
  const [isMaterializing, setIsMaterializing] = React.useState(false)
  const [materializeSuccess, setMaterializeSuccess] = React.useState(false)
  const [isGeneratingDataset, setIsGeneratingDataset] = React.useState(false)
  const [datasetSuccess, setDatasetSuccess] = React.useState(false)
  const [copiedFeast, setCopiedFeast] = React.useState(false)
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null)
  const selectedEntityId = 'usr_9a4f201d-7e2b-4d68'

  const pythonLines = React.useMemo(() => pythonFeastSource.split('\n'), [])

  const filteredFeatures = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return features.filter((f) => {
      const matchesSearch =
        !query ||
        f.name.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query) ||
        f.onlineCacheKey.toLowerCase().includes(query) ||
        f.dtype.toLowerCase().includes(query)
      const matchesType = selectedType === 'all' || f.dtype === selectedType
      return matchesSearch && matchesType
    })
  }, [searchQuery, selectedType])

  const copyToClipboard = React.useCallback((text: string, type: 'code' | 'key', keyName?: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      if (type === 'code') {
        setCopiedFeast(true)
        setTimeout(() => {
          setCopiedFeast(false)
        }, 2000)
      } else if (type === 'key' && keyName) {
        setCopiedKey(keyName)
        setTimeout(() => {
          setCopiedKey(null)
        }, 2000)
      }
    }
  }, [])

  const handleMaterialize = React.useCallback(() => {
    if (isMaterializing) return
    setIsMaterializing(true)
    setMaterializeSuccess(false)

    setTimeout(() => {
      setIsMaterializing(false)
      setMaterializeSuccess(true)
      setTimeout(() => {
        setMaterializeSuccess(false)
      }, 3000)
    }, 1200)
  }, [isMaterializing])

  const handleGenerateDataset = React.useCallback(() => {
    if (isGeneratingDataset) return
    setIsGeneratingDataset(true)
    setDatasetSuccess(false)

    setTimeout(() => {
      setIsGeneratingDataset(false)
      setDatasetSuccess(true)
      setTimeout(() => {
        setDatasetSuccess(false)
      }, 3000)
    }, 1000)
  }, [isGeneratingDataset])

  return (
    <div
      data-slot="feature-store-registry"
      className={cn(
        'bg-background text-foreground border-border flex w-full flex-col overflow-hidden rounded-xl border shadow-xs',
        className,
      )}
    >
      {/* TOP FEATURE VIEW HEADER */}
      <header className="border-border bg-card/70 border-b px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: Title, Entity, Stores */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg shadow-xs">
              <Cpu className="size-5" />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground font-mono text-xs">feature_view /</span>
                <h1 className="text-foreground font-mono text-base font-bold tracking-tight break-all sm:text-lg">
                  user_30d_transaction_aggregates
                </h1>
                <Badge wrap variant="outline" className="font-mono text-xs font-normal">
                  v2.4.0
                </Badge>
              </div>

              {/* Metadata Badges Strip */}
              <div className="flex flex-wrap items-center gap-2 pt-0.5">
                {/* Entity Pill */}
                <div className="border-border bg-muted/40 text-foreground inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-xs">
                  <Key className="text-primary size-3" />
                  <span className="text-muted-foreground">Entity:</span>
                  <span className="font-semibold">user_id</span>
                  <span className="text-muted-foreground">[UUID]</span>
                </div>

                {/* Online Store Pill */}
                <div className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                  <span>Redis Cluster · &lt; 2ms latency</span>
                </div>

                {/* Batch Store Pill */}
                <div className="inline-flex items-center gap-1.5 rounded-md border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 font-mono text-xs font-medium text-sky-600 dark:text-sky-400">
                  <Database className="size-3 text-sky-500" />
                  <span>Snowflake Gold DW</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Generate Training Dataset Button */}
            <Button
              aria-label="Download attachment"
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 text-xs font-medium shadow-none"
              disabled={isGeneratingDataset}
              onClick={handleGenerateDataset}
            >
              {isGeneratingDataset ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : datasetSuccess ? (
                <Check className="size-3.5 text-emerald-500" />
              ) : (
                <Download className="size-3.5" />
              )}
              <span>
                {isGeneratingDataset
                  ? 'Building Parquet...'
                  : datasetSuccess
                    ? 'Dataset Exported (14.2 MB)'
                    : 'Generate Training Dataset'}
              </span>
            </Button>

            {/* Materialize Online Features Button */}
            <Button
              variant="default"
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 gap-1.5 text-xs font-semibold shadow-xs"
              disabled={isMaterializing}
              onClick={handleMaterialize}
            >
              {isMaterializing ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : materializeSuccess ? (
                <Check className="size-3.5 text-emerald-300" />
              ) : (
                <Zap className="size-3.5 fill-current" />
              )}
              <span>
                {isMaterializing
                  ? 'Syncing to Redis...'
                  : materializeSuccess
                    ? 'Materialized 18.4k Keys!'
                    : 'Materialize Online Features'}
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* 4 FEATURE STORE METRIC CARDS */}
      <div className="border-border bg-muted/15 border-b p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => {
            const IconComp = metric.icon
            return (
              <Card
                key={metric.title}
                className="border-border bg-card hover:bg-muted/30 shadow-none transition-colors"
              >
                <CardContent className="flex flex-col justify-between gap-3 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs font-medium">{metric.title}</span>
                    <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-md">
                      <IconComp className="size-3.5" />
                    </div>
                  </div>

                  <div>
                    <div className="text-foreground font-mono text-xl font-bold tracking-tight">{metric.value}</div>
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-muted-foreground truncate">{metric.subtitle}</span>
                      <Badge wrap variant="secondary" className="ml-1 shrink-0 font-mono text-xs font-normal">
                        {metric.badge}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* MAIN TABS STUDIO */}
      <div className="flex flex-1 flex-col">
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as 'features' | 'python-feast' | 'lineage')}
          defaultValue="features"
          className="flex flex-1 flex-col"
        >
          {/* Tabs Bar */}
          <div className="border-border bg-card flex flex-wrap items-center justify-between gap-3 border-b px-4 py-2.5 sm:px-6">
            <TabsList className="grid h-9 grid-cols-3">
              <TabsTrigger value="features" className="gap-1.5 text-xs">
                <Table2 className="text-primary size-3.5" />
                <span>Feature Definitions</span>
                <Badge wrap variant="secondary" className="ml-1 h-4 px-1 font-mono text-xs">
                  {features.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="python-feast" className="gap-1.5 text-xs">
                <Code2 className="size-3.5 text-amber-500" />
                <span>Feast Definition</span>
              </TabsTrigger>
              <TabsTrigger value="lineage" className="gap-1.5 text-xs">
                <Workflow className="size-3.5 text-sky-500" />
                <span>Lineage & Architecture</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Badge wrap variant="outline" className="gap-1 font-mono text-xs text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="size-3" />
                <span>Redis Online Serving: ACTIVE</span>
              </Badge>
            </div>
          </div>

          {/* TAB 1: FEATURE DEFINITIONS TABLE */}
          <TabsContent value="features" className="m-0 flex flex-1 flex-col space-y-5 p-4 sm:p-6">
            {/* Filter / Search Controls */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-full sm:w-72">
                  <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter by feature name, type, or cache key..."
                    className="h-8 pl-8 font-mono text-xs"
                  />
                </div>

                {/* Type filter pills */}
                <div className="flex items-center gap-1">
                  {(['all', 'Float64', 'Int32', 'String'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={cn(
                        'cursor-pointer rounded-md px-2 py-1 font-mono text-xs transition-colors',
                        selectedType === t
                          ? 'bg-primary text-primary-foreground font-medium shadow-xs'
                          : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                      onClick={() => setSelectedType(t)}
                    >
                      {t === 'all' ? 'All Types' : t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-muted-foreground flex items-center gap-2 font-mono text-xs">
                <span>
                  Showing {filteredFeatures.length} of {features.length} features
                </span>
              </div>
            </div>

            {/* Feature Definitions Table */}
            <Card className="border-border overflow-hidden border shadow-none">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="text-xs font-semibold">Feature Name & Type</TableHead>
                      <TableHead className="text-xs font-semibold">Description & Aggregation Window</TableHead>
                      <TableHead className="text-xs font-semibold">Online Cache Key (Redis)</TableHead>
                      <TableHead className="text-xs font-semibold">Freshness</TableHead>
                      <TableHead className="text-xs font-semibold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFeatures.map((feature) => (
                      <TableRow key={feature.name} className="text-xs">
                        {/* Feature Name & Type */}
                        <TableCell className="font-mono">
                          <div className="space-y-1">
                            <div className="text-foreground font-semibold tracking-tight">{feature.name}</div>
                            <Badge
                              variant="secondary"
                              className={cn(
                                'font-mono text-xs font-normal',
                                feature.dtype === 'Float64' &&
                                  'border border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300',
                                feature.dtype === 'Int32' &&
                                  'border border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300',
                                feature.dtype === 'String' &&
                                  'border border-purple-500/20 bg-purple-500/10 text-purple-700 dark:text-purple-300',
                              )}
                            >
                              {feature.dtype}
                            </Badge>
                          </div>
                        </TableCell>

                        {/* Description & Aggregation Window */}
                        <TableCell className="max-w-[280px]">
                          <div className="space-y-1">
                            <p className="text-muted-foreground text-xs leading-relaxed">{feature.description}</p>
                            <Badge wrap variant="outline" className="gap-1 font-mono text-xs font-normal">
                              <Clock className="text-muted-foreground size-2.5" />
                              {feature.aggregationWindow}
                            </Badge>
                          </div>
                        </TableCell>

                        {/* Online Cache Key */}
                        <TableCell>
                          <button
                            type="button"
                            className="border-border/80 bg-muted/60 hover:bg-muted hover:border-primary/40 text-foreground group inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs transition-colors"
                            title="Click to copy Redis key"
                            onClick={() => copyToClipboard(feature.onlineCacheKey, 'key', feature.name)}
                          >
                            <span className="text-primary font-semibold">GET</span>
                            <span>{feature.onlineCacheKey}</span>
                            {copiedKey === feature.name ? (
                              <Check className="size-3 text-emerald-500 transition-transform" />
                            ) : (
                              <Copy className="text-muted-foreground size-3 opacity-60 group-hover:opacity-100" />
                            )}
                          </button>
                        </TableCell>

                        {/* Freshness / Last Synced */}
                        <TableCell className="text-muted-foreground font-mono whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Clock className="size-3 text-emerald-500" />
                            <span>{feature.freshness}</span>
                          </div>
                        </TableCell>

                        {/* Feature Status */}
                        <TableCell className="whitespace-nowrap">
                          <Badge
                            wrap
                            variant="outline"
                            className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400"
                          >
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            {feature.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>

            {/* Interactive Entity Live Feature Vector Inspector */}
            <Card className="border-border bg-card/60 space-y-4 border p-4 shadow-none sm:p-5">
              <div className="border-border/80 flex flex-col gap-2 border-b pb-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <Fingerprint className="text-primary size-4 shrink-0" />
                  <span className="text-foreground text-xs font-semibold">
                    Live Online Feature Vector Lookup Simulator
                  </span>
                  <Badge wrap variant="secondary" className="font-mono text-xs">
                    feast.get_online_features()
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-mono text-xs">Target Entity:</span>
                  <span className="text-foreground font-mono text-xs font-semibold">{selectedEntityId}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
                {features.map((feature) => (
                  <div
                    key={feature.name}
                    className="border-border/70 bg-muted/25 flex flex-col justify-between rounded-lg border p-3"
                  >
                    <div className="space-y-1">
                      <span className="text-muted-foreground block truncate font-mono text-xs font-medium">
                        {feature.name}
                      </span>
                      <span className="text-muted-foreground text-xs">{feature.aggregationWindow}</span>
                    </div>
                    <div className="border-border/40 mt-3 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 border-t pt-2">
                      <span className="text-foreground font-mono text-sm font-bold">{feature.sampleValue}</span>
                      <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">&lt; 1.2ms</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* TAB 2: PYTHON FEAST DEFINITION CODE BOX */}
          <TabsContent value="python-feast" className="m-0 flex flex-1 flex-col space-y-4 p-4 sm:p-6">
            <div className="border-border bg-muted/40 overflow-hidden rounded-xl border">
              {/* Code Box Toolbar Header */}
              <div className="border-border bg-card flex items-center justify-between border-b px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex size-6 items-center justify-center rounded bg-amber-500/10 text-amber-500">
                    <Code2 className="size-3.5" />
                  </div>
                  <span className="text-foreground font-mono text-xs font-semibold">
                    feature_definitions/user_aggregates.py
                  </span>
                  <Badge wrap variant="secondary" className="font-mono text-xs">
                    Python 3.11 · Feast 0.42+
                  </Badge>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1.5 text-xs font-medium"
                  onClick={() => copyToClipboard(pythonFeastSource, 'code')}
                >
                  {copiedFeast ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                  <span>{copiedFeast ? 'Copied Feast Code!' : 'Copy Python Code'}</span>
                </Button>
              </div>

              {/* Code Gutter and Syntax Highlighter */}
              <div className="relative flex overflow-x-auto bg-neutral-950 font-mono text-xs leading-relaxed text-neutral-100 dark:bg-neutral-950">
                {/* Line Numbers Gutter */}
                <div className="w-11 shrink-0 overflow-hidden border-r border-neutral-800 bg-neutral-900/60 py-3 pr-2 text-right text-neutral-500 select-none">
                  {pythonLines.map((_, idx) => (
                    <div key={idx}>{idx + 1}</div>
                  ))}
                </div>

                {/* Python Code Content */}
                <div className="flex-1 overflow-x-auto p-3 whitespace-pre select-text">
                  {pythonLines.map((line, idx) => (
                    <div
                      key={idx}
                      className="h-5 font-mono leading-5"
                      dangerouslySetInnerHTML={{ __html: highlightPythonLine(line) }}
                    />
                  ))}
                </div>
              </div>

              {/* Code Footer Meta */}
              <div className="border-border/60 bg-muted/20 text-muted-foreground flex items-center justify-between border-t px-4 py-1.5 font-mono text-xs">
                <div className="flex items-center gap-3">
                  <span>{pythonLines.length} lines</span>
                  <span>·</span>
                  <span>UTF-8</span>
                  <span>·</span>
                  <span>Feast Entity &amp; FeatureView DSL</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-3.5" />
                  <span>Valid Feast Schema Contract</span>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: STORAGE & LINEAGE ARCHITECTURE */}
          <TabsContent value="lineage" className="m-0 flex flex-1 flex-col space-y-4 p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* Offline Batch Lineage Card */}
              <Card className="border-border bg-card space-y-3 border p-5 shadow-none">
                <div className="border-border flex items-center justify-between border-b pb-2.5">
                  <div className="flex items-center gap-2">
                    <Database className="size-4 text-sky-500" />
                    <span className="text-foreground text-xs font-semibold">Offline Batch Store Architecture</span>
                  </div>
                  <Badge wrap variant="secondary" className="font-mono text-xs">
                    Snowflake Gold
                  </Badge>
                </div>

                <p className="text-muted-foreground text-xs leading-relaxed">
                  Immutable historical logs for time-travel queries, training set generation, and AS-OF joins without
                  point-in-time data leakage.
                </p>

                <div className="border-border/60 bg-muted/20 space-y-2 rounded-lg border p-3 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Database &amp; Schema:</span>
                    <span className="text-foreground font-semibold">ANALYTICS_PROD.GOLD_MARTS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Source Table:</span>
                    <span className="text-foreground font-semibold">fct_user_transactions_daily</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Timestamp Partition:</span>
                    <span className="text-foreground">event_timestamp (UTC)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Historical Depth:</span>
                    <span className="text-foreground">3 Years (Lookback TTL 30 Days)</span>
                  </div>
                </div>
              </Card>

              {/* Online Low-Latency Cache Card */}
              <Card className="border-border bg-card space-y-3 border p-5 shadow-none">
                <div className="border-border flex items-center justify-between border-b pb-2.5">
                  <div className="flex items-center gap-2">
                    <Zap className="size-4 text-emerald-500" />
                    <span className="text-foreground text-xs font-semibold">Online Key-Value Cache Architecture</span>
                  </div>
                  <Badge
                    wrap
                    variant="outline"
                    className="border-emerald-500/30 font-mono text-xs text-emerald-600 dark:text-emerald-400"
                  >
                    Redis 7.2 Cluster
                  </Badge>
                </div>

                <p className="text-muted-foreground text-xs leading-relaxed">
                  Ultra-low latency memory tier providing sub-2 millisecond retrieval for online model inference
                  microservices and fraud scoring.
                </p>

                <div className="border-border/60 bg-muted/20 space-y-2 rounded-lg border p-3 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cluster Topology:</span>
                    <span className="text-foreground font-semibold">3 Master Shards + 3 Replicas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Key Prefix Pattern:</span>
                    <span className="text-foreground font-semibold">user:ft:&#123;feature_name&#125;</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Read SLA (p95):</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">&lt; 1.4ms Latency</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Materialization Schedule:</span>
                    <span className="text-foreground">Every 15 mins via Feast Job</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

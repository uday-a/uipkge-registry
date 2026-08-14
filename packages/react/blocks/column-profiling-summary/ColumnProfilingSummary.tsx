'use client'

import * as React from 'react'
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
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

export interface ColumnProfilingSummaryProps {
  className?: string
  tableName?: string
  totalRows?: string
  totalColumns?: number
  memoryFootprint?: string
  datasetVersion?: string
}

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

export function ColumnProfilingSummary({
  className,
  tableName = 'customer_churn_features_v2',
  totalRows = '148,290',
  totalColumns = 18,
  memoryFootprint = '24.2 MB',
  datasetVersion = 'v2.4.1',
}: ColumnProfilingSummaryProps) {
  const [activeTypeFilter, setActiveTypeFilter] = React.useState<'all' | 'numeric' | 'categorical' | 'boolean'>('all')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [viewMode, setViewMode] = React.useState<'cards' | 'table'>('cards')
  const [isExporting, setIsExporting] = React.useState(false)
  const [showExportSuccess, setShowExportSuccess] = React.useState(false)
  const [copiedColumn, setCopiedColumn] = React.useState<string | null>(null)
  const [hoveredHistBin, setHoveredHistBin] = React.useState<number | null>(null)

  const filteredColumns = React.useMemo(() => {
    return allSchemaColumns.filter((col) => {
      const matchesCategory = activeTypeFilter === 'all' || col.category === activeTypeFilter
      const matchesSearch =
        col.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        col.type.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeTypeFilter, searchQuery])

  const handleExportReport = React.useCallback(() => {
    if (isExporting) return
    setIsExporting(true)
    setTimeout(() => {
      setIsExporting(false)
      setShowExportSuccess(true)
      setTimeout(() => {
        setShowExportSuccess(false)
      }, 3500)
    }, 600)
  }, [isExporting])

  const handleCopy = React.useCallback((name: string) => {
    navigator.clipboard?.writeText(name)
    setCopiedColumn(name)
    setTimeout(() => {
      setCopiedColumn((prev) => (prev === name ? null : prev))
    }, 2000)
  }, [])

  return (
    <div data-slot="column-profiling-summary" className={cn('mx-auto w-full max-w-6xl space-y-6', className)}>
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
              <Database className="size-4" />
            </div>
            <h1 className="text-foreground text-2xl font-bold tracking-tight break-all sm:text-3xl">
              Table: {tableName}
            </h1>
            <Badge variant="outline" className="gap-1.5 font-mono text-xs font-normal">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>Apache Parquet</span>
            </Badge>
            <Badge variant="secondary" className="font-mono text-xs font-normal">
              {datasetVersion}
            </Badge>
          </div>
          <p className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <span>Profiled: 2026-08-21 14:30 UTC</span>
            <span>•</span>
            <span>Snappy Compressed</span>
            <span>•</span>
            <span className="text-foreground font-medium">EDA Engine: ydata-profiler v4.8</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Meta Pills */}
          <div className="bg-card border-border/80 flex items-center divide-x rounded-lg border text-xs shadow-xs">
            <div className="px-3 py-1.5">
              <span className="text-muted-foreground">Rows: </span>
              <span className="text-foreground font-semibold tabular-nums">{totalRows}</span>
            </div>
            <div className="px-3 py-1.5">
              <span className="text-muted-foreground">Cols: </span>
              <span className="text-foreground font-semibold tabular-nums">{totalColumns}</span>
            </div>
            <div className="px-3 py-1.5">
              <span className="text-muted-foreground">Memory: </span>
              <span className="text-foreground font-semibold tabular-nums">{memoryFootprint}</span>
            </div>
          </div>

          {/* Export EDA Report Button */}
          <Button
            aria-label="Download attachment"
            size="sm"
            className="gap-1.5 shadow-xs"
            disabled={isExporting}
            onClick={handleExportReport}
          >
            {isExporting ? (
              <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Download className="size-3.5" />
            )}
            <span>{isExporting ? 'Generating HTML Report...' : 'Export EDA Report'}</span>
          </Button>
        </div>
      </div>

      {/* Export Success Banner */}
      {showExportSuccess && (
        <div
          className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-950 shadow-xs dark:text-emerald-50"
          role="status"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
            <span className="font-medium">
              Exploratory Data Analysis report exported. HTML summary & JSON schema bundle ready for download.
            </span>
          </div>
          <button
            type="button"
            className="cursor-pointer text-xs font-semibold text-emerald-700 hover:underline dark:text-emerald-300"
            onClick={() => setShowExportSuccess(false)}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 4 Dataset Overview KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Numeric Columns */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="bg-muted text-foreground flex size-7 items-center justify-center rounded-md border">
                  <Hash className="size-3.5 text-sky-500" />
                </div>
                <CardTitle className="text-sm font-medium">Numeric Columns</CardTitle>
              </div>
              <Badge variant="outline" className="font-mono text-xs tabular-nums">
                55.6%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 pt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-foreground text-3xl font-bold tracking-tight tabular-nums">10</span>
              <span className="text-muted-foreground text-xs font-medium">Columns</span>
            </div>
            <div className="border-border/60 border-t pt-2 text-xs">
              <div className="text-muted-foreground flex items-center justify-between">
                <span>Types Breakdown:</span>
                <span className="text-foreground font-medium tabular-nums">8 Float64 · 2 Int32</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Categorical Columns */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="bg-muted text-foreground flex size-7 items-center justify-center rounded-md border">
                  <Tag className="size-3.5 text-violet-500" />
                </div>
                <CardTitle className="text-sm font-medium">Categorical Columns</CardTitle>
              </div>
              <Badge variant="outline" className="font-mono text-xs tabular-nums">
                33.3%
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 pt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-foreground text-3xl font-bold tracking-tight tabular-nums">6</span>
              <span className="text-muted-foreground text-xs font-medium">Columns</span>
            </div>
            <div className="border-border/60 border-t pt-2 text-xs">
              <div className="text-muted-foreground flex items-center justify-between">
                <span>High Cardinality:</span>
                <span className="text-foreground font-medium tabular-nums">1 (customer_id)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Missing Values % */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="bg-muted text-foreground flex size-7 items-center justify-center rounded-md border">
                  <AlertCircle className="size-3.5 text-emerald-500" />
                </div>
                <CardTitle className="text-sm font-medium">Missing Values</CardTitle>
              </div>
              <Badge variant="success" className="text-xs">
                Clean
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 pt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-foreground text-3xl font-bold tracking-tight tabular-nums">0.4%</span>
              <span className="text-muted-foreground text-xs font-medium">Missing</span>
            </div>
            <div className="border-border/60 border-t pt-2 text-xs">
              <div className="text-muted-foreground flex items-center justify-between">
                <span>Total Null Cells:</span>
                <span className="text-foreground font-medium tabular-nums">593 / 2,669,220</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. Duplicate Rows */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="bg-muted text-foreground flex size-7 items-center justify-center rounded-md border">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                </div>
                <CardTitle className="text-sm font-medium">Duplicate Rows</CardTitle>
              </div>
              <Badge variant="success" className="text-xs">
                100% Unique
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 pt-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-foreground text-3xl font-bold tracking-tight tabular-nums">0</span>
              <span className="text-muted-foreground text-xs font-medium">Duplicates</span>
            </div>
            <div className="border-border/60 border-t pt-2 text-xs">
              <div className="text-muted-foreground flex items-center justify-between">
                <span>Primary Key Integrity:</span>
                <span className="text-foreground font-medium">100.0% Valid</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter & Toolbar Controls */}
      <Card className="border-border bg-card shadow-xs">
        <CardContent className="p-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Type Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                className={cn(
                  'cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                  activeTypeFilter === 'all'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
                onClick={() => setActiveTypeFilter('all')}
              >
                All Types (18)
              </button>
              <button
                type="button"
                className={cn(
                  'cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                  activeTypeFilter === 'numeric'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
                onClick={() => setActiveTypeFilter('numeric')}
              >
                Numeric (10)
              </button>
              <button
                type="button"
                className={cn(
                  'cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                  activeTypeFilter === 'categorical'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
                onClick={() => setActiveTypeFilter('categorical')}
              >
                Categorical (6)
              </button>
              <button
                type="button"
                className={cn(
                  'cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                  activeTypeFilter === 'boolean'
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
                onClick={() => setActiveTypeFilter('boolean')}
              >
                Boolean (2)
              </button>
            </div>

            {/* Search & View Mode Switcher */}
            <div className="flex items-center gap-2">
              <div className="relative flex items-center">
                <Search className="text-muted-foreground pointer-events-none absolute left-2.5 size-3.5" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  placeholder="Filter column name..."
                  className="border-border bg-background text-foreground focus-visible:border-ring focus-visible:ring-ring/50 h-8 w-44 rounded-md border pr-2.5 pl-8 text-xs focus-visible:ring-2 focus-visible:outline-none sm:w-56"
                />
              </div>

              <div className="bg-muted border-border flex items-center rounded-md border p-0.5 text-xs">
                <button
                  type="button"
                  className={cn(
                    'cursor-pointer rounded px-2 py-1 transition-colors',
                    viewMode === 'cards'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  aria-label="Card deep dive view"
                  onClick={() => setViewMode('cards')}
                >
                  <LayoutGrid className="size-3.5" />
                </button>
                <button
                  type="button"
                  className={cn(
                    'cursor-pointer rounded px-2 py-1 transition-colors',
                    viewMode === 'table'
                      ? 'bg-background text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  aria-label="Compact table view"
                  onClick={() => setViewMode('table')}
                >
                  <TableIcon className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compact Table View */}
      {viewMode === 'table' ? (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Dataset Schema & Profiling Matrix</CardTitle>
                <CardDescription className="text-xs">
                  Tabular view of all columns with inferred types, missingness, cardinality, and distribution summary.
                </CardDescription>
              </div>
              <Badge variant="outline" className="font-mono text-xs tabular-nums">
                {filteredColumns.length} of 18 columns
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[180px]">Column Name</TableHead>
                    <TableHead className="min-w-[140px]">Data Type</TableHead>
                    <TableHead className="min-w-[110px]">Missing Values</TableHead>
                    <TableHead className="min-w-[120px]">Distinct Values</TableHead>
                    <TableHead className="min-w-[280px]">Distribution / Quantiles</TableHead>
                    <TableHead className="text-right">Health Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredColumns.map((col) => (
                    <TableRow key={col.name}>
                      <TableCell className="font-mono text-xs font-medium">
                        <div className="flex items-center gap-1.5">
                          <span>{col.name}</span>
                          <button
                            type="button"
                            className="text-muted-foreground hover:text-foreground cursor-pointer"
                            aria-label={`Copy column ${col.name}`}
                            onClick={() => handleCopy(col.name)}
                          >
                            {copiedColumn === col.name ? (
                              <Check className="size-3 text-emerald-500" />
                            ) : (
                              <Copy className="size-3" />
                            )}
                          </button>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">
                        <Badge variant="secondary" className="font-mono text-xs font-normal">
                          {col.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs tabular-nums">
                        {col.missing}
                      </TableCell>
                      <TableCell className="text-foreground font-mono text-xs tabular-nums">{col.distinct}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{col.summary}</TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={col.status.includes('Unique') ? 'default' : 'success'}
                          className="text-xs font-normal"
                        >
                          {col.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* 4 Detailed Column Deep-Dive Cards */
        <div className="space-y-6">
          {/* 1. Column 1: monthly_spend_usd (Numeric Float64 + 10-bar SVG Histogram) */}
          {(activeTypeFilter === 'all' || activeTypeFilter === 'numeric') && (
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex size-6 items-center justify-center rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400">
                        <Hash className="size-3.5" />
                      </div>
                      <CardTitle className="font-mono text-base font-semibold">{monthlySpendStats.name}</CardTitle>
                      <Badge variant="secondary" className="font-mono text-xs font-normal">
                        {monthlySpendStats.type}
                      </Badge>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground cursor-pointer"
                        aria-label={`Copy ${monthlySpendStats.name}`}
                        onClick={() => handleCopy(monthlySpendStats.name)}
                      >
                        {copiedColumn === monthlySpendStats.name ? (
                          <Check className="size-3 text-emerald-500" />
                        ) : (
                          <Copy className="size-3" />
                        )}
                      </button>
                    </div>
                    <CardDescription className="text-xs">
                      Monthly billed subscription and add-on expenditure in USD. Right-skewed distribution with long
                      tail.
                    </CardDescription>
                  </div>

                  {/* Meta Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-xs font-normal">
                      Missing:{' '}
                      <span className="ml-1 font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                        {monthlySpendStats.missingPct}
                      </span>
                    </Badge>
                    <Badge variant="outline" className="text-xs font-normal">
                      Distinct:{' '}
                      <span className="text-foreground ml-1 font-semibold tabular-nums">
                        {monthlySpendStats.distinctCount}
                      </span>
                    </Badge>
                    <Badge variant="outline" className="text-xs font-normal">
                      Memory:{' '}
                      <span className="text-foreground ml-1 font-semibold tabular-nums">
                        {monthlySpendStats.memory}
                      </span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-1">
                {/* Summary Metrics Grid */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                  <div className="border-border bg-muted/30 rounded-lg border p-2.5">
                    <span className="text-muted-foreground text-xs">Minimum</span>
                    <p className="text-foreground font-mono text-sm font-semibold tabular-nums">
                      {monthlySpendStats.min}
                    </p>
                  </div>
                  <div className="border-border bg-muted/30 rounded-lg border p-2.5">
                    <span className="text-muted-foreground text-xs">Mean (Avg)</span>
                    <p className="text-foreground font-mono text-sm font-semibold tabular-nums">
                      {monthlySpendStats.mean}
                    </p>
                  </div>
                  <div className="border-border bg-muted/30 rounded-lg border p-2.5">
                    <span className="text-muted-foreground text-xs">Median (P50)</span>
                    <p className="text-foreground font-mono text-sm font-semibold tabular-nums">
                      {monthlySpendStats.median}
                    </p>
                  </div>
                  <div className="border-border bg-muted/30 rounded-lg border p-2.5">
                    <span className="text-muted-foreground text-xs">Maximum</span>
                    <p className="text-foreground font-mono text-sm font-semibold tabular-nums">
                      {monthlySpendStats.max}
                    </p>
                  </div>
                  <div className="border-border bg-muted/30 rounded-lg border p-2.5">
                    <span className="text-muted-foreground text-xs">Std. Deviation</span>
                    <p className="text-foreground font-mono text-sm font-semibold tabular-nums">
                      {monthlySpendStats.stdDev}
                    </p>
                  </div>
                  <div className="border-border bg-muted/30 rounded-lg border p-2.5">
                    <span className="text-muted-foreground text-xs">Interquartile (IQR)</span>
                    <p className="text-foreground font-mono text-sm font-semibold tabular-nums">
                      {monthlySpendStats.iqr}
                    </p>
                  </div>
                </div>

                {/* 10-Bar SVG Histogram */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <BarChart2 className="text-primary size-3.5" />
                      <span className="text-foreground font-medium">10-Bin Distribution Frequency Histogram</span>
                    </div>
                    {hoveredHistBin !== null ? (
                      <span className="text-foreground font-mono tabular-nums">
                        {histogramBins[hoveredHistBin].bin}:{' '}
                        <strong className="text-primary">
                          {histogramBins[hoveredHistBin].count.toLocaleString()} rows
                        </strong>{' '}
                        ({histogramBins[hoveredHistBin].pct}%)
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Hover bar to inspect bin interval</span>
                    )}
                  </div>

                  {/* SVG Histogram Visual */}
                  <div className="border-border bg-muted/20 w-full overflow-x-auto rounded-lg border p-4">
                    <div className="h-44 w-full max-w-[420px] min-w-full">
                      <svg
                        className="h-full w-full overflow-visible"
                        viewBox="0 0 520 140"
                        preserveAspectRatio="none"
                        role="img"
                        aria-label="10-bar distribution histogram for monthly spend in USD"
                      >
                        {/* Background Grid Lines */}
                        <line
                          x1="0"
                          y1="20"
                          x2="520"
                          y2="20"
                          stroke="currentColor"
                          className="text-border/40"
                          strokeDasharray="3 3"
                        />
                        <line
                          x1="0"
                          y1="65"
                          x2="520"
                          y2="65"
                          stroke="currentColor"
                          className="text-border/40"
                          strokeDasharray="3 3"
                        />
                        <line x1="0" y1="110" x2="520" y2="110" stroke="currentColor" className="text-border" />

                        {/* 10 Bars */}
                        {histogramBins.map((bin, idx) => (
                          <g key={idx}>
                            {/* Bar rect */}
                            <rect
                              x={idx * 52 + 6}
                              y={110 - bin.height}
                              width="40"
                              height={bin.height}
                              rx="3"
                              className={cn(
                                'cursor-pointer transition-colors duration-150',
                                hoveredHistBin === idx
                                  ? 'fill-primary text-primary'
                                  : 'fill-primary/75 hover:fill-primary text-primary/75',
                              )}
                              onMouseEnter={() => setHoveredHistBin(idx)}
                              onMouseLeave={() => setHoveredHistBin(null)}
                            />

                            {/* Percentage Label on top of high bars */}
                            {bin.pct >= 5 && (
                              <text
                                x={idx * 52 + 26}
                                y={104 - bin.height}
                                textAnchor="middle"
                                className="fill-foreground font-mono text-xs font-medium select-none"
                              >
                                {bin.pct}%
                              </text>
                            )}
                          </g>
                        ))}
                      </svg>
                    </div>

                    {/* Bin Axis Ticks */}
                    <div className="text-muted-foreground mt-2 grid grid-cols-5 text-center font-mono text-xs tabular-nums">
                      <span className="text-left">$0.00</span>
                      <span>$490</span>
                      <span>$980</span>
                      <span>$1,715</span>
                      <span className="text-right">$2,450</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 2. Column 2: subscription_tier (Categorical + Horizontal Distribution Bars) */}
          {(activeTypeFilter === 'all' || activeTypeFilter === 'categorical') && (
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex size-6 items-center justify-center rounded-md bg-violet-500/10 text-violet-600 dark:text-violet-400">
                        <Tag className="size-3.5" />
                      </div>
                      <CardTitle className="font-mono text-base font-semibold">{subscriptionTierStats.name}</CardTitle>
                      <Badge variant="secondary" className="font-mono text-xs font-normal">
                        {subscriptionTierStats.type}
                      </Badge>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground cursor-pointer"
                        aria-label={`Copy ${subscriptionTierStats.name}`}
                        onClick={() => handleCopy(subscriptionTierStats.name)}
                      >
                        {copiedColumn === subscriptionTierStats.name ? (
                          <Check className="size-3 text-emerald-500" />
                        ) : (
                          <Copy className="size-3" />
                        )}
                      </button>
                    </div>
                    <CardDescription className="text-xs">
                      Active customer plan classification tier. Clean categorical distribution across 4 discrete levels.
                    </CardDescription>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-xs font-normal">
                      Missing:{' '}
                      <span className="ml-1 font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                        {subscriptionTierStats.missingPct}
                      </span>
                    </Badge>
                    <Badge variant="outline" className="text-xs font-normal">
                      Distinct:{' '}
                      <span className="text-foreground ml-1 font-semibold tabular-nums">
                        {subscriptionTierStats.distinctCount} values
                      </span>
                    </Badge>
                    <Badge variant="outline" className="text-xs font-normal">
                      Memory:{' '}
                      <span className="text-foreground ml-1 font-semibold tabular-nums">
                        {subscriptionTierStats.memory}
                      </span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-1">
                {/* Segmented Composite Stacked Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground font-medium">Category Proportions</span>
                    <span className="text-muted-foreground font-mono tabular-nums">148,290 total instances</span>
                  </div>

                  {/* Stacked bar */}
                  <div className="border-border flex h-4 w-full overflow-hidden rounded-full border">
                    {subscriptionTiers.map((tier) => (
                      <div
                        key={tier.name}
                        className={tier.colorClass}
                        style={{ width: `${tier.pct}%` }}
                        title={`${tier.name}: ${tier.pct}% (${tier.count.toLocaleString()} rows)`}
                      />
                    ))}
                  </div>
                </div>

                {/* Detailed Breakdown Rows */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {subscriptionTiers.map((tier) => (
                    <div
                      key={tier.name}
                      className="border-border bg-muted/20 flex flex-col justify-between rounded-lg border p-3.5"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-foreground font-mono text-xs font-semibold">{tier.name}</span>
                          <Badge
                            variant="outline"
                            className={cn('font-mono text-xs font-medium tabular-nums', tier.badgeClass)}
                          >
                            {tier.pct.toFixed(1)}%
                          </Badge>
                        </div>
                        <p className="text-muted-foreground font-mono text-xs tabular-nums">
                          {tier.count.toLocaleString()} rows
                        </p>
                      </div>

                      <div className="mt-3">
                        <div className="bg-muted relative h-1.5 w-full overflow-hidden rounded-full">
                          <div
                            className={cn('h-full rounded-full', tier.colorClass)}
                            style={{ width: `${tier.pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 3. Column 3: account_age_days (Numeric Int32 + Quantiles Box Plot) */}
          {(activeTypeFilter === 'all' || activeTypeFilter === 'numeric') && (
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex size-6 items-center justify-center rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400">
                        <Hash className="size-3.5" />
                      </div>
                      <CardTitle className="font-mono text-base font-semibold">{accountAgeStats.name}</CardTitle>
                      <Badge variant="secondary" className="font-mono text-xs font-normal">
                        {accountAgeStats.type}
                      </Badge>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground cursor-pointer"
                        aria-label={`Copy ${accountAgeStats.name}`}
                        onClick={() => handleCopy(accountAgeStats.name)}
                      >
                        {copiedColumn === accountAgeStats.name ? (
                          <Check className="size-3 text-emerald-500" />
                        ) : (
                          <Copy className="size-3" />
                        )}
                      </button>
                    </div>
                    <CardDescription className="text-xs">
                      Total account tenure in days since initial signup. Box plot shows median at 180d with Q1-Q3
                      interquartile band.
                    </CardDescription>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-xs font-normal">
                      Missing:{' '}
                      <span className="ml-1 font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                        {accountAgeStats.missingPct} (42 rows)
                      </span>
                    </Badge>
                    <Badge variant="outline" className="text-xs font-normal">
                      Distinct:{' '}
                      <span className="text-foreground ml-1 font-semibold tabular-nums">
                        {accountAgeStats.distinctCount}
                      </span>
                    </Badge>
                    <Badge variant="outline" className="text-xs font-normal">
                      Memory:{' '}
                      <span className="text-foreground ml-1 font-semibold tabular-nums">{accountAgeStats.memory}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-1">
                {/* Quantile Stats Grid */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                  <div className="border-border bg-muted/30 rounded-lg border p-2.5 text-center">
                    <span className="text-muted-foreground text-xs">Min (0%)</span>
                    <p className="text-foreground font-mono text-sm font-semibold tabular-nums">
                      {accountAgeStats.min}
                    </p>
                  </div>
                  <div className="border-border bg-muted/30 rounded-lg border p-2.5 text-center">
                    <span className="text-muted-foreground text-xs">Q1 (P25)</span>
                    <p className="text-foreground font-mono text-sm font-semibold tabular-nums">
                      {accountAgeStats.p25}
                    </p>
                  </div>
                  <div className="border-primary/40 bg-primary/5 rounded-lg border p-2.5 text-center shadow-xs">
                    <span className="text-primary text-xs font-medium">Median (P50)</span>
                    <p className="text-primary font-mono text-sm font-bold tabular-nums">{accountAgeStats.p50}</p>
                  </div>
                  <div className="border-border bg-muted/30 rounded-lg border p-2.5 text-center">
                    <span className="text-muted-foreground text-xs">Q3 (P75)</span>
                    <p className="text-foreground font-mono text-sm font-semibold tabular-nums">
                      {accountAgeStats.p75}
                    </p>
                  </div>
                  <div className="border-border bg-muted/30 rounded-lg border p-2.5 text-center">
                    <span className="text-muted-foreground text-xs">P95</span>
                    <p className="text-foreground font-mono text-sm font-semibold tabular-nums">
                      {accountAgeStats.p95}
                    </p>
                  </div>
                  <div className="border-border bg-muted/30 rounded-lg border p-2.5 text-center">
                    <span className="text-muted-foreground text-xs">P99</span>
                    <p className="text-foreground font-mono text-sm font-semibold tabular-nums">
                      {accountAgeStats.p99}
                    </p>
                  </div>
                  <div className="border-border bg-muted/30 rounded-lg border p-2.5 text-center">
                    <span className="text-muted-foreground text-xs">Max</span>
                    <p className="text-foreground font-mono text-sm font-semibold tabular-nums">
                      {accountAgeStats.max}
                    </p>
                  </div>
                </div>

                {/* Box Plot SVG Representation */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground font-medium">Quantile Box & Whisker Plot</span>
                    <span className="text-muted-foreground font-mono tabular-nums">IQR = 323 days (P75 - P25)</span>
                  </div>

                  <div className="border-border bg-muted/20 w-full overflow-x-auto rounded-lg border p-4">
                    <div className="h-28 w-full max-w-[420px] min-w-full">
                      <svg
                        className="h-full w-full overflow-visible"
                        viewBox="0 0 500 90"
                        preserveAspectRatio="none"
                        role="img"
                        aria-label="Box plot visualization of account age quantiles"
                      >
                        {/* Axis Baseline */}
                        <line x1="30" y1="72" x2="470" y2="72" stroke="currentColor" className="text-border" />

                        {/* Left Whisker: Min to Q1 */}
                        <line
                          x1="31"
                          y1="36"
                          x2="51"
                          y2="36"
                          stroke="currentColor"
                          className="text-foreground"
                          strokeWidth="2"
                        />
                        {/* Min Cap */}
                        <line
                          x1="31"
                          y1="24"
                          x2="31"
                          y2="48"
                          stroke="currentColor"
                          className="text-foreground"
                          strokeWidth="2"
                        />

                        {/* Right Whisker: Q3 to P99 */}
                        <line
                          x1="208"
                          y1="36"
                          x2="382"
                          y2="36"
                          stroke="currentColor"
                          className="text-foreground"
                          strokeWidth="2"
                        />
                        {/* P99 Cap */}
                        <line
                          x1="382"
                          y1="24"
                          x2="382"
                          y2="48"
                          stroke="currentColor"
                          className="text-foreground"
                          strokeWidth="2"
                        />

                        {/* Interquartile Box (Q1 to Q3) */}
                        <rect
                          x="51"
                          y="18"
                          width="157"
                          height="36"
                          rx="3"
                          className="fill-primary/20 stroke-primary"
                          strokeWidth="2"
                        />

                        {/* Median (P50) Line */}
                        <line x1="118" y1="18" x2="118" y2="54" className="stroke-primary" strokeWidth="3" />

                        {/* Outlier Points (P99 to Max: 780d, 820d, 850d) */}
                        <circle cx="411" cy="36" r="3.5" className="fill-muted-foreground/60 stroke-foreground" />
                        <circle cx="431" cy="36" r="3.5" className="fill-muted-foreground/60 stroke-foreground" />
                        <circle cx="446" cy="36" r="3.5" className="fill-muted-foreground/60 stroke-foreground" />

                        {/* Tick Labels on Axis */}
                        <text x="31" y="86" textAnchor="middle" className="fill-muted-foreground font-mono text-xs">
                          1d (Min)
                        </text>
                        <text x="51" y="86" textAnchor="middle" className="fill-muted-foreground font-mono text-xs">
                          42d
                        </text>
                        <text x="118" y="86" textAnchor="middle" className="fill-primary font-mono text-xs font-bold">
                          180d (Med)
                        </text>
                        <text x="208" y="86" textAnchor="middle" className="fill-muted-foreground font-mono text-xs">
                          365d
                        </text>
                        <text x="382" y="86" textAnchor="middle" className="fill-muted-foreground font-mono text-xs">
                          720d (P99)
                        </text>
                        <text x="446" y="86" textAnchor="middle" className="fill-muted-foreground font-mono text-xs">
                          850d (Max)
                        </text>
                      </svg>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 4. Column 4: has_cancelled (Boolean) */}
          {(activeTypeFilter === 'all' || activeTypeFilter === 'boolean') && (
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex size-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <Binary className="size-3.5" />
                      </div>
                      <CardTitle className="font-mono text-base font-semibold">{hasCancelledStats.name}</CardTitle>
                      <Badge variant="secondary" className="font-mono text-xs font-normal">
                        {hasCancelledStats.type}
                      </Badge>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground cursor-pointer"
                        aria-label={`Copy ${hasCancelledStats.name}`}
                        onClick={() => handleCopy(hasCancelledStats.name)}
                      >
                        {copiedColumn === hasCancelledStats.name ? (
                          <Check className="size-3 text-emerald-500" />
                        ) : (
                          <Copy className="size-3" />
                        )}
                      </button>
                    </div>
                    <CardDescription className="text-xs">
                      Binary churn indicator flag. 14.2% positive cancellation rate against 85.8% retained base.
                    </CardDescription>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-xs font-normal">
                      Missing:{' '}
                      <span className="ml-1 font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                        {hasCancelledStats.missingPct}
                      </span>
                    </Badge>
                    <Badge variant="outline" className="text-xs font-normal">
                      Distinct:{' '}
                      <span className="text-foreground ml-1 font-semibold tabular-nums">
                        {hasCancelledStats.distinctCount} values
                      </span>
                    </Badge>
                    <Badge variant="outline" className="text-xs font-normal">
                      Memory:{' '}
                      <span className="text-foreground ml-1 font-semibold tabular-nums">
                        {hasCancelledStats.memory}
                      </span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6 pt-1">
                {/* Boolean Split Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground font-medium">Boolean Ratio Distribution</span>
                    <span className="text-muted-foreground font-mono tabular-nums">Class Imbalance: 1 : 6.04</span>
                  </div>

                  {/* Two-Tone Split Bar */}
                  <div className="border-border flex h-4 w-full overflow-hidden rounded-full border">
                    <div
                      className="bg-emerald-500 transition-all"
                      style={{ width: `${hasCancelledStats.falsePct}%` }}
                      title={`False: ${hasCancelledStats.falsePct}% (${hasCancelledStats.falseCount.toLocaleString()} rows)`}
                    />
                    <div
                      className="bg-rose-500 transition-all"
                      style={{ width: `${hasCancelledStats.truePct}%` }}
                      title={`True: ${hasCancelledStats.truePct}% (${hasCancelledStats.trueCount.toLocaleString()} rows)`}
                    />
                  </div>
                </div>

                {/* Value Breakdown Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* False / Active */}
                  <div className="border-border bg-muted/20 flex flex-col justify-between rounded-lg border p-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="size-2 rounded-full bg-emerald-500" />
                          <span className="text-foreground font-mono text-xs font-semibold">
                            False (Active / Retained)
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-emerald-500/30 font-mono text-xs font-medium text-emerald-600 tabular-nums dark:text-emerald-400"
                        >
                          {hasCancelledStats.falsePct}%
                        </Badge>
                      </div>
                      <p className="text-muted-foreground font-mono text-xs tabular-nums">
                        {hasCancelledStats.falseCount.toLocaleString()} instances
                      </p>
                    </div>
                    <div className="mt-3">
                      <Progress
                        value={hasCancelledStats.falsePct}
                        className="h-1.5 [&_[data-slot=progress-indicator]]:bg-emerald-500"
                      />
                    </div>
                  </div>

                  {/* True / Cancelled */}
                  <div className="border-border bg-muted/20 flex flex-col justify-between rounded-lg border p-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="size-2 rounded-full bg-rose-500" />
                          <span className="text-foreground font-mono text-xs font-semibold">
                            True (Cancelled / Churned)
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-rose-500/30 font-mono text-xs font-medium text-rose-600 tabular-nums dark:text-rose-400"
                        >
                          {hasCancelledStats.truePct}%
                        </Badge>
                      </div>
                      <p className="text-muted-foreground font-mono text-xs tabular-nums">
                        {hasCancelledStats.trueCount.toLocaleString()} instances
                      </p>
                    </div>
                    <div className="mt-3">
                      <Progress
                        value={hasCancelledStats.truePct}
                        className="h-1.5 [&_[data-slot=progress-indicator]]:bg-rose-500"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

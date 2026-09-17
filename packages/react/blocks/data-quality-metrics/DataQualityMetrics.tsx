'use client'

import * as React from 'react'
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
} from 'lucide-react'
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
  className?: string
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

export function DataQualityMetrics({
  datasetTitle = 'production_analytics.dim_users',
  suiteName = 'user_profile_integrity_v3',
  qualityScore = 98.4,
  lastRun = 'Ran 14m ago · 48 assertions evaluated',
  passedAssertions = '47 / 48 Passing · 98%',
  failedWarnings = '1 Warning · Null phone numbers 1.2%',
  schemaDriftStatus = '0 breaking schema changes',
  totalRowsAudited = '1,480,000 rows',
  assertions = defaultAssertions,
  className,
}: DataQualityMetricsProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all')
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')
  const [isRunningSuite, setIsRunningSuite] = React.useState(false)
  const [currentLastRun, setCurrentLastRun] = React.useState(lastRun)
  const [selectedAssertion, setSelectedAssertion] = React.useState<AssertionItem | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
  const [copiedSnippetKey, setCopiedSnippetKey] = React.useState<string | null>(null)
  const [exportSuccess, setExportSuccess] = React.useState(false)
  const [anomalyExportSuccess, setAnomalyExportSuccess] = React.useState(false)

  const availableCategories = React.useMemo(() => {
    const categories = new Set<string>()
    assertions.forEach((item) => categories.add(item.category))
    return ['all', ...Array.from(categories)]
  }, [assertions])

  const filteredAssertions = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    const statusFilter = selectedStatus
    const categoryFilter = selectedCategory

    return assertions.filter((item) => {
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
  }, [assertions, searchQuery, selectedStatus, selectedCategory])

  const handleRunSuite = React.useCallback(() => {
    if (isRunningSuite) return
    setIsRunningSuite(true)

    setTimeout(() => {
      setIsRunningSuite(false)
      setCurrentLastRun('Ran just now · 48 assertions evaluated')
    }, 750)
  }, [isRunningSuite])

  const handleInspectAnomalies = React.useCallback((assertion: AssertionItem) => {
    setSelectedAssertion(assertion)
    setIsDrawerOpen(true)
  }, [])

  const copyCodeSnippet = React.useCallback((key: string, content: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(content)
      setCopiedSnippetKey(key)
      setTimeout(() => {
        setCopiedSnippetKey((curr) => (curr === key ? null : curr))
      }, 2000)
    }
  }, [])

  const exportQualityReport = React.useCallback(() => {
    const report = {
      dataset: datasetTitle,
      suite: suiteName,
      overallQualityScore: qualityScore,
      evaluatedAt: new Date().toISOString(),
      engine: 'Great Expectations v0.18 / SodaCL',
      summary: {
        passed: passedAssertions,
        warnings: failedWarnings,
        schemaDrift: schemaDriftStatus,
        totalRows: totalRowsAudited,
      },
      assertions,
    }

    const jsonStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2))
    if (typeof document !== 'undefined') {
      const link = document.createElement('a')
      link.setAttribute('href', jsonStr)
      link.setAttribute('download', `dq-report-${suiteName}-${new Date().toISOString().slice(0, 10)}.json`)
      document.body.appendChild(link)
      link.click()
      link.remove()

      setExportSuccess(true)
      setTimeout(() => {
        setExportSuccess(false)
      }, 2000)
    }
  }, [
    datasetTitle,
    suiteName,
    qualityScore,
    passedAssertions,
    failedWarnings,
    schemaDriftStatus,
    totalRowsAudited,
    assertions,
  ])

  const exportAnomalyCsv = React.useCallback(() => {
    if (!selectedAssertion || selectedAssertion.anomalies.length === 0) return

    const headers = ['Record ID', 'Column', 'Observed Value', 'Failure Reason']
    const rows = selectedAssertion.anomalies.map((a) => [a.recordId, a.column, `"${a.value}"`, `"${a.reason}"`])
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `anomalies-${selectedAssertion.columnName}.csv`)
    document.body.appendChild(link)
    link.click()
    link.remove()

    setAnomalyExportSuccess(true)
    setTimeout(() => {
      setAnomalyExportSuccess(false)
    }, 2000)
  }, [selectedAssertion])

  return (
    <div data-slot="data-quality-metrics" className={cn('w-full space-y-6', className)}>
      {/* Header Section */}
      <Card className="border-border bg-card shadow-xs">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Left: Dataset and Suite Metadata */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="bg-muted text-foreground border-border flex size-9 shrink-0 items-center justify-center rounded-lg border shadow-xs">
                  <Database className="size-4.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-foreground font-mono text-lg font-bold tracking-tight break-all sm:text-xl">
                      {datasetTitle}
                    </h1>
                    <Badge wrap variant="secondary" className="font-mono text-xs">
                      {suiteName}
                    </Badge>
                  </div>
                  <div className="text-muted-foreground flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" />
                      {currentLastRun}
                    </span>
                    <span className="opacity-40">·</span>
                    <span className="font-mono">Snowflake DW</span>
                    <span className="opacity-40">·</span>
                    <span className="font-mono">dbt Core v1.8</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Overall Score Card & Action Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Overall Score Pill Card */}
              <div className="flex flex-wrap items-center gap-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 shadow-xs">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-6" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-2xl font-bold tracking-tight text-emerald-600 tabular-nums sm:text-3xl dark:text-emerald-400">
                      {qualityScore}%
                    </span>
                    <Badge wrap variant="success" className="gap-1 px-2 text-xs font-semibold">
                      <Sparkles className="size-3" />
                      Quality Score
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">Automated Sodacl / GX Engine</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2.5 sm:flex-col">
                <Button
                  variant="default"
                  size="sm"
                  className="gap-2 shadow-xs"
                  disabled={isRunningSuite}
                  onClick={handleRunSuite}
                >
                  <RefreshCw className={cn('size-4', isRunningSuite && 'animate-spin')} />
                  <span>{isRunningSuite ? 'Evaluating Suite...' : 'Run Assertions Suite'}</span>
                </Button>

                <Button variant="outline" size="sm" className="gap-2 shadow-xs" onClick={exportQualityReport}>
                  {exportSuccess ? <Check className="text-success size-4" /> : <Download className="size-4" />}
                  <span>{exportSuccess ? 'Report Downloaded!' : 'Export Quality Report'}</span>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Sub-bar Contract Guarantee */}
        <div className="bg-muted/40 border-border text-muted-foreground flex flex-col gap-2 border-t px-5 py-2.5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-mono">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span>Schema Contract: Locked v3.2 · Zero Breaking Schema Drift</span>
          </div>
          <div className="flex items-center gap-3">
            <span>
              Engine SLA: <strong className="text-foreground font-medium">Strict Production</strong>
            </span>
            <Separator orientation="vertical" className="hidden h-3 sm:block" />
            <span>48 assertions evaluated</span>
          </div>
        </div>
      </Card>

      {/* 4 Assertion Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Passed Assertions */}
        <Card className="border-border bg-card hover:border-border shadow-xs transition-colors">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-start justify-between gap-2">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Passed Assertions</p>
              <div className="flex size-7 items-center justify-center rounded-md border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">47 / 48</span>
              <Badge wrap variant="success" className="text-xs font-medium">
                98% Passing
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 p-4 pt-1">
            <Progress value={98} className="h-1.5 w-full" />
            <p className="text-muted-foreground text-xs">{passedAssertions}</p>
          </CardContent>
        </Card>

        {/* Card 2: Failed / Warnings */}
        <Card className="border-border bg-card hover:border-border shadow-xs transition-colors">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-start justify-between gap-2">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Failed / Warnings</p>
              <div className="flex size-7 items-center justify-center rounded-md border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="size-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">
                1 Warning
              </span>
              <Badge wrap variant="warning" className="text-xs font-medium">
                1.2% Non-conformant
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 p-4 pt-1">
            <Progress value={1.2} className="h-1.5 w-full" />
            <p className="text-muted-foreground text-xs">{failedWarnings}</p>
          </CardContent>
        </Card>

        {/* Card 3: Schema Drift Status */}
        <Card className="border-border bg-card hover:border-border shadow-xs transition-colors">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-start justify-between gap-2">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Schema Drift Status</p>
              <div className="flex size-7 items-center justify-center rounded-md border border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <GitBranch className="size-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">
                0 Breaking
              </span>
              <Badge wrap variant="outline" className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                No Drift
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 p-4 pt-1">
            <div className="bg-muted/40 flex items-center justify-between gap-x-2 rounded-md px-2 py-1 text-xs">
              <span className="text-muted-foreground">Columns Synced</span>
              <span className="text-foreground font-mono font-medium">14 / 14 matched</span>
            </div>
            <p className="text-muted-foreground text-xs">{schemaDriftStatus}</p>
          </CardContent>
        </Card>

        {/* Card 4: Total Rows Audited */}
        <Card className="border-border bg-card hover:border-border shadow-xs transition-colors">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-start justify-between gap-2">
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Total Rows Audited</p>
              <div className="bg-muted text-foreground border-border flex size-7 items-center justify-center rounded-md border">
                <Layers className="size-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">
                1,480,000
              </span>
              <Badge wrap variant="outline" className="font-mono text-xs font-normal">
                1.48M Rows
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 p-4 pt-1">
            <div className="bg-muted/40 flex items-center justify-between gap-x-2 rounded-md px-2 py-1 text-xs">
              <span className="text-muted-foreground">Partition Range</span>
              <span className="text-foreground font-mono font-medium">1.0M .. 2.0M</span>
            </div>
            <p className="text-muted-foreground text-xs">{totalRowsAudited}</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Quality Test Assertions Table Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="flex flex-col gap-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold">Data Quality Test Assertions</CardTitle>
              <Badge wrap variant="secondary" className="font-mono text-xs">
                {filteredAssertions.length} of {assertions.length} Assertions
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Automated expectations, boundary validations, regex format rules, and volume anomaly checks.
            </CardDescription>
          </div>

          {/* Filter Pills by Status */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              className={cn(
                'focus-visible:ring-ring inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                selectedStatus === 'all'
                  ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                  : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
              onClick={() => setSelectedStatus('all')}
            >
              All Assertions ({assertions.length})
            </button>
            <button
              type="button"
              className={cn(
                'focus-visible:ring-ring inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                selectedStatus === 'passing'
                  ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs dark:bg-emerald-600'
                  : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
              onClick={() => setSelectedStatus('passing')}
            >
              Passing (4)
            </button>
            <button
              type="button"
              className={cn(
                'focus-visible:ring-ring inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                selectedStatus === 'warning'
                  ? 'border-amber-600 bg-amber-600 text-white shadow-xs dark:bg-amber-600'
                  : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
              onClick={() => setSelectedStatus('warning')}
            >
              Warnings (1)
            </button>
          </div>
        </CardHeader>

        {/* Filter & Search Toolbar */}
        <div className="border-border/60 border-t p-4 pt-3 pb-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Search by assertion type, column name, or rule definition..."
                className="border-border bg-background placeholder:text-muted-foreground focus-visible:ring-ring h-8 w-full rounded-md border px-3 pl-8 text-xs focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-muted-foreground mr-1 flex items-center gap-1 text-xs font-medium">
                <Filter className="size-3" />
                Category:
              </span>
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={cn(
                    'focus-visible:ring-ring inline-flex items-center rounded-md border px-2 py-1 font-mono text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                    selectedCategory === cat
                      ? 'border-foreground bg-foreground text-background shadow-xs'
                      : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground',
                  )}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table Container */}
        <CardContent className="p-0">
          <div className="border-border/60 overflow-x-auto border-t">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="min-w-[260px] text-xs">Assertion & Target Column</TableHead>
                  <TableHead className="min-w-[100px] text-xs">Category</TableHead>
                  <TableHead className="min-w-[120px] text-xs">Target Threshold</TableHead>
                  <TableHead className="min-w-[120px] text-xs">Observed Value</TableHead>
                  <TableHead className="min-w-[110px] text-xs">Status</TableHead>
                  <TableHead className="min-w-[130px] text-right text-xs">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssertions.map((assertion) => (
                  <TableRow key={assertion.id} className="hover:bg-muted/20 transition-colors">
                    {/* Assertion Type & Target Column */}
                    <TableCell className="py-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge wrap variant="outline" className="border-border font-mono text-xs font-semibold">
                            {assertion.columnName}
                          </Badge>
                          <span className="text-foreground font-mono text-xs font-medium">
                            {assertion.assertionType}
                          </span>
                        </div>
                        <p className="text-muted-foreground max-w-sm text-xs leading-relaxed sm:max-w-md">
                          {assertion.ruleDefinition}
                        </p>
                      </div>
                    </TableCell>

                    {/* Category */}
                    <TableCell className="py-3">
                      <Badge wrap variant="secondary" className="font-normal">
                        {assertion.category}
                      </Badge>
                    </TableCell>

                    {/* Target Threshold */}
                    <TableCell className="py-3">
                      <span className="text-muted-foreground font-mono text-xs font-medium">
                        {assertion.targetThreshold}
                      </span>
                    </TableCell>

                    {/* Observed Value */}
                    <TableCell className="py-3">
                      <div className="space-y-0.5 font-mono text-xs">
                        <span
                          className={cn(
                            'font-bold tabular-nums',
                            assertion.status === 'Passing'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-amber-600 dark:text-amber-400',
                          )}
                        >
                          {assertion.observedValue}
                        </span>
                        <span className="text-muted-foreground/70 block text-xs">{assertion.executionTime} eval</span>
                      </div>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="py-3">
                      <Badge wrap variant={assertion.statusVariant} className="gap-1 text-xs font-medium">
                        {assertion.status === 'Passing' ? (
                          <CheckCircle2 className="size-3" />
                        ) : assertion.status === 'Warning' ? (
                          <AlertTriangle className="size-3" />
                        ) : (
                          <AlertCircle className="size-3" />
                        )}
                        {assertion.status}
                      </Badge>
                    </TableCell>

                    {/* Action Button */}
                    <TableCell className="py-3 text-right">
                      <Button
                        variant="outline"
                        size="xs"
                        className="h-7 gap-1 text-xs font-medium shadow-xs"
                        onClick={() => handleInspectAnomalies(assertion)}
                      >
                        <Activity className="size-3" />
                        <span>Inspect Anomalies</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredAssertions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-8 text-center">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <ShieldCheck className="size-7 text-emerald-500" />
                        <p className="text-foreground text-sm font-medium">No assertions match your filter query</p>
                        <p className="text-muted-foreground text-xs">
                          All assertions meet standard quality constraints.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Table Footer */}
          <div className="border-border/60 bg-muted/20 text-muted-foreground flex flex-col gap-2 border-t px-4 py-2.5 text-xs sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>Great Expectations Assertions Runner: 100% evaluated</span>
            </div>
            <span className="font-mono text-xs">Dataset: {datasetTitle} · Last Batch: 1,480,000 rows</span>
          </div>
        </CardContent>
      </Card>

      {/* Anomaly Inspector Drawer / Sheet */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="w-full space-y-6 overflow-y-auto p-6 sm:max-w-xl md:max-w-2xl">
          {selectedAssertion && (
            <>
              <SheetHeader className="space-y-2 p-0 text-left">
                <div className="flex items-center justify-between gap-3 pr-6">
                  <div className="flex items-center gap-2">
                    <Badge
                      wrap
                      variant={selectedAssertion.statusVariant}
                      className="gap-1 font-mono text-xs font-semibold"
                    >
                      {selectedAssertion.status === 'Passing' ? (
                        <CheckCircle2 className="size-3" />
                      ) : (
                        <AlertTriangle className="size-3" />
                      )}
                      {selectedAssertion.status.toUpperCase()}
                    </Badge>
                    <Badge wrap variant="outline" className="font-mono text-xs font-semibold">
                      {selectedAssertion.category}
                    </Badge>
                  </div>

                  <span className="text-muted-foreground font-mono text-xs">
                    Latency: {selectedAssertion.executionTime}
                  </span>
                </div>

                <SheetTitle className="text-lg font-bold tracking-tight">{selectedAssertion.assertionType}</SheetTitle>
                <SheetDescription className="text-foreground/90 font-mono text-xs">
                  Target Column:{' '}
                  <strong className="text-foreground font-semibold">{selectedAssertion.columnName}</strong>
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-5 text-xs">
                {/* Summary Metrics Cards Grid */}
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  <div className="bg-muted/40 border-border/80 rounded-lg border p-3">
                    <span className="text-muted-foreground text-xs">Target Threshold</span>
                    <p className="text-foreground mt-1 font-mono text-sm font-bold">
                      {selectedAssertion.targetThreshold}
                    </p>
                  </div>
                  <div className="bg-muted/40 border-border/80 rounded-lg border p-3">
                    <span className="text-muted-foreground text-xs">Observed Pass Rate</span>
                    <p
                      className={cn(
                        'mt-1 font-mono text-sm font-bold tabular-nums',
                        selectedAssertion.status === 'Passing'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-amber-600 dark:text-amber-400',
                      )}
                    >
                      {selectedAssertion.observedValue}
                    </p>
                  </div>
                  <div className="bg-muted/40 border-border/80 rounded-lg border p-3">
                    <span className="text-muted-foreground text-xs">Audited Records</span>
                    <p className="text-foreground mt-1 font-mono text-sm font-bold tabular-nums">
                      {selectedAssertion.totalEvaluated.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-muted/40 border-border/80 rounded-lg border p-3">
                    <span className="text-muted-foreground text-xs">Failed Anomalies</span>
                    <p
                      className={cn(
                        'mt-1 font-mono text-sm font-bold tabular-nums',
                        selectedAssertion.failedCount > 0
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-emerald-600 dark:text-emerald-400',
                      )}
                    >
                      {selectedAssertion.failedCount.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Expectation Configuration DSL Box */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-x-2">
                    <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                      Great Expectations Specification
                    </h3>
                    <Button
                      variant="ghost"
                      size="xs"
                      className="h-6 gap-1 px-2 text-xs"
                      onClick={() =>
                        copyCodeSnippet('dsl', JSON.stringify(selectedAssertion.expectationConfig, null, 2))
                      }
                    >
                      {copiedSnippetKey === 'dsl' ? (
                        <Check className="size-3 text-emerald-500" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                      <span>{copiedSnippetKey === 'dsl' ? 'Copied' : 'Copy Config'}</span>
                    </Button>
                  </div>
                  <div className="overflow-hidden rounded-md border bg-zinc-950 font-mono text-xs text-zinc-100 shadow-inner">
                    <div className="flex items-center gap-2 border-b border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs text-zinc-400">
                      <FileCode2 className="size-3.5" />
                      <span>expectation_suite.json</span>
                    </div>
                    <pre className="overflow-x-auto p-3 text-xs leading-relaxed text-zinc-300 select-text">
                      {JSON.stringify(selectedAssertion.expectationConfig, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Anomalous Samples Table or Clean Pass State */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-x-2">
                    <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                      Anomalous Sample Records
                    </h3>
                    {selectedAssertion.anomalies.length > 0 && (
                      <span className="text-muted-foreground font-mono text-xs">
                        Showing {selectedAssertion.anomalies.length} failure samples
                      </span>
                    )}
                  </div>

                  {selectedAssertion.anomalies.length > 0 ? (
                    <div className="border-border/80 overflow-hidden rounded-md border shadow-xs">
                      <Table>
                        <TableHeader className="bg-muted/40">
                          <TableRow>
                            <TableHead className="text-xs">Record ID</TableHead>
                            <TableHead className="text-xs">Column</TableHead>
                            <TableHead className="text-xs">Observed Value</TableHead>
                            <TableHead className="text-xs">Diagnostic Reason</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedAssertion.anomalies.map((anomaly) => (
                            <TableRow key={anomaly.recordId}>
                              <TableCell className="font-mono text-xs font-medium">{anomaly.recordId}</TableCell>
                              <TableCell className="font-mono text-xs">{anomaly.column}</TableCell>
                              <TableCell className="font-mono text-xs font-semibold text-rose-600 dark:text-rose-400">
                                {anomaly.value}
                              </TableCell>
                              <TableCell className="text-muted-foreground text-xs">{anomaly.reason}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="bg-muted/20 border-border/80 flex flex-col items-center justify-center gap-1.5 rounded-md border p-6 text-center">
                      <CheckCircle2 className="size-6 text-emerald-500" />
                      <p className="text-foreground text-xs font-semibold">Zero Anomalies Detected</p>
                      <p className="text-muted-foreground text-xs">
                        All {selectedAssertion.totalEvaluated.toLocaleString()} audited records strictly satisfied the
                        expectation rule.
                      </p>
                    </div>
                  )}
                </div>

                {/* Quarantine SQL Script */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-x-2">
                    <h3 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                      Quarantine & Remediation SQL
                    </h3>
                    <Button
                      variant="ghost"
                      size="xs"
                      className="h-6 gap-1 px-2 text-xs"
                      onClick={() => copyCodeSnippet('sql', selectedAssertion.remediationQuery)}
                    >
                      {copiedSnippetKey === 'sql' ? (
                        <Check className="size-3 text-emerald-500" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                      <span>{copiedSnippetKey === 'sql' ? 'Copied' : 'Copy SQL'}</span>
                    </Button>
                  </div>
                  <div className="border-border bg-muted/60 rounded-md border p-3 font-mono text-xs leading-relaxed select-text">
                    <pre className="text-foreground overflow-x-auto whitespace-pre-wrap">
                      {selectedAssertion.remediationQuery}
                    </pre>
                  </div>
                </div>
              </div>

              <SheetFooter className="border-border/80 flex flex-row items-center justify-end gap-2 border-t pt-4">
                <SheetClose asChild>
                  <Button variant="outline" size="sm" className="text-xs">
                    Close
                  </Button>
                </SheetClose>

                {selectedAssertion.anomalies.length > 0 && (
                  <Button
                    variant="default"
                    size="sm"
                    className="gap-1.5 text-xs font-medium shadow-xs"
                    onClick={exportAnomalyCsv}
                  >
                    {anomalyExportSuccess ? (
                      <Check className="size-3.5 text-emerald-300" />
                    ) : (
                      <Download className="size-3.5" />
                    )}
                    <span>{anomalyExportSuccess ? 'Anomalies Exported!' : 'Export Anomaly CSV'}</span>
                  </Button>
                )}
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

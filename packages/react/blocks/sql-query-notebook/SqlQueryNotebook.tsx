'use client'

import * as React from 'react'
import {
  BarChart3,
  Check,
  Clock,
  Copy,
  Database,
  Download,
  FileCode2,
  FileText,
  Layers,
  Loader2,
  Play,
  Plus,
  Sparkles,
  Table2,
  Terminal,
  Trash2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface CohortRow {
  signup_cohort: string
  cohort_label: string
  total_customers: number
  avg_mrr: number
  cohort_ltv: number
  expansion_rate: string
  retention_score: number
}

export interface SqlQueryNotebookProps {
  className?: string
}

const initialCohortResults: CohortRow[] = [
  {
    signup_cohort: '2026-06-01',
    cohort_label: 'Jun 2026',
    total_customers: 4820,
    avg_mrr: 248.5,
    cohort_ltv: 1428500.0,
    expansion_rate: '+18.4%',
    retention_score: 94,
  },
  {
    signup_cohort: '2026-05-01',
    cohort_label: 'May 2026',
    total_customers: 3940,
    avg_mrr: 232.1,
    cohort_ltv: 1148200.0,
    expansion_rate: '+14.1%',
    retention_score: 89,
  },
  {
    signup_cohort: '2026-04-01',
    cohort_label: 'Apr 2026',
    total_customers: 3110,
    avg_mrr: 219.8,
    cohort_ltv: 924100.0,
    expansion_rate: '+11.8%',
    retention_score: 85,
  },
  {
    signup_cohort: '2026-03-01',
    cohort_label: 'Mar 2026',
    total_customers: 2420,
    avg_mrr: 198.4,
    cohort_ltv: 682900.0,
    expansion_rate: '+8.6%',
    retention_score: 81,
  },
]

const sqlQuery = `SELECT 
  DATE_TRUNC('month', created_at) AS signup_cohort,
  COUNT(DISTINCT customer_id) AS total_customers,
  ROUND(AVG(mrr), 2) AS avg_mrr,
  ROUND(SUM(lifetime_value), 2) AS cohort_ltv
FROM analytics.fct_subscriptions
WHERE created_at >= '2026-01-01'
GROUP BY 1 ORDER BY 1 DESC;`

function highlightSqlLine(line: string): string {
  if (!line.trim()) return '&nbsp;'

  const escaped = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  // Single line comments
  if (/^\s*--/.test(escaped)) {
    return `<span class="text-zinc-500 italic">${escaped}</span>`
  }

  // Every emitted <span> is parked behind a letter-only placeholder so later
  // passes cannot match inside the markup they already produced (the numeric
  // pass used to rewrite the `400` inside `text-purple-400` and shred the tag).
  const parked: string[] = []
  const park = (html: string) => {
    const key = String(parked.length)
      .split('')
      .map((d) => String.fromCharCode(97 + Number(d)))
      .join('')
    parked.push(html)
    return `\u0000${key}\u0000`
  }

  let out = escaped

  // Strings (Emerald)
  out = out.replace(/(['"])(?:(?=(\\?))\2.)*?\1/g, (m) =>
    park(`<span class="text-emerald-400 font-normal">${m}</span>`),
  )

  // SQL Functions (Sky / Blue)
  out = out.replace(
    /\b(DATE_TRUNC|COUNT|DISTINCT|ROUND|AVG|SUM|MIN|MAX|COALESCE|CAST|CONCAT|NOW|CURRENT_TIMESTAMP)\b/g,
    (m) => park(`<span class="text-sky-400 font-semibold">${m}</span>`),
  )

  // SQL Keywords (Purple / Indigo)
  out = out.replace(
    /\b(SELECT|FROM|WHERE|GROUP BY|ORDER BY|GROUP|ORDER|BY|DESC|ASC|AS|AND|OR|NOT|IN|ON|JOIN|LEFT|RIGHT|INNER|OUTER|LIMIT|HAVING|UNION|ALL|CASE|WHEN|THEN|ELSE|END|WITH)\b/g,
    (m) => park(`<span class="text-purple-400 font-semibold">${m}</span>`),
  )

  // Numbers (Amber)
  out = out.replace(/\b(\d+(\.\d+)?)\b/g, (m) => park(`<span class="text-amber-400 font-mono">${m}</span>`))

  // Restore every parked span
  return out.replace(/\u0000([a-j]+)\u0000/g, (_, key: string) => {
    const idx = Number(
      key
        .split('')
        .map((c: string) => String(c.charCodeAt(0) - 97))
        .join(''),
    )
    return parked[idx] ?? ''
  })
}

export function SqlQueryNotebook({ className }: SqlQueryNotebookProps) {
  const [isRunningAll, setIsRunningAll] = React.useState(false)
  const [isCellRunning, setIsCellRunning] = React.useState(false)
  const [lastSaved, setLastSaved] = React.useState('Autosaved 1m ago')
  const [activeCell, setActiveCell] = React.useState<'doc' | 'sql' | 'extra'>('sql')
  const [activeResultTab, setActiveResultTab] = React.useState<'table' | 'chart'>('table')
  const [copiedSql, setCopiedSql] = React.useState(false)
  const [copiedCsv, setCopiedCsv] = React.useState(false)
  const [hoveredSqlLine, setHoveredSqlLine] = React.useState<number | null>(null)
  const [executionTime, setExecutionTime] = React.useState('1.24s')
  const [rowCount] = React.useState(14290)
  const [lastExecutionTimestamp, setLastExecutionTimestamp] = React.useState('14:28:40')
  const [showMarkdownEditor, setShowMarkdownEditor] = React.useState(false)
  const [showExtraCell, setShowExtraCell] = React.useState(false)
  const [extraCellRunning, setExtraCellRunning] = React.useState(false)
  const [markdownContent, setMarkdownContent] = React.useState(
    '# Cohort Retention & Expansion Query: Grouping by monthly signup cohort to evaluate customer lifetime value (LTV) trajectory and expansion MRR across enterprise tiers. Filtered for 2026 activations from the primary subscriptions warehouse.',
  )

  const sqlLines = React.useMemo(() => sqlQuery.split('\n'), [])

  const totalCustomersSum = React.useMemo(() => {
    return initialCohortResults.reduce((acc, r) => acc + r.total_customers, 0)
  }, [])

  const totalLtvSum = React.useMemo(() => {
    return initialCohortResults.reduce((acc, r) => acc + r.cohort_ltv, 0)
  }, [])

  const maxCohortLtv = React.useMemo(() => {
    return Math.max(...initialCohortResults.map((r) => r.cohort_ltv))
  }, [])

  const handleRunAll = React.useCallback(() => {
    if (isRunningAll) return
    setIsRunningAll(true)
    setIsCellRunning(true)

    setTimeout(() => {
      setIsCellRunning(false)
      setIsRunningAll(false)
      const now = new Date()
      setLastExecutionTimestamp(now.toTimeString().split(' ')[0])
      setExecutionTime((1.18 + Math.random() * 0.15).toFixed(2) + 's')
      setLastSaved('Saved just now')
    }, 620)
  }, [isRunningAll])

  const handleRunCell = React.useCallback(() => {
    if (isCellRunning) return
    setIsCellRunning(true)

    setTimeout(() => {
      setIsCellRunning(false)
      const now = new Date()
      setLastExecutionTimestamp(now.toTimeString().split(' ')[0])
      setExecutionTime((1.15 + Math.random() * 0.2).toFixed(2) + 's')
    }, 480)
  }, [isCellRunning])

  const handleCopySql = React.useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(sqlQuery)
      setCopiedSql(true)
      setTimeout(() => {
        setCopiedSql(false)
      }, 2000)
    }
  }, [])

  const handleExportCsv = React.useCallback(() => {
    const csvHeaders = 'signup_cohort,total_customers,avg_mrr,cohort_ltv\n'
    const csvRows = initialCohortResults
      .map((r) => `${r.signup_cohort},${r.total_customers},${r.avg_mrr},${r.cohort_ltv}`)
      .join('\n')
    const csvContent = csvHeaders + csvRows

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(csvContent)
      setCopiedCsv(true)
      setTimeout(() => {
        setCopiedCsv(false)
      }, 2000)
    }
  }, [])

  const handleAddCell = React.useCallback(() => {
    setShowExtraCell(true)
    setActiveCell('extra')
  }, [])

  const handleRunExtraCell = React.useCallback(() => {
    setExtraCellRunning(true)
    setTimeout(() => {
      setExtraCellRunning(false)
    }, 450)
  }, [])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        handleRunAll()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleRunAll])

  return (
    <div
      data-slot="sql-query-notebook"
      className={cn(
        'bg-background text-foreground border-border w-full overflow-hidden rounded-xl border shadow-xs',
        className,
      )}
    >
      {/* Top Notebook Header */}
      <header className="border-border bg-card/70 border-b px-4 py-3.5 sm:px-6">
        <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
          {/* Notebook Identity & Metadata */}
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 text-primary mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg">
              <FileCode2 className="size-4.5" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-foreground text-sm font-semibold tracking-tight sm:text-base">
                  Customer Churn &amp; Cohort Analysis · Q3 2026
                </h1>
                <Badge variant="secondary" className="font-mono text-xs">
                  v2.4
                </Badge>
              </div>

              <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-foreground/90 font-medium">Snowflake Production Warehouse</span>
                  <span className="text-muted-foreground">· Large Cluster</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="size-3.5 opacity-70" />
                  <span>{lastSaved}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Global Action Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs shadow-none"
              title="Append SQL query cell"
              onClick={handleAddCell}
            >
              <Plus className="size-3.5" />
              <span>Add SQL Cell</span>
            </Button>

            <Button
              size="sm"
              className="h-8 gap-1.5 text-xs font-medium"
              disabled={isRunningAll}
              onClick={handleRunAll}
            >
              {isRunningAll ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Play className="size-3.5 fill-current" />
              )}
              <span>{isRunningAll ? 'Running Notebook...' : 'Run All Cells'}</span>
              <kbd className="border-primary-foreground/30 bg-primary-foreground/10 hidden rounded border px-1 font-mono text-xs sm:inline">
                ⌘↵
              </kbd>
            </Button>
          </div>
        </div>
      </header>

      {/* Notebook Content Stream Container */}
      <main className="space-y-4 p-4 sm:p-6">
        {/* CELL 1: Markdown Documentation Cell */}
        <Card
          className={cn(
            'border-border relative overflow-hidden shadow-none transition-all',
            activeCell === 'doc' ? 'ring-primary/20 ring-2' : '',
          )}
          onClick={() => setActiveCell('doc')}
        >
          {/* Cell Left Focus Strip */}
          <div
            className={cn(
              'absolute top-0 bottom-0 left-0 w-1 transition-colors',
              activeCell === 'doc' ? 'bg-primary' : 'bg-transparent',
            )}
          />

          {/* Cell Top Toolbar */}
          <div className="border-border bg-muted/30 flex items-center justify-between border-b px-4 py-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs font-semibold uppercase">
                [MD] Doc
              </Badge>
              <span className="text-muted-foreground text-xs">Methodology &amp; Hypothesis</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground h-6 px-2 text-xs"
                onClick={(e) => {
                  e.stopPropagation()
                  setShowMarkdownEditor(!showMarkdownEditor)
                }}
              >
                <FileText className="mr-1 size-3" />
                {showMarkdownEditor ? 'Preview' : 'Source'}
              </Button>
            </div>
          </div>

          {/* Cell Content Body */}
          <CardContent className="p-4 sm:p-5">
            {showMarkdownEditor ? (
              <div className="space-y-2">
                <textarea
                  value={markdownContent}
                  onChange={(e) => setMarkdownContent(e.target.value)}
                  rows={3}
                  className="border-input bg-muted/20 text-foreground focus-visible:ring-ring w-full rounded-md border p-3 font-mono text-xs leading-relaxed outline-none focus-visible:ring-2"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="border-border/60 border-b pb-2">
                  <h2 className="text-foreground text-base font-semibold tracking-tight">
                    Cohort Retention &amp; Expansion Query
                  </h2>
                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                    Grouping by monthly signup cohort to evaluate customer lifetime value (LTV) trajectory and expansion
                    MRR across enterprise tiers. Filtered for 2026 activations from the primary subscriptions warehouse.
                  </p>
                </div>

                {/* Metadata Parameter Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <div className="border-border bg-muted/40 text-muted-foreground flex flex-wrap items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs">
                    <Database className="text-foreground/70 size-3.5" />
                    <span>Source:</span>
                    <span className="text-foreground font-mono font-medium">analytics.fct_subscriptions</span>
                  </div>
                  <div className="border-border bg-muted/40 text-muted-foreground flex flex-wrap items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs">
                    <Sparkles className="size-3.5 text-amber-500" />
                    <span>Target Retention:</span>
                    <span className="text-foreground font-medium">&gt; 118% Net Expansion</span>
                  </div>
                  <div className="border-border bg-muted/40 text-muted-foreground flex flex-wrap items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs">
                    <Layers className="text-foreground/70 size-3.5" />
                    <span>Granularity:</span>
                    <span className="text-foreground font-mono font-medium">DATE_TRUNC('month')</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CELL 2: SQL Query Execution Cell */}
        <Card
          className={cn(
            'border-border relative overflow-hidden shadow-none transition-all',
            activeCell === 'sql' ? 'ring-primary/20 ring-2' : '',
          )}
          onClick={() => setActiveCell('sql')}
        >
          {/* Cell Left Focus Strip */}
          <div
            className={cn(
              'absolute top-0 bottom-0 left-0 w-1 transition-colors',
              activeCell === 'sql' ? 'bg-primary' : 'bg-transparent',
            )}
          />

          {/* Cell Toolbar */}
          <div className="border-border bg-muted/30 flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2">
            {/* Left: Cell # & Status */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default" className="bg-primary text-primary-foreground font-mono text-xs font-semibold">
                [1] SQL
              </Badge>
              <Badge variant="secondary" className="font-mono text-xs">
                Snowflake SQL
              </Badge>

              <div className="border-border/80 bg-background/80 flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs">
                <span
                  className={cn(
                    'size-1.5 rounded-full transition-colors',
                    isCellRunning ? 'animate-pulse bg-amber-500' : 'bg-emerald-500',
                  )}
                />
                <span className="text-muted-foreground font-mono">
                  {isCellRunning ? 'Executing query...' : `${executionTime} · ${rowCount.toLocaleString()} rows`}
                </span>
              </div>
            </div>

            {/* Right: Cell Actions */}
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1 px-2.5 text-xs shadow-none"
                title="Copy SQL Query"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCopySql()
                }}
              >
                {copiedSql ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                <span>{copiedSql ? 'Copied' : 'Copy SQL'}</span>
              </Button>

              <Button
                size="sm"
                className="h-7 gap-1 px-2.5 text-xs font-medium"
                disabled={isCellRunning}
                onClick={(e) => {
                  e.stopPropagation()
                  handleRunCell()
                }}
              >
                {isCellRunning ? <Loader2 className="size-3 animate-spin" /> : <Play className="size-3 fill-current" />}
                <span>Run Cell</span>
                <kbd className="border-primary-foreground/30 bg-primary-foreground/10 ml-0.5 rounded border px-1 font-mono text-xs">
                  ^↵
                </kbd>
              </Button>
            </div>
          </div>

          {/* Code Editor Body (Dark Theme) */}
          <div className="relative flex overflow-x-auto bg-zinc-950 py-3 font-mono text-xs leading-relaxed text-zinc-100 select-text">
            {/* Line Numbers Gutter */}
            <div className="flex flex-col border-r border-zinc-800/80 px-3 text-right text-zinc-600 select-none">
              {sqlLines.map((_, idx) => (
                <span
                  key={idx}
                  className={cn(
                    'h-5 leading-5 transition-colors',
                    hoveredSqlLine === idx + 1 ? 'font-semibold text-zinc-300' : '',
                  )}
                >
                  {idx + 1}
                </span>
              ))}
            </div>

            {/* Code Lines with Syntax Colors */}
            <div className="flex-1 px-4 whitespace-pre">
              {sqlLines.map((line, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'group flex h-5 items-center rounded-xs px-1 leading-5 transition-colors',
                    hoveredSqlLine === idx + 1 ? 'bg-zinc-800/40' : '',
                  )}
                  onMouseEnter={() => setHoveredSqlLine(idx + 1)}
                  onMouseLeave={() => setHoveredSqlLine(null)}
                >
                  <span dangerouslySetInnerHTML={{ __html: highlightSqlLine(line) }} />
                </div>
              ))}
            </div>
          </div>

          {/* Tabular Query Results & Output Grid */}
          <div className="border-border border-t">
            {/* Results Header & Actions Bar */}
            <div className="border-border bg-card flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <Table2 className="text-primary size-4" />
                  <span className="text-foreground text-xs font-semibold">Query Output</span>
                </div>
                <Badge variant="secondary" className="font-mono text-xs">
                  4 cohorts · 14,290 records
                </Badge>
                <span className="text-muted-foreground hidden font-mono text-xs sm:inline">
                  Last run: {lastExecutionTimestamp}
                </span>
              </div>

              {/* Action Controls: Tabs & Export */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="border-border bg-muted/40 flex items-center rounded-lg border p-0.5">
                  <button
                    type="button"
                    className={cn(
                      'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                      activeResultTab === 'table'
                        ? 'bg-background text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                    onClick={() => setActiveResultTab('table')}
                  >
                    <Table2 className="size-3.5" />
                    <span>Table</span>
                  </button>
                  <button
                    type="button"
                    className={cn(
                      'flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                      activeResultTab === 'chart'
                        ? 'bg-background text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                    onClick={() => setActiveResultTab('chart')}
                  >
                    <BarChart3 className="size-3.5" />
                    <span>Chart</span>
                  </button>
                </div>

                <Button
                  aria-label="Download attachment"
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 px-2.5 text-xs shadow-none"
                  onClick={handleExportCsv}
                >
                  {copiedCsv ? <Check className="size-3 text-emerald-500" /> : <Download className="size-3" />}
                  <span>{copiedCsv ? 'Copied CSV!' : 'Export CSV'}</span>
                </Button>

                {activeResultTab === 'table' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-7 gap-1 px-2.5 text-xs"
                    onClick={() => setActiveResultTab('chart')}
                  >
                    <BarChart3 className="size-3" />
                    <span>Visualize as Chart</span>
                  </Button>
                )}
              </div>
            </div>

            {/* View 1: Tabular Results Grid */}
            {activeResultTab === 'table' ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="text-xs font-semibold">
                        <div className="flex items-center gap-1.5">
                          <span>signup_cohort</span>
                          <Badge variant="outline" className="text-muted-foreground py-0 text-xs font-normal">
                            DATE
                          </Badge>
                        </div>
                      </TableHead>
                      <TableHead className="text-right text-xs font-semibold">
                        <div className="flex items-center justify-end gap-1.5">
                          <span>total_customers</span>
                          <Badge variant="outline" className="text-muted-foreground py-0 text-xs font-normal">
                            INT
                          </Badge>
                        </div>
                      </TableHead>
                      <TableHead className="text-right text-xs font-semibold">
                        <div className="flex items-center justify-end gap-1.5">
                          <span>avg_mrr</span>
                          <Badge variant="outline" className="text-muted-foreground py-0 text-xs font-normal">
                            NUMERIC
                          </Badge>
                        </div>
                      </TableHead>
                      <TableHead className="text-right text-xs font-semibold">
                        <div className="flex items-center justify-end gap-1.5">
                          <span>cohort_ltv</span>
                          <Badge variant="outline" className="text-muted-foreground py-0 text-xs font-normal">
                            CURRENCY
                          </Badge>
                        </div>
                      </TableHead>
                      <TableHead className="text-right text-xs font-semibold">
                        <span>expansion_velocity</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {initialCohortResults.map((row, idx) => (
                      <TableRow
                        key={row.signup_cohort}
                        className={cn('text-xs transition-colors', idx % 2 === 1 ? 'bg-muted/15' : '')}
                      >
                        <TableCell className="font-mono font-medium">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground font-mono text-xs">{idx + 1}</span>
                            <span className="text-foreground font-semibold">{row.signup_cohort}</span>
                            <Badge variant="secondary" className="font-sans text-xs font-normal">
                              {row.cohort_label}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-foreground text-right font-mono font-medium tabular-nums">
                          {row.total_customers.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-foreground text-right font-mono tabular-nums">
                          ${row.avg_mrr.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-foreground text-right font-mono font-semibold tabular-nums">
                          $
                          {row.cohort_ltv.toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="rounded-md bg-emerald-500/10 px-2 py-0.5 font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            {row.expansion_rate}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Table Summary Footer */}
                <div className="border-border bg-muted/20 flex flex-wrap items-center justify-between gap-3 border-t px-4 py-2.5 text-xs">
                  <span className="text-muted-foreground font-mono">4 of 4 cohort partitions loaded · 0 errors</span>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-muted-foreground">
                      Total Active Accounts:{' '}
                      <strong className="text-foreground font-mono tabular-nums">
                        {totalCustomersSum.toLocaleString()}
                      </strong>
                    </span>
                    <span className="text-muted-foreground">
                      Cumulative Cohort LTV:{' '}
                      <strong className="text-foreground font-mono tabular-nums">
                        ${totalLtvSum.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </strong>
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* View 2: Chart Visualization */
              <div className="space-y-5 p-4 sm:p-6">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-foreground text-sm font-semibold">Cohort Lifetime Value Trajectory</h3>
                    <p className="text-muted-foreground text-xs">
                      Progression of cumulative customer LTV and expansion momentum by activation month.
                    </p>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    Snowflake Snowpark Analytics
                  </Badge>
                </div>

                {/* Bar Chart Distribution */}
                <div className="space-y-3.5">
                  {initialCohortResults.map((item) => (
                    <div
                      key={item.signup_cohort}
                      className="border-border/60 bg-card space-y-1.5 rounded-lg border p-3 shadow-none"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold">{item.cohort_label}</span>
                          <span className="text-muted-foreground font-mono">({item.signup_cohort})</span>
                          <Badge variant="secondary" className="font-mono text-xs">
                            {item.total_customers.toLocaleString()} customers
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-muted-foreground font-mono">Avg MRR: ${item.avg_mrr.toFixed(2)}</span>
                          <span className="text-foreground font-mono font-bold tabular-nums">
                            ${item.cohort_ltv.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>

                      {/* Visual Bar Fill */}
                      <div className="bg-muted/60 relative h-3.5 w-full overflow-hidden rounded-full">
                        <div
                          className="bg-primary absolute top-0 bottom-0 left-0 rounded-full transition-all duration-500"
                          style={{ width: `${(item.cohort_ltv / maxCohortLtv) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* CELL 3: Downstream Python / Added Cell (Toggled or Interactive) */}
        {showExtraCell && (
          <Card
            className={cn(
              'border-border relative overflow-hidden shadow-none transition-all',
              activeCell === 'extra' ? 'ring-primary/20 ring-2' : '',
            )}
            onClick={() => setActiveCell('extra')}
          >
            {/* Cell Left Focus Strip */}
            <div
              className={cn(
                'absolute top-0 bottom-0 left-0 w-1 transition-colors',
                activeCell === 'extra' ? 'bg-primary' : 'bg-transparent',
              )}
            />

            <div className="border-border bg-muted/30 flex items-center justify-between border-b px-4 py-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-mono text-xs font-semibold">
                  [2] Python
                </Badge>
                <span className="text-muted-foreground text-xs">Downstream Snowpark Dataframe</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  size="sm"
                  className="h-7 gap-1 px-2.5 text-xs"
                  disabled={extraCellRunning}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRunExtraCell()
                  }}
                >
                  {extraCellRunning ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Play className="size-3 fill-current" />
                  )}
                  <span>Run</span>
                </Button>
                <Button
                  aria-label="Delete query cell"
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive h-7 px-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowExtraCell(false)
                  }}
                >
                  <Trash2 className="size-3" />
                </Button>
              </div>
            </div>

            <div className="bg-zinc-950 p-4 font-mono text-xs leading-relaxed text-zinc-300">
              <pre className="text-zinc-400">
                <code>
                  <span className="text-purple-400">import</span> snowflake.snowpark{' '}
                  <span className="text-purple-400">as</span> snowpark{'\n'}
                  <span className="text-purple-400">import</span> polars <span className="text-purple-400">as</span> pl
                  {'\n\n'}
                  <span className="text-zinc-500"># Read Cell [1] tabular results and compute hazard rate</span>
                  {'\n'}
                  df = cell_1_results.to_pandas(){'\n'}
                  df[<span className="text-emerald-400">'expansion_velocity'</span>] = df[
                  <span className="text-emerald-400">'cohort_ltv'</span>] / df[
                  <span className="text-emerald-400">'total_customers'</span>]{'\n'}
                  <span className="text-sky-400">print</span>(f
                  <span className="text-emerald-400">
                    "Average cohort customer value: ${'{'}df['expansion_velocity'].mean():.2f{'}'}"
                  </span>
                  )
                </code>
              </pre>
            </div>

            <div className="border-border bg-muted/20 border-t p-3 font-mono text-xs">
              <div className="text-muted-foreground flex items-center gap-2">
                <Terminal className="size-3.5 text-emerald-500" />
                <span>Output:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Average cohort customer value: $292.77
                </span>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}

'use client'

import * as React from 'react'
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
} from 'lucide-react'
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

export interface LakehouseTableOptimizerProps {
  initialTable?: TableDetails
  initialSnapshots?: TableSnapshot[]
  initialPartitions?: PartitionRecord[]
  className?: string
}

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

export function LakehouseTableOptimizer({
  initialTable = defaultTable,
  initialSnapshots = defaultSnapshots,
  initialPartitions = defaultPartitions,
  className,
}: LakehouseTableOptimizerProps) {
  const [table] = React.useState<TableDetails>(initialTable)
  const [snapshots] = React.useState<TableSnapshot[]>(initialSnapshots)
  const [partitions] = React.useState<PartitionRecord[]>(initialPartitions)

  const [selectedSnapshotId, setSelectedSnapshotId] = React.useState<string>('snap_84920194821')
  const [sqlSyntaxMode, setSqlSyntaxMode] = React.useState<SqlSyntaxMode>('system_time')
  const [snapshotFilter, setSnapshotFilter] = React.useState<string>('ALL')
  const [snapshotSearch, setSnapshotSearch] = React.useState<string>('')
  const [partitionSearch, setPartitionSearch] = React.useState<string>('')
  const [activeTab, setActiveTab] = React.useState<string>('snapshots')

  const [isCompacting, setIsCompacting] = React.useState<boolean>(false)
  const [isExpiring, setIsExpiring] = React.useState<boolean>(false)
  const [actionNotification, setActionNotification] = React.useState<string | null>(null)
  const [copiedQuery, setCopiedQuery] = React.useState<boolean>(false)

  const selectedSnapshot = React.useMemo(() => {
    return snapshots.find((s) => s.id === selectedSnapshotId) ?? snapshots[0]
  }, [snapshots, selectedSnapshotId])

  const filteredSnapshots = React.useMemo(() => {
    return snapshots.filter((snap) => {
      const matchesOp = snapshotFilter === 'ALL' || snap.operation === snapshotFilter
      const query = snapshotSearch.toLowerCase().trim()
      const matchesSearch =
        query === '' ||
        snap.id.toLowerCase().includes(query) ||
        snap.author.toLowerCase().includes(query) ||
        snap.summary.toLowerCase().includes(query) ||
        snap.operation.toLowerCase().includes(query)
      return matchesOp && matchesSearch
    })
  }, [snapshots, snapshotFilter, snapshotSearch])

  const filteredPartitions = React.useMemo(() => {
    const query = partitionSearch.toLowerCase().trim()
    if (!query) return partitions
    return partitions.filter((p) => p.partitionKey.toLowerCase().includes(query))
  }, [partitions, partitionSearch])

  const generatedQuery = React.useMemo(() => {
    const currentSnap = selectedSnapshot
    const tableName = table.name

    switch (sqlSyntaxMode) {
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
  }, [selectedSnapshot, table.name, sqlSyntaxMode])

  const handleCopyQuery = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(generatedQuery)
      setCopiedQuery(true)
      setTimeout(() => {
        setCopiedQuery(false)
      }, 2000)
    }
  }

  const runCompaction = () => {
    if (isCompacting) return
    setIsCompacting(true)
    setActionNotification(null)

    setTimeout(() => {
      setIsCompacting(false)
      setActionNotification(
        'Compaction & Vacuum complete: 14,280 small files compacted into 142 optimal 128MB Parquet files. Reclaimed 1.2 TB storage.',
      )
      setTimeout(() => {
        setActionNotification(null)
      }, 6000)
    }, 1800)
  }

  const expireSnapshots = () => {
    if (isExpiring) return
    setIsExpiring(true)
    setActionNotification(null)

    setTimeout(() => {
      setIsExpiring(false)
      setActionNotification(
        'Snapshot expiration finished: Removed 12 stale snapshots older than 30-day retention window. Purged 872 GB metadata & unreferenced parquet files.',
      )
      setTimeout(() => {
        setActionNotification(null)
      }, 6000)
    }, 1400)
  }

  return (
    <div className={cn('text-foreground w-full space-y-6', className)}>
      {/* Header Section */}
      <div className="border-border bg-card rounded-xl border p-5 shadow-xs sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Table Identity */}
          <div className="flex items-start gap-4">
            <div className="border-primary/20 bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-lg border shadow-xs">
              <Database className="size-6" />
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-foreground font-mono text-lg font-bold tracking-tight break-all sm:text-xl">
                  {table.name}
                </h1>
                <Badge variant="success" className="gap-1.5 font-medium">
                  <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                  {table.statusText}
                </Badge>
              </div>
              <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
                <Badge variant="outline" className="gap-1 font-mono">
                  <Layers className="text-muted-foreground size-3" />
                  {table.format}
                </Badge>
                <Badge variant="secondary" className="gap-1 font-mono font-medium">
                  <HardDrive className="text-muted-foreground size-3" />
                  {table.totalSize} · {table.rowCount}
                </Badge>
                <span className="hidden items-center gap-1 sm:inline-flex">
                  <Server className="size-3" />
                  {table.catalog}
                </span>
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 shadow-xs"
              disabled={isExpiring}
              onClick={expireSnapshots}
            >
              {!isExpiring ? (
                <Clock className="text-muted-foreground size-3.5" />
              ) : (
                <RefreshCw className="text-muted-foreground size-3.5 animate-spin" />
              )}
              <span>{isExpiring ? 'Expiring Stale...' : 'Expire Snapshots'}</span>
            </Button>

            <Button
              variant="default"
              size="sm"
              className="h-9 gap-1.5 shadow-xs"
              disabled={isCompacting}
              onClick={runCompaction}
            >
              {!isCompacting ? <Sparkles className="size-3.5" /> : <RefreshCw className="size-3.5 animate-spin" />}
              <span>{isCompacting ? 'Compacting Table...' : 'Run Compaction & Vacuum'}</span>
            </Button>
          </div>
        </div>

        {/* Action Toast / Banner */}
        {actionNotification && (
          <div className="mt-4 flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-700 dark:text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{actionNotification}</span>
            </div>
            <button
              type="button"
              className="rounded p-1 text-emerald-700/70 hover:bg-emerald-500/20 hover:text-emerald-700 dark:text-emerald-300/70 dark:hover:text-emerald-200"
              onClick={() => setActionNotification(null)}
            >
              <span className="sr-only">Dismiss</span>
              &times;
            </button>
          </div>
        )}
      </div>

      {/* 4 Table Health & Storage Telemetry Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Partitions */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Total Partitions
            </CardTitle>
            <div className="border-border bg-muted/50 text-muted-foreground flex size-7 items-center justify-center rounded-md border">
              <FolderArchive className="size-3.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">1,420</div>
              <Badge variant="success" className="text-xs">
                100% Healthy
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">1,420 Partitions · Date Partitioned</p>
            <div className="space-y-1 pt-1">
              <Progress value={100} className="bg-muted h-1.5" />
              <div className="text-muted-foreground flex justify-between text-xs">
                <span>event_date (YYYY-MM-DD)</span>
                <span className="font-mono tabular-nums">0 unpartitioned</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Small Files Neutralized */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Small Files Neutralized
            </CardTitle>
            <div className="border-border bg-muted/50 text-muted-foreground flex size-7 items-center justify-center rounded-md border">
              <HardDrive className="size-3.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">14,280</div>
              <Badge variant="success" className="font-mono text-xs">
                99.0% Reduction
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">14,280 small files compacted -&gt; 142 optimal 128MB files</p>
            <div className="space-y-1 pt-1">
              <Progress value={99} className="bg-muted h-1.5" />
              <div className="text-muted-foreground flex justify-between text-xs">
                <span>Target: 128 MB</span>
                <span className="font-mono tabular-nums">0 files &lt;32MB</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Snapshot History Count */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Snapshot History
            </CardTitle>
            <div className="border-border bg-muted/50 text-muted-foreground flex size-7 items-center justify-center rounded-md border">
              <History className="size-3.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">48</div>
              <Badge variant="info" className="font-mono text-xs">
                30-Day Window
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">48 Active Snapshots · 30-Day Time Travel</p>
            <div className="space-y-1 pt-1">
              <Progress value={64} className="bg-muted h-1.5" />
              <div className="text-muted-foreground flex justify-between text-xs">
                <span>Oldest: Jul 22, 2026</span>
                <span className="font-mono tabular-nums">4.8 MB metadata</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Storage Optimization Savings */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Storage Optimization
            </CardTitle>
            <div className="border-border bg-muted/50 text-muted-foreground flex size-7 items-center justify-center rounded-md border">
              <Zap className="size-3.5" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">1.2 TB</div>
              <Badge variant="success" className="font-mono text-xs">
                $240/mo Saved
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">1.2 TB freed via Vacuum · $240/mo saved</p>
            <div className="space-y-1 pt-1">
              <Progress value={85} className="bg-muted h-1.5" />
              <div className="text-muted-foreground flex justify-between text-xs">
                <span>872 GB stale · 328 GB orphan</span>
                <span className="font-mono tabular-nums">-28.5% S3 Cost</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Lakehouse Inspection & Control Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-5">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="snapshots" className="gap-1.5 text-xs font-medium">
            <History className="size-3.5" />
            <span>Snapshots & Time-Travel</span>
          </TabsTrigger>
          <TabsTrigger value="partitions" className="gap-1.5 text-xs font-medium">
            <Layers className="size-3.5" />
            <span>Partitions & Z-Ordering</span>
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="gap-1.5 text-xs font-medium">
            <Sparkles className="size-3.5" />
            <span>Compaction & Vacuum</span>
          </TabsTrigger>
          <TabsTrigger value="files" className="gap-1.5 text-xs font-medium">
            <HardDrive className="size-3.5" />
            <span>File Sizing & Distribution</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: SNAPSHOTS & TIME-TRAVEL QUERY PICKER */}
        <TabsContent value="snapshots" className="space-y-5">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left: Interactive Timeline (7 Cols) */}
            <div className="space-y-4 lg:col-span-7">
              <Card className="border-border bg-card shadow-xs">
                <CardHeader className="p-4 pb-3 sm:p-5 sm:pb-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="text-sm font-semibold sm:text-base">Snapshot Commit History</CardTitle>
                      <CardDescription className="text-xs">
                        Select any snapshot to generate reproducible time-travel queries
                      </CardDescription>
                    </div>
                    {/* Filter Pill Buttons */}
                    <div className="flex flex-wrap items-center gap-1">
                      {(['ALL', 'MERGE', 'OPTIMIZE', 'APPEND', 'REPLACE_PARTITION'] as const).map((op) => (
                        <button
                          key={op}
                          type="button"
                          className={cn(
                            'rounded-md px-2 py-1 font-mono text-xs transition-colors',
                            snapshotFilter === op
                              ? 'bg-primary text-primary-foreground font-semibold'
                              : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground',
                          )}
                          onClick={() => setSnapshotFilter(op)}
                        >
                          {op}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Search Filter */}
                  <div className="relative pt-2">
                    <Search className="text-muted-foreground absolute top-5 left-2.5 size-3.5" />
                    <input
                      value={snapshotSearch}
                      onChange={(e) => setSnapshotSearch(e.target.value)}
                      type="text"
                      placeholder="Search snapshot ID, author, summary..."
                      className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border py-1.5 pr-3 pl-8 text-xs focus-visible:ring-2 focus-visible:outline-none"
                    />
                  </div>
                </CardHeader>

                <Separator />

                <CardContent className="p-4 sm:p-5">
                  <div className="before:bg-border relative space-y-4 before:absolute before:top-3 before:bottom-3 before:left-[17px] before:w-0.5">
                    {filteredSnapshots.map((snap) => (
                      <div
                        key={snap.id}
                        className={cn(
                          'group relative flex cursor-pointer flex-col gap-3 rounded-lg border p-3.5 transition-all sm:flex-row sm:items-start sm:gap-4',
                          selectedSnapshotId === snap.id
                            ? 'border-primary/60 bg-primary/[0.03] ring-primary/30 shadow-xs ring-1'
                            : 'border-border bg-card/60 hover:border-border hover:bg-accent/40',
                        )}
                        onClick={() => setSelectedSnapshotId(snap.id)}
                      >
                        {/* Timeline Dot Indicator */}
                        <div className="border-border bg-card text-foreground group-hover:border-primary/50 relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border shadow-xs">
                          {snap.operation === 'MERGE' && <History className="size-4 text-blue-500" />}
                          {snap.operation === 'OPTIMIZE' && <Sparkles className="size-4 text-emerald-500" />}
                          {snap.operation === 'APPEND' && <ArrowDownRight className="size-4 text-violet-500" />}
                          {snap.operation === 'REPLACE_PARTITION' && <RefreshCw className="size-4 text-amber-500" />}
                        </div>

                        {/* Snapshot Details */}
                        <div className="min-w-0 flex-1 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-foreground font-mono text-xs font-bold">{snap.id}</span>
                              <Badge variant={getOperationBadgeVariant(snap.operation)} className="font-mono text-xs">
                                {snap.operation}
                              </Badge>
                              {selectedSnapshotId === snap.id && (
                                <Badge variant="default" className="text-xs">
                                  Active Time-Travel Target
                                </Badge>
                              )}
                            </div>
                            <span className="text-muted-foreground font-mono text-xs tabular-nums">
                              {snap.relativeTime}
                            </span>
                          </div>

                          <p className="text-muted-foreground text-xs">{snap.summary}</p>

                          {/* Metric Badges Row */}
                          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                            <div className="text-muted-foreground flex items-center gap-1 font-mono">
                              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                                {snap.rowsAdded}
                              </span>
                              <span>/</span>
                              <span className="font-semibold text-rose-600 dark:text-rose-400">
                                {snap.rowsDeleted} rows
                              </span>
                            </div>
                            <div className="text-muted-foreground flex items-center gap-1 font-mono">
                              <FileCode2 className="text-muted-foreground size-3" />
                              <span>{snap.byteDelta}</span>
                            </div>
                            <div className="text-muted-foreground flex items-center gap-1 font-mono">
                              <span>Author:</span>
                              <span className="text-foreground font-medium">{snap.author}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Time-Travel Query Generator & Helper (5 Cols) */}
            <div className="space-y-4 lg:col-span-5">
              <Card className="border-border bg-card shadow-xs">
                <CardHeader className="p-4 pb-3 sm:p-5 sm:pb-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-sm font-semibold sm:text-base">Time-Travel Query Picker</CardTitle>
                      <CardDescription className="text-xs">
                        Instant query generator for snapshot audit & reconciliation
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="font-mono text-xs">
                      {selectedSnapshot.numericId}
                    </Badge>
                  </div>

                  {/* Syntax Mode Buttons */}
                  <div className="grid grid-cols-2 gap-1 pt-3 sm:grid-cols-4">
                    <button
                      type="button"
                      className={cn(
                        'rounded-md px-2 py-1.5 text-center font-mono text-xs transition-colors',
                        sqlSyntaxMode === 'system_time'
                          ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                          : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground',
                      )}
                      onClick={() => setSqlSyntaxMode('system_time')}
                    >
                      SYSTEM_TIME
                    </button>
                    <button
                      type="button"
                      className={cn(
                        'rounded-md px-2 py-1.5 text-center font-mono text-xs transition-colors',
                        sqlSyntaxMode === 'system_version'
                          ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                          : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground',
                      )}
                      onClick={() => setSqlSyntaxMode('system_version')}
                    >
                      VERSION
                    </button>
                    <button
                      type="button"
                      className={cn(
                        'rounded-md px-2 py-1.5 text-center font-mono text-xs transition-colors',
                        sqlSyntaxMode === 'pyspark'
                          ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                          : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground',
                      )}
                      onClick={() => setSqlSyntaxMode('pyspark')}
                    >
                      PySpark
                    </button>
                    <button
                      type="button"
                      className={cn(
                        'rounded-md px-2 py-1.5 text-center font-mono text-xs transition-colors',
                        sqlSyntaxMode === 'trino'
                          ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                          : 'bg-muted text-muted-foreground hover:bg-accent hover:text-foreground',
                      )}
                      onClick={() => setSqlSyntaxMode('trino')}
                    >
                      Trino SQL
                    </button>
                  </div>
                </CardHeader>

                <Separator />

                <CardContent className="space-y-4 p-4 sm:p-5">
                  {/* Target Snapshot Meta Summary */}
                  <div className="border-border bg-muted/40 space-y-1.5 rounded-lg border p-3 text-xs">
                    <div className="text-muted-foreground flex items-center justify-between">
                      <span>Target Snapshot:</span>
                      <span className="text-foreground font-mono font-semibold">{selectedSnapshot.id}</span>
                    </div>
                    <div className="text-muted-foreground flex items-center justify-between">
                      <span>Point-in-Time:</span>
                      <span className="text-foreground font-mono">{selectedSnapshot.timestamp}</span>
                    </div>
                    <div className="text-muted-foreground flex items-center justify-between">
                      <span>Commit Operation:</span>
                      <Badge
                        variant={getOperationBadgeVariant(selectedSnapshot.operation)}
                        className="font-mono text-xs"
                      >
                        {selectedSnapshot.operation}
                      </Badge>
                    </div>
                  </div>

                  {/* Code Block with Copy */}
                  <div className="border-border bg-muted/70 relative overflow-hidden rounded-lg border font-mono">
                    <div className="border-border bg-muted/90 text-muted-foreground flex items-center justify-between border-b px-3 py-2 text-xs">
                      <span className="text-foreground flex items-center gap-1.5 font-semibold">
                        <Terminal className="text-primary size-3.5" />
                        Query table as of snapshot:
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-background hover:text-foreground h-7 gap-1 px-2 text-xs"
                        onClick={handleCopyQuery}
                      >
                        {copiedQuery ? (
                          <Check className="size-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="text-muted-foreground size-3.5" />
                        )}
                        <span>{copiedQuery ? 'Copied' : 'Copy'}</span>
                      </Button>
                    </div>
                    <pre className="text-foreground overflow-x-auto p-3 text-xs leading-relaxed">
                      <code>{generatedQuery}</code>
                    </pre>
                  </div>

                  {/* Telemetry Stats about Query */}
                  <div className="border-border bg-card space-y-2 rounded-lg border p-3 text-xs">
                    <div className="text-muted-foreground flex items-center justify-between">
                      <span>Estimated Scan Overhead:</span>
                      <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        42ms · 96.4% skipped
                      </span>
                    </div>
                    <div className="text-muted-foreground flex items-center justify-between">
                      <span>Manifest Avro File:</span>
                      <span className="text-foreground font-mono text-xs">{selectedSnapshot.manifestFile}</span>
                    </div>
                    <div className="text-muted-foreground flex items-center justify-between">
                      <span>Storage Engine:</span>
                      <span className="text-foreground">Apache Iceberg Native Parquet Reader</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: PARTITIONS & Z-ORDER CLUSTERING */}
        <TabsContent value="partitions" className="space-y-5">
          {/* Table Partition Maintenance & Z-Order Clustering Status Card */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="p-5 pb-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <Workflow className="text-primary size-4" />
                    Partition Health & Multidimensional Z-Order Clustering
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Z-Order clustered by <code className="text-foreground font-mono font-semibold">customer_id</code>,{' '}
                    <code className="text-foreground font-mono font-semibold">event_type</code> to maximize Parquet
                    min/max statistics pruning.
                  </CardDescription>
                </div>

                {/* Search Partitions */}
                <div className="relative w-full md:w-64">
                  <Search className="text-muted-foreground absolute top-2.5 left-2.5 size-3.5" />
                  <input
                    value={partitionSearch}
                    onChange={(e) => setPartitionSearch(e.target.value)}
                    type="text"
                    placeholder="Filter partitions..."
                    className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border py-1.5 pr-3 pl-8 text-xs focus-visible:ring-2 focus-visible:outline-none"
                  />
                </div>
              </div>

              {/* Clustering Telemetry Overview Grid */}
              <div className="border-border bg-muted/30 mt-4 grid grid-cols-1 gap-3 rounded-lg border p-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <span className="text-muted-foreground">Clustered Columns:</span>
                  <div className="text-foreground font-mono font-semibold">customer_id, event_type</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Data Skipping Efficiency:</span>
                  <div className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    96.4% Row-Groups Skipped
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Clustering Curve Algorithm:</span>
                  <div className="text-foreground font-mono font-semibold">Hilbert Space-Filling (Depth 16)</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Compression Codec:</span>
                  <div className="text-foreground font-mono font-semibold">ZSTD Level 7 · Parquet v2</div>
                </div>
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-xs">Partition Key</TableHead>
                      <TableHead className="text-xs">File Count</TableHead>
                      <TableHead className="text-xs">Avg File Size</TableHead>
                      <TableHead className="text-xs">Total Data Size</TableHead>
                      <TableHead className="text-xs">Data Skipping</TableHead>
                      <TableHead className="text-xs">Z-Order Status</TableHead>
                      <TableHead className="text-right text-xs">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPartitions.map((partition) => (
                      <TableRow key={partition.partitionKey} className="hover:bg-muted/50">
                        <TableCell className="text-foreground font-mono text-xs font-semibold">
                          {partition.partitionKey}
                        </TableCell>
                        <TableCell className="font-mono text-xs tabular-nums">{partition.fileCount} files</TableCell>
                        <TableCell className="font-mono text-xs tabular-nums">{partition.avgFileSize}</TableCell>
                        <TableCell className="font-mono text-xs tabular-nums">{partition.totalSize}</TableCell>
                        <TableCell>
                          <div className="w-32 space-y-1">
                            <div className="text-muted-foreground flex justify-between font-mono text-xs tabular-nums">
                              <span>{partition.skippedPercentage}%</span>
                            </div>
                            <Progress value={partition.skippedPercentage} className="bg-muted h-1.5" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="success" className="gap-1 font-mono text-xs">
                            <CheckCircle2 className="size-3" />
                            {partition.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-7 text-xs font-medium">
                            Re-cluster
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: COMPACTION & VACUUM MAINTENANCE RULES */}
        <TabsContent value="maintenance" className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Bin-Pack Compaction Rule */}
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="p-4 pb-2 sm:p-5 sm:pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <Sparkles className="size-4 text-emerald-500" />
                    Bin-Pack Data File Compaction
                  </CardTitle>
                  <Badge variant="success" className="text-xs">
                    Enabled · Auto
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  Merges small files into optimized 128MB Parquet chunks to prevent small file bottleneck
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-4 pt-3 text-xs sm:p-5">
                <div className="border-border bg-muted/40 space-y-2 rounded-lg border p-3">
                  <div className="text-muted-foreground flex justify-between">
                    <span>Target File Size:</span>
                    <span className="text-foreground font-mono font-semibold">128 MB</span>
                  </div>
                  <div className="text-muted-foreground flex justify-between">
                    <span>Small File Threshold:</span>
                    <span className="text-foreground font-mono font-semibold">&lt; 32 MB</span>
                  </div>
                  <div className="text-muted-foreground flex justify-between">
                    <span>Execution Schedule:</span>
                    <span className="text-foreground font-mono">Every 2 Hours (cron: 0 */2 * * *)</span>
                  </div>
                  <div className="text-muted-foreground flex justify-between">
                    <span>Engine:</span>
                    <span className="text-foreground">Apache Spark Iceberg RewriteDataFiles Action</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vacuum & Orphan File Removal */}
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="p-4 pb-2 sm:p-5 sm:pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <Trash2 className="size-4 text-rose-500" />
                    Vacuum & Orphan File Purger
                  </CardTitle>
                  <Badge variant="success" className="text-xs">
                    Enabled · Daily
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  Hard-deletes unreferenced data files and uncommitted multi-part upload orphans in S3
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-4 pt-3 text-xs sm:p-5">
                <div className="border-border bg-muted/40 space-y-2 rounded-lg border p-3">
                  <div className="text-muted-foreground flex justify-between">
                    <span>Retention Grace Period:</span>
                    <span className="text-foreground font-mono font-semibold">7 Days (168 Hours)</span>
                  </div>
                  <div className="text-muted-foreground flex justify-between">
                    <span>Storage Reclaimed (30d):</span>
                    <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">1.2 TB freed</span>
                  </div>
                  <div className="text-muted-foreground flex justify-between">
                    <span>Execution Schedule:</span>
                    <span className="text-foreground font-mono">Daily at 02:00 UTC</span>
                  </div>
                  <div className="text-muted-foreground flex justify-between">
                    <span>Safety Guard:</span>
                    <span className="text-foreground">Explicit dry-run verification check</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Snapshot Expiration Policy */}
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="p-4 pb-2 sm:p-5 sm:pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <Clock className="size-4 text-blue-500" />
                    Snapshot Expiration Policy
                  </CardTitle>
                  <Badge variant="info" className="text-xs">
                    30-Day Window
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  Controls metadata table history retention for time-travel queries and rollback safety
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-4 pt-3 text-xs sm:p-5">
                <div className="border-border bg-muted/40 space-y-2 rounded-lg border p-3">
                  <div className="text-muted-foreground flex justify-between">
                    <span>Retention Window:</span>
                    <span className="text-foreground font-mono font-semibold">30 Days</span>
                  </div>
                  <div className="text-muted-foreground flex justify-between">
                    <span>Min Snapshots Retained:</span>
                    <span className="text-foreground font-mono font-semibold">20 Snapshots</span>
                  </div>
                  <div className="text-muted-foreground flex justify-between">
                    <span>Clean Expired Metadata:</span>
                    <span className="text-foreground font-mono">Yes (Purge orphan Avro manifests)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Manifest Consolidation */}
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="p-4 pb-2 sm:p-5 sm:pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <FileText className="size-4 text-violet-500" />
                    Manifest File Consolidation
                  </CardTitle>
                  <Badge variant="success" className="text-xs">
                    Optimized
                  </Badge>
                </div>
                <CardDescription className="text-xs">
                  Rewrites small manifest files to accelerate query planning and metadata scanning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 p-4 pt-3 text-xs sm:p-5">
                <div className="border-border bg-muted/40 space-y-2 rounded-lg border p-3">
                  <div className="text-muted-foreground flex justify-between">
                    <span>Active Manifest Count:</span>
                    <span className="text-foreground font-mono font-semibold">6 Manifests</span>
                  </div>
                  <div className="text-muted-foreground flex justify-between">
                    <span>Rewrite Trigger Threshold:</span>
                    <span className="text-foreground font-mono">&gt; 50 Small Manifests</span>
                  </div>
                  <div className="text-muted-foreground flex justify-between">
                    <span>Query Planning Overhead:</span>
                    <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">&lt; 15ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 4: FILE SIZING & I/O DISTRIBUTION */}
        <TabsContent value="files" className="space-y-5">
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base font-semibold">
                File Size Distribution & I/O Amplification Analysis
              </CardTitle>
              <CardDescription className="text-xs">
                Comparison of storage layout before vs. after Iceberg automatic compaction
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-6 p-5">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Before Compaction */}
                <div className="border-border bg-muted/20 space-y-3 rounded-xl border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                      Before Compaction (Small File Problem)
                    </span>
                    <Badge variant="destructive" className="font-mono text-xs">
                      18.4x I/O Amplification
                    </Badge>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="text-muted-foreground flex justify-between">
                      <span>Total Small Files (&lt;4MB):</span>
                      <span className="text-foreground font-mono font-bold">14,280 Files</span>
                    </div>
                    <div className="text-muted-foreground flex justify-between">
                      <span>Average File Size:</span>
                      <span className="text-foreground font-mono">2.4 MB</span>
                    </div>
                    <div className="text-muted-foreground flex justify-between">
                      <span>Query Scan Latency (P95):</span>
                      <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">8.4 seconds</span>
                    </div>
                    <div className="text-muted-foreground flex justify-between">
                      <span>S3 GET Request Cost:</span>
                      <span className="text-foreground font-mono">$380 / month</span>
                    </div>
                  </div>
                </div>

                {/* After Compaction */}
                <div className="space-y-3 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.03] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      After Compaction (Optimal Bin-Pack)
                    </span>
                    <Badge variant="success" className="font-mono text-xs">
                      1.02x Near-Ideal
                    </Badge>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="text-muted-foreground flex justify-between">
                      <span>Total Target Files (128MB):</span>
                      <span className="text-foreground font-mono font-bold">142 Files</span>
                    </div>
                    <div className="text-muted-foreground flex justify-between">
                      <span>Average File Size:</span>
                      <span className="text-foreground font-mono">128.2 MB</span>
                    </div>
                    <div className="text-muted-foreground flex justify-between">
                      <span>Query Scan Latency (P95):</span>
                      <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                        220 milliseconds (38x speedup)
                      </span>
                    </div>
                    <div className="text-muted-foreground flex justify-between">
                      <span>S3 GET Request Cost:</span>
                      <span className="text-foreground font-mono">$12 / month</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default LakehouseTableOptimizer

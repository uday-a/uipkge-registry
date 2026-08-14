'use client'

import * as React from 'react'
import {
  Activity,
  ArrowRight,
  ArrowRightLeft,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  Database,
  Download,
  Filter,
  Key,
  Layers,
  Pencil,
  RefreshCw,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Timer,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export type SyncMode =
  | 'Upsert on Match Key'
  | 'Update if Newer'
  | 'Update only (Null overwrite off)'
  | 'Always Overwrite'

export interface FieldMapping {
  id: string
  sourceColumn: string
  sourceType: string
  sourceTable?: string
  destinationField: string
  destinationObject: string
  destinationType: string
  isMatchKey?: boolean
  syncMode: SyncMode
  transform: string
  sampleValue: string
  active: boolean
}

export interface SyncRunRecord {
  id: string
  runNumber: string
  startedAt: string
  duration: string
  durationSec: number
  status: 'succeeded' | 'running' | 'failed' | 'warning'
  statusLabel: string
  totalRecords: number
  insertedRecords: number
  updatedRecords: number
  deletedRecords: number
  failedRecords: number
  warehouse: string
  queryId: string
  batchId: string
  syncTrigger: 'Scheduled Cron' | 'Manual Trigger' | 'dbt Cloud Webhook' | 'API Dispatch'
  errorSummary?: string
}

export interface ReverseEtlMetrics {
  recordsSynced: number
  successRate: number
  duration: string
  warehouseName: string
  insertions: number
  updates: number
  deletions: number
  scheduleInterval: string
  nextRunIn: string
}

export interface ReverseEtlSyncManagerProps {
  initialMappings?: FieldMapping[]
  initialRuns?: SyncRunRecord[]
  initialMetrics?: ReverseEtlMetrics
  className?: string
}

const defaultMappings: FieldMapping[] = [
  {
    id: 'map-1',
    sourceColumn: 'customer_id',
    sourceType: 'VARCHAR(64) [PK]',
    sourceTable: 'analytics.dim_high_value_customers',
    destinationField: 'External_ID__c',
    destinationObject: 'Account',
    destinationType: 'Text(64) [Unique Match Key]',
    isMatchKey: true,
    syncMode: 'Upsert on Match Key',
    transform: 'Direct Map (Primary Key)',
    sampleValue: 'CUST_9918203',
    active: true,
  },
  {
    id: 'map-2',
    sourceColumn: 'calculated_arr',
    sourceType: 'NUMBER(14,2)',
    sourceTable: 'analytics.dim_high_value_customers',
    destinationField: 'AnnualRevenue',
    destinationObject: 'Account',
    destinationType: 'Currency(16,2)',
    isMatchKey: false,
    syncMode: 'Update if Newer',
    transform: 'Currency Cast (USD)',
    sampleValue: '$14,250.00',
    active: true,
  },
  {
    id: 'map-3',
    sourceColumn: 'last_login_at',
    sourceType: 'TIMESTAMP_TZ',
    sourceTable: 'analytics.dim_high_value_customers',
    destinationField: 'Last_Active_Date__c',
    destinationObject: 'Contact',
    destinationType: 'DateTime',
    isMatchKey: false,
    syncMode: 'Update only (Null overwrite off)',
    transform: 'ISO8601 Date Parse',
    sampleValue: '2026-08-21 14:30:00',
    active: true,
  },
  {
    id: 'map-4',
    sourceColumn: 'health_score',
    sourceType: 'INTEGER',
    sourceTable: 'analytics.dim_high_value_customers',
    destinationField: 'Health_Score__c',
    destinationObject: 'Account',
    destinationType: 'Number(3,0)',
    isMatchKey: false,
    syncMode: 'Update if Newer',
    transform: 'Score Normalizer (0-100)',
    sampleValue: '94.8 / 100',
    active: true,
  },
  {
    id: 'map-5',
    sourceColumn: 'plan_tier',
    sourceType: 'VARCHAR(50)',
    sourceTable: 'analytics.dim_high_value_customers',
    destinationField: 'Plan_Tier__c',
    destinationObject: 'Account',
    destinationType: 'Picklist',
    isMatchKey: false,
    syncMode: 'Upsert on Match Key',
    transform: 'Enum Mapping (3 Tiers)',
    sampleValue: 'Tier 1 Enterprise',
    active: true,
  },
]

const defaultRuns: SyncRunRecord[] = [
  {
    id: 'run-8821',
    runNumber: '#SYNC-8821',
    startedAt: '2026-08-21T14:00:00Z',
    duration: '01m:12s',
    durationSec: 72,
    status: 'succeeded',
    statusLabel: 'Succeeded',
    totalRecords: 14290,
    insertedRecords: 428,
    updatedRecords: 13862,
    deletedRecords: 0,
    failedRecords: 0,
    warehouse: 'SNOWFLAKE_WH_XS',
    queryId: '01b64e9a-0001-2a81-0000-00049281a8b1',
    batchId: 'sf-bulk-batch-7718902',
    syncTrigger: 'Scheduled Cron',
  },
  {
    id: 'run-8820',
    runNumber: '#SYNC-8820',
    startedAt: '2026-08-21T13:00:00Z',
    duration: '00m:58s',
    durationSec: 58,
    status: 'succeeded',
    statusLabel: 'Succeeded',
    totalRecords: 3410,
    insertedRecords: 85,
    updatedRecords: 3325,
    deletedRecords: 0,
    failedRecords: 0,
    warehouse: 'SNOWFLAKE_WH_XS',
    queryId: '01b64e9a-0001-2a80-0000-00049279b904',
    batchId: 'sf-bulk-batch-7718819',
    syncTrigger: 'Scheduled Cron',
  },
  {
    id: 'run-8819',
    runNumber: '#SYNC-8819',
    startedAt: '2026-08-21T12:00:00Z',
    duration: '01m:45s',
    durationSec: 105,
    status: 'succeeded',
    statusLabel: 'Succeeded',
    totalRecords: 12850,
    insertedRecords: 310,
    updatedRecords: 12540,
    deletedRecords: 0,
    failedRecords: 0,
    warehouse: 'SNOWFLAKE_WH_XS',
    queryId: '01b64e9a-0001-2a7f-0000-00049265f128',
    batchId: 'sf-bulk-batch-7718744',
    syncTrigger: 'dbt Cloud Webhook',
  },
  {
    id: 'run-8818',
    runNumber: '#SYNC-8818',
    startedAt: '2026-08-21T11:00:00Z',
    duration: '00m:42s',
    durationSec: 42,
    status: 'succeeded',
    statusLabel: 'Succeeded',
    totalRecords: 980,
    insertedRecords: 12,
    updatedRecords: 968,
    deletedRecords: 0,
    failedRecords: 0,
    warehouse: 'SNOWFLAKE_WH_XS',
    queryId: '01b64e9a-0001-2a7e-0000-00049251cc90',
    batchId: 'sf-bulk-batch-7718690',
    syncTrigger: 'Scheduled Cron',
  },
]

const defaultMetrics: ReverseEtlMetrics = {
  recordsSynced: 14290,
  successRate: 100,
  duration: '01m:12s',
  warehouseName: 'Snowflake SQL Warehouse',
  insertions: 428,
  updates: 13862,
  deletions: 0,
  scheduleInterval: 'Every 1 hour',
  nextRunIn: '48m',
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso)
    return d.toISOString().replace('T', ' ').replace('.000Z', ' UTC').replace('Z', ' UTC')
  } catch {
    return iso
  }
}

export function ReverseEtlSyncManager({
  initialMappings,
  initialRuns,
  initialMetrics,
  className,
}: ReverseEtlSyncManagerProps) {
  const [mappings] = React.useState<FieldMapping[]>(initialMappings ? [...initialMappings] : [...defaultMappings])
  const [runs, setRuns] = React.useState<SyncRunRecord[]>(initialRuns ? [...initialRuns] : [...defaultRuns])
  const [metrics] = React.useState<ReverseEtlMetrics>(initialMetrics ? { ...initialMetrics } : { ...defaultMetrics })

  const [isSyncing, setIsSyncing] = React.useState(false)
  const [syncNotice, setSyncNotice] = React.useState(false)
  const [isEditingMappings, setIsEditingMappings] = React.useState(false)
  const [mappingSearch, setMappingSearch] = React.useState('')
  const [selectedModeFilter, setSelectedModeFilter] = React.useState<string>('all')
  const [expandedRunIds, setExpandedRunIds] = React.useState<Record<string, boolean>>({
    'run-8821': true,
  })
  const [copiedQueryId, setCopiedQueryId] = React.useState<string | null>(null)
  const [copiedManifest, setCopiedManifest] = React.useState(false)

  const filteredMappings = React.useMemo(() => {
    return mappings.filter((m) => {
      const matchesSearch =
        mappingSearch.trim() === '' ||
        m.sourceColumn.toLowerCase().includes(mappingSearch.toLowerCase()) ||
        m.destinationField.toLowerCase().includes(mappingSearch.toLowerCase()) ||
        m.destinationObject.toLowerCase().includes(mappingSearch.toLowerCase()) ||
        m.syncMode.toLowerCase().includes(mappingSearch.toLowerCase()) ||
        m.sampleValue.toLowerCase().includes(mappingSearch.toLowerCase())

      const matchesMode =
        selectedModeFilter === 'all' ||
        (selectedModeFilter === 'upsert' && m.syncMode.includes('Upsert')) ||
        (selectedModeFilter === 'update_if_newer' && m.syncMode === 'Update if Newer') ||
        (selectedModeFilter === 'update_only' && m.syncMode.includes('Update only'))

      return matchesSearch && matchesMode
    })
  }, [mappings, mappingSearch, selectedModeFilter])

  function triggerManualSync() {
    if (isSyncing) return
    setIsSyncing(true)
    setSyncNotice(true)

    setTimeout(() => {
      setIsSyncing(false)
      const newRunId = `run-${Date.now()}`
      setRuns((prev) => [
        {
          id: newRunId,
          runNumber: `#SYNC-${8822 + (prev.length - 4)}`,
          startedAt: new Date().toISOString(),
          duration: '01m:08s',
          durationSec: 68,
          status: 'succeeded',
          statusLabel: 'Succeeded',
          totalRecords: 14290,
          insertedRecords: 428,
          updatedRecords: 13862,
          deletedRecords: 0,
          failedRecords: 0,
          warehouse: 'SNOWFLAKE_WH_XS',
          queryId: `01b64e9a-0001-${Math.floor(1000 + Math.random() * 9000)}-0000-${Math.floor(100000000000 + Math.random() * 900000000000).toString(16)}`,
          batchId: `sf-bulk-batch-${Math.floor(7718900 + Math.random() * 1000)}`,
          syncTrigger: 'Manual Trigger',
        },
        ...prev,
      ])
      setExpandedRunIds((prev) => ({ ...prev, [newRunId]: true }))
    }, 2200)

    setTimeout(() => {
      setSyncNotice(false)
    }, 6500)
  }

  function toggleEditMappings() {
    setIsEditingMappings((prev) => !prev)
  }

  function toggleRunExpand(id: string) {
    setExpandedRunIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  function copyQueryId(id: string, text: string) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedQueryId(id)
      setTimeout(() => {
        setCopiedQueryId((current) => (current === id ? null : current))
      }, 2000)
    }
  }

  function exportSyncManifest() {
    const manifestData = {
      syncName: 'Snowflake Gold Marts → Salesforce Accounts & Hubspot',
      source: 'Snowflake: analytics.dim_high_value_customers',
      destination: 'Salesforce CRM & HubSpot Marketing',
      exportTimestamp: new Date().toISOString(),
      metrics,
      fieldMappings: mappings,
      recentRuns: runs,
    }

    if (typeof document !== 'undefined') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(manifestData, null, 2))
      const downloadAnchor = document.createElement('a')
      downloadAnchor.setAttribute('href', dataStr)
      downloadAnchor.setAttribute(
        'download',
        `reverse-etl-sync-manifest-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`,
      )
      document.body.appendChild(downloadAnchor)
      downloadAnchor.click()
      downloadAnchor.remove()
      setCopiedManifest(true)
      setTimeout(() => {
        setCopiedManifest(false)
      }, 2000)
    }
  }

  return (
    <div data-slot="reverse-etl-sync-manager" className={cn('w-full space-y-4', className)}>
      {/* Top Header: Sync Pipeline Name, Source, Destination & Global Triggers */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3 sm:items-center">
          <div className="bg-card flex size-10 shrink-0 items-center justify-center rounded-lg border shadow-xs">
            <ArrowRightLeft className="text-primary size-5" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                Snowflake Gold Marts → Salesforce Accounts & Hubspot
              </h2>

              {/* Real-Time Sync Status Badge */}
              {isSyncing ? (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-xs font-medium text-sky-600 dark:text-sky-400">
                  <RefreshCw className="size-3 animate-spin" aria-hidden="true" />
                  <span>Syncing Warehouse Deltas...</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="relative flex size-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                  </span>
                  <span>Sync Succeeded · {formatNumber(metrics.recordsSynced)} Records Updated</span>
                </div>
              )}
            </div>

            {/* Source to Destination Breadcrumb */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-foreground inline-flex items-center gap-1 font-semibold">
                <Database className="size-3.5 text-sky-500" aria-hidden="true" />
                Snowflake:
                <code className="text-foreground/90 font-mono font-medium">analytics.dim_high_value_customers</code>
              </span>
              <ArrowRight className="text-muted-foreground size-3.5" aria-hidden="true" />
              <span className="text-primary inline-flex items-center gap-1 font-semibold">
                <Layers className="text-primary size-3.5" aria-hidden="true" />
                Salesforce CRM & HubSpot Marketing
              </span>
              <span className="text-muted-foreground hidden font-mono sm:inline">
                Reverse ETL · Hightouch/Census Model
              </span>
            </div>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={cn('gap-1.5', isEditingMappings && 'border-primary bg-primary/10 text-primary')}
            onClick={toggleEditMappings}
          >
            <Pencil className="size-3.5" aria-hidden="true" />
            <span>{isEditingMappings ? 'Exit Mapping Mode' : 'Edit Field Mappings'}</span>
          </Button>

          <Button
            aria-label="Download attachment"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={exportSyncManifest}
          >
            {copiedManifest ? (
              <Check className="size-3.5 text-emerald-500" aria-hidden="true" />
            ) : (
              <Download className="size-3.5" aria-hidden="true" />
            )}
            <span>{copiedManifest ? 'Exported' : 'Export Audit JSON'}</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            disabled={isSyncing}
            className="gap-1.5 shadow-xs"
            onClick={triggerManualSync}
          >
            <RefreshCw className={cn('size-3.5', isSyncing && 'animate-spin')} aria-hidden="true" />
            <span>{isSyncing ? 'Dispatching Batch...' : 'Trigger Sync Now'}</span>
          </Button>
        </div>
      </div>

      {/* Active Sync Notification Alert Banner */}
      {syncNotice && (
        <div className="text-foreground flex items-center justify-between rounded-lg border border-sky-500/30 bg-sky-500/10 p-3 text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="size-4 shrink-0 text-sky-500" aria-hidden="true" />
            <div>
              <span className="font-semibold text-sky-600 dark:text-sky-400">Manual Reverse ETL Sync Triggered:</span>
              <span>
                {' '}
                Executing incremental delta reconciliation on{' '}
                <code className="font-mono font-medium">analytics.dim_high_value_customers</code> via Snowflake
                Warehouse <code className="font-mono font-medium">SNOWFLAKE_WH_XS</code>.
              </span>
            </div>
          </div>
          <Badge variant="outline" className="font-mono text-xs">
            Salesforce Bulk API 2.0
          </Badge>
        </div>
      )}

      {/* 4 Reverse ETL KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 1. Records Synced */}
        <Card className="border-border shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">Records Synced</span>
              <div className="flex size-8 items-center justify-center rounded-md border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-4" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">
                  {formatNumber(metrics.recordsSynced)}
                </span>
                <span className="text-muted-foreground text-xs">Records</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success" className="font-mono text-xs">
                  {metrics.successRate}% Success
                </Badge>
              </div>
              <div className="text-muted-foreground flex items-center justify-between pt-1 text-xs">
                <span>Failed Records</span>
                <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">0 Errors</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Sync Duration */}
        <Card className="border-border shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">Sync Duration</span>
              <div className="flex size-8 items-center justify-center rounded-md border border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <Timer className="size-4" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">
                  {metrics.duration}
                </span>
                <span className="text-muted-foreground text-xs">runtime</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="info" className="font-mono text-xs">
                  {metrics.warehouseName}
                </Badge>
              </div>
              <div className="text-muted-foreground flex items-center justify-between pt-1 text-xs">
                <span>Throughput</span>
                <span className="text-foreground font-mono font-medium">198 rows/sec</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Changes Detected */}
        <Card className="border-border shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">Changes Detected</span>
              <div className="border-primary/20 bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md border">
                <Activity className="size-4" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">
                  {formatNumber(metrics.recordsSynced)}
                </span>
                <span className="text-muted-foreground text-xs">Total Deltas</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 font-medium text-emerald-600 dark:text-emerald-400">
                  {metrics.insertions} Insertions
                </span>
                <span className="rounded bg-sky-500/10 px-1.5 py-0.5 font-medium text-sky-600 dark:text-sky-400">
                  {formatNumber(metrics.updates)} Updates
                </span>
                <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 font-medium">
                  {metrics.deletions} Deletions
                </span>
              </div>
              {/* Segmented distribution progress bar */}
              <div className="bg-muted flex h-1.5 w-full overflow-hidden rounded-full border pt-0">
                <div
                  className="bg-emerald-500 transition-all duration-300"
                  style={{ width: `${(metrics.insertions / metrics.recordsSynced) * 100}%` }}
                />
                <div
                  className="bg-sky-500 transition-all duration-300"
                  style={{ width: `${(metrics.updates / metrics.recordsSynced) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 4. Next Scheduled Run */}
        <Card className="border-border shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">Next Scheduled Run</span>
              <div className="flex size-8 items-center justify-center rounded-md border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <CalendarClock className="size-4" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">
                  in {metrics.nextRunIn}
                </span>
                <span className="text-muted-foreground text-xs">remaining</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="border-amber-500/30 font-mono text-xs text-amber-600 dark:text-amber-400"
                >
                  {metrics.scheduleInterval}
                </Badge>
              </div>
              <div className="text-muted-foreground flex items-center justify-between pt-1 text-xs">
                <span>Cron Expression</span>
                <span className="text-foreground font-mono font-medium">0 * * * *</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Field Mapping Configuration Table Card */}
      <Card className="border-border shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-semibold">
                  Field Mapping Configuration ({mappings.length} Mappings Active)
                </CardTitle>
                {isEditingMappings && (
                  <Badge variant="default" className="text-xs">
                    Editing Mode Active
                  </Badge>
                )}
              </div>
              <CardDescription className="text-xs">
                Schema transformation matrix mapping Snowflake warehouse marts to Salesforce CRM object attributes and
                match keys
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                Primary Match: Account: External_ID__c
              </Badge>
            </div>
          </div>
        </CardHeader>

        {/* Filter / Search Toolbar for Mappings */}
        <div className="border-b px-4 py-3">
          <div className="flex flex-col flex-wrap gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:min-w-[12rem] sm:flex-1">
              <Search
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                aria-hidden="true"
              />
              <Input
                value={mappingSearch}
                onChange={(e) => setMappingSearch(e.target.value)}
                placeholder="Search mappings..."
                className="pl-9 text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-muted-foreground mr-1 flex items-center gap-1 text-xs font-medium">
                <Filter className="size-3" aria-hidden="true" />
                Mode:
              </span>

              <button
                type="button"
                className={cn(
                  'focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  selectedModeFilter === 'all'
                    ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                    : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
                onClick={() => setSelectedModeFilter('all')}
              >
                All ({mappings.length})
              </button>

              <button
                type="button"
                className={cn(
                  'focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  selectedModeFilter === 'upsert'
                    ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                    : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
                onClick={() => setSelectedModeFilter('upsert')}
              >
                Upsert Keys (2)
              </button>

              <button
                type="button"
                className={cn(
                  'focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  selectedModeFilter === 'update_if_newer'
                    ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                    : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
                onClick={() => setSelectedModeFilter('update_if_newer')}
              >
                Update if Newer (2)
              </button>

              <button
                type="button"
                className={cn(
                  'focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  selectedModeFilter === 'update_only'
                    ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                    : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground',
                )}
                onClick={() => setSelectedModeFilter('update_only')}
              >
                Update Only (1)
              </button>
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table density="cozy">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-semibold">Source Column (Snowflake)</TableHead>
                  <TableHead className="w-12 text-center text-xs font-semibold" aria-label="Mapping Direction" />
                  <TableHead className="text-xs font-semibold">Destination Field (Salesforce CRM)</TableHead>
                  <TableHead className="text-xs font-semibold">Data Type & Sync Mode</TableHead>
                  <TableHead className="text-xs font-semibold">Sample Sync Value</TableHead>
                  <TableHead className="text-center text-xs font-semibold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMappings.map((mapping) => (
                  <TableRow key={mapping.id} className="group">
                    {/* Source Column (Snowflake) */}
                    <TableCell className="py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-foreground font-mono text-xs font-semibold">
                            {mapping.sourceColumn}
                          </span>
                          {mapping.isMatchKey && (
                            <Badge variant="info" className="gap-1 font-mono text-xs">
                              <Key className="size-3" aria-hidden="true" />
                              Match Key
                            </Badge>
                          )}
                        </div>
                        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                          <span className="font-mono text-xs">{mapping.sourceType}</span>
                          <span>·</span>
                          <span className="text-muted-foreground/80 truncate font-mono text-xs">
                            {mapping.transform}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Mapping Arrow (→) */}
                    <TableCell className="text-muted-foreground group-hover:text-primary w-12 py-3 text-center">
                      <div className="flex items-center justify-center">
                        <ArrowRight
                          className="size-4 transition-transform group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </div>
                    </TableCell>

                    {/* Destination Field (Salesforce CRM) */}
                    <TableCell className="py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <Badge variant="outline" className="font-mono text-xs">
                            {mapping.destinationObject}
                          </Badge>
                          <span className="text-foreground font-mono text-xs font-semibold">
                            {mapping.destinationField}
                          </span>
                        </div>
                        <p className="text-muted-foreground font-mono text-xs">
                          Target Type: {mapping.destinationType}
                        </p>
                      </div>
                    </TableCell>

                    {/* Data Type & Sync Mode */}
                    <TableCell className="py-3">
                      <div className="space-y-1">
                        <Badge
                          variant={mapping.syncMode.includes('Upsert') ? 'default' : 'outline'}
                          className="font-mono text-xs"
                        >
                          {mapping.syncMode}
                        </Badge>
                        <p className="text-muted-foreground text-xs">
                          {mapping.isMatchKey ? 'Primary deduplication index' : 'Safe incremental sync'}
                        </p>
                      </div>
                    </TableCell>

                    {/* Sample Sync Value */}
                    <TableCell className="py-3">
                      <div className="space-y-0.5">
                        <div className="bg-muted/50 text-foreground inline-flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-xs font-medium">
                          <span className="text-primary font-semibold">›</span>
                          <span>{mapping.sampleValue}</span>
                        </div>
                        <p className="text-muted-foreground text-xs">Live sample preview</p>
                      </div>
                    </TableCell>

                    {/* Status Badge / Toggle */}
                    <TableCell className="py-3 text-center">
                      <Badge variant="success" className="gap-1 font-mono text-xs">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        Active
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Sync Run History & Error Queue Table Card */}
      <Card className="border-border shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base font-semibold">
                Sync Run History & Execution Log (Recent {runs.length} Runs)
              </CardTitle>
              <CardDescription className="text-xs">
                Audit trail of automated and manual reverse ETL execution runs, Snowflake query IDs, and Salesforce Bulk
                API ingestion
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-md border bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="size-3.5" aria-hidden="true" />
                <span>Error DLQ: 0 Failed Records</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-border/60 divide-y">
            {runs.map((run) => {
              const isExpanded = !!expandedRunIds[run.id]
              return (
                <div
                  key={run.id}
                  className={cn('group transition-colors', isExpanded ? 'bg-muted/30' : 'hover:bg-muted/20')}
                >
                  {/* Run Summary Header Row */}
                  <div
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                    className="focus-visible:ring-ring flex cursor-pointer flex-col gap-3 p-3.5 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset sm:flex-row sm:items-center sm:justify-between"
                    onClick={() => toggleRunExpand(run.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        toggleRunExpand(run.id)
                      }
                    }}
                  >
                    {/* Left Rail: Chevron, Run ID, Status, Timestamp & Trigger */}
                    <div className="flex min-w-0 items-start gap-3 sm:items-center">
                      <button
                        type="button"
                        aria-label="Toggle sync run details"
                        className={cn(
                          'text-muted-foreground group-hover:text-foreground mt-0.5 shrink-0 transition-transform sm:mt-0',
                          isExpanded && 'text-foreground rotate-90',
                        )}
                      >
                        <ChevronRight className="size-4" aria-hidden="true" />
                      </button>

                      <div className="space-y-1 sm:space-y-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-foreground font-mono text-xs font-bold">{run.runNumber}</span>

                          <Badge variant="success" className="gap-1 font-mono text-xs">
                            <span className="size-1.5 rounded-full bg-emerald-500" />
                            {run.statusLabel}
                          </Badge>

                          <span className="text-muted-foreground font-mono text-xs whitespace-nowrap">
                            {formatTimestamp(run.startedAt)}
                          </span>

                          <Badge variant="outline" className="font-mono text-xs">
                            {run.syncTrigger}
                          </Badge>
                        </div>

                        <p className="text-muted-foreground text-xs">
                          Processed {formatNumber(run.totalRecords)} records ({formatNumber(run.insertedRecords)} added,{' '}
                          {formatNumber(run.updatedRecords)} updated) · 0 failed
                        </p>
                      </div>
                    </div>

                    {/* Right Rail: Duration, Rows Affected, Warehouse */}
                    <div className="flex shrink-0 flex-wrap items-center gap-3 sm:justify-end">
                      <div className="bg-muted/60 flex items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-xs">
                        <Clock className="text-muted-foreground size-3" aria-hidden="true" />
                        <span className="text-muted-foreground">Duration:</span>
                        <span className="text-foreground font-medium tabular-nums">{run.duration}</span>
                      </div>

                      <div className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs">
                        <span className="text-foreground/90 font-medium">{run.warehouse}</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Run Diagnostics Details */}
                  {isExpanded && (
                    <div className="bg-muted/15 border-t px-4 py-3.5">
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {/* Snowflake Query Identifier */}
                          <div className="bg-card space-y-1 rounded-md border p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground text-xs font-medium">Snowflake Query ID</span>
                              <Button
                                variant="ghost"
                                size="xs"
                                className="h-6 gap-1 px-2 text-xs"
                                onClick={() => copyQueryId(run.id, run.queryId)}
                              >
                                {copiedQueryId === run.id ? (
                                  <Check className="size-3 text-emerald-500" aria-hidden="true" />
                                ) : (
                                  <Copy className="size-3" aria-hidden="true" />
                                )}
                                <span>{copiedQueryId === run.id ? 'Copied' : 'Copy'}</span>
                              </Button>
                            </div>
                            <p className="text-foreground font-mono text-xs font-semibold">{run.queryId}</p>
                            <p className="text-muted-foreground text-xs">
                              SQL compilation: 180ms · Warehousing tier: XS
                            </p>
                          </div>

                          {/* Salesforce Bulk API Batch ID */}
                          <div className="bg-card space-y-1 rounded-md border p-3">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground text-xs font-medium">
                                Salesforce Bulk Batch ID
                              </span>
                              <Badge variant="outline" className="font-mono text-xs">
                                Bulk 2.0
                              </Badge>
                            </div>
                            <p className="text-foreground font-mono text-xs font-semibold">{run.batchId}</p>
                            <p className="text-muted-foreground text-xs">
                              Chunk size: 10,000 records/batch · HTTP 200 OK
                            </p>
                          </div>

                          {/* Ingestion Breakdown */}
                          <div className="bg-card space-y-1 rounded-md border p-3 sm:col-span-2 lg:col-span-1">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground text-xs font-medium">Ingestion Breakdown</span>
                              <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                                100% Ingested
                              </span>
                            </div>
                            <div className="flex items-center gap-2 pt-1 font-mono text-xs">
                              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                +{formatNumber(run.insertedRecords)} Ins
                              </span>
                              <span className="font-medium text-sky-600 dark:text-sky-400">
                                ~{formatNumber(run.updatedRecords)} Upd
                              </span>
                              <span className="text-muted-foreground">{run.deletedRecords} Del</span>
                            </div>
                            <p className="text-muted-foreground text-xs">Zero dead-letter quarantine items</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>

        {/* Bottom Engine & Sync Ingestion Protocol Telemetry Bar */}
        <div className="bg-muted/40 flex flex-col gap-2.5 border-t px-4 py-3 text-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="text-muted-foreground flex flex-wrap items-center gap-4">
            <div className="text-foreground flex items-center gap-1.5 font-medium">
              <Activity className="size-3.5 text-emerald-500" aria-hidden="true" />
              <span>Reverse ETL Engine:</span>
              <span className="font-mono">Census / Hightouch Protocol v4.2</span>
            </div>

            <Separator orientation="vertical" className="hidden h-3.5 sm:block" />

            <div className="flex items-center gap-1.5">
              <Database className="size-3.5 text-sky-500" aria-hidden="true" />
              <span>Source DW:</span>
              <span className="text-foreground font-mono">Snowflake (AWS us-east-1)</span>
            </div>

            <Separator orientation="vertical" className="hidden h-3.5 sm:block" />

            <div className="flex items-center gap-1.5">
              <Server className="text-primary size-3.5" aria-hidden="true" />
              <span>Target SaaS:</span>
              <span className="text-foreground font-mono">Salesforce Bulk API 2.0 + HubSpot v3</span>
            </div>
          </div>

          <div className="text-muted-foreground flex items-center gap-2 font-mono">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span>Daily API Quota: 94,200 / 100,000 remaining</span>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ReverseEtlSyncManager

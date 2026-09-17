'use client'

import * as React from 'react'
import {
  Archive,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Database,
  DollarSign,
  HardDriveDownload,
  MoreHorizontal,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export type EngineType = 'Snowflake' | 'BigQuery' | 'Databricks' | 'Postgres'
export type ArchiveTierType = 'Glacier Deep' | 'Coldline' | 'Standard Cold' | 'Purge Immediately'

export interface RetentionPolicy {
  id: string
  tableName: string
  database: string
  engine: EngineType
  partitionColumn: string
  retentionPeriod: string
  lifecycleAction: string
  archiveTier: ArchiveTierType
  complianceReason: string
  totalSize: string
  coldSize: string
  estimatedMonthlySavings: string
  enabled: boolean
  lastRun: string
  nextRun: string
  rowCount?: string
}

export interface StorageRetentionStats {
  totalManagedData: string
  totalManagedSubtitle?: string
  coldArchivedData: string
  archivedPercentage: number
  archivedSubtitle?: string
  projectedMonthlySavings: string
  savingsSubtitle?: string
  purged30d: string
  purgedSubtitle?: string
}

export const defaultPolicies: RetentionPolicy[] = [
  {
    id: 'pol-1',
    tableName: 'audit_logs.events',
    database: 'SNOWFLAKE_PROD_DWH',
    engine: 'Snowflake',
    partitionColumn: 'event_timestamp (DAY)',
    retentionPeriod: '90 Days Active',
    lifecycleAction: 'Transition to Cold Glacier at 90d -> Hard Purge at 365d',
    archiveTier: 'Glacier Deep',
    complianceReason: 'SOX Compliance',
    totalSize: '4.2 TB',
    coldSize: '3.1 TB',
    estimatedMonthlySavings: '$420.00 / mo',
    enabled: true,
    lastRun: '1 hour ago',
    nextRun: 'Today at 02:00 UTC',
    rowCount: '1.4B rows',
  },
  {
    id: 'pol-2',
    tableName: 'telemetry.raw_pings',
    database: 'BIGQUERY_IOT_STREAM',
    engine: 'BigQuery',
    partitionColumn: 'received_at (HOUR)',
    retentionPeriod: '30 Days TTL',
    lifecycleAction: 'Direct Partition Drop at 30d TTL -> Zero Archive',
    archiveTier: 'Purge Immediately',
    complianceReason: 'Storage Optimization',
    totalSize: '5.6 TB',
    coldSize: '0.0 TB',
    estimatedMonthlySavings: '$560.00 / mo',
    enabled: true,
    lastRun: '10 min ago',
    nextRun: 'Continuous partition sweep',
    rowCount: '8.9B rows',
  },
  {
    id: 'pol-3',
    tableName: 'billing.invoices_archive',
    database: 'SNOWFLAKE_FINANCE',
    engine: 'Snowflake',
    partitionColumn: 'invoice_date (MONTH)',
    retentionPeriod: '7 Years Compliance',
    lifecycleAction: 'Hot 1 Year -> Glacier Vault Lock Tier 7 Years',
    archiveTier: 'Glacier Deep',
    complianceReason: 'SOX Compliance',
    totalSize: '2.4 TB',
    coldSize: '2.1 TB',
    estimatedMonthlySavings: '$210.00 / mo',
    enabled: true,
    lastRun: 'Yesterday',
    nextRun: 'Sep 01 at 00:00 UTC',
    rowCount: '180M rows',
  },
  {
    id: 'pol-4',
    tableName: 'analytics.staging_events',
    database: 'BIGQUERY_INGEST',
    engine: 'BigQuery',
    partitionColumn: 'ingest_time (DAY)',
    retentionPeriod: '14 Days TTL',
    lifecycleAction: 'Truncate partition > 14d -> Permanent Delete',
    archiveTier: 'Purge Immediately',
    complianceReason: 'Storage Optimization',
    totalSize: '1.5 TB',
    coldSize: '0.0 TB',
    estimatedMonthlySavings: '$150.00 / mo',
    enabled: false,
    lastRun: '3 days ago',
    nextRun: 'Paused',
    rowCount: '420M rows',
  },
  {
    id: 'pol-5',
    tableName: 'customer_pii.user_sessions',
    database: 'SNOWFLAKE_CUSTOMER360',
    engine: 'Snowflake',
    partitionColumn: 'session_start (DAY)',
    retentionPeriod: '180 Days Active',
    lifecycleAction: 'Anonymize at 90d -> Cold Glacier -> Hard Purge at 180d',
    archiveTier: 'Standard Cold',
    complianceReason: 'GDPR Art. 17',
    totalSize: '1.1 TB',
    coldSize: '0.9 TB',
    estimatedMonthlySavings: '$80.00 / mo',
    enabled: true,
    lastRun: '6 hours ago',
    nextRun: 'Tomorrow at 04:00 UTC',
    rowCount: '290M rows',
  },
]

export const defaultStats: StorageRetentionStats = {
  totalManagedData: '14.8 TB',
  totalManagedSubtitle: 'Across 48 partitioned tables',
  coldArchivedData: '9.2 TB',
  archivedPercentage: 62,
  archivedSubtitle: '62% archived to Glacier / Cold Tier',
  projectedMonthlySavings: '$1,420.00 / mo saved',
  savingsSubtitle: '68% cost drop vs active NVMe',
  purged30d: '1.8 TB',
  purgedSubtitle: 'Expired TTL partitions purged',
}

export interface DataRetentionPolicyManagerProps {
  initialPolicies?: RetentionPolicy[]
  initialStats?: StorageRetentionStats
  className?: string
}

export function DataRetentionPolicyManager({
  initialPolicies,
  initialStats,
  className,
}: DataRetentionPolicyManagerProps) {
  const [policies, setPolicies] = React.useState<RetentionPolicy[]>(initialPolicies ?? defaultPolicies)
  const stats = initialStats ?? defaultStats

  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [complianceFilter, setComplianceFilter] = React.useState<string>('all')
  const [bannerMessage, setBannerMessage] = React.useState<{ type: 'success' | 'info'; text: string } | null>(null)
  const [copiedTable, setCopiedTable] = React.useState<string | null>(null)

  // Policy Dialog state
  const [isPolicyModalOpen, setIsPolicyModalOpen] = React.useState(false)
  const [editingPolicy, setEditingPolicy] = React.useState<RetentionPolicy | null>(null)
  const [formTableName, setFormTableName] = React.useState('')
  const [formDatabase, setFormDatabase] = React.useState('')
  const [formEngine, setFormEngine] = React.useState<EngineType>('Snowflake')
  const [formPartitionCol, setFormPartitionCol] = React.useState('')
  const [formRetentionPeriod, setFormRetentionPeriod] = React.useState('90 Days Active')
  const [formLifecycleAction, setFormLifecycleAction] = React.useState(
    'Transition to Cold Glacier at 90d -> Hard Purge at 365d',
  )
  const [formArchiveTier, setFormArchiveTier] = React.useState<ArchiveTierType>('Glacier Deep')
  const [formComplianceReason, setFormComplianceReason] = React.useState('Storage Optimization')

  // Instant Archive Modal state
  const [isArchiveModalOpen, setIsArchiveModalOpen] = React.useState(false)
  const [selectedPolicyForArchive, setSelectedPolicyForArchive] = React.useState<RetentionPolicy | null>(null)
  const [isArchiving, setIsArchiving] = React.useState(false)

  const filteredPolicies = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return policies.filter((policy) => {
      if (statusFilter === 'enabled' && !policy.enabled) return false
      if (statusFilter === 'disabled' && policy.enabled) return false

      if (complianceFilter !== 'all' && policy.complianceReason !== complianceFilter) {
        return false
      }

      if (!q) return true
      const matchTable = policy.tableName.toLowerCase().includes(q)
      const matchDb = policy.database.toLowerCase().includes(q)
      const matchReason = policy.complianceReason.toLowerCase().includes(q)
      const matchAction = policy.lifecycleAction.toLowerCase().includes(q)
      const matchEngine = policy.engine.toLowerCase().includes(q)
      return matchTable || matchDb || matchReason || matchAction || matchEngine
    })
  }, [policies, searchQuery, statusFilter, complianceFilter])

  const togglePolicyStatus = (id: string) => {
    setPolicies((prev) =>
      prev.map((policy) => {
        if (policy.id === id) {
          const nextState = !policy.enabled
          setBannerMessage({
            type: 'info',
            text: `Retention policy for table "${policy.tableName}" has been ${nextState ? 'activated' : 'paused'}.`,
          })
          return { ...policy, enabled: nextState }
        }
        return policy
      }),
    )
  }

  const deletePolicy = (id: string) => {
    const target = policies.find((p) => p.id === id)
    setPolicies((prev) => prev.filter((p) => p.id !== id))
    if (target) {
      setBannerMessage({
        type: 'info',
        text: `Deleted retention policy for "${target.tableName}".`,
      })
    }
  }

  const copyTableName = (name: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(name)
      setCopiedTable(name)
      setTimeout(() => {
        setCopiedTable((curr) => (curr === name ? null : curr))
      }, 2000)
    }
  }

  const openAddPolicyModal = () => {
    setEditingPolicy(null)
    setFormTableName('')
    setFormDatabase('SNOWFLAKE_PROD_DWH')
    setFormEngine('Snowflake')
    setFormPartitionCol('created_at (DAY)')
    setFormRetentionPeriod('90 Days Active')
    setFormLifecycleAction('Transition to Cold Glacier at 90d -> Hard Purge at 365d')
    setFormArchiveTier('Glacier Deep')
    setFormComplianceReason('Storage Optimization')
    setIsPolicyModalOpen(true)
  }

  const openEditPolicyModal = (policy: RetentionPolicy) => {
    setEditingPolicy(policy)
    setFormTableName(policy.tableName)
    setFormDatabase(policy.database)
    setFormEngine(policy.engine)
    setFormPartitionCol(policy.partitionColumn)
    setFormRetentionPeriod(policy.retentionPeriod)
    setFormLifecycleAction(policy.lifecycleAction)
    setFormArchiveTier(policy.archiveTier)
    setFormComplianceReason(policy.complianceReason)
    setIsPolicyModalOpen(true)
  }

  const savePolicy = () => {
    if (!formTableName.trim()) return

    if (editingPolicy) {
      setPolicies((prev) =>
        prev.map((p) =>
          p.id === editingPolicy.id
            ? {
                ...p,
                tableName: formTableName.trim(),
                database: formDatabase.trim() || 'SNOWFLAKE_PROD_DWH',
                engine: formEngine,
                partitionColumn: formPartitionCol.trim() || 'event_timestamp',
                retentionPeriod: formRetentionPeriod,
                lifecycleAction: formLifecycleAction,
                archiveTier: formArchiveTier,
                complianceReason: formComplianceReason,
              }
            : p,
        ),
      )
      setBannerMessage({
        type: 'success',
        text: `Updated retention policy for "${formTableName}".`,
      })
    } else {
      const newPolicy: RetentionPolicy = {
        id: `pol-${Date.now()}`,
        tableName: formTableName.trim(),
        database: formDatabase.trim() || 'SNOWFLAKE_PROD_DWH',
        engine: formEngine,
        partitionColumn: formPartitionCol.trim() || 'created_at (DAY)',
        retentionPeriod: formRetentionPeriod,
        lifecycleAction: formLifecycleAction,
        archiveTier: formArchiveTier,
        complianceReason: formComplianceReason,
        totalSize: '1.2 TB',
        coldSize: '0.8 TB',
        estimatedMonthlySavings: '$110.00 / mo',
        enabled: true,
        lastRun: 'Pending First Run',
        nextRun: 'Tonight at 00:00 UTC',
        rowCount: '150M rows',
      }
      setPolicies((prev) => [newPolicy, ...prev])
      setBannerMessage({
        type: 'success',
        text: `Created new automated retention policy for "${newPolicy.tableName}".`,
      })
    }
    setIsPolicyModalOpen(false)
  }

  const openRunArchiveModal = (policy: RetentionPolicy) => {
    setSelectedPolicyForArchive(policy)
    setIsArchiveModalOpen(true)
  }

  const executeArchiveRun = () => {
    if (!selectedPolicyForArchive) return
    setIsArchiving(true)

    setTimeout(() => {
      setIsArchiving(false)
      setIsArchiveModalOpen(false)
      const target = selectedPolicyForArchive
      setPolicies((prev) => prev.map((p) => (p.id === target.id ? { ...p, lastRun: 'Just now' } : p)))
      setBannerMessage({
        type: 'success',
        text: `Archive partition sweep successfully completed for "${target.tableName}". Cold tier storage synchronized.`,
      })
    }, 1200)
  }

  const getRetentionBadgeVariant = (
    period: string,
  ): 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'info' => {
    if (period.includes('7 Years') || period.includes('Compliance')) return 'success'
    if (period.includes('TTL') || period.includes('14 Days') || period.includes('30 Days')) return 'warning'
    if (period.includes('90 Days') || period.includes('180 Days')) return 'info'
    return 'secondary'
  }

  const getComplianceBadgeVariant = (
    reason: string,
  ): 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'info' => {
    if (reason.includes('GDPR') || reason.includes('CCPA')) return 'info'
    if (reason.includes('SOX') || reason.includes('HIPAA')) return 'success'
    if (reason.includes('Storage') || reason.includes('Optimization')) return 'secondary'
    if (reason.includes('PCI')) return 'warning'
    return 'outline'
  }

  return (
    <div data-slot="data-retention-policy-manager" className={cn('w-full space-y-6', className)}>
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
              <Archive className="size-4.5" />
            </div>
            <h1 className="text-foreground text-2xl font-bold tracking-tight">
              Data Retention & Cold Storage Lifecycle
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Configure automated table partition expiration, cold storage tiering, and compliance retention periods.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button className="gap-1.5" onClick={openAddPolicyModal}>
            <Plus className="size-4" />
            Add Retention Policy
          </Button>
        </div>
      </div>

      {/* Notification / Action banner */}
      {bannerMessage && (
        <div className="border-border bg-card flex items-center justify-between gap-3 rounded-lg border p-3 shadow-xs">
          <div className="flex items-center gap-2.5 text-sm">
            {bannerMessage.type === 'success' ? (
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Sparkles className="text-primary size-4 shrink-0" />
            )}
            <span className="text-foreground text-xs font-medium sm:text-sm">{bannerMessage.text}</span>
          </div>
          <Button variant="ghost" size="icon" className="size-7" onClick={() => setBannerMessage(null)}>
            <X className="size-3.5" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      )}

      {/* 4 Storage & Cost Impact Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Managed Data */}
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">Total Managed Data</CardTitle>
            <div className="bg-primary/10 text-primary rounded-lg p-2">
              <Database className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-foreground text-2xl font-bold tracking-tight">{stats.totalManagedData}</div>
            <p className="text-muted-foreground text-xs">{stats.totalManagedSubtitle}</p>
          </CardContent>
        </Card>

        {/* Auto-Archived to Glacier / Cold Tier */}
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Auto-Archived to Glacier / Cold Tier
            </CardTitle>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
              <HardDriveDownload className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between gap-x-2">
              <span className="text-foreground text-2xl font-bold tracking-tight">{stats.coldArchivedData}</span>
              <Badge variant="info" className="text-xs">
                {stats.archivedPercentage}% archived
              </Badge>
            </div>
            <Progress value={stats.archivedPercentage} className="h-1.5" />
            <p className="text-muted-foreground text-xs">{stats.archivedSubtitle}</p>
          </CardContent>
        </Card>

        {/* Projected Monthly Storage Savings */}
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">Projected Monthly Savings</CardTitle>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-foreground text-2xl font-bold tracking-tight">{stats.projectedMonthlySavings}</span>
              <Badge variant="success" className="text-xs">
                Active
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">{stats.savingsSubtitle}</p>
          </CardContent>
        </Card>

        {/* Expired Data Purged in 30d */}
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">Expired Data Purged (30d)</CardTitle>
            <div className="bg-warning/10 text-warning rounded-lg p-2">
              <Trash2 className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-foreground text-2xl font-bold tracking-tight">{stats.purged30d}</span>
              <Badge variant="outline" className="text-xs">
                TTL Drops
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">{stats.purgedSubtitle}</p>
          </CardContent>
        </Card>
      </div>

      {/* Retention Policies Table Card */}
      <Card className="shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Table Retention Policies & Partition TTL</CardTitle>
              <CardDescription className="text-xs">
                Automated lifecycle transition rules, cold tiering, and compliance audit locks across databases.
              </CardDescription>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search table, database, or compliance..."
                  className="h-8 pl-9 text-xs"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-8 w-32 text-xs">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="enabled">Active</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={complianceFilter} onValueChange={setComplianceFilter}>
                <SelectTrigger className="h-8 w-38 text-xs">
                  <SelectValue placeholder="All Compliance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Compliance</SelectItem>
                  <SelectItem value="SOX Compliance">SOX Compliance</SelectItem>
                  <SelectItem value="GDPR Art. 17">GDPR Art. 17</SelectItem>
                  <SelectItem value="Storage Optimization">Storage Optimization</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="min-w-[240px]">Table Name & Database</TableHead>
                  <TableHead className="min-w-[150px]">Retention Period</TableHead>
                  <TableHead className="min-w-[280px]">Lifecycle Action & Tiering</TableHead>
                  <TableHead className="min-w-[150px]">Compliance Reason</TableHead>
                  <TableHead className="min-w-[120px]">Status</TableHead>
                  <TableHead className="w-16 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPolicies.map((policy) => (
                  <TableRow
                    key={policy.id}
                    className={cn('group transition-colors', !policy.enabled && 'opacity-70 dark:opacity-65')}
                  >
                    {/* Table Name & Database */}
                    <TableCell className="py-3.5 align-top">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-foreground font-mono text-xs font-semibold">{policy.tableName}</span>
                          <button
                            type="button"
                            className="text-muted-foreground hover:text-foreground inline-flex size-4 shrink-0 items-center justify-center transition-colors"
                            title={copiedTable === policy.tableName ? 'Copied!' : 'Copy table name'}
                            onClick={() => copyTableName(policy.tableName)}
                          >
                            {copiedTable === policy.tableName ? (
                              <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Copy className="size-3" />
                            )}
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 text-xs">
                          <Badge variant="outline" className="font-mono text-xs">
                            {
                              {
                                Snowflake: 'Snowflake',
                                BigQuery: 'BigQuery',
                                Databricks: 'Databricks',
                                Postgres: 'Postgres',
                              }[policy.engine]
                            }
                          </Badge>
                          <span className="text-muted-foreground font-mono text-xs">{policy.database}</span>
                        </div>
                        {policy.rowCount && (
                          <div className="text-muted-foreground text-xs">
                            {policy.rowCount} · {policy.totalSize}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Retention Period Badge */}
                    <TableCell className="py-3.5 align-top">
                      <div className="space-y-1">
                        <Badge variant={getRetentionBadgeVariant(policy.retentionPeriod)} className="gap-1 text-xs">
                          <Clock className="size-3" />
                          {policy.retentionPeriod}
                        </Badge>
                        <p className="text-muted-foreground font-mono text-xs">Col: {policy.partitionColumn}</p>
                      </div>
                    </TableCell>

                    {/* Lifecycle Action & Tiering */}
                    <TableCell className="py-3.5 align-top">
                      <div className="space-y-1">
                        <div className="text-foreground flex items-center gap-1.5 text-xs font-medium">
                          <Archive className="text-muted-foreground size-3.5 shrink-0" />
                          <span>{policy.lifecycleAction}</span>
                        </div>
                        <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
                          <span>
                            Tier: <strong className="text-foreground font-normal">{policy.archiveTier}</strong>
                          </span>
                          <span>·</span>
                          <span>
                            Savings:{' '}
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              {policy.estimatedMonthlySavings}
                            </span>
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Compliance Reason */}
                    <TableCell className="py-3.5 align-top">
                      <div className="space-y-1">
                        <Badge variant={getComplianceBadgeVariant(policy.complianceReason)} className="gap-1 text-xs">
                          {policy.complianceReason.includes('SOX') || policy.complianceReason.includes('GDPR') ? (
                            <ShieldCheck className="size-3" />
                          ) : (
                            <Sparkles className="size-3" />
                          )}
                          {policy.complianceReason}
                        </Badge>
                        <p className="text-muted-foreground text-xs">Next: {policy.nextRun}</p>
                      </div>
                    </TableCell>

                    {/* Status Switch */}
                    <TableCell className="py-3.5 align-middle">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={policy.enabled}
                          aria-label={`Toggle retention policy for ${policy.tableName}`}
                          onCheckedChange={() => togglePolicyStatus(policy.id)}
                        />
                        <span
                          className={cn(
                            'text-xs font-medium',
                            policy.enabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground',
                          )}
                        >
                          {policy.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </TableCell>

                    {/* Action Menu */}
                    <TableCell className="py-3.5 text-right align-middle">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Open actions for {policy.tableName}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-52">
                          <DropdownMenuLabel className="text-xs">Policy Controls</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer" onClick={() => openRunArchiveModal(policy)}>
                            <Play className="mr-2 size-4 text-emerald-600 dark:text-emerald-400" />
                            <span>Run Archive Now</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => openEditPolicyModal(policy)}>
                            <Pencil className="mr-2 size-4" />
                            <span>Edit Policy</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => copyTableName(policy.tableName)}>
                            <Copy className="mr-2 size-4" />
                            <span>Copy Table Name</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive cursor-pointer"
                            onClick={() => deletePolicy(policy.id)}
                          >
                            <Trash2 className="mr-2 size-4" />
                            <span>Delete Policy</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}

                {filteredPolicies.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-muted-foreground h-32 text-center text-sm">
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <Search className="text-muted-foreground/40 size-6" />
                        <p className="text-foreground text-sm font-medium">No retention policies found</p>
                        <p className="text-muted-foreground text-xs">
                          Try adjusting your search query or filter settings.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add / Edit Policy Dialog */}
      <Dialog open={isPolicyModalOpen} onOpenChange={setIsPolicyModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingPolicy ? 'Edit Retention Policy' : 'Add Retention Policy'}</DialogTitle>
            <DialogDescription className="text-xs">
              Configure partition expiration time-to-live, cold tier transitions, and legal retention mandates.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2">
            <div className="space-y-1">
              <label htmlFor="policy-table-name" className="text-foreground text-xs font-medium">
                Target Table (schema.table)
              </label>
              <Input
                id="policy-table-name"
                value={formTableName}
                onChange={(e) => setFormTableName(e.target.value)}
                placeholder="e.g. telemetry.clickstream_raw"
                className="font-mono text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="policy-engine" className="text-foreground text-xs font-medium">
                  Engine
                </label>
                <Select value={formEngine} onValueChange={(v) => setFormEngine(v as EngineType)}>
                  <SelectTrigger id="policy-engine" className="text-xs">
                    <SelectValue placeholder="Engine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Snowflake">Snowflake</SelectItem>
                    <SelectItem value="BigQuery">BigQuery</SelectItem>
                    <SelectItem value="Databricks">Databricks</SelectItem>
                    <SelectItem value="Postgres">Postgres</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label htmlFor="policy-database" className="text-foreground text-xs font-medium">
                  Database / Cluster
                </label>
                <Input
                  id="policy-database"
                  value={formDatabase}
                  onChange={(e) => setFormDatabase(e.target.value)}
                  placeholder="e.g. SNOWFLAKE_PROD_DWH"
                  className="font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="policy-partition-col" className="text-foreground text-xs font-medium">
                  Partition Column
                </label>
                <Input
                  id="policy-partition-col"
                  value={formPartitionCol}
                  onChange={(e) => setFormPartitionCol(e.target.value)}
                  placeholder="e.g. event_timestamp (DAY)"
                  className="font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="policy-retention-period" className="text-foreground text-xs font-medium">
                  Retention Period
                </label>
                <Select value={formRetentionPeriod} onValueChange={setFormRetentionPeriod}>
                  <SelectTrigger id="policy-retention-period" className="text-xs">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="14 Days TTL">14 Days TTL</SelectItem>
                    <SelectItem value="30 Days TTL">30 Days TTL</SelectItem>
                    <SelectItem value="90 Days Active">90 Days Active</SelectItem>
                    <SelectItem value="180 Days Active">180 Days Active</SelectItem>
                    <SelectItem value="365 Days Active">365 Days Active</SelectItem>
                    <SelectItem value="7 Years Compliance">7 Years Compliance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="policy-lifecycle-action" className="text-foreground text-xs font-medium">
                Lifecycle Transition Action
              </label>
              <Input
                id="policy-lifecycle-action"
                value={formLifecycleAction}
                onChange={(e) => setFormLifecycleAction(e.target.value)}
                placeholder="e.g. Transition to Cold Glacier at 90d -> Hard Purge at 365d"
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="policy-archive-tier" className="text-foreground text-xs font-medium">
                  Cold Storage Tier
                </label>
                <Select value={formArchiveTier} onValueChange={(v) => setFormArchiveTier(v as ArchiveTierType)}>
                  <SelectTrigger id="policy-archive-tier" className="text-xs">
                    <SelectValue placeholder="Tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Glacier Deep">Glacier Deep Archive</SelectItem>
                    <SelectItem value="Coldline">BigQuery Coldline</SelectItem>
                    <SelectItem value="Standard Cold">Standard Cold</SelectItem>
                    <SelectItem value="Purge Immediately">Purge Immediately</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label htmlFor="policy-compliance" className="text-foreground text-xs font-medium">
                  Compliance Framework
                </label>
                <Select value={formComplianceReason} onValueChange={setFormComplianceReason}>
                  <SelectTrigger id="policy-compliance" className="text-xs">
                    <SelectValue placeholder="Compliance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOX Compliance">SOX Compliance</SelectItem>
                    <SelectItem value="GDPR Art. 17">GDPR Art. 17</SelectItem>
                    <SelectItem value="Storage Optimization">Storage Optimization</SelectItem>
                    <SelectItem value="PCI-DSS v4.0">PCI-DSS v4.0</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPolicyModalOpen(false)}>
              Cancel
            </Button>
            <Button disabled={!formTableName.trim()} onClick={savePolicy}>
              {editingPolicy ? 'Save Policy Changes' : 'Create Retention Policy'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Run Archive Dry-Run & Execution Modal */}
      <Dialog open={isArchiveModalOpen} onOpenChange={setIsArchiveModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 text-primary rounded-lg p-2">
                <HardDriveDownload className="size-5" />
              </div>
              <div>
                <DialogTitle>Run Archive Partition Sweep</DialogTitle>
                <DialogDescription className="text-xs">
                  Trigger manual partition evaluation and transition expired partitions to cold storage.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="border-border bg-muted/40 space-y-2 rounded-lg border p-3">
              <div className="flex items-center justify-between gap-x-2">
                <span className="text-muted-foreground">Target Table:</span>
                <span className="text-foreground font-mono font-semibold">{selectedPolicyForArchive?.tableName}</span>
              </div>
              <div className="flex items-center justify-between gap-x-2">
                <span className="text-muted-foreground">Database Engine:</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {selectedPolicyForArchive?.engine}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-x-2">
                <span className="text-muted-foreground">Lifecycle Action:</span>
                <span className="text-foreground font-medium">{selectedPolicyForArchive?.lifecycleAction}</span>
              </div>
              <div className="flex items-center justify-between gap-x-2">
                <span className="text-muted-foreground">Est. Savings:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {selectedPolicyForArchive?.estimatedMonthlySavings}
                </span>
              </div>
            </div>

            <div className="border-border bg-card text-muted-foreground space-y-1 rounded-lg border p-3">
              <div className="text-foreground flex items-center gap-1.5 font-medium">
                <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
                <span>Dry-Run Check Passed</span>
              </div>
              <p className="text-xs">
                Partitions older than configured threshold will be compressed, archived into cold tier, and purged from
                active storage without table locks.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" disabled={isArchiving} onClick={() => setIsArchiveModalOpen(false)}>
              Cancel
            </Button>
            <Button disabled={isArchiving} className="gap-1.5" onClick={executeArchiveRun}>
              {isArchiving ? (
                <>
                  <RefreshCw className="size-4 animate-spin" />
                  Archiving Partitions...
                </>
              ) : (
                <>
                  <Play className="size-4" />
                  Run Archive Sweep Now
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DataRetentionPolicyManager

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
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
} from 'lucide-vue-next'
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

interface Props {
  initialPolicies?: RetentionPolicy[]
  initialStats?: StorageRetentionStats
  class?: HTMLAttributes['class']
}

const defaultPolicies: RetentionPolicy[] = [
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

const defaultStats: StorageRetentionStats = {
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

const props = defineProps<Props>()

const stats = computed<StorageRetentionStats>(() => props.initialStats ?? defaultStats)
const policies = ref<RetentionPolicy[]>([...(props.initialPolicies ?? defaultPolicies)])
const searchQuery = ref('')
const statusFilter = ref<string>('all')
const complianceFilter = ref<string>('all')
const bannerMessage = ref<{ type: 'success' | 'info'; text: string } | null>(null)
const copiedTable = ref<string | null>(null)

// Modal States
const isPolicyModalOpen = ref(false)
const editingPolicy = ref<RetentionPolicy | null>(null)
const formTableName = ref('')
const formDatabase = ref('')
const formEngine = ref<EngineType>('Snowflake')
const formPartitionCol = ref('')
const formRetentionPeriod = ref('90 Days Active')
const formLifecycleAction = ref('Transition to Cold Glacier at 90d -> Hard Purge at 365d')
const formArchiveTier = ref<ArchiveTierType>('Glacier Deep')
const formComplianceReason = ref('SOX Compliance')

// Instant Archive Modal
const isArchiveModalOpen = ref(false)
const selectedPolicyForArchive = ref<RetentionPolicy | null>(null)
const isArchiving = ref(false)

const filteredPolicies = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return policies.value.filter((policy) => {
    if (statusFilter.value === 'enabled' && !policy.enabled) return false
    if (statusFilter.value === 'disabled' && policy.enabled) return false

    if (complianceFilter.value !== 'all' && policy.complianceReason !== complianceFilter.value) {
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
})

function togglePolicyStatus(id: string) {
  const target = policies.value.find((p) => p.id === id)
  if (target) {
    target.enabled = !target.enabled
    bannerMessage.value = {
      type: 'info',
      text: `Retention policy for table "${target.tableName}" has been ${target.enabled ? 'activated' : 'paused'}.`,
    }
  }
}

function deletePolicy(id: string) {
  const target = policies.value.find((p) => p.id === id)
  policies.value = policies.value.filter((p) => p.id !== id)
  if (target) {
    bannerMessage.value = {
      type: 'info',
      text: `Deleted retention policy for "${target.tableName}".`,
    }
  }
}

function copyTableName(name: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(name)
    copiedTable.value = name
    setTimeout(() => {
      if (copiedTable.value === name) copiedTable.value = null
    }, 2000)
  }
}

function openAddPolicyModal() {
  editingPolicy.value = null
  formTableName.value = ''
  formDatabase.value = 'SNOWFLAKE_PROD_DWH'
  formEngine.value = 'Snowflake'
  formPartitionCol.value = 'created_at (DAY)'
  formRetentionPeriod.value = '90 Days Active'
  formLifecycleAction.value = 'Transition to Cold Glacier at 90d -> Hard Purge at 365d'
  formArchiveTier.value = 'Glacier Deep'
  formComplianceReason.value = 'Storage Optimization'
  isPolicyModalOpen.value = true
}

function openEditPolicyModal(policy: RetentionPolicy) {
  editingPolicy.value = policy
  formTableName.value = policy.tableName
  formDatabase.value = policy.database
  formEngine.value = policy.engine
  formPartitionCol.value = policy.partitionColumn
  formRetentionPeriod.value = policy.retentionPeriod
  formLifecycleAction.value = policy.lifecycleAction
  formArchiveTier.value = policy.archiveTier
  formComplianceReason.value = policy.complianceReason
  isPolicyModalOpen.value = true
}

function savePolicy() {
  if (!formTableName.value.trim()) return

  if (editingPolicy.value) {
    const idx = policies.value.findIndex((p) => p.id === editingPolicy.value?.id)
    if (idx !== -1) {
      policies.value[idx] = {
        ...policies.value[idx],
        tableName: formTableName.value.trim(),
        database: formDatabase.value.trim() || 'SNOWFLAKE_PROD_DWH',
        engine: formEngine.value,
        partitionColumn: formPartitionCol.value.trim() || 'event_timestamp',
        retentionPeriod: formRetentionPeriod.value,
        lifecycleAction: formLifecycleAction.value,
        archiveTier: formArchiveTier.value,
        complianceReason: formComplianceReason.value,
      }
      bannerMessage.value = {
        type: 'success',
        text: `Updated retention policy for "${formTableName.value}".`,
      }
    }
  } else {
    const newPolicy: RetentionPolicy = {
      id: `pol-${Date.now()}`,
      tableName: formTableName.value.trim(),
      database: formDatabase.value.trim() || 'SNOWFLAKE_PROD_DWH',
      engine: formEngine.value,
      partitionColumn: formPartitionCol.value.trim() || 'created_at (DAY)',
      retentionPeriod: formRetentionPeriod.value,
      lifecycleAction: formLifecycleAction.value,
      archiveTier: formArchiveTier.value,
      complianceReason: formComplianceReason.value,
      totalSize: '1.2 TB',
      coldSize: '0.8 TB',
      estimatedMonthlySavings: '$110.00 / mo',
      enabled: true,
      lastRun: 'Pending First Run',
      nextRun: 'Tonight at 00:00 UTC',
      rowCount: '150M rows',
    }
    policies.value.unshift(newPolicy)
    bannerMessage.value = {
      type: 'success',
      text: `Created new automated retention policy for "${newPolicy.tableName}".`,
    }
  }
  isPolicyModalOpen.value = false
}

function openRunArchiveModal(policy: RetentionPolicy) {
  selectedPolicyForArchive.value = policy
  isArchiveModalOpen.value = true
}

function executeArchiveRun() {
  if (!selectedPolicyForArchive.value) return
  isArchiving.value = true

  setTimeout(() => {
    isArchiving.value = false
    isArchiveModalOpen.value = false
    const target = selectedPolicyForArchive.value
    if (target) {
      const idx = policies.value.findIndex((p) => p.id === target.id)
      if (idx !== -1) {
        policies.value[idx] = {
          ...policies.value[idx],
          lastRun: 'Just now',
        }
      }
      bannerMessage.value = {
        type: 'success',
        text: `Archive partition sweep successfully completed for "${target.tableName}". Cold tier storage synchronized.`,
      }
    }
  }, 1200)
}

function getRetentionBadgeVariant(
  period: string,
): 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'info' {
  if (period.includes('7 Years') || period.includes('Compliance')) return 'success'
  if (period.includes('TTL') || period.includes('14 Days') || period.includes('30 Days')) return 'warning'
  if (period.includes('90 Days') || period.includes('180 Days')) return 'info'
  return 'secondary'
}

function getComplianceBadgeVariant(
  reason: string,
): 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'info' {
  if (reason.includes('GDPR') || reason.includes('CCPA')) return 'info'
  if (reason.includes('SOX') || reason.includes('HIPAA')) return 'success'
  if (reason.includes('Storage') || reason.includes('Optimization')) return 'secondary'
  if (reason.includes('PCI')) return 'warning'
  return 'outline'
}
</script>

<template>
  <div data-slot="data-retention-policy-manager" :class="cn('w-full space-y-6', props.class)">
    <!-- Header Section -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg">
            <Archive class="size-4.5" />
          </div>
          <h1 class="text-foreground text-2xl font-bold tracking-tight">Data Retention & Cold Storage Lifecycle</h1>
        </div>
        <p class="text-muted-foreground text-sm">
          Configure automated table partition expiration, cold storage tiering, and compliance retention periods.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <Button class="gap-1.5" @click="openAddPolicyModal">
          <Plus class="size-4" />
          Add Retention Policy
        </Button>
      </div>
    </div>

    <!-- Notification / Action banner -->
    <div
      v-if="bannerMessage"
      class="border-border bg-card flex items-center justify-between gap-3 rounded-lg border p-3 shadow-xs"
    >
      <div class="flex items-center gap-2.5 text-sm">
        <CheckCircle2
          v-if="bannerMessage.type === 'success'"
          class="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
        />
        <Sparkles v-else class="text-primary size-4 shrink-0" />
        <span class="text-foreground text-xs font-medium sm:text-sm">{{ bannerMessage.text }}</span>
      </div>
      <Button variant="ghost" size="icon" class="size-7" @click="bannerMessage = null">
        <X class="size-3.5" />
        <span class="sr-only">Dismiss</span>
      </Button>
    </div>

    <!-- 4 Storage & Cost Impact Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Total Managed Data -->
      <Card class="shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-muted-foreground text-sm font-medium">Total Managed Data</CardTitle>
          <div class="bg-primary/10 text-primary rounded-lg p-2">
            <Database class="size-4" />
          </div>
        </CardHeader>
        <CardContent class="space-y-1">
          <div class="text-foreground text-2xl font-bold tracking-tight">{{ stats.totalManagedData }}</div>
          <p class="text-muted-foreground text-xs">{{ stats.totalManagedSubtitle }}</p>
        </CardContent>
      </Card>

      <!-- Auto-Archived to Glacier / Cold Tier -->
      <Card class="shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-muted-foreground text-sm font-medium">Auto-Archived to Glacier / Cold Tier</CardTitle>
          <div class="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
            <HardDriveDownload class="size-4" />
          </div>
        </CardHeader>
        <CardContent class="space-y-2">
          <div class="flex items-center justify-between gap-x-2">
            <span class="text-foreground text-2xl font-bold tracking-tight">{{ stats.coldArchivedData }}</span>
            <Badge variant="info" class="text-xs">{{ stats.archivedPercentage }}% archived</Badge>
          </div>
          <Progress :model-value="stats.archivedPercentage" class="h-1.5" />
          <p class="text-muted-foreground text-xs">{{ stats.archivedSubtitle }}</p>
        </CardContent>
      </Card>

      <!-- Projected Monthly Storage Savings -->
      <Card class="shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-muted-foreground text-sm font-medium">Projected Monthly Savings</CardTitle>
          <div class="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
            <DollarSign class="size-4" />
          </div>
        </CardHeader>
        <CardContent class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-foreground text-2xl font-bold tracking-tight">{{ stats.projectedMonthlySavings }}</span>
            <Badge variant="success" class="text-xs">Active</Badge>
          </div>
          <p class="text-muted-foreground text-xs">{{ stats.savingsSubtitle }}</p>
        </CardContent>
      </Card>

      <!-- Expired Data Purged in 30d -->
      <Card class="shadow-xs">
        <CardHeader class="flex flex-row items-center justify-between pb-2">
          <CardTitle class="text-muted-foreground text-sm font-medium">Expired Data Purged (30d)</CardTitle>
          <div class="bg-warning/10 text-warning rounded-lg p-2">
            <Trash2 class="size-4" />
          </div>
        </CardHeader>
        <CardContent class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-foreground text-2xl font-bold tracking-tight">{{ stats.purged30d }}</span>
            <Badge variant="outline" class="text-xs">TTL Drops</Badge>
          </div>
          <p class="text-muted-foreground text-xs">{{ stats.purgedSubtitle }}</p>
        </CardContent>
      </Card>
    </div>

    <!-- Retention Policies Table Card -->
    <Card class="shadow-xs">
      <CardHeader class="pb-3">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle class="text-lg font-semibold">Table Retention Policies & Partition TTL</CardTitle>
            <CardDescription class="text-xs">
              Automated lifecycle transition rules, cold tiering, and compliance audit locks across databases.
            </CardDescription>
          </div>

          <!-- Filter Toolbar -->
          <div class="flex flex-wrap items-center gap-2">
            <div class="relative w-full sm:w-64">
              <Search
                class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
              />
              <Input
                v-model="searchQuery"
                placeholder="Search table, database, or compliance..."
                class="h-8 pl-9 text-xs"
              />
            </div>

            <Select v-model="statusFilter">
              <SelectTrigger class="h-8 w-32 text-xs">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="enabled">Active</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>

            <Select v-model="complianceFilter">
              <SelectTrigger class="h-8 w-38 text-xs">
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

      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow class="hover:bg-transparent">
                <TableHead class="min-w-[240px]">Table Name & Database</TableHead>
                <TableHead class="min-w-[150px]">Retention Period</TableHead>
                <TableHead class="min-w-[280px]">Lifecycle Action & Tiering</TableHead>
                <TableHead class="min-w-[150px]">Compliance Reason</TableHead>
                <TableHead class="min-w-[120px]">Status</TableHead>
                <TableHead class="w-16 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="policy in filteredPolicies"
                :key="policy.id"
                :class="cn('group transition-colors', !policy.enabled && 'opacity-70 dark:opacity-65')"
              >
                <!-- Table Name & Database -->
                <TableCell class="py-3.5 align-top">
                  <div class="space-y-1">
                    <div class="flex items-center gap-1.5">
                      <span class="text-foreground font-mono text-xs font-semibold">{{ policy.tableName }}</span>
                      <button
                        type="button"
                        class="text-muted-foreground hover:text-foreground inline-flex size-4 shrink-0 items-center justify-center transition-colors"
                        :title="copiedTable === policy.tableName ? 'Copied!' : 'Copy table name'"
                        @click="copyTableName(policy.tableName)"
                      >
                        <Check
                          v-if="copiedTable === policy.tableName"
                          class="size-3 text-emerald-600 dark:text-emerald-400"
                        />
                        <Copy v-else class="size-3" />
                      </button>
                    </div>
                    <div class="flex flex-wrap items-center gap-1.5 text-xs">
                      <Badge variant="outline" class="font-mono text-xs">
                        {{ policy.engine }}
                      </Badge>
                      <span class="text-muted-foreground font-mono text-xs">{{ policy.database }}</span>
                    </div>
                    <div v-if="policy.rowCount" class="text-muted-foreground text-xs">
                      {{ policy.rowCount }} · {{ policy.totalSize }}
                    </div>
                  </div>
                </TableCell>

                <!-- Retention Period Badge -->
                <TableCell class="py-3.5 align-top">
                  <div class="space-y-1">
                    <Badge :variant="getRetentionBadgeVariant(policy.retentionPeriod)" class="gap-1 text-xs">
                      <Clock class="size-3" />
                      {{ policy.retentionPeriod }}
                    </Badge>
                    <p class="text-muted-foreground font-mono text-xs">Col: {{ policy.partitionColumn }}</p>
                  </div>
                </TableCell>

                <!-- Lifecycle Action & Tiering -->
                <TableCell class="py-3.5 align-top">
                  <div class="space-y-1">
                    <div class="text-foreground flex items-center gap-1.5 text-xs font-medium">
                      <Archive class="text-muted-foreground size-3.5 shrink-0" />
                      <span>{{ policy.lifecycleAction }}</span>
                    </div>
                    <div class="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
                      <span
                        >Tier: <strong class="text-foreground font-normal">{{ policy.archiveTier }}</strong></span
                      >
                      <span>·</span>
                      <span
                        >Savings:
                        <span class="font-semibold text-emerald-600 dark:text-emerald-400">{{
                          policy.estimatedMonthlySavings
                        }}</span></span
                      >
                    </div>
                  </div>
                </TableCell>

                <!-- Compliance Reason -->
                <TableCell class="py-3.5 align-top">
                  <div class="space-y-1">
                    <Badge :variant="getComplianceBadgeVariant(policy.complianceReason)" class="gap-1 text-xs">
                      <ShieldCheck
                        v-if="policy.complianceReason.includes('SOX') || policy.complianceReason.includes('GDPR')"
                        class="size-3"
                      />
                      <Sparkles v-else class="size-3" />
                      {{ policy.complianceReason }}
                    </Badge>
                    <p class="text-muted-foreground text-xs">Next: {{ policy.nextRun }}</p>
                  </div>
                </TableCell>

                <!-- Status Switch -->
                <TableCell class="py-3.5 align-middle">
                  <div class="flex items-center gap-2">
                    <Switch
                      :model-value="policy.enabled"
                      :aria-label="`Toggle retention policy for ${policy.tableName}`"
                      @update:model-value="togglePolicyStatus(policy.id)"
                    />
                    <span
                      :class="
                        cn(
                          'text-xs font-medium',
                          policy.enabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground',
                        )
                      "
                    >
                      {{ policy.enabled ? 'Enabled' : 'Disabled' }}
                    </span>
                  </div>
                </TableCell>

                <!-- Action Menu -->
                <TableCell class="py-3.5 text-right align-middle">
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <Button variant="ghost" size="icon" class="size-8">
                        <MoreHorizontal class="size-4" />
                        <span class="sr-only">Open actions for {{ policy.tableName }}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" class="w-52">
                      <DropdownMenuLabel class="text-xs">Policy Controls</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem class="cursor-pointer" @click="openRunArchiveModal(policy)">
                        <Play class="mr-2 size-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Run Archive Now</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem class="cursor-pointer" @click="openEditPolicyModal(policy)">
                        <Pencil class="mr-2 size-4" />
                        <span>Edit Policy</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem class="cursor-pointer" @click="copyTableName(policy.tableName)">
                        <Copy class="mr-2 size-4" />
                        <span>Copy Table Name</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        class="text-destructive focus:text-destructive cursor-pointer"
                        @click="deletePolicy(policy.id)"
                      >
                        <Trash2 class="mr-2 size-4" />
                        <span>Delete Policy</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>

              <TableRow v-if="filteredPolicies.length === 0">
                <TableCell colspan="6" class="text-muted-foreground h-32 text-center text-sm">
                  <div class="flex flex-col items-center justify-center space-y-1">
                    <Search class="text-muted-foreground/40 size-6" />
                    <p class="text-foreground text-sm font-medium">No retention policies found</p>
                    <p class="text-muted-foreground text-xs">Try adjusting your search query or filter settings.</p>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    <!-- Add / Edit Policy Dialog -->
    <Dialog v-model:open="isPolicyModalOpen">
      <DialogContent class="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{{ editingPolicy ? 'Edit Retention Policy' : 'Add Retention Policy' }}</DialogTitle>
          <DialogDescription class="text-xs">
            Configure partition expiration time-to-live, cold tier transitions, and legal retention mandates.
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-3.5 py-2">
          <div class="space-y-1">
            <label for="policy-table-name" class="text-foreground text-xs font-medium"
              >Target Table (schema.table)</label
            >
            <Input
              id="policy-table-name"
              v-model="formTableName"
              placeholder="e.g. telemetry.clickstream_raw"
              class="font-mono text-xs"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label for="policy-engine" class="text-foreground text-xs font-medium">Engine</label>
              <Select v-model="formEngine">
                <SelectTrigger id="policy-engine" class="text-xs">
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

            <div class="space-y-1">
              <label for="policy-database" class="text-foreground text-xs font-medium">Database / Cluster</label>
              <Input
                id="policy-database"
                v-model="formDatabase"
                placeholder="e.g. SNOWFLAKE_PROD_DWH"
                class="font-mono text-xs"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label for="policy-partition-col" class="text-foreground text-xs font-medium">Partition Column</label>
              <Input
                id="policy-partition-col"
                v-model="formPartitionCol"
                placeholder="e.g. event_timestamp (DAY)"
                class="font-mono text-xs"
              />
            </div>

            <div class="space-y-1">
              <label for="policy-retention-period" class="text-foreground text-xs font-medium">Retention Period</label>
              <Select v-model="formRetentionPeriod">
                <SelectTrigger id="policy-retention-period" class="text-xs">
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

          <div class="space-y-1">
            <label for="policy-lifecycle-action" class="text-foreground text-xs font-medium"
              >Lifecycle Transition Action</label
            >
            <Input
              id="policy-lifecycle-action"
              v-model="formLifecycleAction"
              placeholder="e.g. Transition to Cold Glacier at 90d -> Hard Purge at 365d"
              class="text-xs"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label for="policy-archive-tier" class="text-foreground text-xs font-medium">Cold Storage Tier</label>
              <Select v-model="formArchiveTier">
                <SelectTrigger id="policy-archive-tier" class="text-xs">
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

            <div class="space-y-1">
              <label for="policy-compliance" class="text-foreground text-xs font-medium">Compliance Framework</label>
              <Select v-model="formComplianceReason">
                <SelectTrigger id="policy-compliance" class="text-xs">
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
          <Button variant="outline" @click="isPolicyModalOpen = false">Cancel</Button>
          <Button :disabled="!formTableName.trim()" @click="savePolicy">
            {{ editingPolicy ? 'Save Policy Changes' : 'Create Retention Policy' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Run Archive Dry-Run & Execution Modal -->
    <Dialog v-model:open="isArchiveModalOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <div class="flex items-center gap-2">
            <div class="bg-primary/10 text-primary rounded-lg p-2">
              <HardDriveDownload class="size-5" />
            </div>
            <div>
              <DialogTitle>Run Archive Partition Sweep</DialogTitle>
              <DialogDescription class="text-xs">
                Trigger manual partition evaluation and transition expired partitions to cold storage.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div class="space-y-3 py-2 text-xs">
          <div class="border-border bg-muted/40 space-y-2 rounded-lg border p-3">
            <div class="flex items-center justify-between gap-x-2">
              <span class="text-muted-foreground">Target Table:</span>
              <span class="text-foreground font-mono font-semibold">{{ selectedPolicyForArchive?.tableName }}</span>
            </div>
            <div class="flex items-center justify-between gap-x-2">
              <span class="text-muted-foreground">Database Engine:</span>
              <Badge variant="outline" class="font-mono text-xs">{{ selectedPolicyForArchive?.engine }}</Badge>
            </div>
            <div class="flex items-center justify-between gap-x-2">
              <span class="text-muted-foreground">Lifecycle Action:</span>
              <span class="text-foreground font-medium">{{ selectedPolicyForArchive?.lifecycleAction }}</span>
            </div>
            <div class="flex items-center justify-between gap-x-2">
              <span class="text-muted-foreground">Est. Savings:</span>
              <span class="font-semibold text-emerald-600 dark:text-emerald-400">{{
                selectedPolicyForArchive?.estimatedMonthlySavings
              }}</span>
            </div>
          </div>

          <div class="border-border bg-card text-muted-foreground space-y-1 rounded-lg border p-3">
            <div class="text-foreground flex items-center gap-1.5 font-medium">
              <ShieldCheck class="size-4 text-emerald-600 dark:text-emerald-400" />
              <span>Dry-Run Check Passed</span>
            </div>
            <p class="text-xs">
              Partitions older than configured threshold will be compressed, archived into cold tier, and purged from
              active storage without table locks.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" :disabled="isArchiving" @click="isArchiveModalOpen = false">Cancel</Button>
          <Button :disabled="isArchiving" class="gap-1.5" @click="executeArchiveRun">
            <RefreshCw v-if="isArchiving" class="size-4 animate-spin" />
            <Play v-else class="size-4" />
            {{ isArchiving ? 'Archiving Partitions...' : 'Run Archive Sweep Now' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

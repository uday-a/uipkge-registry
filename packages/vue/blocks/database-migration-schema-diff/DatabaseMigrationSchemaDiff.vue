<script setup lang="ts">
import { ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Copy,
  Database,
  FileCode2,
  GitBranch,
  GitCommit,
  HardDrive,
  Layers,
  Loader2,
  Play,
  RotateCcw,
  Server,
  ShieldCheck,
  Sparkles,
  Terminal,
  Timer,
  Undo2,
  Zap,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface DiffLine {
  num: number
  type: 'addition' | 'modification' | 'deletion' | 'neutral'
  prefix: string
  text: string
}

interface HistoricalMigration {
  id: string
  filename: string
  version: string
  description: string
  appliedAt: string
  author: string
  executionTime: string
  tablesAffected: string
  status: 'applied' | 'pending' | 'rolled_back'
  checksum: string
}

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

const activeTab = ref('up')
const isApplying = ref(false)
const isApplied = ref(false)
const copiedUpSql = ref(false)
const copiedDownSql = ref(false)
const copiedCli = ref(false)

const upSqlRaw = `-- Up Migration
-- Migration: 20260821142850_add_org_billing_seats_and_quotas.sql
-- Target: public.organizations

ALTER TABLE public.organizations 
  ADD COLUMN billing_seats_allocated INTEGER NOT NULL DEFAULT 5,
  ADD COLUMN max_seat_limit INTEGER NOT NULL DEFAULT 20,
  ADD COLUMN last_seat_audit_at TIMESTAMPTZ DEFAULT NOW();

CREATE INDEX idx_orgs_seat_audit ON public.organizations(last_seat_audit_at);`

const downSqlRaw = `-- Down Migration (Rollback)
-- Reverts: 20260821142850_add_org_billing_seats_and_quotas.sql
-- Target: public.organizations

DROP INDEX IF EXISTS idx_orgs_seat_audit;

ALTER TABLE public.organizations 
  DROP COLUMN IF EXISTS billing_seats_allocated,
  DROP COLUMN IF EXISTS max_seat_limit,
  DROP COLUMN IF EXISTS last_seat_audit_at;`

const upDiffLines: DiffLine[] = [
  { num: 1, type: 'neutral', prefix: ' ', text: '-- Up Migration' },
  { num: 2, type: 'neutral', prefix: ' ', text: '-- Migration: 20260821142850_add_org_billing_seats_and_quotas.sql' },
  { num: 3, type: 'neutral', prefix: ' ', text: '-- Target: public.organizations' },
  { num: 4, type: 'neutral', prefix: ' ', text: '' },
  { num: 5, type: 'modification', prefix: '~', text: 'ALTER TABLE public.organizations ' },
  { num: 6, type: 'addition', prefix: '+', text: '  ADD COLUMN billing_seats_allocated INTEGER NOT NULL DEFAULT 5,' },
  { num: 7, type: 'addition', prefix: '+', text: '  ADD COLUMN max_seat_limit INTEGER NOT NULL DEFAULT 20,' },
  { num: 8, type: 'addition', prefix: '+', text: '  ADD COLUMN last_seat_audit_at TIMESTAMPTZ DEFAULT NOW();' },
  { num: 9, type: 'neutral', prefix: ' ', text: '' },
  {
    num: 10,
    type: 'addition',
    prefix: '+',
    text: 'CREATE INDEX idx_orgs_seat_audit ON public.organizations(last_seat_audit_at);',
  },
]

const downDiffLines: DiffLine[] = [
  { num: 1, type: 'neutral', prefix: ' ', text: '-- Down Migration (Rollback)' },
  { num: 2, type: 'neutral', prefix: ' ', text: '-- Reverts: 20260821142850_add_org_billing_seats_and_quotas.sql' },
  { num: 3, type: 'neutral', prefix: ' ', text: '-- Target: public.organizations' },
  { num: 4, type: 'neutral', prefix: ' ', text: '' },
  { num: 5, type: 'deletion', prefix: '-', text: 'DROP INDEX IF EXISTS idx_orgs_seat_audit;' },
  { num: 6, type: 'neutral', prefix: ' ', text: '' },
  { num: 7, type: 'modification', prefix: '~', text: 'ALTER TABLE public.organizations ' },
  { num: 8, type: 'deletion', prefix: '-', text: '  DROP COLUMN IF EXISTS billing_seats_allocated,' },
  { num: 9, type: 'deletion', prefix: '-', text: '  DROP COLUMN IF EXISTS max_seat_limit,' },
  { num: 10, type: 'deletion', prefix: '-', text: '  DROP COLUMN IF EXISTS last_seat_audit_at;' },
]

const historicalMigrations: HistoricalMigration[] = [
  {
    id: 'mig_48',
    filename: '20260814091522_add_audit_logs_partitioning.sql',
    version: 'v2026.08.14.02',
    description: 'Partition audit_logs table by month range and attach default tablespace',
    appliedAt: 'Aug 14, 2026 · 09:15 UTC',
    author: 'alex.chen@corp',
    executionTime: '1.8s',
    tablesAffected: 'audit_logs, audit_logs_2026_08',
    status: 'applied',
    checksum: 'sha256:4e8b39c0',
  },
  {
    id: 'mig_47',
    filename: '20260810143011_create_api_rate_limits_table.sql',
    version: 'v2026.08.10.01',
    description: 'Create rate_limits table & redis fallback synchronization schema',
    appliedAt: 'Aug 10, 2026 · 14:30 UTC',
    author: 'sarah.m@corp',
    executionTime: '0.9s',
    tablesAffected: 'api_rate_limits',
    status: 'applied',
    checksum: 'sha256:d12c88f1',
  },
  {
    id: 'mig_46',
    filename: '20260802110540_add_saml_sso_workspaces.sql',
    version: 'v2026.08.02.03',
    description: 'Add SAML SSO domain verification and enterprise IdP metadata records',
    appliedAt: 'Aug 02, 2026 · 11:05 UTC',
    author: 'devops-bot',
    executionTime: '2.1s',
    tablesAffected: 'workspaces, idp_configs',
    status: 'applied',
    checksum: 'sha256:88a3b114',
  },
  {
    id: 'mig_45',
    filename: '20260725184219_optimize_query_cache_indexes.sql',
    version: 'v2026.07.25.01',
    description: 'Add CONCURRENT B-Tree composite index on team_id + created_at timestamp',
    appliedAt: 'Jul 25, 2026 · 18:42 UTC',
    author: 'alex.chen@corp',
    executionTime: '4.2s',
    tablesAffected: 'query_logs, cache_entries',
    status: 'applied',
    checksum: 'sha256:fa2300b9',
  },
  {
    id: 'mig_44',
    filename: '20260718082005_init_multi_tenant_memberships.sql',
    version: 'v2026.07.18.01',
    description: 'Initialize organization_memberships, team_roles, and permission cascades',
    appliedAt: 'Jul 18, 2026 · 08:20 UTC',
    author: 'elena.r@corp',
    executionTime: '1.2s',
    tablesAffected: 'org_members, permissions',
    status: 'applied',
    checksum: 'sha256:56df9201',
  },
]

function handleApplyMigration() {
  if (isApplying.value || isApplied.value) return
  isApplying.value = true
  setTimeout(() => {
    isApplying.value = false
    isApplied.value = true
  }, 900)
}

function handlePreviewRollback() {
  activeTab.value = 'rollback'
}

function handleResetState() {
  isApplied.value = false
  isApplying.value = false
}

function copyActiveSql() {
  copyToClipboard(
    activeTab.value === 'rollback' ? downSqlRaw : upSqlRaw,
    activeTab.value === 'rollback' ? 'down' : 'up',
  )
}

function copyToClipboard(text: string, type: 'up' | 'down' | 'cli') {
  navigator.clipboard.writeText(text)
  if (type === 'up') {
    copiedUpSql.value = true
    setTimeout(() => {
      copiedUpSql.value = false
    }, 2000)
  } else if (type === 'down') {
    copiedDownSql.value = true
    setTimeout(() => {
      copiedDownSql.value = false
    }, 2000)
  } else if (type === 'cli') {
    copiedCli.value = true
    setTimeout(() => {
      copiedCli.value = false
    }, 2000)
  }
}
</script>

<template>
  <div data-slot="database-migration-schema-diff" :class="cn('w-full space-y-6', props.class)">
    <!-- Header: Target Database & Version Runner Status -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="pb-4">
        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="space-y-1.5">
            <div class="flex flex-wrap items-center gap-2">
              <div class="text-foreground flex items-center gap-2 text-base font-semibold sm:text-lg">
                <Database class="text-primary size-5 shrink-0" />
                <span>PostgreSQL 16.2 · production_primary_cluster</span>
              </div>
              <div
                class="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
              >
                <span class="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                <span>Connected</span>
              </div>
            </div>

            <div class="text-muted-foreground flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <span class="text-foreground font-mono font-medium">v2026.08.21.01_add_org_billing_seats</span>
              <Separator orientation="vertical" class="h-3.5" />
              <span>db.us-east-1.aws.neon.tech:5432</span>
              <Separator orientation="vertical" class="h-3.5" />
              <span>public schema</span>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <Badge wrap v-if="!isApplied" variant="warning" class="gap-1.5 px-2.5 py-1 text-xs">
              <Clock class="size-3.5" />
              <span>1 Pending Migration Ready to Apply</span>
            </Badge>
            <Badge wrap v-else variant="success" class="gap-1.5 px-2.5 py-1 text-xs">
              <CheckCircle2 class="size-3.5" />
              <span>All Migrations Applied · In Sync</span>
            </Badge>

            <Button
              variant="outline"
              size="sm"
              class="h-9 gap-1.5 text-xs font-medium shadow-xs"
              @click="handlePreviewRollback"
            >
              <Undo2 class="text-muted-foreground size-3.5" />
              <span>Preview Rollback Script</span>
            </Button>

            <Button
              v-if="!isApplied"
              variant="default"
              size="sm"
              class="h-9 gap-1.5 text-xs font-medium shadow-xs"
              :disabled="isApplying"
              @click="handleApplyMigration"
            >
              <Loader2 v-if="isApplying" class="size-3.5 animate-spin" />
              <Play v-else class="size-3.5 fill-current" />
              <span>{{ isApplying ? 'Applying Migration...' : 'Apply Migration (prisma migrate deploy)' }}</span>
            </Button>

            <Button
              v-else
              variant="secondary"
              size="sm"
              class="h-9 gap-1.5 text-xs font-medium"
              @click="handleResetState"
            >
              <RotateCcw class="size-3.5" />
              <span>Reset State</span>
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>

    <!-- 4 Migration Telemetry Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Total Applied Migrations -->
      <Card class="border-border bg-card shadow-xs">
        <CardContent class="p-4 sm:p-5">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-xs font-medium">Total Applied Migrations</span>
            <div class="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-md">
              <Layers class="size-4" />
            </div>
          </div>
          <div class="mt-3">
            <div class="text-foreground text-2xl font-bold tracking-tight">
              {{ isApplied ? '49' : '48' }}
            </div>
            <p class="text-muted-foreground mt-1 text-xs">48 Migrations Applied · Baseline to v2026.08.14</p>
          </div>
          <div class="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <Check class="size-3.5" />
            <span>100% successful execution history</span>
          </div>
        </CardContent>
      </Card>

      <!-- Pending Migrations -->
      <Card
        :class="
          cn(
            'border-border bg-card shadow-xs transition-colors',
            !isApplied && 'border-amber-500/40 dark:border-amber-500/30',
          )
        "
      >
        <CardContent class="p-4 sm:p-5">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-xs font-medium">Pending Migrations</span>
            <div
              :class="
                cn(
                  'flex size-8 items-center justify-center rounded-md',
                  !isApplied
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                )
              "
            >
              <Clock v-if="!isApplied" class="size-4" />
              <CheckCircle2 v-else class="size-4" />
            </div>
          </div>
          <div class="mt-3">
            <div class="text-foreground text-2xl font-bold tracking-tight">
              {{ isApplied ? '0' : '1' }}
            </div>
            <p class="text-muted-foreground mt-1 text-xs">
              {{ isApplied ? '0 Pending · Schema up to date' : '1 Pending Deployment' }}
            </p>
          </div>
          <div
            :class="
              cn(
                'mt-3 flex items-center gap-1.5 text-xs font-medium',
                !isApplied ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400',
              )
            "
          >
            <Sparkles v-if="!isApplied" class="size-3.5" />
            <Check v-else class="size-3.5" />
            <span>{{ !isApplied ? 'Safe DDL · Non-blocking ALTER' : 'Schema verified against shadow DB' }}</span>
          </div>
        </CardContent>
      </Card>

      <!-- Last Migration Execution -->
      <Card class="border-border bg-card shadow-xs">
        <CardContent class="p-4 sm:p-5">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-xs font-medium">Last Migration Execution</span>
            <div class="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-md">
              <Zap class="size-4" />
            </div>
          </div>
          <div class="mt-3">
            <div class="text-foreground text-2xl font-bold tracking-tight">
              {{ isApplied ? '0.12s' : '3.4s' }}
            </div>
            <p class="text-muted-foreground mt-1 text-xs">3.4s execution time · 0 lock timeouts</p>
          </div>
          <div class="text-muted-foreground mt-3 flex items-center gap-1.5 text-xs">
            <Timer class="size-3.5" />
            <span>Zero query contention or lock waits</span>
          </div>
        </CardContent>
      </Card>

      <!-- Target Schema Integrity -->
      <Card class="border-border bg-card shadow-xs">
        <CardContent class="p-4 sm:p-5">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-xs font-medium">Target Schema Integrity</span>
            <div
              class="flex size-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            >
              <ShieldCheck class="size-4" />
            </div>
          </div>
          <div class="mt-3">
            <div class="text-foreground text-2xl font-bold tracking-tight">100%</div>
            <p class="text-muted-foreground mt-1 text-xs">100% Validated · Zero Drift</p>
          </div>
          <div class="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 class="size-3.5" />
            <span>Prisma schema & DB in sync</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Active Migration Inspector & DDL Diff Card -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="border-border border-b pb-4">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <FileCode2 class="text-primary size-4 shrink-0" />
              <CardTitle class="text-foreground font-mono text-sm font-semibold sm:text-base">
                20260821142850_add_org_billing_seats_and_quotas.sql
              </CardTitle>
              <Badge wrap v-if="!isApplied" variant="warning" class="text-xs"> Pending DDL Execution </Badge>
              <Badge wrap v-else variant="success" class="text-xs"> Applied in Production </Badge>
            </div>
            <CardDescription class="text-muted-foreground text-xs">
              Target Table: <span class="text-foreground font-mono font-medium">public.organizations</span> · Author:
              <span class="text-foreground">alex.chen@corp</span> · Estimated duration:
              <span class="text-foreground font-mono font-medium">~120ms</span>
            </CardDescription>
          </div>

          <div class="flex items-center gap-2">
            <Button variant="outline" size="sm" class="h-8 gap-1.5 text-xs font-medium" @click="copyActiveSql">
              <Check
                v-if="activeTab === 'rollback' ? copiedDownSql : copiedUpSql"
                class="size-3.5 text-emerald-600 dark:text-emerald-400"
              />
              <Copy v-else class="size-3.5" />
              <span>{{ (activeTab === 'rollback' ? copiedDownSql : copiedUpSql) ? 'Copied SQL' : 'Copy SQL' }}</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent class="p-4 sm:p-6">
        <Tabs v-model="activeTab" class="w-full space-y-4">
          <TabsList class="grid w-full grid-cols-2 sm:inline-flex sm:w-auto sm:grid-cols-none">
            <TabsTrigger value="up" class="gap-1.5 text-xs">
              <Code2 class="size-3.5" />
              <span>DDL Diff (Up)</span>
            </TabsTrigger>
            <TabsTrigger value="rollback" class="gap-1.5 text-xs">
              <Undo2 class="size-3.5" />
              <span>Rollback Script (Down)</span>
            </TabsTrigger>
            <TabsTrigger value="impact" class="gap-1.5 text-xs">
              <HardDrive class="size-3.5" />
              <span>Schema Impact</span>
            </TabsTrigger>
            <TabsTrigger value="cli" class="gap-1.5 text-xs">
              <Terminal class="size-3.5" />
              <span>Prisma / CLI Runner</span>
            </TabsTrigger>
          </TabsList>

          <!-- Tab 1: DDL Diff (Up) -->
          <TabsContent value="up" class="space-y-3 focus-visible:outline-none">
            <div
              class="border-border bg-muted/50 flex items-center justify-between rounded-t-md border-x border-t px-3 py-2 text-xs"
            >
              <div class="text-muted-foreground flex items-center gap-2">
                <span class="text-foreground font-medium">Forward Migration (Up)</span>
                <span>·</span>
                <span class="font-medium text-emerald-600 dark:text-emerald-400">+3 columns added</span>
                <span>·</span>
                <span class="font-medium text-sky-600 dark:text-sky-400">+1 index created</span>
              </div>
              <span class="text-muted-foreground font-mono">SQL (PostgreSQL DDL)</span>
            </div>

            <div
              class="border-border bg-muted/20 overflow-x-auto rounded-b-md border font-mono text-xs leading-relaxed"
            >
              <div class="max-w-[540px] min-w-full py-2">
                <div
                  v-for="line in upDiffLines"
                  :key="line.num"
                  :class="
                    cn(
                      'flex items-center px-3 py-0.5 transition-colors',
                      line.type === 'addition' &&
                        'border-l-2 border-emerald-500 bg-emerald-500/10 font-medium text-emerald-800 dark:text-emerald-300',
                      line.type === 'modification' &&
                        'border-l-2 border-sky-500 bg-sky-500/10 font-medium text-sky-800 dark:text-sky-300',
                      line.type === 'neutral' && 'text-muted-foreground border-l-2 border-transparent',
                    )
                  "
                >
                  <span class="text-muted-foreground/50 w-7 shrink-0 pr-3 text-right select-none">{{ line.num }}</span>
                  <span
                    :class="
                      cn(
                        'w-4 shrink-0 text-center font-bold select-none',
                        line.type === 'addition' && 'text-emerald-600 dark:text-emerald-400',
                        line.type === 'modification' && 'text-sky-600 dark:text-sky-400',
                        line.type === 'neutral' && 'text-transparent',
                      )
                    "
                    >{{ line.prefix }}</span
                  >
                  <span class="pl-1 whitespace-pre">{{ line.text }}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <!-- Tab 2: Rollback Script (Down) -->
          <TabsContent value="rollback" class="space-y-3 focus-visible:outline-none">
            <div
              class="border-border bg-muted/50 flex items-center justify-between rounded-t-md border-x border-t px-3 py-2 text-xs"
            >
              <div class="text-muted-foreground flex items-center gap-2">
                <span class="text-foreground font-medium">Revert Script (Down)</span>
                <span>·</span>
                <span class="font-medium text-rose-600 dark:text-rose-400">-3 columns dropped</span>
                <span>·</span>
                <span class="font-medium text-rose-600 dark:text-rose-400">-1 index dropped</span>
              </div>
              <span class="text-muted-foreground font-mono">SQL (PostgreSQL DDL)</span>
            </div>

            <div
              class="border-border bg-muted/20 overflow-x-auto rounded-b-md border font-mono text-xs leading-relaxed"
            >
              <div class="max-w-[540px] min-w-full py-2">
                <div
                  v-for="line in downDiffLines"
                  :key="line.num"
                  :class="
                    cn(
                      'flex items-center px-3 py-0.5 transition-colors',
                      line.type === 'deletion' &&
                        'border-l-2 border-rose-500 bg-rose-500/10 font-medium text-rose-800 dark:text-rose-300',
                      line.type === 'modification' &&
                        'border-l-2 border-sky-500 bg-sky-500/10 font-medium text-sky-800 dark:text-sky-300',
                      line.type === 'neutral' && 'text-muted-foreground border-l-2 border-transparent',
                    )
                  "
                >
                  <span class="text-muted-foreground/50 w-7 shrink-0 pr-3 text-right select-none">{{ line.num }}</span>
                  <span
                    :class="
                      cn(
                        'w-4 shrink-0 text-center font-bold select-none',
                        line.type === 'deletion' && 'text-rose-600 dark:text-rose-400',
                        line.type === 'modification' && 'text-sky-600 dark:text-sky-400',
                        line.type === 'neutral' && 'text-transparent',
                      )
                    "
                    >{{ line.prefix }}</span
                  >
                  <span class="pl-1 whitespace-pre">{{ line.text }}</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <!-- Tab 3: Schema Impact & Locks -->
          <TabsContent value="impact" class="space-y-4 focus-visible:outline-none">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div class="border-border bg-muted/30 space-y-3 rounded-lg border p-4">
                <div class="text-foreground flex items-center gap-2 text-sm font-medium">
                  <Database class="text-primary size-4 shrink-0" />
                  <span>Target Table & Column Additions</span>
                </div>
                <div class="space-y-2 text-xs">
                  <div class="border-border/60 bg-card flex items-center justify-between rounded-md border p-2">
                    <span class="text-foreground font-mono font-medium">billing_seats_allocated</span>
                    <Badge wrap variant="secondary" class="font-mono text-xs">INTEGER NOT NULL DEFAULT 5</Badge>
                  </div>
                  <div class="border-border/60 bg-card flex items-center justify-between rounded-md border p-2">
                    <span class="text-foreground font-mono font-medium">max_seat_limit</span>
                    <Badge wrap variant="secondary" class="font-mono text-xs">INTEGER NOT NULL DEFAULT 20</Badge>
                  </div>
                  <div class="border-border/60 bg-card flex items-center justify-between rounded-md border p-2">
                    <span class="text-foreground font-mono font-medium">last_seat_audit_at</span>
                    <Badge wrap variant="secondary" class="font-mono text-xs">TIMESTAMPTZ DEFAULT NOW()</Badge>
                  </div>
                </div>
              </div>

              <div class="border-border bg-muted/30 space-y-3 rounded-lg border p-4">
                <div class="text-foreground flex items-center gap-2 text-sm font-medium">
                  <ShieldCheck class="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <span>Lock Safety & Concurrency Evaluation</span>
                </div>
                <div class="text-muted-foreground space-y-2 text-xs">
                  <div class="border-border/60 bg-card flex items-center justify-between rounded-md border p-2">
                    <span>Lock Level Required</span>
                    <span class="text-foreground font-mono font-medium">ACCESS EXCLUSIVE (Catalog only)</span>
                  </div>
                  <div class="border-border/60 bg-card flex items-center justify-between rounded-md border p-2">
                    <span>Table Rewrite Required</span>
                    <Badge wrap variant="success" class="text-xs">No (PG11+ Constant Default)</Badge>
                  </div>
                  <div class="border-border/60 bg-card flex items-center justify-between rounded-md border p-2">
                    <span>Estimated Lock Duration</span>
                    <span class="font-mono font-medium text-emerald-600 dark:text-emerald-400">&lt; 2ms</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <!-- Tab 4: CLI Runner -->
          <TabsContent value="cli" class="space-y-3 focus-visible:outline-none">
            <div class="border-border bg-card space-y-3 rounded-lg border p-4">
              <div class="flex items-center justify-between">
                <div class="text-foreground flex items-center gap-2 text-xs font-medium">
                  <Terminal class="text-primary size-4 shrink-0" />
                  <span>Execute via Prisma CLI</span>
                </div>
                <Button
                  variant="outline"
                  size="xs"
                  class="h-7 gap-1 text-xs"
                  @click="copyToClipboard('npx prisma migrate deploy --schema=./prisma/schema.prisma', 'cli')"
                >
                  <Check v-if="copiedCli" class="size-3 text-emerald-600 dark:text-emerald-400" />
                  <Copy v-else class="size-3" />
                  <span>{{ copiedCli ? 'Copied' : 'Copy' }}</span>
                </Button>
              </div>
              <div class="bg-muted/60 text-foreground rounded-md p-3 font-mono text-xs select-all">
                npx prisma migrate deploy --schema=./prisma/schema.prisma
              </div>
              <p class="text-muted-foreground text-xs">
                Applies all pending migrations to the configured datasource cluster without prompting for interactive
                confirmation.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>

    <!-- Historical Migrations Table Card -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="pb-3">
        <div class="flex items-center justify-between">
          <div>
            <CardTitle class="text-foreground text-base font-semibold"> Recent Applied Migrations </CardTitle>
            <CardDescription class="text-muted-foreground text-xs">
              Historical DDL execution logs, author signatures, and validation checksums
            </CardDescription>
          </div>
          <Badge wrap variant="outline" class="font-mono text-xs"> 5 Most Recent </Badge>
        </div>
      </CardHeader>

      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow class="hover:bg-transparent">
                <TableHead class="text-xs font-medium">Migration & Version</TableHead>
                <TableHead class="text-xs font-medium">Target Scope</TableHead>
                <TableHead class="text-xs font-medium">Executed At</TableHead>
                <TableHead class="text-xs font-medium">Author</TableHead>
                <TableHead class="text-xs font-medium">Duration</TableHead>
                <TableHead class="text-right text-xs font-medium">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow
                v-for="migration in historicalMigrations"
                :key="migration.id"
                class="hover:bg-muted/50 text-xs transition-colors"
              >
                <TableCell class="py-3">
                  <div class="space-y-0.5">
                    <div class="text-foreground font-mono font-medium">
                      {{ migration.filename }}
                    </div>
                    <div class="text-muted-foreground flex items-center gap-1.5">
                      <span class="text-primary font-mono font-medium">{{ migration.version }}</span>
                      <span>·</span>
                      <span>{{ migration.description }}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell class="text-muted-foreground font-mono whitespace-nowrap">
                  {{ migration.tablesAffected }}
                </TableCell>
                <TableCell class="text-muted-foreground whitespace-nowrap">
                  {{ migration.appliedAt }}
                </TableCell>
                <TableCell class="text-muted-foreground whitespace-nowrap">
                  {{ migration.author }}
                </TableCell>
                <TableCell class="text-foreground font-mono font-medium whitespace-nowrap">
                  {{ migration.executionTime }}
                </TableCell>
                <TableCell class="text-right whitespace-nowrap">
                  <Badge wrap variant="success" class="gap-1 px-2 py-0.5 text-xs font-medium">
                    <CheckCircle2 class="size-3" />
                    <span>Applied</span>
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

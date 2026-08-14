'use client'

import * as React from 'react'
import {
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Copy,
  Database,
  FileCode2,
  HardDrive,
  Layers,
  Loader2,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Terminal,
  Timer,
  Undo2,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export interface DiffLine {
  num: number
  type: 'addition' | 'modification' | 'deletion' | 'neutral'
  prefix: string
  text: string
}

export interface HistoricalMigration {
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

export interface DatabaseMigrationSchemaDiffProps {
  className?: string
}

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

export function DatabaseMigrationSchemaDiff({ className }: DatabaseMigrationSchemaDiffProps) {
  const [activeTab, setActiveTab] = React.useState('up')
  const [isApplying, setIsApplying] = React.useState(false)
  const [isApplied, setIsApplied] = React.useState(false)
  const [copiedUpSql, setCopiedUpSql] = React.useState(false)
  const [copiedDownSql, setCopiedDownSql] = React.useState(false)
  const [copiedCli, setCopiedCli] = React.useState(false)

  const handleApplyMigration = () => {
    if (isApplying || isApplied) return
    setIsApplying(true)
    setTimeout(() => {
      setIsApplying(false)
      setIsApplied(true)
    }, 900)
  }

  const handlePreviewRollback = () => {
    setActiveTab('rollback')
  }

  const handleResetState = () => {
    setIsApplied(false)
    setIsApplying(false)
  }

  const copyToClipboard = (text: string, type: 'up' | 'down' | 'cli') => {
    navigator.clipboard.writeText(text)
    if (type === 'up') {
      setCopiedUpSql(true)
      setTimeout(() => setCopiedUpSql(false), 2000)
    } else if (type === 'down') {
      setCopiedDownSql(true)
      setTimeout(() => setCopiedDownSql(false), 2000)
    } else if (type === 'cli') {
      setCopiedCli(true)
      setTimeout(() => setCopiedCli(false), 2000)
    }
  }

  return (
    <div data-slot="database-migration-schema-diff" className={cn('w-full space-y-6', className)}>
      {/* Header: Target Database & Version Runner Status */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-foreground flex items-center gap-2 text-base font-semibold sm:text-lg">
                  <Database className="text-primary size-5 shrink-0" />
                  <span>PostgreSQL 16.2 · production_primary_cluster</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                  <span>Connected</span>
                </div>
              </div>

              <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <span className="text-foreground font-mono font-medium">v2026.08.21.01_add_org_billing_seats</span>
                <Separator orientation="vertical" className="h-3.5" />
                <span>db.us-east-1.aws.neon.tech:5432</span>
                <Separator orientation="vertical" className="h-3.5" />
                <span>public schema</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {!isApplied ? (
                <Badge wrap variant="warning" className="gap-1.5 px-2.5 py-1 text-xs">
                  <Clock className="size-3.5" />
                  <span>1 Pending Migration Ready to Apply</span>
                </Badge>
              ) : (
                <Badge wrap variant="success" className="gap-1.5 px-2.5 py-1 text-xs">
                  <CheckCircle2 className="size-3.5" />
                  <span>All Migrations Applied · In Sync</span>
                </Badge>
              )}

              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1.5 text-xs font-medium shadow-xs"
                onClick={handlePreviewRollback}
              >
                <Undo2 className="text-muted-foreground size-3.5" />
                <span>Preview Rollback Script</span>
              </Button>

              {!isApplied ? (
                <Button
                  variant="default"
                  size="sm"
                  className="h-9 gap-1.5 text-xs font-medium shadow-xs"
                  disabled={isApplying}
                  onClick={handleApplyMigration}
                >
                  {isApplying ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Play className="size-3.5 fill-current" />
                  )}
                  <span>{isApplying ? 'Applying Migration...' : 'Apply Migration (prisma migrate deploy)'}</span>
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-9 gap-1.5 text-xs font-medium"
                  onClick={handleResetState}
                >
                  <RotateCcw className="size-3.5" />
                  <span>Reset State</span>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 4 Migration Telemetry Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Applied Migrations */}
        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">Total Applied Migrations</span>
              <div className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-md">
                <Layers className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-foreground text-2xl font-bold tracking-tight">{isApplied ? '49' : '48'}</div>
              <p className="text-muted-foreground mt-1 text-xs">48 Migrations Applied · Baseline to v2026.08.14</p>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <Check className="size-3.5" />
              <span>100% successful execution history</span>
            </div>
          </CardContent>
        </Card>

        {/* Pending Migrations */}
        <Card
          className={cn(
            'border-border bg-card shadow-xs transition-colors',
            !isApplied && 'border-amber-500/40 dark:border-amber-500/30',
          )}
        >
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">Pending Migrations</span>
              <div
                className={cn(
                  'flex size-8 items-center justify-center rounded-md',
                  !isApplied
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                )}
              >
                {!isApplied ? <Clock className="size-4" /> : <CheckCircle2 className="size-4" />}
              </div>
            </div>
            <div className="mt-3">
              <div className="text-foreground text-2xl font-bold tracking-tight">{isApplied ? '0' : '1'}</div>
              <p className="text-muted-foreground mt-1 text-xs">
                {isApplied ? '0 Pending · Schema up to date' : '1 Pending Deployment'}
              </p>
            </div>
            <div
              className={cn(
                'mt-3 flex items-center gap-1.5 text-xs font-medium',
                !isApplied ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400',
              )}
            >
              {!isApplied ? <Sparkles className="size-3.5" /> : <Check className="size-3.5" />}
              <span>{!isApplied ? 'Safe DDL · Non-blocking ALTER' : 'Schema verified against shadow DB'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Last Migration Execution */}
        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">Last Migration Execution</span>
              <div className="bg-muted text-muted-foreground flex size-8 items-center justify-center rounded-md">
                <Zap className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-foreground text-2xl font-bold tracking-tight">{isApplied ? '0.12s' : '3.4s'}</div>
              <p className="text-muted-foreground mt-1 text-xs">3.4s execution time · 0 lock timeouts</p>
            </div>
            <div className="text-muted-foreground mt-3 flex items-center gap-1.5 text-xs">
              <Timer className="size-3.5" />
              <span>Zero query contention or lock waits</span>
            </div>
          </CardContent>
        </Card>

        {/* Target Schema Integrity */}
        <Card className="border-border bg-card shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-medium">Target Schema Integrity</span>
              <div className="flex size-8 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="size-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-foreground text-2xl font-bold tracking-tight">100%</div>
              <p className="text-muted-foreground mt-1 text-xs">100% Validated · Zero Drift</p>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-3.5" />
              <span>Prisma schema & DB in sync</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Migration Inspector & DDL Diff Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="border-border border-b pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <FileCode2 className="text-primary size-4 shrink-0" />
                <CardTitle className="text-foreground font-mono text-sm font-semibold sm:text-base">
                  20260821142850_add_org_billing_seats_and_quotas.sql
                </CardTitle>
                {!isApplied ? (
                  <Badge wrap variant="warning" className="text-xs">
                    Pending DDL Execution
                  </Badge>
                ) : (
                  <Badge wrap variant="success" className="text-xs">
                    Applied in Production
                  </Badge>
                )}
              </div>
              <CardDescription className="text-muted-foreground text-xs">
                Target Table: <span className="text-foreground font-mono font-medium">public.organizations</span> ·
                Author: <span className="text-foreground">alex.chen@corp</span> · Estimated duration:{' '}
                <span className="text-foreground font-mono font-medium">~120ms</span>
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs font-medium"
                onClick={() =>
                  copyToClipboard(
                    activeTab === 'rollback' ? downSqlRaw : upSqlRaw,
                    activeTab === 'rollback' ? 'down' : 'up',
                  )
                }
              >
                {(activeTab === 'rollback' ? copiedDownSql : copiedUpSql) ? (
                  <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                <span>{(activeTab === 'rollback' ? copiedDownSql : copiedUpSql) ? 'Copied SQL' : 'Copy SQL'}</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
            <TabsList className="grid w-full grid-cols-2 sm:inline-flex sm:w-auto sm:grid-cols-none">
              <TabsTrigger value="up" className="gap-1.5 text-xs">
                <Code2 className="size-3.5" />
                <span>DDL Diff (Up)</span>
              </TabsTrigger>
              <TabsTrigger value="rollback" className="gap-1.5 text-xs">
                <Undo2 className="size-3.5" />
                <span>Rollback Script (Down)</span>
              </TabsTrigger>
              <TabsTrigger value="impact" className="gap-1.5 text-xs">
                <HardDrive className="size-3.5" />
                <span>Schema Impact</span>
              </TabsTrigger>
              <TabsTrigger value="cli" className="gap-1.5 text-xs">
                <Terminal className="size-3.5" />
                <span>Prisma / CLI Runner</span>
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: DDL Diff (Up) */}
            <TabsContent value="up" className="space-y-3 focus-visible:outline-none">
              <div className="border-border bg-muted/50 flex items-center justify-between rounded-t-md border-x border-t px-3 py-2 text-xs">
                <div className="text-muted-foreground flex items-center gap-2">
                  <span className="text-foreground font-medium">Forward Migration (Up)</span>
                  <span>·</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">+3 columns added</span>
                  <span>·</span>
                  <span className="font-medium text-sky-600 dark:text-sky-400">+1 index created</span>
                </div>
                <span className="text-muted-foreground font-mono">SQL (PostgreSQL DDL)</span>
              </div>

              <div className="border-border bg-muted/20 overflow-x-auto rounded-b-md border font-mono text-xs leading-relaxed">
                <div className="max-w-[540px] min-w-full py-2">
                  {upDiffLines.map((line) => (
                    <div
                      key={line.num}
                      className={cn(
                        'flex items-center px-3 py-0.5 transition-colors',
                        line.type === 'addition' &&
                          'border-l-2 border-emerald-500 bg-emerald-500/10 font-medium text-emerald-800 dark:text-emerald-300',
                        line.type === 'modification' &&
                          'border-l-2 border-sky-500 bg-sky-500/10 font-medium text-sky-800 dark:text-sky-300',
                        line.type === 'neutral' && 'text-muted-foreground border-l-2 border-transparent',
                      )}
                    >
                      <span className="text-muted-foreground/50 w-7 shrink-0 pr-3 text-right select-none">
                        {line.num}
                      </span>
                      <span
                        className={cn(
                          'w-4 shrink-0 text-center font-bold select-none',
                          line.type === 'addition' && 'text-emerald-600 dark:text-emerald-400',
                          line.type === 'modification' && 'text-sky-600 dark:text-sky-400',
                          line.type === 'neutral' && 'text-transparent',
                        )}
                      >
                        {line.prefix}
                      </span>
                      <span className="pl-1 whitespace-pre">{line.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Tab 2: Rollback Script (Down) */}
            <TabsContent value="rollback" className="space-y-3 focus-visible:outline-none">
              <div className="border-border bg-muted/50 flex items-center justify-between rounded-t-md border-x border-t px-3 py-2 text-xs">
                <div className="text-muted-foreground flex items-center gap-2">
                  <span className="text-foreground font-medium">Revert Script (Down)</span>
                  <span>·</span>
                  <span className="font-medium text-rose-600 dark:text-rose-400">-3 columns dropped</span>
                  <span>·</span>
                  <span className="font-medium text-rose-600 dark:text-rose-400">-1 index dropped</span>
                </div>
                <span className="text-muted-foreground font-mono">SQL (PostgreSQL DDL)</span>
              </div>

              <div className="border-border bg-muted/20 overflow-x-auto rounded-b-md border font-mono text-xs leading-relaxed">
                <div className="max-w-[540px] min-w-full py-2">
                  {downDiffLines.map((line) => (
                    <div
                      key={line.num}
                      className={cn(
                        'flex items-center px-3 py-0.5 transition-colors',
                        line.type === 'deletion' &&
                          'border-l-2 border-rose-500 bg-rose-500/10 font-medium text-rose-800 dark:text-rose-300',
                        line.type === 'modification' &&
                          'border-l-2 border-sky-500 bg-sky-500/10 font-medium text-sky-800 dark:text-sky-300',
                        line.type === 'neutral' && 'text-muted-foreground border-l-2 border-transparent',
                      )}
                    >
                      <span className="text-muted-foreground/50 w-7 shrink-0 pr-3 text-right select-none">
                        {line.num}
                      </span>
                      <span
                        className={cn(
                          'w-4 shrink-0 text-center font-bold select-none',
                          line.type === 'deletion' && 'text-rose-600 dark:text-rose-400',
                          line.type === 'modification' && 'text-sky-600 dark:text-sky-400',
                          line.type === 'neutral' && 'text-transparent',
                        )}
                      >
                        {line.prefix}
                      </span>
                      <span className="pl-1 whitespace-pre">{line.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Tab 3: Schema Impact & Locks */}
            <TabsContent value="impact" className="space-y-4 focus-visible:outline-none">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="border-border bg-muted/30 space-y-3 rounded-lg border p-4">
                  <div className="text-foreground flex items-center gap-2 text-sm font-medium">
                    <Database className="text-primary size-4 shrink-0" />
                    <span>Target Table & Column Additions</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="border-border/60 bg-card flex items-center justify-between rounded-md border p-2">
                      <span className="text-foreground font-mono font-medium">billing_seats_allocated</span>
                      <Badge wrap variant="secondary" className="font-mono text-xs">
                        INTEGER NOT NULL DEFAULT 5
                      </Badge>
                    </div>
                    <div className="border-border/60 bg-card flex items-center justify-between rounded-md border p-2">
                      <span className="text-foreground font-mono font-medium">max_seat_limit</span>
                      <Badge wrap variant="secondary" className="font-mono text-xs">
                        INTEGER NOT NULL DEFAULT 20
                      </Badge>
                    </div>
                    <div className="border-border/60 bg-card flex items-center justify-between rounded-md border p-2">
                      <span className="text-foreground font-mono font-medium">last_seat_audit_at</span>
                      <Badge wrap variant="secondary" className="font-mono text-xs">
                        TIMESTAMPTZ DEFAULT NOW()
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="border-border bg-muted/30 space-y-3 rounded-lg border p-4">
                  <div className="text-foreground flex items-center gap-2 text-sm font-medium">
                    <ShieldCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>Lock Safety & Concurrency Evaluation</span>
                  </div>
                  <div className="text-muted-foreground space-y-2 text-xs">
                    <div className="border-border/60 bg-card flex items-center justify-between rounded-md border p-2">
                      <span>Lock Level Required</span>
                      <span className="text-foreground font-mono font-medium">ACCESS EXCLUSIVE (Catalog only)</span>
                    </div>
                    <div className="border-border/60 bg-card flex items-center justify-between rounded-md border p-2">
                      <span>Table Rewrite Required</span>
                      <Badge wrap variant="success" className="text-xs">
                        No (PG11+ Constant Default)
                      </Badge>
                    </div>
                    <div className="border-border/60 bg-card flex items-center justify-between rounded-md border p-2">
                      <span>Estimated Lock Duration</span>
                      <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">&lt; 2ms</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab 4: CLI Runner */}
            <TabsContent value="cli" className="space-y-3 focus-visible:outline-none">
              <div className="border-border bg-card space-y-3 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="text-foreground flex items-center gap-2 text-xs font-medium">
                    <Terminal className="text-primary size-4 shrink-0" />
                    <span>Execute via Prisma CLI</span>
                  </div>
                  <Button
                    variant="outline"
                    size="xs"
                    className="h-7 gap-1 text-xs"
                    onClick={() => copyToClipboard('npx prisma migrate deploy --schema=./prisma/schema.prisma', 'cli')}
                  >
                    {copiedCli ? (
                      <Check className="size-3 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                    <span>{copiedCli ? 'Copied' : 'Copy'}</span>
                  </Button>
                </div>
                <div className="bg-muted/60 text-foreground rounded-md p-3 font-mono text-xs select-all">
                  npx prisma migrate deploy --schema=./prisma/schema.prisma
                </div>
                <p className="text-muted-foreground text-xs">
                  Applies all pending migrations to the configured datasource cluster without prompting for interactive
                  confirmation.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Historical Migrations Table Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-foreground text-base font-semibold">Recent Applied Migrations</CardTitle>
              <CardDescription className="text-muted-foreground text-xs">
                Historical DDL execution logs, author signatures, and validation checksums
              </CardDescription>
            </div>
            <Badge wrap variant="outline" className="font-mono text-xs">
              5 Most Recent
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-xs font-medium">Migration & Version</TableHead>
                  <TableHead className="text-xs font-medium">Target Scope</TableHead>
                  <TableHead className="text-xs font-medium">Executed At</TableHead>
                  <TableHead className="text-xs font-medium">Author</TableHead>
                  <TableHead className="text-xs font-medium">Duration</TableHead>
                  <TableHead className="text-right text-xs font-medium">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {historicalMigrations.map((migration) => (
                  <TableRow key={migration.id} className="hover:bg-muted/50 text-xs transition-colors">
                    <TableCell className="py-3">
                      <div className="space-y-0.5">
                        <div className="text-foreground font-mono font-medium">{migration.filename}</div>
                        <div className="text-muted-foreground flex items-center gap-1.5">
                          <span className="text-primary font-mono font-medium">{migration.version}</span>
                          <span>·</span>
                          <span>{migration.description}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono whitespace-nowrap">
                      {migration.tablesAffected}
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">{migration.appliedAt}</TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">{migration.author}</TableCell>
                    <TableCell className="text-foreground font-mono font-medium whitespace-nowrap">
                      {migration.executionTime}
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <Badge wrap variant="success" className="gap-1 px-2 py-0.5 text-xs font-medium">
                        <CheckCircle2 className="size-3" />
                        <span>Applied</span>
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DatabaseMigrationSchemaDiff

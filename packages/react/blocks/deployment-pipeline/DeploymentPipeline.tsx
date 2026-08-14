'use client'

import * as React from 'react'
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  ExternalLink,
  GitBranch,
  GitCommit,
  Layers,
  Loader2,
  MoreHorizontal,
  Play,
  RotateCcw,
  RotateCw,
  Terminal,
  Undo2,
  XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export type DeploymentEnvironment = 'all' | 'production' | 'preview' | 'staging'
export type DeploymentStatus = 'ready' | 'building' | 'failed' | 'rolled-back'
export type DeploymentTrigger = 'push' | 'manual' | 'rollback'

export interface DeploymentRecord {
  id: string
  commitMessage: string
  commitHash: string
  branch: string
  environment: 'production' | 'preview' | 'staging'
  status: DeploymentStatus
  duration: string
  deployer: {
    name: string
    initials: string
  }
  trigger: DeploymentTrigger
  deployedAt: string
  url: string
}

export interface PipelineStep {
  id: string
  name: string
  duration: string
  description: string
  status: 'completed' | 'in-progress' | 'pending'
}

export interface DeploymentPipelineProps {
  initialEnv?: DeploymentEnvironment
  initialLogsOpen?: boolean
  className?: string
}

const branches = ['main', 'staging', 'preview/safari-tabs', 'preview/e2e-tests']

const pipelineSteps: PipelineStep[] = [
  { id: 'step-1', name: 'Queued', duration: '0.2s', description: 'Worker allocated', status: 'completed' },
  { id: 'step-2', name: 'Build & Bundle', duration: '42s', description: 'Vite & TS compilation', status: 'completed' },
  {
    id: 'step-3',
    name: 'Static Generation',
    duration: '18s',
    description: '42 SSG pages rendered',
    status: 'completed',
  },
  { id: 'step-4', name: 'Edge Propagation', duration: '3s', description: 'Synced to 310 PoPs', status: 'completed' },
  { id: 'step-5', name: 'Ready', duration: 'Instant', description: 'Verified & live', status: 'completed' },
]

const terminalLogs = [
  {
    time: '00:00:00.120',
    type: 'info',
    prefix: '❯ [worker]',
    text: 'Initializing deployment worker in region iad-1 (runner-edge-iad-4)...',
  },
  {
    time: '00:00:00.340',
    type: 'info',
    prefix: '❯ [git]',
    text: 'Cloning repository uipkge/core-registry at commit a3f89b1 (branch: main)...',
  },
  {
    time: '00:00:01.050',
    type: 'info',
    prefix: '❯ [cache]',
    text: 'Restoring pnpm store cache (v9.15.0)... (1,482 packages restored, 98.4% cache hit)',
  },
  { time: '00:00:02.410', type: 'cmd', prefix: '$', text: 'pnpm run build:registry && pnpm run build' },
  { time: '00:00:04.180', type: 'stdout', prefix: '  [vite]', text: 'Transformed 482 modules in 312ms' },
  {
    time: '00:00:15.920',
    type: 'stdout',
    prefix: '  [astro]',
    text: 'Building static entrypoints for production (Vue 3.5 + React 19 islands)...',
  },
  { time: '00:00:32.400', type: 'stdout', prefix: '  [astro]', text: '✓ 42 static pages rendered in 16.48s' },
  {
    time: '00:00:44.210',
    type: 'stdout',
    prefix: '  [registry]',
    text: 'Generated 120 manifests into public/r/vue/*.json and public/r/react/*.json',
  },
  {
    time: '00:00:58.800',
    type: 'info',
    prefix: '❯ [edge]',
    text: 'Optimizing edge assets with Brotli compression (saved 4.8 MB)...',
  },
  {
    time: '00:01:01.320',
    type: 'info',
    prefix: '❯ [edge]',
    text: 'Propagating edge routes to Cloudflare global network across 310 PoPs...',
  },
  {
    time: '00:01:03.200',
    type: 'success',
    prefix: '✓ [ready]',
    text: 'Deployment successfully verified and healthy at https://uipkge.dev',
  },
  {
    time: '00:01:03.210',
    type: 'success',
    prefix: '✓ [exit]',
    text: 'Process completed with exit code 0 (success in 1m 03.2s)',
  },
]

const deployments: DeploymentRecord[] = [
  {
    id: 'd-1042',
    commitMessage: 'feat(blocks): add ecommerce suite (#412)',
    commitHash: 'a3f89b1',
    branch: 'main',
    environment: 'production',
    status: 'ready',
    duration: '1m 03s',
    deployer: { name: 'Jordan Diaz', initials: 'JD' },
    trigger: 'push',
    deployedAt: '12m ago',
    url: 'https://uipkge.dev',
  },
  {
    id: 'd-1041',
    commitMessage: 'fix(tabs): resolve indicator jitter in safari (#411)',
    commitHash: 'f79b20e',
    branch: 'preview/safari-tabs',
    environment: 'preview',
    status: 'ready',
    duration: '48s',
    deployer: { name: 'Amara Osei', initials: 'AO' },
    trigger: 'push',
    deployedAt: '2h ago',
    url: 'https://uipkge-pr-411.uipkge.dev',
  },
  {
    id: 'd-1040',
    commitMessage: 'refactor(avatar): extract avatar-group primitive (#410)',
    commitHash: '91bc8d3',
    branch: 'staging',
    environment: 'staging',
    status: 'ready',
    duration: '54s',
    deployer: { name: 'Jonas Weber', initials: 'JW' },
    trigger: 'manual',
    deployedAt: '5h ago',
    url: 'https://staging.uipkge.dev',
  },
  {
    id: 'd-1039',
    commitMessage: 'test(e2e): add playwright visual regression suite (#409)',
    commitHash: '62e08a4',
    branch: 'preview/e2e-tests',
    environment: 'preview',
    status: 'building',
    duration: '1m 12s',
    deployer: { name: 'Priya Nair', initials: 'PN' },
    trigger: 'push',
    deployedAt: 'Just now',
    url: 'https://uipkge-pr-409.uipkge.dev',
  },
  {
    id: 'd-1038',
    commitMessage: 'perf(theme): eliminate css custom property recalculation (#408)',
    commitHash: '3d12fa9',
    branch: 'staging',
    environment: 'staging',
    status: 'failed',
    duration: '24s',
    deployer: { name: 'Marcus Lee', initials: 'ML' },
    trigger: 'push',
    deployedAt: 'Yesterday',
    url: 'https://staging-failed.uipkge.dev',
  },
  {
    id: 'd-1037',
    commitMessage: 'chore(deps): update reka-ui to v1.1.0 (#407)',
    commitHash: '180eac2',
    branch: 'main',
    environment: 'production',
    status: 'rolled-back',
    duration: '1m 20s',
    deployer: { name: 'Jordan Diaz', initials: 'JD' },
    trigger: 'rollback',
    deployedAt: '2 days ago',
    url: 'https://uipkge-v2-rollback.uipkge.dev',
  },
]

export function DeploymentPipeline({ initialEnv = 'all', initialLogsOpen = true, className }: DeploymentPipelineProps) {
  const [selectedEnv, setSelectedEnv] = React.useState<DeploymentEnvironment>(initialEnv)
  const [selectedBranch, setSelectedBranch] = React.useState<string>('main')
  const [showLogs, setShowLogs] = React.useState<boolean>(initialLogsOpen)
  const [copiedLogs, setCopiedLogs] = React.useState<boolean>(false)
  const [copiedUrlId, setCopiedUrlId] = React.useState<string | null>(null)
  const [isDeploying, setIsDeploying] = React.useState<boolean>(false)

  const filteredDeployments =
    selectedEnv === 'all' ? deployments : deployments.filter((d) => d.environment === selectedEnv)

  function triggerDeployment() {
    setIsDeploying(true)
    setTimeout(() => {
      setIsDeploying(false)
    }, 1200)
  }

  function copyLogs() {
    const text = terminalLogs.map((l) => `[${l.time}] ${l.prefix} ${l.text}`).join('\n')
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopiedLogs(true)
      setTimeout(() => {
        setCopiedLogs(false)
      }, 2000)
    }
  }

  function copyUrl(url: string, id: string) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url)
      setCopiedUrlId(id)
      setTimeout(() => {
        setCopiedUrlId(null)
      }, 2000)
    }
  }

  return (
    <div data-slot="deployment-pipeline" className={cn('w-full space-y-6', className)}>
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-card flex size-10 items-center justify-center rounded-lg border shadow-xs">
            <Layers className="text-primary size-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Deployments</h2>
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <span className="text-foreground font-mono font-medium">uipkge</span>
              <span>/</span>
              <span className="font-mono">core-registry</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="font-mono text-xs">
                <GitBranch className="text-muted-foreground size-3.5" aria-hidden="true" />
                <span>{selectedBranch}</span>
                <ChevronDown className="text-muted-foreground size-3.5 opacity-60" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Select branch</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {branches.map((branch) => (
                <DropdownMenuItem
                  key={branch}
                  className={selectedBranch === branch ? 'bg-accent font-semibold' : ''}
                  onClick={() => setSelectedBranch(branch)}
                >
                  <GitBranch className="mr-2 size-3.5" aria-hidden="true" />
                  <span className="font-mono text-xs">{branch}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button size="sm" disabled={isDeploying} onClick={triggerDeployment}>
            {isDeploying ? (
              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Play className="size-3.5 fill-current" aria-hidden="true" />
            )}
            {isDeploying ? 'Triggering...' : 'Trigger Deployment'}
          </Button>
        </div>
      </div>

      {/* Environment Tabs Navigation */}
      <Tabs
        value={selectedEnv}
        onValueChange={(val) => setSelectedEnv(val as DeploymentEnvironment)}
        className="w-full"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList variant="segmented" className="w-full sm:w-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="production">Production</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="staging">Staging</TabsTrigger>
          </TabsList>
          <span className="text-muted-foreground text-xs tabular-nums">
            Showing {filteredDeployments.length} of {deployments.length} deployments
          </span>
        </div>
      </Tabs>

      {/* Latest Deployment Hero Card */}
      <Card className="border-border shadow-xs">
        <CardHeader className="space-y-4 pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-base font-semibold">Latest Deployment</CardTitle>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="relative flex size-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                  </span>
                  Live · Production
                </div>
              </div>
              <CardDescription>
                <a
                  href="https://uipkge.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary inline-flex min-h-6 items-center gap-1 py-0.5 font-mono text-xs font-medium underline underline-offset-4 transition-colors"
                >
                  https://uipkge.dev
                  <ExternalLink className="text-muted-foreground size-3" aria-hidden="true" />
                </a>
              </CardDescription>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowLogs(!showLogs)}>
                <Terminal className="size-3.5" aria-hidden="true" />
                <span>{showLogs ? 'Hide Build Logs' : 'View Build Logs'}</span>
                {showLogs ? (
                  <ChevronUp className="text-muted-foreground size-3.5" aria-hidden="true" />
                ) : (
                  <ChevronDown className="text-muted-foreground size-3.5" aria-hidden="true" />
                )}
              </Button>
              <Button variant="outline" size="sm">
                <RotateCw className="size-3.5" aria-hidden="true" />
                <span>Redeploy</span>
              </Button>
              <Button variant="outline" size="sm">
                <Undo2 className="size-3.5" aria-hidden="true" />
                <span>Instant Rollback</span>
              </Button>
            </div>
          </div>

          {/* Commit Details Bar */}
          <div className="bg-muted/40 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border px-3.5 py-2.5 text-xs">
            <div className="flex items-center gap-2">
              <Avatar className="size-5">
                <AvatarFallback className="text-xs font-medium">JD</AvatarFallback>
              </Avatar>
              <span className="text-foreground font-medium">Jordan Diaz</span>
            </div>
            <Separator orientation="vertical" className="hidden h-3.5 sm:block" />
            <span className="text-foreground font-medium">feat(blocks): add ecommerce suite (#412)</span>
            <Separator orientation="vertical" className="hidden h-3.5 sm:block" />
            <div className="text-muted-foreground flex items-center gap-1 font-mono">
              <GitCommit className="size-3.5" aria-hidden="true" />
              <span>a3f89b1</span>
            </div>
            <Separator orientation="vertical" className="hidden h-3.5 sm:block" />
            <div className="text-muted-foreground flex items-center gap-1 font-mono">
              <GitBranch className="size-3.5" aria-hidden="true" />
              <span>main</span>
            </div>
            <Separator orientation="vertical" className="hidden h-3.5 sm:block" />
            <div className="text-muted-foreground flex items-center gap-1">
              <Clock className="size-3.5" aria-hidden="true" />
              <span>Deployed 12m ago</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          {/* Execution Stepper */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Pipeline Execution
              </span>
              <span className="text-muted-foreground font-mono text-xs">5 of 5 steps completed · 1m 03s</span>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {pipelineSteps.map((step, index) => (
                <div
                  key={step.id}
                  className="bg-card/60 hover:bg-muted/40 flex flex-col justify-between rounded-lg border p-3 shadow-2xs transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      <Check className="size-3 stroke-[3]" aria-hidden="true" />
                    </span>
                    <span className="text-muted-foreground font-mono text-xs">{step.duration}</span>
                  </div>
                  <div className="mt-2">
                    <p className="text-foreground text-xs font-semibold">
                      {index + 1}. {step.name}
                    </p>
                    <p className="text-muted-foreground truncate text-xs">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Collapsible Dark Terminal / Build Log Viewer */}
          {showLogs && (
            <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-3.5 py-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-red-500/80" />
                    <span className="size-2.5 rounded-full bg-amber-500/80" />
                    <span className="size-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs text-zinc-400">build-stdout — node v22.12.0 — runner-edge-iad-4</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground hidden text-xs text-zinc-400 sm:inline">Total: 1m 03.2s</span>
                  <Button
                    variant="ghost"
                    size="xs"
                    className="h-6 gap-1 px-2 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
                    onClick={copyLogs}
                  >
                    {copiedLogs ? (
                      <Check className="size-3 text-emerald-400" aria-hidden="true" />
                    ) : (
                      <Copy className="size-3" aria-hidden="true" />
                    )}
                    <span>{copiedLogs ? 'Copied' : 'Copy logs'}</span>
                  </Button>
                </div>
              </div>

              <div className="max-h-72 space-y-1 overflow-y-auto p-4 select-text">
                {terminalLogs.map((line, idx) => (
                  <div key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-zinc-500 select-none">[{line.time}]</span>
                    <span
                      className={cn(
                        'font-medium select-none',
                        line.type === 'success' && 'text-emerald-400',
                        line.type === 'info' && 'text-sky-400',
                        line.type === 'cmd' && 'text-amber-400',
                        line.type === 'stdout' && 'text-zinc-400',
                      )}
                    >
                      {line.prefix}
                    </span>
                    <span
                      className={cn(
                        line.type === 'success' && 'font-medium text-emerald-300',
                        line.type === 'cmd' && 'font-semibold text-zinc-100',
                        line.type === 'info' && 'text-zinc-300',
                        line.type === 'stdout' && 'text-zinc-300',
                      )}
                    >
                      {line.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-900/60 px-3.5 py-1.5 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 font-medium text-emerald-400">
                    <Check className="size-3" aria-hidden="true" /> Exit code: 0
                  </span>
                  <span>Clean build</span>
                </div>
                <span className="text-zinc-500">Memory: 412 MB / 2048 MB</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deployment History Table */}
      <Card className="border-border shadow-xs">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Deployment History</CardTitle>
          <CardDescription className="text-xs">
            Past deployments across production, preview, and staging environments.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <span className="sr-only">Status</span>
                  </TableHead>
                  <TableHead>Commit & Message</TableHead>
                  <TableHead>Environment</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Deployer</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead className="text-right">Deployed</TableHead>
                  <TableHead className="w-10">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeployments.map((deployment) => (
                  <TableRow key={deployment.id} className="hover:bg-muted/50">
                    <TableCell className="py-3">
                      {deployment.status === 'ready' && (
                        <span title="Ready">
                          <CheckCircle2 className="size-4 text-emerald-500" aria-hidden="true" />
                        </span>
                      )}
                      {deployment.status === 'building' && (
                        <span title="Building">
                          <Loader2 className="size-4 animate-spin text-sky-500" aria-hidden="true" />
                        </span>
                      )}
                      {deployment.status === 'failed' && (
                        <span title="Failed">
                          <XCircle className="text-destructive size-4" aria-hidden="true" />
                        </span>
                      )}
                      {deployment.status === 'rolled-back' && (
                        <span title="Rolled back">
                          <Undo2 className="size-4 text-amber-500" aria-hidden="true" />
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="min-w-[220px]">
                        <p className="text-foreground max-w-sm truncate text-sm font-medium">
                          {deployment.commitMessage}
                        </p>
                        <div className="text-muted-foreground mt-0.5 flex items-center gap-2 font-mono text-xs">
                          <span className="flex items-center gap-1">
                            <GitBranch className="size-3" aria-hidden="true" />
                            {deployment.branch}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <GitCommit className="size-3" aria-hidden="true" />
                            {deployment.commitHash}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          deployment.environment === 'production'
                            ? 'default'
                            : deployment.environment === 'preview'
                              ? 'secondary'
                              : 'outline'
                        }
                        className="text-xs capitalize"
                      >
                        {deployment.environment}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs tabular-nums">
                      {deployment.duration}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6">
                          <AvatarFallback className="text-xs font-medium">
                            {deployment.deployer.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-foreground text-xs">{deployment.deployer.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                        {deployment.trigger === 'push' && <GitCommit className="size-3.5" aria-hidden="true" />}
                        {deployment.trigger === 'manual' && <Play className="size-3.5" aria-hidden="true" />}
                        {deployment.trigger === 'rollback' && <RotateCcw className="size-3.5" aria-hidden="true" />}
                        <span className="capitalize">{deployment.trigger}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-right text-xs whitespace-nowrap tabular-nums">
                      {deployment.deployedAt}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
                            <MoreHorizontal className="size-4" aria-hidden="true" />
                            <span className="sr-only">Open actions for {deployment.id}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Undo2 className="mr-2 size-4" aria-hidden="true" />
                            Rollback to this deploy
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => copyUrl(deployment.url, deployment.id)}>
                            {copiedUrlId === deployment.id ? (
                              <Check className="mr-2 size-4 text-emerald-500" aria-hidden="true" />
                            ) : (
                              <Copy className="mr-2 size-4" aria-hidden="true" />
                            )}
                            {copiedUrlId === deployment.id ? 'Copied URL' : 'Copy deployment URL'}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setShowLogs(true)}>
                            <Terminal className="mr-2 size-4" aria-hidden="true" />
                            Inspect build logs
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a
                              href={deployment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center"
                            >
                              <ExternalLink className="mr-2 size-4" aria-hidden="true" />
                              View live preview
                            </a>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredDeployments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-muted-foreground h-24 text-center text-sm">
                      No deployments match the selected environment filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

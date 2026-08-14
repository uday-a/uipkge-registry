'use client'

import * as React from 'react'
import {
  Activity,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Clock,
  Code2,
  Cpu,
  Database,
  FileText,
  Globe,
  Pause,
  Play,
  RefreshCw,
  Server,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Props {
  className?: string
}

type WorkloadCategory = 'all' | 'code' | 'rag' | 'agent' | 'vision'

interface ModelWorkload {
  id: string
  name: string
  version: string
  category: 'Code Generation' | 'Document RAG' | 'Autonomous Agent' | 'Vision'
  categoryKey: 'code' | 'rag' | 'agent' | 'vision'
  iconName: 'Code2' | 'FileText' | 'Bot' | 'Sparkles'
  requestsPerHour: string
  tokenThroughput: string
  avgGenerationTime: string
  ttft: string
  gpuInstances: string
  gpuVramUsed: string
  gpuVramTotal: string
  gpuUtilization: number
  status: 'operational' | 'high_load'
}

interface AgentSession {
  id: string
  sessionKey: string
  agentName: string
  agentRole: string
  avatarInitials: string
  avatarColor: 'primary' | 'info' | 'success' | 'warning'
  model: string
  reasoningGoal: string
  elapsedSeconds: number
  toolCount: number
  tools: { name: string; count: number }[]
  status: 'streaming' | 'reasoning' | 'executing'
  statusLabel: string
  progress: number
}

const initialModels: ModelWorkload[] = [
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    version: 'claude-3-5-sonnet-20241022',
    category: 'Code Generation',
    categoryKey: 'code',
    iconName: 'Code2',
    requestsPerHour: '42.8k requests / hr',
    tokenThroughput: '1.82M tok/min',
    avgGenerationTime: '840ms',
    ttft: '160ms TTFT',
    gpuInstances: '4× H100 SXM5',
    gpuVramUsed: '72.4 GB',
    gpuVramTotal: '80 GB',
    gpuUtilization: 90.5,
    status: 'operational',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    version: 'gpt-4o-2024-08-06',
    category: 'Document RAG',
    categoryKey: 'rag',
    iconName: 'FileText',
    requestsPerHour: '36.2k requests / hr',
    tokenThroughput: '1.45M tok/min',
    avgGenerationTime: '720ms',
    ttft: '140ms TTFT',
    gpuInstances: '2× H100 SXM5',
    gpuVramUsed: '68.1 GB',
    gpuVramTotal: '80 GB',
    gpuUtilization: 85.1,
    status: 'operational',
  },
  {
    id: 'llama-3-3-70b',
    name: 'Llama 3.3 70B',
    version: 'llama-3.3-70b-instruct-fp8',
    category: 'Autonomous Agent',
    categoryKey: 'agent',
    iconName: 'Bot',
    requestsPerHour: '19.4k requests / hr',
    tokenThroughput: '890k tok/min',
    avgGenerationTime: '1,120ms',
    ttft: '280ms TTFT',
    gpuInstances: '8× H100 SXM5',
    gpuVramUsed: '78.6 GB',
    gpuVramTotal: '80 GB',
    gpuUtilization: 98.2,
    status: 'high_load',
  },
  {
    id: 'sd-3-5',
    name: 'Stable Diffusion 3.5',
    version: 'sd3.5-large-turbo',
    category: 'Vision',
    categoryKey: 'vision',
    iconName: 'Sparkles',
    requestsPerHour: '8.6k requests / hr',
    tokenThroughput: '143 img/min',
    avgGenerationTime: '1,450ms',
    ttft: '28 steps',
    gpuInstances: '2× H100 SXM5',
    gpuVramUsed: '64.0 GB',
    gpuVramTotal: '80 GB',
    gpuUtilization: 80.0,
    status: 'operational',
  },
]

const initialAgentSessions: AgentSession[] = [
  {
    id: 'sess-1',
    sessionKey: 'ag-9481',
    agentName: 'CodeGen Synthesizer Agent',
    agentRole: 'Full-Stack Schema & API Pipeline',
    avatarInitials: 'CG',
    avatarColor: 'primary',
    model: 'Claude 3.5 Sonnet',
    reasoningGoal:
      'Synthesizing full-stack schema validation pipelines with edge caching, RPC endpoints, and async telemetry buffers.',
    elapsedSeconds: 258,
    toolCount: 14,
    tools: [
      { name: 'ast_grep', count: 6 },
      { name: 'typecheck', count: 4 },
      { name: 'file_write', count: 4 },
    ],
    status: 'streaming',
    statusLabel: 'Streaming Output',
    progress: 74,
  },
  {
    id: 'sess-2',
    sessionKey: 'ag-8820',
    agentName: 'Knowledge RAG Researcher',
    agentRole: 'Document Semantic Indexer',
    avatarInitials: 'KR',
    avatarColor: 'info',
    model: 'GPT-4o',
    reasoningGoal:
      'Indexing 240-page financial PDF disclosures into hybrid vector database with semantic chunking and cosine similarity rerank.',
    elapsedSeconds: 165,
    toolCount: 6,
    tools: [
      { name: 'pdf_extract', count: 2 },
      { name: 'chunk_embed', count: 3 },
      { name: 'pgvector', count: 1 },
    ],
    status: 'reasoning',
    statusLabel: 'Reasoning & Embedding',
    progress: 48,
  },
  {
    id: 'sess-3',
    sessionKey: 'ag-7104',
    agentName: 'Autonomous QA & Test Orchestrator',
    agentRole: 'Deterministic Browser Matrix',
    avatarInitials: 'QA',
    avatarColor: 'success',
    model: 'Llama 3.3 70B',
    reasoningGoal:
      'Executing deterministic browser regression matrix across dual-framework island components with DOM snapshot validation.',
    elapsedSeconds: 492,
    toolCount: 28,
    tools: [
      { name: 'playwright_mcp', count: 18 },
      { name: 'dom_snapshot', count: 8 },
      { name: 'diff_audit', count: 2 },
    ],
    status: 'executing',
    statusLabel: 'Executing Tests',
    progress: 91,
  },
]

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}m:${secs.toString().padStart(2, '0')}s`
}

export function AiSaasCommandCenter({ className }: Props) {
  const [isStreaming, setIsStreaming] = React.useState(true)
  const [selectedCategory, setSelectedCategory] = React.useState<WorkloadCategory>('all')
  const [scaleSuccessMessage, setScaleSuccessMessage] = React.useState('')
  const [lastUpdated, setLastUpdated] = React.useState('Updated just now')
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [agentSessions, setAgentSessions] = React.useState<AgentSession[]>(initialAgentSessions)

  React.useEffect(() => {
    const timer = setInterval(() => {
      if (isStreaming) {
        setAgentSessions((prev) =>
          prev.map((sess) => ({
            ...sess,
            elapsedSeconds: sess.elapsedSeconds + 1,
          })),
        )
      }
    }, 1000)
    return () => clearInterval(timer)
  }, [isStreaming])

  const filteredModels = React.useMemo(() => {
    if (selectedCategory === 'all') {
      return initialModels
    }
    return initialModels.filter((m) => m.categoryKey === selectedCategory)
  }, [selectedCategory])

  const toggleStreaming = () => {
    setIsStreaming((prev) => !prev)
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      setLastUpdated('Updated just now')
    }, 400)
  }

  const handleScaleNodes = () => {
    setScaleSuccessMessage('GPU Autoscaler requested +2 H100 SXM5 instances for US-West pool.')
    setTimeout(() => {
      setScaleSuccessMessage('')
    }, 4000)
  }

  const renderModelIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code2':
        return <Code2 className="text-primary size-4" />
      case 'FileText':
        return <FileText className="size-4 text-sky-500" />
      case 'Bot':
        return <Bot className="size-4 text-amber-500" />
      case 'Sparkles':
        return <Sparkles className="size-4 text-purple-500" />
      default:
        return <Cpu className="text-primary size-4" />
    }
  }

  return (
    <div data-slot="ai-saas-command-center" className={cn('w-full space-y-6', className)}>
      {/* Header: Title, Region, Health Badge, Action Controls */}
      <Card className="border-border bg-card shadow-xs">
        <CardContent className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Title & Region */}
          <div className="flex items-start gap-3.5 sm:items-center">
            <div className="bg-primary/10 text-primary border-primary/20 flex size-12 shrink-0 items-center justify-center rounded-xl border">
              <Cpu className="size-6" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-foreground text-lg leading-none font-semibold tracking-tight sm:text-xl">
                  AI Platform Command Center & Workloads
                </h1>
                <Badge variant="success" className="h-5 gap-1 px-2 text-xs font-medium shadow-xs">
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
                  </span>
                  Cluster Healthy · 99.99% Uptime
                </Badge>
              </div>
              <div className="text-muted-foreground flex flex-wrap items-center gap-2 font-mono text-xs">
                <div className="flex items-center gap-1.5">
                  <Server className="size-3.5" />
                  <span>NVIDIA H100 GPU Cluster · US-West</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Globe className="size-3.5" />
                  <span>16 Nodes Live · 1.28 TB Combined VRAM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls: Rate Limits & Scale GPU Nodes */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
            {/* Refresh telemetry */}
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <Clock className="size-3.5" />
              <span className="font-mono">{lastUpdated}</span>
              <Button
                variant="ghost"
                size="icon-sm"
                className="size-7 rounded-md"
                aria-label="Refresh telemetry data"
                onClick={handleRefresh}
              >
                <RefreshCw className={cn('size-3.5', isRefreshing ? 'animate-spin' : '')} />
              </Button>
            </div>

            <Separator orientation="vertical" className="hidden h-5 lg:block" />

            {/* Configure Rate Limits */}
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-medium shadow-xs">
              <SlidersHorizontal className="size-3.5" />
              <span>Configure Rate Limits</span>
            </Button>

            {/* Scale GPU Nodes */}
            <Button
              variant="default"
              size="sm"
              className="h-8 gap-1.5 text-xs font-medium shadow-xs"
              onClick={handleScaleNodes}
            >
              <Cpu className="size-3.5" />
              <span>Scale GPU Nodes</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Scale Notification Toast / Inline Feedback */}
      {scaleSuccessMessage ? (
        <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-950 shadow-xs dark:text-emerald-100">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-500" />
            <span className="font-medium">{scaleSuccessMessage}</span>
          </div>
          <Badge
            variant="outline"
            className="border-emerald-500/40 font-mono text-xs text-emerald-700 dark:text-emerald-300"
          >
            Provisioning ~45s
          </Badge>
        </div>
      ) : null}

      {/* Cost Anomaly & Guardrail Alert Banner */}
      <div className="border-border/80 bg-muted/40 flex flex-col gap-3 rounded-xl border p-3.5 shadow-xs sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 text-primary border-primary/20 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border">
            <ShieldCheck className="size-4" />
          </div>
          <div className="space-y-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-foreground text-xs font-semibold">Cost Anomaly & Spend Velocity Guardrails Active</p>
              <Badge variant="secondary" className="font-mono text-xs">
                Policy: P99 SLA &lt; 800ms
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Current spend velocity ($142.50/hr) is within safe budget limits. Dynamic semantic caching saved $318.40
              today across 184k requests. Zero runaway recursive loops detected.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 self-end font-mono text-xs sm:self-auto">
          <span className="text-muted-foreground">Budget Cap:</span>
          <span className="text-foreground font-semibold tabular-nums">$5,000 / day (34.2% consumed)</span>
        </div>
      </div>

      {/* 4 Primary Workload Telemetry Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Token Burn Rate */}
        <Card className="border-border/80 bg-card hover:border-border shadow-xs transition-colors">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium">Total Token Burn Rate</CardDescription>
              <div className="flex size-7 items-center justify-center rounded-md border border-amber-500/20 bg-amber-500/10 text-amber-500">
                <Zap className="size-3.5" />
              </div>
            </div>
            <div className="pt-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">4,850</span>
                <span className="text-muted-foreground text-xs">tok/sec</span>
              </div>
              <p className="text-foreground/90 font-mono text-xs font-medium tabular-nums">$142.50 / hr</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 p-4 pt-1">
            <div className="bg-muted/40 border-border/60 flex items-center justify-between rounded-md border px-2 py-1 text-xs">
              <span className="text-muted-foreground font-mono">Daily Volume</span>
              <span className="text-foreground font-mono font-semibold tabular-nums">184.2M tokens</span>
            </div>
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span className="flex items-center gap-0.5 font-medium text-emerald-600 tabular-nums dark:text-emerald-400">
                <ArrowUpRight className="size-3" />
                +12.4% vs prev hour
              </span>
              <span>Stable burn</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Active Model Inferences */}
        <Card className="border-border/80 bg-card hover:border-border shadow-xs transition-colors">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium">Active Model Inferences</CardDescription>
              <div className="bg-primary/10 text-primary border-primary/20 flex size-7 items-center justify-center rounded-md border">
                <Bot className="size-3.5" />
              </div>
            </div>
            <div className="pt-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">48</span>
                <span className="text-muted-foreground text-xs">concurrent</span>
              </div>
              <p className="text-foreground/90 text-xs font-medium">48 Concurrent Agent Sessions</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 p-4 pt-1">
            <div className="bg-muted/40 border-border/60 flex items-center justify-between rounded-md border px-2 py-1 text-xs">
              <span className="text-muted-foreground font-mono">Throughput</span>
              <span className="text-foreground font-mono font-semibold tabular-nums">1,420 req / min</span>
            </div>
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span className="font-medium text-emerald-600 dark:text-emerald-400">0 queued jobs</span>
              <span className="font-mono">Pool: 48/64</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: GPU Cluster Utilization */}
        <Card className="border-border/80 bg-card hover:border-border shadow-xs transition-colors">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium">GPU Cluster Utilization</CardDescription>
              <div className="flex size-7 items-center justify-center rounded-md border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
                <Cpu className="size-3.5" />
              </div>
            </div>
            <div className="pt-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">88.4%</span>
                <span className="text-muted-foreground text-xs">compute</span>
              </div>
              <p className="text-foreground/90 font-mono text-xs font-medium tabular-nums">76.2 GB / 80 GB VRAM</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 p-4 pt-1">
            <div className="space-y-1">
              <Progress value={88.4} className="h-1.5" />
            </div>
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span className="font-mono">Thermal: 58°C</span>
              <span className="text-foreground font-medium">16/16 H100 Online</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: P99 Inference Latency */}
        <Card className="border-border/80 bg-card hover:border-border shadow-xs transition-colors">
          <CardHeader className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium">P99 Inference Latency</CardDescription>
              <div className="flex size-7 items-center justify-center rounded-md border border-sky-500/20 bg-sky-500/10 text-sky-500">
                <Clock className="size-3.5" />
              </div>
            </div>
            <div className="pt-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-foreground font-mono text-2xl font-bold tracking-tight tabular-nums">640ms</span>
                <span className="text-muted-foreground text-xs">P99</span>
              </div>
              <p className="text-foreground/90 font-mono text-xs font-medium tabular-nums">Sub-second TTFT (180ms)</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 p-4 pt-1">
            <div className="bg-muted/40 border-border/60 flex items-center justify-between rounded-md border px-2 py-1 font-mono text-xs">
              <span className="text-muted-foreground">P50: 310ms</span>
              <span className="text-foreground font-medium">P90: 490ms</span>
            </div>
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span className="font-medium text-emerald-600 dark:text-emerald-400">Target &lt; 800ms SLA</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">Optimal</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-Time Model Workloads & Throughput Table */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="p-5 pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Database className="text-primary size-4" />
                <CardTitle className="text-base font-semibold">Real-Time Model Workloads & Throughput</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Live inference telemetry, compute allocation, and throughput metrics across deployed foundation models.
              </CardDescription>
            </div>

            {/* Workload Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { key: 'all', label: 'All Models' },
                { key: 'code', label: 'Code Gen' },
                { key: 'rag', label: 'Document RAG' },
                { key: 'agent', label: 'Agents' },
                { key: 'vision', label: 'Vision' },
              ].map((cat) => (
                <Button
                  key={cat.key}
                  variant={selectedCategory === cat.key ? 'default' : 'outline'}
                  size="xs"
                  className="h-7 text-xs font-medium"
                  onClick={() => setSelectedCategory(cat.key as WorkloadCategory)}
                >
                  {{ ...cat }.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table density="cozy">
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="font-semibold">Model Name & Version</TableHead>
                  <TableHead className="font-semibold">Workload Category</TableHead>
                  <TableHead className="font-semibold">Throughput</TableHead>
                  <TableHead className="font-semibold">Avg Generation Time</TableHead>
                  <TableHead className="font-semibold">GPU Instance Allocation</TableHead>
                  <TableHead className="font-semibold">GPU VRAM & Load</TableHead>
                  <TableHead className="text-right font-semibold">Health Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredModels.map((model) => (
                  <TableRow key={model.id} className="hover:bg-muted/30 transition-colors">
                    {/* Model Name & Version */}
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <div className="bg-muted text-muted-foreground border-border/60 flex size-8 shrink-0 items-center justify-center rounded-lg border">
                          {renderModelIcon(model.iconName)}
                        </div>
                        <div>
                          <p className="text-foreground text-xs leading-tight font-semibold">{model.name}</p>
                          <p className="text-muted-foreground font-mono text-xs">{model.version}</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Category Badge */}
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-border bg-muted/30 text-foreground gap-1.5 text-xs font-medium"
                      >
                        <span className="bg-primary size-1.5 rounded-full" />
                        {model.category}
                      </Badge>
                    </TableCell>

                    {/* Throughput */}
                    <TableCell>
                      <div className="font-mono text-xs">
                        <p className="text-foreground font-semibold tabular-nums">{model.requestsPerHour}</p>
                        <p className="text-muted-foreground tabular-nums">{model.tokenThroughput}</p>
                      </div>
                    </TableCell>

                    {/* Avg Generation Time */}
                    <TableCell>
                      <div className="font-mono text-xs">
                        <p className="text-foreground font-semibold tabular-nums">{model.avgGenerationTime}</p>
                        <p className="text-muted-foreground tabular-nums">{model.ttft}</p>
                      </div>
                    </TableCell>

                    {/* GPU Instance Allocation */}
                    <TableCell>
                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        <Server className="text-muted-foreground size-3.5 shrink-0" />
                        <span className="text-foreground font-medium">{model.gpuInstances}</span>
                      </div>
                    </TableCell>

                    {/* GPU VRAM & Load */}
                    <TableCell>
                      <div className="w-36 space-y-1">
                        <div className="flex justify-between font-mono text-xs">
                          <span className="text-muted-foreground tabular-nums">{model.gpuVramUsed}</span>
                          <span className="text-foreground font-semibold tabular-nums">{model.gpuUtilization}%</span>
                        </div>
                        <Progress
                          value={model.gpuUtilization}
                          className={cn(
                            'h-1.5',
                            model.status === 'high_load' ? '[&>[data-slot=progress-indicator]]:bg-amber-500' : '',
                          )}
                        />
                      </div>
                    </TableCell>

                    {/* Health Status */}
                    <TableCell className="text-right">
                      <Badge
                        variant={model.status === 'operational' ? 'success' : 'warning'}
                        className="gap-1 text-xs font-medium"
                      >
                        <span
                          className={cn(
                            'size-1.5 rounded-full',
                            model.status === 'operational' ? 'bg-emerald-500' : 'bg-amber-500',
                          )}
                        />
                        {model.status === 'operational' ? 'Operational' : 'High Load'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Active Autonomous Agent Sessions Stream */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="p-5 pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Bot className="text-primary size-4" />
                <CardTitle className="text-base font-semibold">Active Autonomous Agent Sessions Stream</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Live telemetry, reasoning goals, active tool calls, and execution elapsed timers across agent instances.
              </CardDescription>
            </div>

            <div className="flex items-center gap-2.5">
              <Badge
                variant="outline"
                className="border-primary/40 bg-primary/10 text-primary font-mono text-xs font-medium"
              >
                <span className="relative mr-1.5 flex size-1.5">
                  <span className="bg-primary absolute inline-flex h-full w-full rounded-full opacity-75" />
                  <span className="bg-primary relative inline-flex size-1.5 rounded-full" />
                </span>
                {agentSessions.length} Live Sessions
              </Badge>

              <Button variant="outline" size="xs" className="h-7 gap-1.5 text-xs font-medium" onClick={toggleStreaming}>
                {isStreaming ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                <span>{isStreaming ? 'Pause Stream' : 'Resume Stream'}</span>
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 p-5 pt-1">
          {agentSessions.map((session) => (
            <div
              key={session.id}
              className="border-border/80 bg-muted/20 hover:bg-muted/30 hover:border-border rounded-xl border p-4 transition-all duration-150"
            >
              {/* Session Header: Avatar, Name, Model, Status, Timer */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Avatar size="sm" color={session.avatarColor}>
                    <AvatarFallback className="font-mono text-xs font-semibold">
                      {session.avatarInitials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-foreground text-xs font-semibold">{session.agentName}</p>
                      <span className="text-muted-foreground font-mono text-xs">{session.model}</span>
                      <Badge variant="secondary" className="font-mono text-xs">
                        #{session.sessionKey}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs">{{ ...session }.agentRole}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
                  {/* Execution Time */}
                  <div className="border-border bg-muted/50 text-foreground flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs font-medium tabular-nums">
                    <Clock className="text-muted-foreground size-3.5" />
                    <span>{formatDuration(session.elapsedSeconds)}</span>
                  </div>

                  {/* Status Badge */}
                  {session.status === 'streaming' ? (
                    <Badge
                      variant="outline"
                      className="border-primary/40 bg-primary/10 text-primary text-xs font-medium"
                    >
                      <Activity className="mr-1 size-3 animate-pulse" />
                      {session.statusLabel}
                    </Badge>
                  ) : session.status === 'reasoning' ? (
                    <Badge
                      variant="outline"
                      className="border-sky-500/40 bg-sky-500/10 text-xs font-medium text-sky-600 dark:text-sky-400"
                    >
                      <Sparkles className="mr-1 size-3" />
                      {session.statusLabel}
                    </Badge>
                  ) : (
                    <Badge variant="success" className="text-xs font-medium">
                      <CheckCircle2 className="mr-1 size-3" />
                      {session.statusLabel}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Active Reasoning Goal Statement */}
              <div className="bg-card border-border/60 my-3 rounded-lg border p-3 text-xs leading-relaxed">
                <div className="text-muted-foreground flex items-start gap-2">
                  <Terminal className="text-primary mt-0.5 size-3.5 shrink-0" />
                  <span className="text-foreground/90 font-mono">{session.reasoningGoal}</span>
                </div>
              </div>

              {/* Tool Invocations & Progress Bar Row */}
              <div className="flex flex-col gap-3 pt-0.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-muted-foreground text-xs font-medium">Tool Traces ({session.toolCount}):</span>
                  {session.tools.map((tool) => (
                    <Badge
                      key={tool.name}
                      variant="outline"
                      className="border-border bg-muted/40 font-mono text-xs font-medium"
                    >
                      {tool.name} ({tool.count})
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-2.5 font-mono text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <div className="bg-muted h-1.5 w-24 overflow-hidden rounded-full sm:w-28">
                    <div
                      className="bg-primary h-full transition-all duration-300 ease-out"
                      style={{ width: `${session.progress}%` }}
                    />
                  </div>
                  <span className="text-foreground font-semibold tabular-nums">{session.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

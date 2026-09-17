'use client'

import * as React from 'react'
import {
  ArrowRightLeft,
  BrainCircuit,
  CheckCircle2,
  Coins,
  Download,
  Gauge,
  Layers,
  Route,
  SlidersHorizontal,
  Sparkles,
  TrendingDown,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface ModelTokenCostOptimizerProps {
  className?: string
}

interface ModelAllocation {
  id: string
  name: string
  provider: string
  providerTag: string
  sharePercent: number
  inputTokens: string
  outputTokens: string
  totalTokens: string
  totalCost: string
  reroutesHandled: number
  avgLatency: string
  role: string
  status: 'optimal' | 'active'
}

const models: ModelAllocation[] = [
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    providerTag: 'Anthropic Direct',
    sharePercent: 45,
    inputTokens: '24.2M',
    outputTokens: '4.1M',
    totalTokens: '28.3M',
    totalCost: '$1,824.20',
    reroutesHandled: 142,
    avgLatency: '680ms',
    role: 'Complex Reasoning & System Arch',
    status: 'optimal',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    providerTag: 'OpenAI Tier-5',
    sharePercent: 30,
    inputTokens: '12.5M',
    outputTokens: '2.6M',
    totalTokens: '15.1M',
    totalCost: '$1,080.50',
    reroutesHandled: 64,
    avgLatency: '540ms',
    role: 'Multi-Modal & Structured Schema',
    status: 'active',
  },
  {
    id: 'llama-3-3-70b',
    name: 'Llama 3.3 70B',
    provider: 'Groq',
    providerTag: 'Groq LPU Inference',
    sharePercent: 15,
    inputTokens: '4.1M',
    outputTokens: '1.2M',
    totalTokens: '5.3M',
    totalCost: '$195.40',
    reroutesHandled: 8,
    avgLatency: '190ms',
    role: 'High-Throughput Transformation',
    status: 'optimal',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o-mini',
    provider: 'OpenAI',
    providerTag: 'OpenAI Direct',
    sharePercent: 10,
    inputTokens: '2.0M',
    outputTokens: '0.5M',
    totalTokens: '2.5M',
    totalCost: '$320.40',
    reroutesHandled: 12,
    avgLatency: '240ms',
    role: 'Intent Classification & Tagging',
    status: 'active',
  },
]

interface CacheSegment {
  name: string
  type: 'exact' | 'semantic' | 'origin'
  share: number
  requests: string
  tokensSpared: string
  costSaved: string
  latency: string
  color: string
  badgeVariant: 'success' | 'info' | 'outline'
  description: string
}

const cacheSegments: CacheSegment[] = [
  {
    name: 'Exact Cache',
    type: 'exact',
    share: 24.0,
    requests: '184.2K reqs (24.0%)',
    tokensSpared: '18.2M tokens',
    costSaved: '$2,136.00 saved',
    latency: '12ms p50',
    color: 'bg-emerald-500',
    badgeVariant: 'success',
    description: 'Deterministic SHA-256 hit on normalized system prompt and user parameters.',
  },
  {
    name: 'Semantic Vector Cache',
    type: 'semantic',
    share: 18.8,
    requests: '144.3K reqs (18.8%)',
    tokensSpared: '14.3M tokens',
    costSaved: '$1,676.00 saved',
    latency: '28ms p50',
    color: 'bg-sky-500',
    badgeVariant: 'info',
    description: 'Vector similarity cache match with cosine threshold ≥ 0.88 via Qdrant/Redis.',
  },
  {
    name: 'Origin Model Calls',
    type: 'origin',
    share: 57.2,
    requests: '439.0K reqs (57.2%)',
    tokensSpared: '0 (billed)',
    costSaved: '$3,420.50 spent',
    latency: '840ms p99',
    color: 'bg-muted-foreground/30 dark:bg-muted-foreground/20',
    badgeVariant: 'outline',
    description: 'Forwarded to upstream LLMs via smart model routing with fallback circuit protection.',
  },
]

export function ModelTokenCostOptimizer({ className }: ModelTokenCostOptimizerProps) {
  const [timeframe, setTimeframe] = React.useState('aug-2026')
  const [providerFilter, setProviderFilter] = React.useState('all')

  // Active optimization rule toggles
  const [promptCompressionEnabled, setPromptCompressionEnabled] = React.useState(true)
  const [smallModelRoutingEnabled, setSmallModelRoutingEnabled] = React.useState(true)
  const [semanticCachingEnabled, setSemanticCachingEnabled] = React.useState(true)
  const [circuitBreakerEnabled, setCircuitBreakerEnabled] = React.useState(true)

  const filteredModels = React.useMemo(() => {
    if (providerFilter === 'all') return models
    return models.filter((m) => m.provider.toLowerCase().includes(providerFilter.toLowerCase()))
  }, [providerFilter])

  return (
    <div data-slot="model-token-cost-optimizer" className={cn('mx-auto w-full max-w-6xl space-y-6', className)}>
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
              AI Gateway & Token Cost Optimizer
            </h1>
            <Badge
              wrap
              variant="outline"
              className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
            >
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
              <span>Routing Active · 99.99% Availability</span>
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Helicone & Portkey style gateway telemetry, semantic caching hit rates, model routing savings, and latency
            metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-full text-xs font-medium sm:w-52" aria-label="Select timeframe">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aug-2026">This Month · August 2026</SelectItem>
              <SelectItem value="jul-2026">Last Month · July 2026</SelectItem>
              <SelectItem value="q2-2026">Q2 2026 Summary</SelectItem>
              <SelectItem value="ytd-2026">Year to Date 2026</SelectItem>
            </SelectContent>
          </Select>

          <Button aria-label="Download attachment" variant="outline" size="sm" className="gap-1.5 text-xs">
            <Download className="text-muted-foreground size-3.5" />
            <span>Export Token Logs</span>
          </Button>

          <Button size="sm" className="gap-1.5 text-xs">
            <SlidersHorizontal className="size-3.5" />
            <span>Configure Routing Rules</span>
          </Button>
        </div>
      </div>

      {/* 4 Gateway Performance KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Total Token Spend */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div
                  aria-hidden="true"
                  className="bg-muted text-muted-foreground border-border flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                >
                  <Coins className="size-4" />
                </div>
                <CardTitle className="text-sm font-medium">Total Token Spend</CardTitle>
              </div>
              <Badge wrap variant="outline" className="text-xs font-normal tabular-nums">
                vs $8,900.00 unoptimized
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
              <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums">$3,420.50</span>
              <span className="text-xs font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                -$5,479.50 (61.5%)
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Budget Utilization</span>
                <span className="text-foreground font-medium tabular-nums">38.4% of baseline</span>
              </div>
              <Progress value={38.4} className="h-1.5" />
            </div>
            <p className="text-muted-foreground border-border/60 border-t pt-2 text-xs tabular-nums">
              767,500 total gateway inference requests
            </p>
          </CardContent>
        </Card>

        {/* KPI 2: Cost Savings from Caching & Routing */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 shadow-xs dark:text-emerald-400"
                >
                  <TrendingDown className="size-4" />
                </div>
                <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
              </div>
              <Badge
                wrap
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
              >
                61.5% Reduction
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
              <span className="text-2xl font-bold tracking-tight text-emerald-600 tabular-nums dark:text-emerald-400">
                $5,479.50 Saved
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Semantic Cache Savings</span>
                <span className="text-foreground font-medium tabular-nums">$3,812.00</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Smart Model Routing</span>
                <span className="text-foreground font-medium tabular-nums">$1,667.50</span>
              </div>
            </div>
            <p className="text-muted-foreground border-border/60 border-t pt-2 text-xs tabular-nums">
              32.5M tokens prevented from origin billing
            </p>
          </CardContent>
        </Card>

        {/* KPI 3: Semantic Cache Hit Rate */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/10 text-sky-600 shadow-xs dark:text-sky-400"
                >
                  <Zap className="size-4" />
                </div>
                <CardTitle className="text-sm font-medium">Semantic Cache Hit Rate</CardTitle>
              </div>
              <Badge
                wrap
                variant="outline"
                className="border-sky-500/30 bg-sky-500/10 text-xs font-semibold text-sky-600 dark:text-sky-400"
              >
                &lt; 15ms response
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
              <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums">42.8%</span>
              <span className="text-muted-foreground text-xs font-medium tabular-nums">328,500 hits</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Exact Match vs Vector</span>
                <span className="text-foreground font-medium tabular-nums">24.0% / 18.8%</span>
              </div>
              <Progress value={42.8} className="h-1.5 [&_[data-slot=progress-indicator]]:bg-sky-500" />
            </div>
            <p className="text-muted-foreground border-border/60 border-t pt-2 text-xs tabular-nums">
              p50 exact: 12ms · p50 vector: 28ms
            </p>
          </CardContent>
        </Card>

        {/* KPI 4: P99 Gateway Latency */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <div
                  aria-hidden="true"
                  className="bg-muted text-muted-foreground border-border flex size-8 shrink-0 items-center justify-center rounded-lg border shadow-xs"
                >
                  <Gauge className="size-4" />
                </div>
                <CardTitle className="text-sm font-medium">P99 Gateway Latency</CardTitle>
              </div>
              <Badge wrap variant="outline" className="text-xs font-normal">
                4.2x Faster
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
              <span className="text-foreground text-2xl font-bold tracking-tight tabular-nums">840ms</span>
              <span className="text-muted-foreground text-xs font-medium tabular-nums">p50: 180ms</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Smart Fallback SLA</span>
                <span className="font-medium text-emerald-600 tabular-nums dark:text-emerald-400">
                  Zero 504 timeouts
                </span>
              </div>
              <Progress value={28} className="h-1.5 [&_[data-slot=progress-indicator]]:bg-emerald-500" />
            </div>
            <p className="text-muted-foreground border-border/60 border-t pt-2 text-xs tabular-nums">
              Automatic reroute on &gt;1,500ms TTFT or 429
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Semantic Cache Savings Visualizer */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex min-w-0 items-center gap-2 text-base font-semibold">
                <Layers className="text-primary size-4" />
                <span>Semantic Cache Savings & Token Bypass Visualizer</span>
              </CardTitle>
              <CardDescription>
                Telemetry breakdown comparing deterministic exact hash matches, semantic vector cache hits, and origin
                LLM invocations.
              </CardDescription>
            </div>
            <Badge wrap variant="outline" className="w-fit text-xs font-medium tabular-nums">
              767,500 Total Requests Analyzed
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Multi-segment progress visualizer bar */}
          <div className="space-y-2">
            <div className="border-border/60 bg-muted/40 flex h-4 w-full overflow-hidden rounded-md border p-0.5 shadow-inner">
              <div
                className="h-full rounded-xs bg-emerald-500 transition-all duration-500"
                style={{ width: '24.0%' }}
                title="Exact Key Cache: 24.0%"
              />
              <div className="bg-background w-0.5" aria-hidden="true" />
              <div
                className="h-full rounded-xs bg-sky-500 transition-all duration-500"
                style={{ width: '18.8%' }}
                title="Semantic Vector Cache: 18.8%"
              />
              <div className="bg-background w-0.5" aria-hidden="true" />
              <div
                className="bg-muted-foreground/30 dark:bg-muted-foreground/20 h-full rounded-xs transition-all duration-500"
                style={{ width: '57.2%' }}
                title="Origin Model Calls: 57.2%"
              />
            </div>

            {/* Visual Legend Header */}
            <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
                <span className="text-foreground font-medium">Exact Cache:</span>
                <span className="tabular-nums">24.0%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-sky-500" aria-hidden="true" />
                <span className="text-foreground font-medium">Semantic Vector Cache:</span>
                <span className="tabular-nums">18.8%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="bg-muted-foreground/40 size-2.5 rounded-full" aria-hidden="true" />
                <span className="text-foreground font-medium">Origin Model Calls:</span>
                <span className="tabular-nums">57.2%</span>
              </div>
            </div>
          </div>

          {/* 3 Segment Metric Detail Cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {cacheSegments.map((segment) => (
              <div
                key={segment.name}
                className="bg-muted/30 border-border/80 flex flex-col justify-between space-y-2.5 rounded-lg border p-3.5 shadow-xs"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className={cn('size-2 shrink-0 rounded-full', segment.color)} aria-hidden="true" />
                      <span className="text-foreground truncate text-xs font-semibold">{segment.name}</span>
                    </div>
                    <Badge wrap variant={segment.badgeVariant} className="shrink-0 text-xs font-medium tabular-nums">
                      {
                        {
                          exact: '12ms p50',
                          semantic: '28ms p50',
                          origin: '840ms p99',
                        }[segment.type]
                      }
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">{segment.description}</p>
                </div>

                <div className="border-border/60 space-y-1 border-t pt-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Volume Share</span>
                    <span className="text-foreground font-medium tabular-nums">{segment.requests}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Token Impact</span>
                    <span className="text-foreground font-medium tabular-nums">{segment.tokensSpared}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Financial Impact</span>
                    <span
                      className={cn(
                        'font-semibold tabular-nums',
                        segment.type === 'origin' ? 'text-foreground' : 'text-emerald-600 dark:text-emerald-400',
                      )}
                    >
                      {segment.costSaved}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Model Routing & Cost Allocation Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
              <CardTitle className="flex min-w-0 items-center gap-2 text-base font-semibold">
                <Route className="text-primary size-4" />
                <span>Model Routing & Cost Allocation</span>
              </CardTitle>
              <CardDescription>
                Multi-provider connected models, request distribution, token volumes, total cost, and automated fallback
                retries.
              </CardDescription>
            </div>

            <div className="flex min-w-0 items-center gap-2">
              <Select value={providerFilter} onValueChange={setProviderFilter}>
                <SelectTrigger className="w-full text-xs sm:w-40" aria-label="Filter by provider">
                  <SelectValue placeholder="All Providers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="groq">Groq</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Model & Provider</TableHead>
                  <TableHead className="text-xs">Request Share</TableHead>
                  <TableHead className="text-xs">Tokens (Input / Output)</TableHead>
                  <TableHead className="text-right text-xs">Total Cost</TableHead>
                  <TableHead className="text-right text-xs">Fallback Retries Handled</TableHead>
                  <TableHead className="text-right text-xs">Assigned Routing Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredModels.map((model) => (
                  <TableRow key={model.id}>
                    {/* Model Name & Provider */}
                    <TableCell className="py-3 whitespace-nowrap">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div
                          aria-hidden="true"
                          className="bg-muted text-foreground border-border flex size-7 shrink-0 items-center justify-center rounded-md border shadow-xs"
                        >
                          <BrainCircuit className="size-3.5" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="text-foreground text-xs font-semibold">{model.name}</div>
                          <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                            <span>
                              {{
                                Anthropic: 'Anthropic',
                                OpenAI: 'OpenAI',
                                Groq: 'Groq',
                              }[model.provider] || model.provider}
                            </span>
                            <span className="tabular-nums">{model.avgLatency}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Request Share % */}
                    <TableCell className="py-3">
                      <div className="w-32 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-foreground font-semibold tabular-nums">{model.sharePercent}%</span>
                          <span className="text-muted-foreground text-xs">share</span>
                        </div>
                        <Progress value={model.sharePercent} className="h-1.5" />
                      </div>
                    </TableCell>

                    {/* Input & Output Tokens in tabular-nums */}
                    <TableCell className="py-3 whitespace-nowrap">
                      <div className="space-y-0.5 text-xs">
                        <div className="text-foreground font-medium tabular-nums">
                          {model.inputTokens} input · {model.outputTokens} output
                        </div>
                        <div className="text-muted-foreground text-xs tabular-nums">
                          {model.totalTokens} combined tokens
                        </div>
                      </div>
                    </TableCell>

                    {/* Total Cost */}
                    <TableCell className="py-3 text-right whitespace-nowrap">
                      <div className="text-foreground text-xs font-bold tabular-nums">{model.totalCost}</div>
                      <div className="text-muted-foreground text-xs tabular-nums">
                        avg $
                        {(
                          parseFloat(model.totalCost.replace('$', '').replace(',', '')) /
                          (model.sharePercent * 76.75)
                        ).toFixed(3)}{' '}
                        / 1k req
                      </div>
                    </TableCell>

                    {/* Fallback & Rate-Limit Retries Handled */}
                    <TableCell className="py-3 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1.5 text-xs">
                        <Badge wrap variant="outline" className="gap-1 text-xs font-medium tabular-nums">
                          <ArrowRightLeft className="text-muted-foreground size-3" />
                          <span>{model.reroutesHandled} automatic reroutes</span>
                        </Badge>
                      </div>
                    </TableCell>

                    {/* Assigned Routing Role */}
                    <TableCell className="py-3 text-right whitespace-nowrap">
                      <Badge wrap variant="secondary" className="text-xs font-normal">
                        {model.role}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Table Summary / Footer Banner */}
          <div className="border-border/80 bg-muted/30 mt-4 flex flex-col gap-3 rounded-lg border p-3 text-xs sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
              <span className="text-muted-foreground">
                Across all 4 models:{' '}
                <strong className="text-foreground font-semibold tabular-nums">
                  42.8M input · 8.4M output (51.2M total)
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs tabular-nums">
              <span className="text-muted-foreground">
                Total Reroutes Handled: <strong className="text-foreground font-semibold">226 incidents</strong>
              </span>
              <span className="text-muted-foreground">
                Net Origin Billed: <strong className="text-foreground font-semibold">$3,420.50</strong>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Cost Optimization Rules Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
              <CardTitle className="flex min-w-0 items-center gap-2 text-base font-semibold">
                <Sparkles className="text-primary size-4" />
                <span>Active Cost Optimization & Gateway Rules</span>
              </CardTitle>
              <CardDescription>
                Autonomous gateway policies eliminating redundant token expenditure and enforcing fallback SLAs.
              </CardDescription>
            </div>
            <Badge
              wrap
              variant="outline"
              className="w-fit border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-600 dark:text-emerald-400"
            >
              4 / 4 Rules Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Rule 1: Prompt Compression */}
            <div className="border-border bg-card flex flex-col justify-between space-y-3 rounded-lg border p-4 shadow-xs">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="text-foreground text-sm font-semibold">
                      Prompt Compression & System Cache Priming
                    </span>
                    <Badge wrap variant="success" className="text-xs">
                      Active
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Strips boilerplate whitespaces, trims markdown delimiters, and leverages provider system prompt
                    prefix caching to minimize input token weights.
                  </p>
                </div>
                <Switch
                  checked={promptCompressionEnabled}
                  onCheckedChange={setPromptCompressionEnabled}
                  aria-label="Toggle prompt compression"
                />
              </div>
              <div className="border-border/60 bg-muted/40 flex items-center justify-between rounded-md border px-3 py-1.5 text-xs">
                <span className="text-muted-foreground">Estimated Rule Savings</span>
                <span className="font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                  ~$680.00 / mo (18% input token reduction)
                </span>
              </div>
            </div>

            {/* Rule 2: Automatic small-model routing */}
            <div className="border-border bg-card flex flex-col justify-between space-y-3 rounded-lg border p-4 shadow-xs">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="text-foreground text-sm font-semibold">Automatic Small-Model Routing</span>
                    <Badge wrap variant="success" className="text-xs">
                      Active
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Directs intent classification, sentiment analysis, entity extraction, and structured JSON parsing to
                    GPT-4o-mini and Llama 3.3 70B instead of frontier models.
                  </p>
                </div>
                <Switch
                  checked={smallModelRoutingEnabled}
                  onCheckedChange={setSmallModelRoutingEnabled}
                  aria-label="Toggle small-model routing"
                />
              </div>
              <div className="border-border/60 bg-muted/40 flex items-center justify-between rounded-md border px-3 py-1.5 text-xs">
                <span className="text-muted-foreground">Estimated Rule Savings</span>
                <span className="font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                  ~$1,240.00 / mo (68K queries rerouted)
                </span>
              </div>
            </div>

            {/* Rule 3: Semantic Vector Cache */}
            <div className="border-border bg-card flex flex-col justify-between space-y-3 rounded-lg border p-4 shadow-xs">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="text-foreground text-sm font-semibold">Semantic Vector Caching</span>
                    <Badge wrap variant="success" className="text-xs">
                      Active
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Evaluates embedding cosine distance on incoming queries; returns sub-30ms cached responses when
                    similarity score exceeds 0.88 threshold.
                  </p>
                </div>
                <Switch
                  checked={semanticCachingEnabled}
                  onCheckedChange={setSemanticCachingEnabled}
                  aria-label="Toggle semantic caching"
                />
              </div>
              <div className="border-border/60 bg-muted/40 flex items-center justify-between rounded-md border px-3 py-1.5 text-xs">
                <span className="text-muted-foreground">Estimated Rule Savings</span>
                <span className="font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                  ~$1,676.00 / mo (144.3K queries cached)
                </span>
              </div>
            </div>

            {/* Rule 4: Fallback & Circuit Breaker Engine */}
            <div className="border-border bg-card flex flex-col justify-between space-y-3 rounded-lg border p-4 shadow-xs">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="text-foreground text-sm font-semibold">Fallback & Circuit Breaker Engine</span>
                    <Badge wrap variant="success" className="text-xs">
                      Active
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Monitors upstream provider health; automatically reroutes degraded queries to secondary standby
                    models on HTTP 429 or &gt;1,500ms TTFT latency spikes.
                  </p>
                </div>
                <Switch
                  checked={circuitBreakerEnabled}
                  onCheckedChange={setCircuitBreakerEnabled}
                  aria-label="Toggle circuit breaker engine"
                />
              </div>
              <div className="border-border/60 bg-muted/40 flex items-center justify-between rounded-md border px-3 py-1.5 text-xs">
                <span className="text-muted-foreground">SLA Protection</span>
                <span className="text-foreground font-semibold tabular-nums">
                  99.99% effective uptime (226 incidents saved)
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

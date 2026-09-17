'use client'

import * as React from 'react'
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Database,
  Edit3,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Timer,
  Trash2,
  TrendingUp,
  Zap,
  ZapOff,
} from 'lucide-react'
import { cn } from '@/lib/utils'
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
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface RateLimitRule {
  id: string
  name: string
  scope: string
  path: string
  method: string
  limitThreshold: string
  mitigationAction: 'HTTP 429 Too Many Requests' | 'CAPTCHA Challenge' | 'Block IP'
  actionVariant: 'warning' | 'secondary' | 'destructive'
  enabled: boolean
  lastTriggered: string
  blocked24h: string
}

export interface RateLimitingConfigProps {
  className?: string
}

const INITIAL_RULES: RateLimitRule[] = [
  {
    id: 'rule-auth-bruteforce',
    name: 'auth-endpoint-bruteforce',
    scope: 'Login & SSO token issuance',
    path: '/api/v1/auth/*',
    method: 'POST',
    limitThreshold: '100 req / 60s per IP',
    mitigationAction: 'HTTP 429 Too Many Requests',
    actionVariant: 'warning',
    enabled: true,
    lastTriggered: '2 mins ago',
    blocked24h: '842 blocks',
  },
  {
    id: 'rule-public-unauth',
    name: 'public-api-v1-unauthenticated',
    scope: 'Anonymous REST endpoints',
    path: '/api/v1/public/*',
    method: 'GET, POST',
    limitThreshold: '300 req / 60s per IP',
    mitigationAction: 'CAPTCHA Challenge',
    actionVariant: 'secondary',
    enabled: true,
    lastTriggered: '14 mins ago',
    blocked24h: '412 challenges',
  },
  {
    id: 'rule-ai-inference',
    name: 'ai-inference-tier-standard',
    scope: 'LLM completions & embeddings',
    path: '/api/v1/models/generate',
    method: 'POST',
    limitThreshold: '20 req / 60s per API Key',
    mitigationAction: 'HTTP 429 Too Many Requests',
    actionVariant: 'warning',
    enabled: true,
    lastTriggered: '1 hour ago',
    blocked24h: '148 throttled',
  },
  {
    id: 'rule-search-cluster',
    name: 'search-endpoints',
    scope: 'Vector & fuzzy full-text query',
    path: '/api/v1/search/*',
    method: 'GET',
    limitThreshold: '60 req / 60s per IP',
    mitigationAction: 'Block IP',
    actionVariant: 'destructive',
    enabled: false,
    lastTriggered: '3 days ago',
    blocked24h: '18 blocks',
  },
]

export function RateLimitingConfig({ className }: RateLimitingConfigProps) {
  const [globalProtection, setGlobalProtection] = React.useState(true)
  const [algorithm, setAlgorithm] = React.useState<'token-bucket' | 'sliding-window'>('token-bucket')
  const [simVolume, setSimVolume] = React.useState(120)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [rules, setRules] = React.useState<RateLimitRule[]>(INITIAL_RULES)

  const toggleRule = React.useCallback((id: string) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)))
  }, [])

  const activeRulesCount = React.useMemo(() => rules.filter((r) => r.enabled).length, [rules])

  const filteredRules = React.useMemo(() => {
    if (!searchQuery.trim()) return rules
    const q = searchQuery.toLowerCase()
    return rules.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.path.toLowerCase().includes(q) ||
        r.scope.toLowerCase().includes(q) ||
        r.mitigationAction.toLowerCase().includes(q),
    )
  }, [rules, searchQuery])

  const simStats = React.useMemo(() => {
    const vol = simVolume
    if (algorithm === 'token-bucket') {
      const refillRate = 50
      const burstCapacity = 100
      if (vol <= refillRate) {
        return {
          allowed: vol,
          dropped: 0,
          allowedPct: 100,
          droppedPct: 0,
          bucketFill: Math.round(100 - (vol / refillRate) * 20),
          status: 'optimal' as const,
          statusLabel: 'Optimal Throughput · No Throttling',
          latency: '0.35ms',
          description: `Traffic volume (${vol} req/s) is well within the 50 req/s continuous refill capacity. 100% of requests pass with zero drop rate.`,
        }
      } else if (vol <= burstCapacity) {
        const drop = 0
        return {
          allowed: vol,
          dropped: drop,
          allowedPct: 100,
          droppedPct: 0,
          bucketFill: Math.max(10, Math.round(100 - ((vol - refillRate) / (burstCapacity - refillRate)) * 80)),
          status: 'burst' as const,
          statusLabel: 'Consuming Burst Pool · 0% Dropped',
          latency: '0.42ms',
          description: `Traffic exceeds the 50 req/s replenishment rate. Tokens are being drawn from the 100-token burst reservoir. Zero requests dropped so far.`,
        }
      } else {
        const allowed = burstCapacity
        const dropped = vol - allowed
        const allowedPct = Math.round((allowed / vol) * 100)
        const droppedPct = 100 - allowedPct
        return {
          allowed,
          dropped,
          allowedPct,
          droppedPct,
          bucketFill: 0,
          status: 'throttling' as const,
          statusLabel: `Rate Limiting Active · ${droppedPct}% Dropped`,
          latency: '0.51ms',
          description: `Burst reservoir exhausted. Token bucket limiter is actively enforcing HTTP 429 throttling on ${dropped} req/s excess traffic.`,
        }
      }
    } else {
      // Sliding window mode
      const windowLimit = 120
      if (vol <= windowLimit) {
        const allowedPct = 100
        return {
          allowed: vol,
          dropped: 0,
          allowedPct,
          droppedPct: 0,
          bucketFill: Math.round((vol / windowLimit) * 100),
          status: 'optimal' as const,
          statusLabel: 'Within Sliding Window Quota',
          latency: '0.38ms',
          description: `Current 60-second rolling window is ${Math.round((vol / windowLimit) * 100)}% utilized. No mitigation actions triggered.`,
        }
      } else {
        const allowed = windowLimit
        const dropped = vol - allowed
        const allowedPct = Math.round((allowed / vol) * 100)
        const droppedPct = 100 - allowedPct
        return {
          allowed,
          dropped,
          allowedPct,
          droppedPct,
          bucketFill: 100,
          status: 'throttling' as const,
          statusLabel: `Window Saturated · ${droppedPct}% Shed`,
          latency: '0.48ms',
          description: `Rolling time-window threshold exceeded (${vol} req/s > ${windowLimit} limit). Excess requests are rejected at edge proxy.`,
        }
      }
    }
  }, [simVolume, algorithm])

  return (
    <div data-slot="rate-limiting-config" className={cn('mx-auto w-full max-w-6xl space-y-6', className)}>
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-xs font-medium tracking-wide uppercase">
              <ShieldCheck className="text-primary size-3.5" />
              Edge Protection
            </Badge>
            <span className="text-muted-foreground text-xs">Cloudflare & Upstash compatible</span>
          </div>
          <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            Rate Limiting & Traffic Protection
          </h1>
          <p className="text-muted-foreground text-sm">
            Configure DDoS mitigation, IP throttling, and per-tier request quotas.
          </p>
        </div>

        {/* Header Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-card border-border flex items-center gap-3 rounded-lg border px-3 py-2 shadow-xs">
            <div className="flex flex-col">
              <span className="text-foreground text-xs font-semibold">Global Protection</span>
              <span className="text-muted-foreground text-xs tabular-nums">
                {globalProtection ? `${activeRulesCount} Active Rules` : 'Disabled (Bypassed)'}
              </span>
            </div>
            <Switch checked={globalProtection} onCheckedChange={setGlobalProtection} />
          </div>

          <Button className="gap-1.5 shadow-xs">
            <Plus className="size-4" />
            <span>Add Rate Limit Rule</span>
          </Button>
        </div>
      </div>

      {/* 4 Health Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Requests */}
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium">Total Requests / min</CardTitle>
            <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-md">
              <Activity className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums">4,250 req/s</div>
            <div className="flex items-center gap-1.5 text-xs">
              <Badge variant="success" className="h-4.5 px-1 py-0 text-xs">
                <TrendingUp className="size-3" />
                +12.4%
              </Badge>
              <span className="text-muted-foreground tabular-nums">255.0k / min · 99.98% ok</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Blocked Attacks */}
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium">Blocked Attacks</CardTitle>
            <div className="bg-destructive/10 text-destructive flex size-8 items-center justify-center rounded-md">
              <ShieldAlert className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums">1,420 in 24h</div>
            <div className="flex items-center gap-1.5 text-xs">
              <Badge variant="outline" className="h-4.5 px-1.5 py-0 text-xs font-normal">
                Tier-1 Edge
              </Badge>
              <span className="text-muted-foreground truncate tabular-nums">18 brute-force bursts</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Active Throttles */}
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium">Active Throttles</CardTitle>
            <div className="bg-warning/10 text-warning flex size-8 items-center justify-center rounded-md">
              <ZapOff className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums">18 IPs</div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="bg-warning inline-block size-1.5 rounded-full"></span>
              <span className="text-muted-foreground truncate tabular-nums">4 edge clusters · Exp 15m</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Median Latency Overhead */}
        <Card className="shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-medium">Median Latency Overhead</CardTitle>
            <div className="bg-info/10 text-info flex size-8 items-center justify-center rounded-md">
              <Timer className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-foreground text-2xl font-bold tracking-tight tabular-nums">0.4ms</div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground tabular-nums">p99 &lt; 1.2ms · Multi-Region Redis</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Token Bucket Visualizer */}
      <Card className="shadow-xs">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-lg font-semibold">Algorithm Simulation & Token Dynamics</CardTitle>
              <Badge variant="outline" className="text-xs font-normal">
                Interactive Sandbox
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Test traffic volume against token reservoir dynamics and rolling time windows.
            </CardDescription>
          </div>

          {/* Algorithm Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground text-xs font-medium">Algorithm:</span>
            <Select value={algorithm} onValueChange={(val) => setAlgorithm(val as 'token-bucket' | 'sliding-window')}>
              <SelectTrigger className="w-52 text-xs">
                <SelectValue placeholder="Select algorithm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="token-bucket">Token Bucket (Burst Tolerant)</SelectItem>
                <SelectItem value="sliding-window">Sliding Window Counter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Visual Algorithm Diagram / Pipeline */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <div className="bg-muted/30 border-border relative flex flex-col justify-between rounded-lg border p-3.5">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    {algorithm === 'token-bucket' ? '1. Refill Velocity' : '1. Time Window'}
                  </span>
                  <RefreshCw className="text-muted-foreground size-3.5" />
                </div>
                <div className="text-foreground text-lg font-semibold tabular-nums">
                  {algorithm === 'token-bucket' ? '50 tokens / s' : '60s Window'}
                </div>
                <p className="text-muted-foreground text-xs">
                  {algorithm === 'token-bucket'
                    ? 'Deterministic continuous refill into pool'
                    : 'Rolling granular sub-window slices'}
                </p>
              </div>
              <div className="mt-3">
                <Progress value={100} className="h-1.5" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-muted/30 border-border relative flex flex-col justify-between rounded-lg border p-3.5">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    {algorithm === 'token-bucket' ? '2. Reservoir Capacity' : '2. Window Ceiling'}
                  </span>
                  <Database className="text-muted-foreground size-3.5" />
                </div>
                <div className="text-foreground text-lg font-semibold tabular-nums">
                  {algorithm === 'token-bucket' ? '100 tokens max' : '120 req / window'}
                </div>
                <p className="text-muted-foreground text-xs">
                  {algorithm === 'token-bucket'
                    ? `Pool status: ${simStats.bucketFill}% available`
                    : `Window utilized: ${simStats.bucketFill}%`}
                </p>
              </div>
              <div className="mt-3">
                <Progress value={simStats.bucketFill} className="h-1.5" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-muted/30 border-border relative flex flex-col justify-between rounded-lg border p-3.5">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    3. Test Traffic Load
                  </span>
                  <Zap className="text-primary size-3.5" />
                </div>
                <div className="text-foreground text-lg font-semibold tabular-nums">{simVolume} req/s</div>
                <p className="text-muted-foreground text-xs">Simulated rate generated from slider</p>
              </div>
              <div className="mt-3">
                <Progress value={Math.min(100, Math.round((simVolume / 500) * 100))} className="h-1.5" />
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-muted/30 border-border relative flex flex-col justify-between rounded-lg border p-3.5">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    4. Edge Gate Verdict
                  </span>
                  {simStats.status === 'optimal' ? (
                    <CheckCircle2 className="text-success size-3.5" />
                  ) : simStats.status === 'burst' ? (
                    <AlertTriangle className="text-warning size-3.5" />
                  ) : (
                    <ShieldAlert className="text-destructive size-3.5" />
                  )}
                </div>
                <div className="text-foreground text-lg font-semibold tabular-nums">
                  {simStats.allowed} Pass · {simStats.dropped} Drop
                </div>
                <p className="text-muted-foreground text-xs">Overhead: {simStats.latency}</p>
              </div>
              <div className="mt-3">
                <div className="bg-secondary relative h-1.5 w-full overflow-hidden rounded-full">
                  <div
                    className="bg-success absolute top-0 bottom-0 left-0 transition-all duration-150"
                    style={{ width: `${simStats.allowedPct}%` }}
                  />
                  <div
                    className="bg-destructive absolute top-0 right-0 bottom-0 transition-all duration-150"
                    style={{ width: `${simStats.droppedPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Simulator Slider Box */}
          <div className="bg-muted/20 border-border space-y-4 rounded-lg border p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <Sliders className="text-primary size-4" />
                  <span className="text-foreground text-sm font-semibold">Simulate Incoming Request Volume</span>
                </div>
                <p className="text-muted-foreground text-xs">
                  Drag the slider to stress-test the algorithm against burst spikes and DDoS loads.
                </p>
              </div>

              {/* Current Rate Pill */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant={
                    simStats.status === 'optimal' ? 'success' : simStats.status === 'burst' ? 'warning' : 'destructive'
                  }
                  className="text-xs font-medium"
                >
                  {simStats.statusLabel}
                </Badge>
                <div className="bg-card border-border rounded border px-2.5 py-1 font-mono text-sm font-bold tabular-nums">
                  {simVolume} req/s
                </div>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-2 pt-2">
              <Slider
                value={[simVolume]}
                onValueChange={(val) => setSimVolume(val[0] ?? 120)}
                min={10}
                max={500}
                step={10}
                className="w-full"
              />
              <div className="text-muted-foreground flex justify-between text-xs tabular-nums">
                <span>10 req/s (Low)</span>
                <span>50 req/s (Refill Rate)</span>
                <span>100 req/s (Burst Limit)</span>
                <span>250 req/s (Heavy Spike)</span>
                <span>500 req/s (DDoS Attack)</span>
              </div>
            </div>

            {/* Simulation Visual Metrics & Split Bar */}
            <div className="space-y-3 pt-2">
              {/* Split Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-success flex items-center gap-1">
                    <span className="bg-success size-2 rounded-full"></span>
                    Allowed: {simStats.allowed} req/s ({simStats.allowedPct}%)
                  </span>
                  <span className="text-destructive flex items-center gap-1">
                    <span className="bg-destructive size-2 rounded-full"></span>
                    Rate Limited / 429: {simStats.dropped} req/s ({simStats.droppedPct}%)
                  </span>
                </div>

                <div className="bg-muted border-border/50 relative h-2.5 w-full overflow-hidden rounded-full border">
                  <div
                    className="bg-success absolute top-0 bottom-0 left-0 transition-all duration-150"
                    style={{ width: `${simStats.allowedPct}%` }}
                  />
                  <div
                    className="bg-destructive absolute top-0 right-0 bottom-0 transition-all duration-150"
                    style={{ width: `${simStats.droppedPct}%` }}
                  />
                </div>
              </div>

              {/* Simulation Summary Description */}
              <div className="bg-card border-border/80 flex items-start gap-2.5 rounded-md border p-3 text-xs">
                <Shield className="text-primary mt-0.5 size-4 shrink-0" />
                <p className="text-muted-foreground leading-relaxed">{simStats.description}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configured Rules Table Card */}
      <Card className="shadow-xs">
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-lg font-semibold">Configured Rate Limiting Rules</CardTitle>
              <Badge variant="secondary" className="text-xs font-normal tabular-nums">
                {filteredRules.length} Policies
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Priority-ordered edge firewall rules evaluated sequentially for incoming traffic.
            </CardDescription>
          </div>

          {/* Filter Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Search rules, paths, actions…"
              className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring/50 focus-visible:border-ring h-8.5 w-full rounded-md border pr-3 pl-8 text-xs shadow-xs outline-none focus-visible:ring-[3px]"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[280px]">Rule Name & Scope</TableHead>
                  <TableHead className="w-[220px]">Path Matcher</TableHead>
                  <TableHead className="w-[180px]">Limit Threshold</TableHead>
                  <TableHead className="w-[200px]">Mitigation Action</TableHead>
                  <TableHead className="w-[90px] text-center">Status</TableHead>
                  <TableHead className="w-[60px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRules.map((rule) => (
                  <TableRow key={rule.id} className={cn(!rule.enabled && 'bg-muted/20 opacity-60')}>
                    {/* Rule Name & Scope */}
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-foreground font-mono text-xs font-semibold">{rule.name}</span>
                        </div>
                        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                          <span>{rule.scope}</span>
                          <span>·</span>
                          <span className="tabular-nums">{rule.blocked24h} in 24h</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Path Matcher */}
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="font-mono text-xs uppercase">
                          {rule.method}
                        </Badge>
                        <code className="bg-muted/60 border-border text-foreground rounded border px-1.5 py-0.5 font-mono text-xs">
                          {rule.path}
                        </code>
                      </div>
                    </TableCell>

                    {/* Limit Threshold */}
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="text-foreground font-mono text-xs font-medium tabular-nums">
                          {rule.limitThreshold}
                        </div>
                        <div className="text-muted-foreground text-xs">Triggered {rule.lastTriggered}</div>
                      </div>
                    </TableCell>

                    {/* Mitigation Action Badge */}
                    <TableCell>
                      <Badge variant={rule.actionVariant} className="text-xs font-medium">
                        <span
                          className={cn(
                            'mr-1 size-1.5 rounded-full',
                            rule.actionVariant === 'warning'
                              ? 'bg-warning'
                              : rule.actionVariant === 'destructive'
                                ? 'bg-destructive'
                                : 'bg-secondary-foreground',
                          )}
                        />
                        {rule.mitigationAction}
                      </Badge>
                    </TableCell>

                    {/* Status Switch */}
                    <TableCell className="text-center">
                      <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule.id)} />
                    </TableCell>

                    {/* Actions Dropdown */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel className="text-xs">Rule Configuration</DropdownMenuLabel>
                          <DropdownMenuItem className="gap-2 text-xs">
                            <Edit3 className="size-3.5" />
                            <span>Edit Rule</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-xs">
                            <Activity className="size-3.5" />
                            <span>View Metrics</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-xs">
                            <Copy className="size-3.5" />
                            <span>Duplicate Rule</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive gap-2 text-xs">
                            <Trash2 className="size-3.5" />
                            <span>Delete Rule</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

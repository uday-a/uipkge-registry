'use client'

import * as React from 'react'
import {
  Activity,
  AlertTriangle,
  Bell,
  Check,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  Globe,
  RefreshCw,
  Server,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export type RegionStatus = 'operational' | 'degraded' | 'outage' | 'maintenance'
export type DayStatus = 'up' | 'degraded' | 'down' | 'maintenance'
export type IncidentSeverity = 'minor' | 'major' | 'critical' | 'maintenance'

export interface RegionHealth {
  id: string
  name: string
  location: string
  code: string
  latency: number
  status: RegionStatus
  uptime: number
  p95Latency?: number
  packetLoss?: number
  latencyHistory?: number[]
}

export interface ServiceHealthItem {
  id: string
  name: string
  description?: string
  icon?: 'auth' | 'cdn' | 'database' | 'webhook' | 'ai'
  uptime: number
  status: RegionStatus
  days?: DayStatus[]
}

export interface IncidentUpdate {
  time: string
  status: string
  description: string
}

export interface IncidentRecord {
  id: string
  title: string
  date: string
  severity: IncidentSeverity
  resolved: boolean
  duration: string
  updates: IncidentUpdate[]
}

export interface ServiceHealthMatrixProps {
  systemStatus?: RegionStatus
  systemUptime?: string
  lastUpdated?: string
  regions?: RegionHealth[]
  services?: ServiceHealthItem[]
  incidents?: IncidentRecord[]
  className?: string
}

function generate90Days(blips: Array<{ dayAgo: number; status: DayStatus }> = []): DayStatus[] {
  const days: DayStatus[] = Array.from({ length: 90 }, () => 'up')
  for (const blip of blips) {
    const idx = 89 - blip.dayAgo
    if (idx >= 0 && idx < 90) {
      days[idx] = blip.status
    }
  }
  return days
}

const defaultRegions: RegionHealth[] = [
  {
    id: 'us-east',
    name: 'US East',
    location: 'N. Virginia',
    code: 'us-east-1',
    latency: 24,
    status: 'operational',
    uptime: 100,
    p95Latency: 28,
    packetLoss: 0.0,
    latencyHistory: [26, 25, 24, 25, 23, 24, 25, 24, 23, 24, 25, 24],
  },
  {
    id: 'us-west',
    name: 'US West',
    location: 'Oregon',
    code: 'us-west-2',
    latency: 38,
    status: 'operational',
    uptime: 99.98,
    p95Latency: 42,
    packetLoss: 0.0,
    latencyHistory: [40, 39, 38, 37, 38, 39, 38, 38, 37, 38, 39, 38],
  },
  {
    id: 'eu-central',
    name: 'EU Central',
    location: 'Frankfurt',
    code: 'eu-central-1',
    latency: 18,
    status: 'operational',
    uptime: 100,
    p95Latency: 21,
    packetLoss: 0.0,
    latencyHistory: [19, 18, 18, 17, 18, 19, 18, 18, 17, 18, 18, 18],
  },
  {
    id: 'ap-south',
    name: 'AP South',
    location: 'Mumbai',
    code: 'ap-south-1',
    latency: 45,
    status: 'operational',
    uptime: 99.95,
    p95Latency: 52,
    packetLoss: 0.01,
    latencyHistory: [47, 46, 45, 44, 45, 48, 46, 45, 44, 45, 46, 45],
  },
  {
    id: 'ap-east',
    name: 'AP East',
    location: 'Tokyo',
    code: 'ap-northeast-1',
    latency: 32,
    status: 'operational',
    uptime: 99.99,
    p95Latency: 36,
    packetLoss: 0.0,
    latencyHistory: [34, 33, 32, 31, 32, 33, 32, 32, 31, 32, 33, 32],
  },
  {
    id: 'sa-east',
    name: 'SA East',
    location: 'São Paulo',
    code: 'sa-east-1',
    latency: 58,
    status: 'operational',
    uptime: 99.91,
    p95Latency: 65,
    packetLoss: 0.02,
    latencyHistory: [62, 60, 59, 58, 61, 58, 59, 58, 57, 58, 60, 58],
  },
]

const defaultServices: ServiceHealthItem[] = [
  {
    id: 'auth-api',
    name: 'Authentication API',
    description: 'OAuth2 / SAML SSO · Session Tokens · JWT Validation',
    icon: 'auth',
    uptime: 99.99,
    status: 'operational',
    days: generate90Days(),
  },
  {
    id: 'edge-cdn',
    name: 'Edge CDN & DNS',
    description: 'Anycast Global Routing · Edge Cache · SSL Termination',
    icon: 'cdn',
    uptime: 100.0,
    status: 'operational',
    days: generate90Days(),
  },
  {
    id: 'postgres-cluster',
    name: 'Postgres Database Cluster',
    description: 'Primary Write Node · Regional Read Replicas · Pooler',
    icon: 'database',
    uptime: 99.97,
    status: 'operational',
    days: generate90Days([{ dayAgo: 42, status: 'degraded' }]),
  },
  {
    id: 'webhook-dispatcher',
    name: 'Webhook Dispatcher',
    description: 'Event Streaming Engine · Exponential Backoff Retries',
    icon: 'webhook',
    uptime: 99.98,
    status: 'operational',
    days: generate90Days([{ dayAgo: 1, status: 'degraded' }]),
  },
  {
    id: 'ai-gateway',
    name: 'AI Inference Gateway',
    description: 'Model Routing · Streaming Token Buffers · Semantic Cache',
    icon: 'ai',
    uptime: 99.95,
    status: 'operational',
    days: generate90Days([{ dayAgo: 18, status: 'degraded' }]),
  },
]

const defaultIncidents: IncidentRecord[] = [
  {
    id: 'inc-1',
    title: 'Elevated latency on Webhook Dispatcher',
    date: 'Yesterday · Aug 20, 2026',
    severity: 'minor',
    resolved: true,
    duration: '18 minutes',
    updates: [
      {
        time: '14:40 UTC',
        status: 'Resolved',
        description:
          'The backlog of outgoing webhook payloads has fully drained. All queued webhook events were delivered with zero packet drop. Worker autoscaling thresholds have been adjusted.',
      },
      {
        time: '14:22 UTC',
        status: 'Investigating',
        description:
          'We identified a localized queue lock in the dispatch workers following a Redis connection pool saturation. Workers were scaled up and connection pool limits raised.',
      },
    ],
  },
  {
    id: 'inc-2',
    title: 'Scheduled Maintenance: Postgres Cluster Engine Upgrade',
    date: 'Aug 14, 2026',
    severity: 'maintenance',
    resolved: true,
    duration: '12 minutes',
    updates: [
      {
        time: '02:12 UTC',
        status: 'Completed',
        description:
          'Primary instance switchover completed smoothly. Read replicas synchronized without data lag. All database endpoints are fully operational.',
      },
      {
        time: '02:00 UTC',
        status: 'In Progress',
        description:
          'Scheduled rolling restart of secondary read replicas initiated while applying minor database engine updates.',
      },
    ],
  },
]

const statusBannerConfig: Record<
  RegionStatus,
  {
    title: string
    badge: string
    badgeVariant: 'success' | 'warning' | 'destructive' | 'info'
    containerClass: string
    dotClass: string
    textClass: string
  }
> = {
  operational: {
    title: 'All Systems Operational',
    badge: '99.99% 90-day uptime',
    badgeVariant: 'success',
    containerClass: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-950 dark:text-emerald-50',
    dotClass: 'bg-emerald-500',
    textClass: 'text-emerald-700 dark:text-emerald-400',
  },
  degraded: {
    title: 'Active Service Degradation',
    badge: 'Elevated Latency Detected',
    badgeVariant: 'warning',
    containerClass: 'border-amber-500/30 bg-amber-500/10 text-amber-950 dark:text-amber-50',
    dotClass: 'bg-amber-500',
    textClass: 'text-amber-700 dark:text-amber-400',
  },
  outage: {
    title: 'Partial System Outage',
    badge: 'Incident Under Investigation',
    badgeVariant: 'destructive',
    containerClass: 'border-rose-500/30 bg-rose-500/10 text-rose-950 dark:text-rose-50',
    dotClass: 'bg-rose-500',
    textClass: 'text-rose-700 dark:text-rose-400',
  },
  maintenance: {
    title: 'Scheduled Maintenance in Progress',
    badge: 'Planned Upgrades',
    badgeVariant: 'info',
    containerClass: 'border-sky-500/30 bg-sky-500/10 text-sky-950 dark:text-sky-50',
    dotClass: 'bg-sky-500',
    textClass: 'text-sky-700 dark:text-sky-400',
  },
}

const dayClassMap: Record<DayStatus, string> = {
  up: 'bg-emerald-500/80 hover:bg-emerald-500 dark:bg-emerald-500/70 dark:hover:bg-emerald-400',
  degraded: 'bg-amber-500/90 hover:bg-amber-500',
  down: 'bg-rose-500 hover:bg-rose-400',
  maintenance: 'bg-sky-500 hover:bg-sky-400',
}

const dayLabelMap: Record<DayStatus, string> = {
  up: 'Operational (100%)',
  degraded: 'Degraded Performance',
  down: 'Major Outage',
  maintenance: 'Scheduled Maintenance',
}

function getSparkline(history: number[] = [24, 24, 24, 24]) {
  const min = Math.min(...history)
  const max = Math.max(...history)
  const range = max - min || 1
  const height = 26
  const padding = 3

  const points = history.map((val, idx) => {
    const x = (idx / (history.length - 1)) * 100
    const y = height - ((val - min) / range) * (height - padding * 2) - padding
    return { x, y }
  })

  let path = `M ${points[0].x},${points[0].y}`
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]
    const curr = points[i]
    const cx = (prev.x + curr.x) / 2
    path += ` C ${cx},${prev.y} ${cx},${curr.y} ${curr.x},${curr.y}`
  }

  const lastPoint = points[points.length - 1]
  const area = `${path} L 100,32 L 0,32 Z`

  return { path, area, lastPoint }
}

const severityBadgeMap: Record<
  IncidentSeverity,
  { variant: 'info' | 'warning' | 'destructive' | 'secondary'; label: string }
> = {
  minor: { variant: 'warning', label: 'Minor' },
  major: { variant: 'destructive', label: 'Major' },
  critical: { variant: 'destructive', label: 'Critical' },
  maintenance: { variant: 'secondary', label: 'Maintenance' },
}

export function ServiceHealthMatrix({
  systemStatus = 'operational',
  systemUptime = '99.99%',
  lastUpdated = 'Updated 30s ago',
  regions = defaultRegions,
  services = defaultServices,
  incidents = defaultIncidents,
  className,
}: ServiceHealthMatrixProps) {
  const [isRefreshing, setIsRefreshing] = React.useState(false)
  const [isSubscribed, setIsSubscribed] = React.useState(false)
  const [showSubscribeInput, setShowSubscribeInput] = React.useState(false)
  const [emailInput, setEmailInput] = React.useState('')
  const [currentUpdatedText, setCurrentUpdatedText] = React.useState(lastUpdated)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      setCurrentUpdatedText('Updated just now')
    }, 400)
  }

  const handleSubscribeSubmit = () => {
    if (emailInput.trim().length > 0) {
      setIsSubscribed(true)
      setShowSubscribeInput(false)
      setEmailInput('')
    }
  }

  const currentBanner = statusBannerConfig[systemStatus] || statusBannerConfig.operational

  return (
    <div className={cn('w-full space-y-6', className)} data-slot="service-health-matrix">
      {/* Header Banner */}
      <div
        role="status"
        className={cn(
          'flex flex-col gap-4 rounded-xl border p-4 shadow-xs transition-all sm:p-5 md:flex-row md:items-center md:justify-between',
          currentBanner.containerClass,
        )}
      >
        <div className="flex items-start gap-3.5 sm:items-center">
          <span className="relative mt-1 flex size-3 shrink-0 sm:mt-0">
            <span
              className={cn('absolute inline-flex h-full w-full rounded-full opacity-75', currentBanner.dotClass)}
            />
            <span className={cn('relative inline-flex size-3 rounded-full', currentBanner.dotClass)} />
          </span>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-foreground text-base leading-none font-semibold tracking-tight sm:text-lg">
                {currentBanner.title}
              </h1>
              <span className={cn('flex items-center gap-2 text-xs font-medium sm:text-sm', currentBanner.textClass)}>
                {systemUptime} 90-day uptime
              </span>
            </div>
            <p className="text-muted-foreground text-xs">
              Continuous synthetic telemetry and edge probe latency across all global endpoints.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end sm:gap-3 md:self-center">
          <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <Clock className="size-3.5" />
            <span>{currentUpdatedText}</span>
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-7 rounded-md"
              aria-label="Refresh status telemetry"
              onClick={handleRefresh}
            >
              <RefreshCw className={cn('size-3.5', isRefreshing && 'animate-spin')} />
            </Button>
          </div>

          <div className="relative">
            {!isSubscribed ? (
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs font-medium shadow-xs"
                onClick={() => setShowSubscribeInput(!showSubscribeInput)}
              >
                <Bell className="size-3.5" />
                <span>Subscribe to Updates</span>
              </Button>
            ) : (
              <Badge wrap variant="success" className="h-8 gap-1.5 px-3 text-xs font-medium">
                <Check className="size-3.5" />
                Subscribed
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Collapsible Subscribe Input Form */}
      {showSubscribeInput && !isSubscribed && (
        <div className="border-border bg-card text-card-foreground flex flex-col items-stretch gap-2 rounded-lg border p-3 shadow-xs sm:flex-row sm:items-center">
          <div className="flex-1">
            <p className="text-foreground text-xs font-medium">Get instant outage alerts via Email</p>
            <p className="text-muted-foreground text-xs">
              We will only notify you for major severity incidents and maintenance.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="admin@company.com"
              className="border-border bg-background placeholder:text-muted-foreground focus-visible:ring-ring h-8 w-full rounded-md border px-2.5 text-xs focus-visible:ring-2 focus-visible:outline-none sm:w-64"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubscribeSubmit()
              }}
            />
            <Button size="sm" className="h-8 shrink-0 px-3 text-xs" onClick={handleSubscribeSubmit}>
              Subscribe
            </Button>
          </div>
        </div>
      )}

      {/* Section 1: Global Region Latency Grid */}
      <div className="space-y-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-foreground text-sm font-semibold tracking-tight">Global Region Latency Grid</h2>
            <p className="text-muted-foreground text-xs">
              Real-time edge response round-trip time and packet loss metrics.
            </p>
          </div>
          <div className="text-muted-foreground flex items-center gap-2 text-xs">
            <span className="inline-flex size-2 rounded-full bg-emerald-500" />
            <span>All 6 Edge Zones Live</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {regions.map((region) => {
            const spark = getSparkline(region.latencyHistory)
            return (
              <Card
                key={region.id}
                className="border-border/80 bg-card text-card-foreground hover:border-border shadow-xs transition-colors"
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="bg-muted/70 text-muted-foreground border-border/50 flex size-8 shrink-0 items-center justify-center rounded-md border">
                        <Globe className="size-4" />
                      </div>
                      <div>
                        <CardTitle className="text-sm leading-snug font-semibold">{region.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {region.location} · <span className="text-muted-foreground font-mono">{region.code}</span>
                        </CardDescription>
                      </div>
                    </div>

                    <Badge
                      wrap
                      variant={
                        region.status === 'operational'
                          ? 'success'
                          : region.status === 'degraded'
                            ? 'warning'
                            : 'destructive'
                      }
                      className="shrink-0 text-xs font-medium capitalize"
                    >
                      <span
                        className={cn(
                          'mr-1 size-1.5 rounded-full',
                          region.status === 'operational'
                            ? 'bg-emerald-500'
                            : region.status === 'degraded'
                              ? 'bg-amber-500'
                              : 'bg-rose-500',
                        )}
                      />
                      {region.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 p-4 pt-1">
                  {/* Latency big metric & status */}
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 pt-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-foreground font-mono text-2xl font-bold tracking-tight">
                        {region.latency}ms
                      </span>
                      <span className="text-muted-foreground text-xs">ping</span>
                    </div>
                    <div
                      className={cn(
                        'flex items-center gap-1 text-xs font-medium',
                        region.latency < 30
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : region.latency < 50
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-amber-600 dark:text-amber-400',
                      )}
                    >
                      <Activity className="size-3" />
                      <span>{region.latency < 30 ? 'Optimal' : region.latency < 50 ? 'Normal' : 'Elevated'}</span>
                    </div>
                  </div>

                  {/* SVG Sparkline */}
                  <div className="h-9 w-full overflow-hidden pt-1" aria-label={`${region.name} latency sparkline`}>
                    <svg className="h-full w-full overflow-visible" viewBox="0 0 100 32" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id={`grad-react-${region.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="0%"
                            stopColor={
                              region.status === 'operational'
                                ? 'var(--color-emerald-500, #10b981)'
                                : 'var(--color-amber-500, #f59e0b)'
                            }
                            stopOpacity="0.25"
                          />
                          <stop
                            offset="100%"
                            stopColor={
                              region.status === 'operational'
                                ? 'var(--color-emerald-500, #10b981)'
                                : 'var(--color-amber-500, #f59e0b)'
                            }
                            stopOpacity="0.0"
                          />
                        </linearGradient>
                      </defs>
                      <path d={spark.area} fill={`url(#grad-react-${region.id})`} />
                      <path
                        d={spark.path}
                        fill="none"
                        stroke={
                          region.status === 'operational'
                            ? 'var(--color-emerald-500, #10b981)'
                            : 'var(--color-amber-500, #f59e0b)'
                        }
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx={spark.lastPoint.x}
                        cy={spark.lastPoint.y}
                        r="2.5"
                        className={region.status === 'operational' ? 'fill-emerald-500' : 'fill-amber-500'}
                      />
                    </svg>
                  </div>

                  {/* Footer Stats */}
                  <div className="border-border/50 text-muted-foreground flex items-center justify-between border-t pt-2.5 text-xs">
                    <div className="text-foreground flex items-center gap-1 font-medium">
                      <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                      <span>{region.uptime}% uptime</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span>P95: {region.p95Latency ?? 28}ms</span>
                      <span>·</span>
                      <span>{region.packetLoss ?? 0}% loss</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Section 2: Core Services Component Health List */}
      <div className="space-y-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-foreground text-sm font-semibold tracking-tight">Core Services Component Health</h2>
            <p className="text-muted-foreground text-xs">
              90-day daily uptime history and service availability breakdown.
            </p>
          </div>

          {/* Legend */}
          <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>Operational</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-amber-500" />
              <span>Degraded</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-rose-500" />
              <span>Outage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-sky-500" />
              <span>Maintenance</span>
            </div>
          </div>
        </div>

        <Card className="border-border/80 bg-card text-card-foreground overflow-hidden shadow-xs">
          <div className="divide-border/60 divide-y">
            {services.map((service) => {
              const days = service.days || generate90Days()
              return (
                <div key={service.id} className="hover:bg-muted/15 space-y-3 p-4 transition-colors sm:p-5">
                  {/* Service Header Row */}
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted text-muted-foreground border-border/50 flex size-8 shrink-0 items-center justify-center rounded-lg border">
                        {service.icon === 'auth' && <ShieldCheck className="size-4" />}
                        {service.icon === 'cdn' && <Globe className="size-4" />}
                        {service.icon === 'database' && <Database className="size-4" />}
                        {service.icon === 'webhook' && <Zap className="size-4" />}
                        {service.icon === 'ai' && <Cpu className="size-4" />}
                        {!service.icon && <Server className="size-4" />}
                      </div>
                      <div>
                        <p className="text-foreground text-sm leading-tight font-semibold">{service.name}</p>
                        {service.description && (
                          <p className="text-muted-foreground mt-0.5 text-xs">{service.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-auto">
                      <span className="text-foreground font-mono text-xs font-semibold tabular-nums">
                        {service.uptime}% uptime
                      </span>
                      <Badge
                        wrap
                        variant={
                          service.status === 'operational'
                            ? 'success'
                            : service.status === 'degraded'
                              ? 'warning'
                              : 'destructive'
                        }
                        className="text-xs font-medium capitalize"
                      >
                        <span
                          className={cn(
                            'mr-1 size-1.5 rounded-full',
                            service.status === 'operational' ? 'bg-emerald-500' : 'bg-amber-500',
                          )}
                        />
                        {service.status}
                      </Badge>
                    </div>
                  </div>

                  {/* 90-day pill bar track */}
                  <div className="space-y-1.5">
                    <div
                      className="flex w-full gap-px overflow-hidden sm:gap-[2px]"
                      role="img"
                      aria-label={`${service.name} 90-day availability history (${service.uptime}%)`}
                    >
                      {days.map((day, dayIdx) => (
                        <span
                          key={dayIdx}
                          className={cn(
                            'h-6 min-w-px flex-1 cursor-pointer rounded-xs transition-transform hover:scale-y-125',
                            dayClassMap[day],
                          )}
                          title={`Day ${90 - dayIdx} ago: ${dayLabelMap[day]}`}
                        />
                      ))}
                    </div>

                    {/* Time axis labels */}
                    <div className="text-muted-foreground flex items-center justify-between pt-0.5 text-xs">
                      <span>90 days ago</span>
                      <span className="hidden sm:inline">100% daily health check baseline</span>
                      <span>Today</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Section 3: Past Incidents Timeline */}
      <div className="space-y-3">
        <div>
          <h2 className="text-foreground text-sm font-semibold tracking-tight">Past Incidents & Maintenance</h2>
          <p className="text-muted-foreground text-xs">Detailed post-mortems and scheduled infrastructure updates.</p>
        </div>

        <Card className="border-border/80 bg-card text-card-foreground p-5 shadow-xs sm:p-6">
          {incidents && incidents.length > 0 ? (
            <div className="space-y-8">
              {incidents.map((incident) => (
                <div
                  key={incident.id}
                  className="border-border/80 relative space-y-3 border-l-2 pb-2 pl-6 last:border-l-transparent sm:pl-8"
                >
                  {/* Timeline Node Dot */}
                  <div
                    className={cn(
                      'bg-background absolute top-0 -left-[11px] flex size-5 items-center justify-center rounded-full border',
                      incident.resolved ? 'border-emerald-500 text-emerald-500' : 'border-amber-500 text-amber-500',
                    )}
                  >
                    {incident.resolved ? <Check className="size-3" /> : <AlertTriangle className="size-3" />}
                  </div>

                  {/* Incident Header */}
                  <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-foreground text-sm font-semibold">{incident.title}</h3>
                        <Badge wrap variant={incident.resolved ? 'success' : 'warning'} className="text-xs">
                          {incident.resolved ? 'Resolved' : 'Ongoing'}
                        </Badge>
                        <Badge wrap variant={severityBadgeMap[incident.severity].variant} className="text-xs">
                          {severityBadgeMap[incident.severity].label}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-xs">{incident.date}</p>
                    </div>

                    <span className="text-muted-foreground font-mono text-xs whitespace-nowrap">
                      Duration: {incident.duration}
                    </span>
                  </div>

                  {/* Incident Updates Log */}
                  <div className="bg-muted/40 border-border/60 space-y-3 rounded-lg border p-3.5 text-xs sm:p-4">
                    {incident.updates.map((update, uIdx) => (
                      <div key={uIdx} className="border-border/40 space-y-1 border-b pb-2.5 last:border-b-0 last:pb-0">
                        <div className="text-foreground flex items-center gap-2 font-medium">
                          <span className="text-muted-foreground font-mono">{update.time}</span>
                          <span>·</span>
                          <span
                            className={
                              update.status === 'Resolved' || update.status === 'Completed'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-foreground'
                            }
                          >
                            {update.status}
                          </span>
                        </div>
                        <p className="text-muted-foreground pl-0 leading-relaxed sm:pl-2">{update.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle2 className="mb-2 size-8 text-emerald-500" />
              <p className="text-foreground text-sm font-medium">No incidents reported</p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                All services have maintained 100% operational integrity.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

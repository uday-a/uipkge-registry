'use client'

import * as React from 'react'
import { ArrowRight, CheckCircle2, Play, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type Timeframe = 'live' | '24h' | '7d' | '30d'

interface MetricData {
  mrr: string
  growth: string
  activeUsers: string
  requests: string
  chartPoints: number[]
}

const metricsByTimeframe: Record<Timeframe, MetricData> = {
  live: {
    mrr: '$148,920',
    growth: '+24.6%',
    activeUsers: '14,280',
    requests: '1.42M/min',
    chartPoints: [28, 42, 36, 54, 48, 62, 78, 70, 85, 92, 88, 98],
  },
  '24h': {
    mrr: '$146,800',
    growth: '+18.2%',
    activeUsers: '42,100',
    requests: '84.6M',
    chartPoints: [35, 38, 45, 52, 50, 68, 64, 75, 82, 80, 89, 94],
  },
  '7d': {
    mrr: '$139,400',
    growth: '+31.4%',
    activeUsers: '185,400',
    requests: '592M',
    chartPoints: [20, 28, 35, 42, 55, 60, 72, 68, 80, 85, 90, 100],
  },
  '30d': {
    mrr: '$124,100',
    growth: '+44.1%',
    activeUsers: '490,000',
    requests: '2.4B',
    chartPoints: [15, 22, 30, 38, 48, 58, 65, 74, 82, 88, 94, 105],
  },
}

export interface HeroSaasMetricsDashboardProps {
  className?: string
}

export function HeroSaasMetricsDashboard({ className }: HeroSaasMetricsDashboardProps) {
  const [activeTimeframe, setActiveTimeframe] = React.useState<Timeframe>('live')
  const activeMetric = metricsByTimeframe[activeTimeframe]

  const chartSvgPath = React.useMemo(() => {
    const points = activeMetric.chartPoints
    const width = 500
    const height = 120
    const max = Math.max(...points)
    const min = Math.min(...points)
    const range = max - min || 1

    return points
      .map((val, idx) => {
        const x = (idx / (points.length - 1)) * width
        const y = height - ((val - min) / range) * (height - 20) - 10
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
      })
      .join(' ')
  }, [activeMetric.chartPoints])

  const chartAreaPath = React.useMemo(() => {
    return `${chartSvgPath} L 500 120 L 0 120 Z`
  }, [chartSvgPath])

  return (
    <section
      data-slot="hero-saas-metrics-dashboard"
      className={cn('bg-background relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8', className)}
    >
      {/* Radial Glow Background */}
      <div className="bg-primary/10 pointer-events-none absolute top-0 left-1/2 -z-10 h-80 w-full max-w-6xl -translate-x-1/2 rounded-full blur-xl" />

      <div className="mx-auto max-w-6xl space-y-12 text-center">
        {/* Header Copy */}
        <div className="mx-auto max-w-3xl space-y-5">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1 font-mono text-xs shadow-xs">
            <Sparkles className="text-primary size-3.5" />
            Enterprise Revenue & Event Intelligence
          </Badge>

          <h1 className="text-foreground text-4xl leading-[1.12] font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Real-time telemetry for modern engineering teams.
          </h1>

          <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
            Monitor revenue acceleration, API transaction throughput, and compute workloads with sub-millisecond
            precision.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button asChild size="lg" className="gap-2 font-semibold shadow-xs">
              <a href="#start">
                <span>Start Free Sandbox</span>
                <ArrowRight className="size-4" />
              </a>
            </Button>

            <Button asChild variant="outline" size="lg" className="gap-2 font-medium">
              <a href="#demo">
                <Play className="size-3.5 fill-current" />
                <span>Interactive Demo</span>
              </a>
            </Button>
          </div>

          <div className="text-muted-foreground flex items-center justify-center gap-6 pt-2 font-mono text-xs">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-emerald-500" /> SOC2 Type II Certified
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="text-primary size-4" /> 99.999% SLA Uptime
            </span>
          </div>
        </div>

        {/* Interactive SaaS Dashboard Preview Card */}
        <div className="relative mx-auto max-w-5xl">
          <Card className="border-border bg-card/95 overflow-hidden rounded-2xl text-left shadow-sm backdrop-blur-md">
            {/* Mock Window Top Bar */}
            <div className="border-border bg-muted/40 flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="size-3 rounded-full bg-red-500/80" />
                  <div className="size-3 rounded-full bg-amber-500/80" />
                  <div className="size-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-foreground font-mono text-xs font-medium">console.uipkge.dev/production</span>
              </div>

              {/* Timeframe Filter Tabs */}
              <div className="bg-background border-border flex items-center gap-1 rounded-lg border p-0.5">
                {(['live', '24h', '7d', '30d'] as Timeframe[]).map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    className={cn(
                      'rounded-md px-2.5 py-1 font-mono text-xs uppercase transition-all',
                      activeTimeframe === tf
                        ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                        : 'text-muted-foreground hover:text-foreground',
                    )}
                    onClick={() => setActiveTimeframe(tf)}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Dashboard Metric Cards Grid */}
            <div className="space-y-6 p-6 sm:p-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* MRR Card */}
                <div className="border-border bg-background/50 space-y-1 rounded-xl border p-4">
                  <div className="text-muted-foreground flex items-center justify-between text-xs">
                    <span className="font-mono">Recurring Revenue</span>
                    <Badge
                      variant="outline"
                      className="border-emerald-500/20 bg-emerald-500/10 font-mono text-xs text-emerald-600 dark:text-emerald-400"
                    >
                      {activeMetric.growth}
                    </Badge>
                  </div>
                  <p className="text-foreground font-mono text-2xl font-bold">{activeMetric.mrr}</p>
                  <p className="text-muted-foreground text-xs">Calculated across active subscriptions</p>
                </div>

                {/* Active Workloads Card */}
                <div className="border-border bg-background/50 space-y-1 rounded-xl border p-4">
                  <div className="text-muted-foreground flex items-center justify-between text-xs">
                    <span className="font-mono">Active Nodes & Pods</span>
                    <span className="size-2 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-foreground font-mono text-2xl font-bold">{activeMetric.activeUsers}</p>
                  <p className="text-muted-foreground text-xs">Distributed across 8 global regions</p>
                </div>

                {/* Request Throughput Card */}
                <div className="border-border bg-background/50 space-y-1 rounded-xl border p-4">
                  <div className="text-muted-foreground flex items-center justify-between text-xs">
                    <span className="font-mono">Throughput</span>
                    <TrendingUp className="text-primary size-3.5" />
                  </div>
                  <p className="text-foreground font-mono text-2xl font-bold">{activeMetric.requests}</p>
                  <p className="text-muted-foreground text-xs">Edge cached queries & websocket streams</p>
                </div>
              </div>

              {/* Interactive Area Trend Chart */}
              <div className="border-border bg-background/30 space-y-3 rounded-xl border p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground font-mono text-xs uppercase">
                      Transaction Velocity & Event Stream
                    </p>
                    <p className="text-foreground text-sm font-semibold">Global Ingestion Rate</p>
                  </div>
                  <span className="font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    99.998% Success
                  </span>
                </div>

                {/* SVG Area Chart */}
                <div className="relative h-28 w-full overflow-hidden">
                  <svg className="h-full w-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGlowReact" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* Gradient Area */}
                    <path d={chartAreaPath} fill="url(#chartGlowReact)" />
                    {/* Stroke Line */}
                    <path
                      d={chartSvgPath}
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
export default HeroSaasMetricsDashboard

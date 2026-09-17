'use client'

import * as React from 'react'
import { Check, Clock, Copy, Globe, ShieldCheck, Sparkles, TrendingUp, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface StatsBandProps {
  variant?: 'plain' | 'bordered'
}

type Timeframe = 'realtime' | '24h' | '7d' | '30d'

interface MetricData {
  id: string
  label: string
  subtitle: string
  values: Record<Timeframe, { main: string; change: string; isPositive: boolean; note: string }>
  icon: React.ElementType
  breakdown: { region: string; val: string; status: string }[]
}

const stats: MetricData[] = [
  {
    id: 'uptime',
    label: 'Platform Availability',
    subtitle: 'Multi-region Active-Active SLA',
    icon: ShieldCheck,
    values: {
      realtime: { main: '100.00%', change: '0 incident in 90d', isPositive: true, note: 'Zero degradation' },
      '24h': { main: '99.999%', change: '+0.001%', isPositive: true, note: '100% healthy' },
      '7d': { main: '99.995%', change: '+0.005%', isPositive: true, note: 'Target > 99.99%' },
      '30d': { main: '99.988%', change: '+0.02%', isPositive: true, note: 'Statutory SLA met' },
    },
    breakdown: [
      { region: 'us-east-1 (N. Virginia)', val: '100.0%', status: 'Operational' },
      { region: 'eu-west-1 (Frankfurt)', val: '100.0%', status: 'Operational' },
      { region: 'ap-southeast-1 (Singapore)', val: '100.0%', status: 'Operational' },
      { region: 'sa-east-1 (São Paulo)', val: '99.99%', status: 'Operational' },
    ],
  },
  {
    id: 'throughput',
    label: 'Component Installs & Pulls',
    subtitle: 'Daily registry resolutions',
    icon: Zap,
    values: {
      realtime: { main: '1.42M', change: '+34.2k / hr', isPositive: true, note: 'Peak throughput' },
      '24h': { main: '3.89M', change: '+22.4% vs prev', isPositive: true, note: '320k unique repos' },
      '7d': { main: '26.4M', change: '+18.8%', isPositive: true, note: '1.4k new teams' },
      '30d': { main: '104.2M', change: '+41.0%', isPositive: true, note: 'Global scale' },
    },
    breakdown: [
      { region: 'Vue 3 / Nuxt 3 Core', val: '58.2%', status: 'Dominant' },
      { region: 'React 19 / Next.js Mirror', val: '41.8%', status: 'Growing' },
      { region: 'Direct CLI Installations', val: '88.4%', status: 'Automated' },
      { region: 'Manual Source Downloads', val: '11.6%', status: 'Direct' },
    ],
  },
  {
    id: 'latency',
    label: 'Global Edge P99 Latency',
    subtitle: 'Cloudflare Workers cache hits',
    icon: Clock,
    values: {
      realtime: { main: '12ms', change: '-4ms reduction', isPositive: true, note: 'Global median: 8ms' },
      '24h': { main: '14ms', change: '-2ms vs baseline', isPositive: true, note: '99.9% cache hit' },
      '7d': { main: '16ms', change: '-12ms optimization', isPositive: true, note: 'Zero edge cold-starts' },
      '30d': { main: '18ms', change: '-24ms', isPositive: true, note: 'V4 pipeline rollout' },
    },
    breakdown: [
      { region: 'North America (Edge)', val: '9ms', status: 'Fastest' },
      { region: 'Europe (Edge)', val: '11ms', status: 'Optimal' },
      { region: 'Asia-Pacific (Edge)', val: '14ms', status: 'Optimal' },
      { region: 'Latin America (Edge)', val: '18ms', status: 'Optimal' },
    ],
  },
  {
    id: 'satisfaction',
    label: 'Enterprise Developer NPS',
    subtitle: 'Surveyed across 450+ companies',
    icon: Sparkles,
    values: {
      realtime: { main: '+78', change: 'Top 1% dev tools', isPositive: true, note: 'Verified feedback' },
      '24h': { main: '4.94 / 5', change: '99.2% positive', isPositive: true, note: 'From 1,240 ratings' },
      '7d': { main: '+76', change: '+4 pts vs qtr', isPositive: true, note: '98% retention' },
      '30d': { main: '+74', change: '+12 pts YoY', isPositive: true, note: 'Industry benchmark' },
    },
    breakdown: [
      { region: 'Code Quality & Typing', val: '99.6%', status: '5 Stars' },
      { region: 'Zero-Lockin Ownership', val: '98.8%', status: '5 Stars' },
      { region: 'Visual Design Aesthetics', val: '99.2%', status: '5 Stars' },
      { region: 'Documentation & Demos', val: '97.4%', status: '4.9 Stars' },
    ],
  },
]

export function StatsBand({ variant = 'bordered' }: StatsBandProps) {
  const [selectedTimeframe, setSelectedTimeframe] = React.useState<Timeframe>('realtime')
  const [activeStatIndex, setActiveStatIndex] = React.useState<number | null>(null)
  const [copied, setCopied] = React.useState(false)

  const copyStatsPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(stats, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section
      data-slot="stats-band"
      className={cn(
        'bg-card relative w-full overflow-hidden',
        variant === 'bordered' ? 'border-border rounded-2xl border shadow-xs' : '',
      )}
    >
      {/* Top Telemetry Header Bar */}
      <div className="border-border bg-muted/20 flex flex-col justify-between gap-4 border-b px-6 py-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5">
          <div className="flex size-2.5 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-foreground font-mono text-xs font-semibold tracking-wider uppercase">
            Real-time Telemetry & Performance Matrix
          </span>
          <Badge
            variant="outline"
            className="hidden border-emerald-500/20 bg-emerald-500/10 font-mono text-xs text-emerald-600 sm:inline-flex dark:text-emerald-400"
          >
            All Systems Operational
          </Badge>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Timeframe Selectors */}
          <div className="bg-background border-border flex items-center rounded-lg border p-0.5">
            {[
              { id: 'realtime', label: 'Live P99' },
              { id: '24h', label: '24H' },
              { id: '7d', label: '7D' },
              { id: '30d', label: '30D' },
            ].map((tf) => (
              <button
                key={tf.id}
                type="button"
                className={cn(
                  'rounded px-2.5 py-1 font-mono text-xs transition-all',
                  selectedTimeframe === tf.id
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setSelectedTimeframe(tf.id as any)}
              >
                {tf.label}
              </button>
            ))}
          </div>

          <Button variant="outline" size="sm" className="h-7 gap-1.5 px-2 font-mono text-xs" onClick={copyStatsPayload}>
            {copied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
            <span>{copied ? 'Copied' : 'JSON'}</span>
          </Button>
        </div>
      </div>

      {/* 4-Column KPI Metric Cards */}
      <div className="divide-border grid grid-cols-1 divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
        {stats.map((item, idx) => {
          const Icon = item.icon
          const isSelected = activeStatIndex === idx
          return (
            <div
              key={item.id}
              className={cn(
                'hover:bg-muted/30 group relative cursor-pointer p-6 transition-colors',
                isSelected ? 'bg-muted/40 ring-primary/30 ring-1 ring-inset' : '',
              )}
              onClick={() => setActiveStatIndex(isSelected ? null : idx)}
            >
              <div className="flex items-start justify-between">
                <p className="text-muted-foreground font-mono text-xs tracking-wider uppercase">{item.label}</p>
                <Icon className="text-muted-foreground group-hover:text-primary size-4 transition-colors" />
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-foreground font-mono text-3xl font-bold tracking-tight">
                  {item.values[selectedTimeframe].main}
                </span>
              </div>

              <p className="text-muted-foreground mt-1 line-clamp-1 text-xs">{item.subtitle}</p>

              <div className="border-border/60 mt-4 flex items-center justify-between border-t pt-3">
                <span className="inline-flex items-center gap-1 font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="size-3" />
                  {item.values[selectedTimeframe].change}
                </span>
                <span className="text-muted-foreground font-mono text-xs">{item.values[selectedTimeframe].note}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Telemetry Regional Drilldown Drawer when a card is selected */}
      {activeStatIndex !== null && (
        <div className="bg-muted/20 border-border space-y-4 border-t p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="text-primary size-4" />
              <span className="text-foreground text-xs font-semibold">
                Regional Telemetry & Infrastructure Breakdown: {stats[activeStatIndex].label}
              </span>
            </div>
            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setActiveStatIndex(null)}>
              Close Breakdown
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats[activeStatIndex].breakdown.map((sub) => (
              <div
                key={sub.region}
                className="border-border bg-background flex items-center justify-between rounded-lg border p-3 shadow-xs"
              >
                <div>
                  <p className="text-foreground text-xs font-medium">{sub.region}</p>
                  <p className="text-muted-foreground mt-0.5 font-mono text-xs">{sub.status}</p>
                </div>
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">{sub.val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
export default StatsBand

'use client'

import * as React from 'react'
import { Gauge } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type Cohort = 'all' | 'enterprise' | 'startups'

interface MetricStat {
  id: string
  label: string
  value: string
  baseline: string
  change: string
  isPositive: boolean
  description: string
  details: {
    before: string
    after: string
    impact: string
  }
}

const metricsByCohort: Record<Cohort, MetricStat[]> = {
  all: [
    {
      id: 'velocity',
      label: 'Time to First Production Release',
      value: '4.2x',
      baseline: 'Reduced from 14 weeks to 18 days',
      change: '+320% Faster',
      isPositive: true,
      description: 'Engineering squads ship complete vertical workflows without custom CSS boilerplate.',
      details: { before: '98 Days average', after: '18 Days average', impact: '80 days saved per major launch' },
    },
    {
      id: 'vitals',
      label: 'Core Web Vitals Pass Rate',
      value: '99.4%',
      baseline: 'Tested across 10M+ mobile pageviews',
      change: '+28.4% vs monolithic',
      isPositive: true,
      description: 'OKLCH zero-runtime styling ensures sub-50ms INP and pristine Lighthouse 100 scores.',
      details: { before: '71.0% Pass Rate', after: '99.4% Pass Rate', impact: 'Zero layout shift (CLS 0.00)' },
    },
    {
      id: 'maintenance',
      label: 'Design System Maintenance Cost',
      value: '-74%',
      baseline: 'Engineering hours spent upgrading packages',
      change: '-74% Reduction',
      isPositive: true,
      description: 'Direct code ownership eliminates breaking semver dependency conflicts permanently.',
      details: { before: '24 hrs / developer / mo', after: '6.2 hrs / developer / mo', impact: '17.8 hrs reclaimed' },
    },
    {
      id: 'cloud_savings',
      label: 'Average Annual Compute & Bandwidth Saved',
      value: '$184k',
      baseline: 'Calculated across high-traffic SaaS suites',
      change: 'Zero AST bloat',
      isPositive: true,
      description: 'Zero unused component CSS in bundle output lowers edge bandwidth distribution costs.',
      details: { before: '640 kB vendor chunks', after: '38 kB tree-shaken chunks', impact: '94% payload reduction' },
    },
  ],
  enterprise: [
    {
      id: 'velocity',
      label: 'Time to First Production Release',
      value: '5.8x',
      baseline: 'Enterprise multi-app design alignment',
      change: '+480% Faster',
      isPositive: true,
      description: 'Standardized AST across 20+ squads without package coordination overhead.',
      details: { before: '180 Days average', after: '31 Days average', impact: '149 days saved per project' },
    },
    {
      id: 'vitals',
      label: 'Core Web Vitals Pass Rate',
      value: '99.8%',
      baseline: 'Internal enterprise portals & dashboards',
      change: '+34.2% uplift',
      isPositive: true,
      description: 'Strict keyboard ergonomics and WCAG AA accessibility out of the box.',
      details: { before: '65.6% Pass Rate', after: '99.8% Pass Rate', impact: '100% compliance audit pass' },
    },
    {
      id: 'maintenance',
      label: 'Design System Maintenance Cost',
      value: '-82%',
      baseline: 'Eliminated dedicated registry sync team',
      change: '-82% Saved',
      isPositive: true,
      description: 'Engineers customize source code in their own repo without waiting on upstream merges.',
      details: {
        before: '3 FTEs maintenance',
        after: '0.5 FTE maintenance',
        impact: '2.5 FTEs reallocated to product',
      },
    },
    {
      id: 'cloud_savings',
      label: 'Average Annual Compute & Bandwidth Saved',
      value: '$420k',
      baseline: 'Tier-1 enterprise infrastructure',
      change: 'Zero CVE risk',
      isPositive: true,
      description: 'No third-party runtime dependencies eliminates transitive package auditing costs.',
      details: { before: '$650k vendor licensing', after: '$230k infrastructure', impact: '$420k saved annually' },
    },
  ],
  startups: [
    {
      id: 'velocity',
      label: 'Time to First Production Release',
      value: '6.4x',
      baseline: 'From idea to paying users in days',
      change: '+540% Faster',
      isPositive: true,
      description: 'Plug-and-play workbenches and CRM blocks ready for Stripe integration on day 1.',
      details: { before: '45 Days to MVP', after: '7 Days to MVP', impact: '38 days faster to revenue' },
    },
    {
      id: 'vitals',
      label: 'Core Web Vitals Pass Rate',
      value: '99.1%',
      baseline: 'Landing pages and conversion flows',
      change: '+22.0% uplift',
      isPositive: true,
      description: 'Blazing fast mobile experiences drive higher conversion rates for early users.',
      details: { before: '77.1% Pass Rate', after: '99.1% Pass Rate', impact: '+14% checkout conversion' },
    },
    {
      id: 'maintenance',
      label: 'Design System Maintenance Cost',
      value: '-90%',
      baseline: 'Zero full-time design engineers needed',
      change: '-90% Overhead',
      isPositive: true,
      description: 'Founders and full-stack devs build world-class Linear-grade interfaces independently.',
      details: {
        before: 'Hiring UI designer ($140k)',
        after: 'Self-serve registry ($0)',
        impact: '$140k runway preserved',
      },
    },
    {
      id: 'cloud_savings',
      label: 'Average Annual Compute & Bandwidth Saved',
      value: '$48k',
      baseline: 'Vercel / Cloudflare edge usage tier',
      change: 'Sub-millisecond cold start',
      isPositive: true,
      description: 'Compact bundle sizes prevent edge function invocation timeouts and memory spikes.',
      details: { before: '350ms cold starts', after: '42ms cold starts', impact: '88% compute reduction' },
    },
  ],
}

export interface CustomerMetricsBandProps {
  className?: string
}

export function CustomerMetricsBand({ className }: CustomerMetricsBandProps) {
  const [activeCohort, setActiveCohort] = React.useState<Cohort>('all')
  const [activeMetricId, setActiveMetricId] = React.useState<string>('velocity')

  const currentMetricList = metricsByCohort[activeCohort]
  const selectedMetric = currentMetricList.find((m) => m.id === activeMetricId) || currentMetricList[0]

  return (
    <section
      data-slot="customer-metrics-band"
      className={cn(
        'border-border/80 bg-muted/10 relative overflow-hidden border-y px-4 py-16 sm:px-6 sm:py-24 lg:px-8',
        className,
      )}
    >
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Section Header with Cohort Switcher */}
        <div className="border-border/60 flex flex-col items-center justify-between gap-6 border-b pb-8 text-center md:flex-row md:text-left">
          <div className="space-y-2">
            <Badge variant="secondary" className="gap-1.5 px-3 py-1 font-mono text-xs shadow-xs">
              <Gauge className="text-primary size-3.5" />
              Verified Customer Impact Benchmark
            </Badge>
            <h2 className="text-foreground text-3xl font-bold tracking-tight">
              Proven engineering velocity at global scale.
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Aggregated telemetry from over 1,400+ production applications built with UIPKGE.
            </p>
          </div>

          {/* Cohort Switcher Tabs */}
          <div className="bg-background border-border flex shrink-0 items-center gap-1 rounded-xl border p-1">
            {[
              { id: 'all', label: 'All Teams' },
              { id: 'enterprise', label: 'Enterprise 500' },
              { id: 'startups', label: 'High-Growth' },
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                className={cn(
                  'rounded-lg px-3 py-1.5 font-mono text-xs transition-all',
                  activeCohort === c.id
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setActiveCohort(c.id as Cohort)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Tile KPI Metric Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {currentMetricList.map((stat) => (
            <Card
              key={stat.id}
              className={cn(
                'border-border bg-card/90 flex cursor-pointer flex-col justify-between space-y-4 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md',
                activeMetricId === stat.id && 'ring-primary border-primary/60 bg-card ring-2',
              )}
              onClick={() => setActiveMetricId(stat.id)}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground max-w-[160px] truncate font-mono text-xs">{stat.label}</span>
                  <Badge
                    variant="outline"
                    className="border-emerald-500/20 bg-emerald-500/10 font-mono text-xs text-emerald-600 dark:text-emerald-400"
                  >
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-foreground font-mono text-3xl font-bold tracking-tight sm:text-4xl">{stat.value}</p>
              </div>

              <p className="text-muted-foreground border-border/60 border-t pt-2 text-xs leading-relaxed">
                {stat.baseline}
              </p>
            </Card>
          ))}
        </div>

        {/* Interactive Detailed Breakdown Card for Selected KPI */}
        <Card className="border-border bg-card/95 space-y-6 overflow-hidden rounded-2xl p-6 text-left shadow-xl backdrop-blur-md sm:p-8">
          <div className="border-border flex flex-col items-start justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-primary size-2 rounded-full" />
                <h3 className="text-foreground font-mono text-base font-bold">
                  {selectedMetric.label} &mdash; Deep Dive
                </h3>
              </div>
              <p className="text-muted-foreground text-xs">{selectedMetric.description}</p>
            </div>
            <Badge variant="secondary" className="text-primary font-mono text-xs font-semibold">
              Cohort: {activeCohort.toUpperCase()}
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="border-border bg-background/50 space-y-1 rounded-xl border p-4">
              <p className="text-muted-foreground font-mono text-xs">Monolithic Package Baseline</p>
              <p className="text-muted-foreground font-mono text-lg font-bold line-through">
                {selectedMetric.details.before}
              </p>
            </div>
            <div className="border-border bg-background/50 space-y-1 rounded-xl border p-4">
              <p className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                UIPKGE Unbundled Registry
              </p>
              <p className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {selectedMetric.details.after}
              </p>
            </div>
            <div className="border-border bg-primary/5 space-y-1 rounded-xl border p-4">
              <p className="text-primary font-mono text-xs font-semibold">Net Engineering Impact</p>
              <p className="text-foreground font-mono text-lg font-bold">{selectedMetric.details.impact}</p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
export default CustomerMetricsBand

'use client'

import * as React from 'react'
import { Pause, Play } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface BrandPartner {
  id: string
  name: string
  category: 'devtools' | 'fintech' | 'enterprise'
  role: string
  metric: string
  region: string
}

const partners: BrandPartner[] = [
  {
    id: 'vercel',
    name: 'Vercel Edge',
    category: 'devtools',
    role: 'Global Edge Ingestion',
    metric: '99.999% SLA',
    region: 'Global',
  },
  {
    id: 'supabase',
    name: 'Supabase Postgres',
    category: 'devtools',
    role: 'Real-Time Replication',
    metric: '1.2M QPS',
    region: 'US-East',
  },
  {
    id: 'linear',
    name: 'Linear Method',
    category: 'enterprise',
    role: 'Issue Sync Engine',
    metric: '< 20ms Sync',
    region: 'Global',
  },
  {
    id: 'stripe',
    name: 'Stripe Billing',
    category: 'fintech',
    role: 'Usage Metering Gateway',
    metric: '$4.2B Volume',
    region: 'Global',
  },
  {
    id: 'resend',
    name: 'Resend SMTP',
    category: 'devtools',
    role: 'Transactional Dispatch',
    metric: '200M msgs/mo',
    region: 'US-West',
  },
  {
    id: 'cloudflare',
    name: 'Cloudflare Workers',
    category: 'devtools',
    role: 'Zero-Trust Isolation',
    metric: '300+ Cities',
    region: 'Global',
  },
  {
    id: 'planetscale',
    name: 'PlanetScale DB',
    category: 'enterprise',
    role: 'Branching Schema',
    metric: 'Zero Downtime',
    region: 'EU-Central',
  },
  {
    id: 'brex',
    name: 'Brex Treasury',
    category: 'fintech',
    role: 'Ledger Reconciliation',
    metric: 'Real-time API',
    region: 'US-East',
  },
]

type CategoryFilter = 'all' | 'devtools' | 'fintech' | 'enterprise'

export interface LogoTickerInfiniteProps {
  className?: string
}

export function LogoTickerInfinite({ className }: LogoTickerInfiniteProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<CategoryFilter>('all')
  const [isPaused, setIsPaused] = React.useState(false)
  const [isFastSpeed, setIsFastSpeed] = React.useState(false)
  const [hoveredBrand, setHoveredBrand] = React.useState<BrandPartner | null>(null)

  const filteredPartners = React.useMemo(() => {
    if (selectedCategory === 'all') return partners
    return partners.filter((p) => p.category === selectedCategory)
  }, [selectedCategory])

  return (
    <section
      data-slot="logo-ticker-infinite"
      className={cn(
        'border-border/80 bg-muted/20 relative overflow-hidden border-y px-4 py-14 sm:px-6 sm:py-20 lg:px-8',
        className,
      )}
    >
      <div className="mx-auto max-w-7xl space-y-8 text-center">
        {/* Section Header & Category Filter Controls */}
        <div className="border-border/60 flex flex-col items-center justify-between gap-4 border-b pb-6 text-left md:flex-row">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              <p className="text-foreground font-mono text-xs font-semibold tracking-wider uppercase">
                Production Verified Infrastructure
              </p>
            </div>
            <p className="text-muted-foreground text-xs">
              Trusted by mission-critical platforms powering over $4.2B+ in annual transaction velocity.
            </p>
          </div>

          {/* Filter & Control Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter Pills */}
            <div className="bg-background border-border flex items-center gap-1 rounded-lg border p-0.5">
              {(['all', 'devtools', 'fintech', 'enterprise'] as CategoryFilter[]).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={cn(
                    'rounded-md px-2.5 py-1 font-mono text-xs capitalize transition-all',
                    selectedCategory === cat
                      ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Marquee Speed / Pause Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="border-border bg-background text-muted-foreground hover:text-foreground rounded-lg border p-1.5 transition-colors"
                title={isPaused ? 'Resume Ticker' : 'Pause Ticker'}
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? <Play className="size-3.5 fill-current" /> : <Pause className="size-3.5" />}
              </button>
              <button
                type="button"
                className="border-border bg-background text-muted-foreground hover:text-foreground rounded-lg border px-2 py-1 font-mono text-xs transition-colors"
                onClick={() => setIsFastSpeed(!isFastSpeed)}
              >
                {isFastSpeed ? '2x' : '1x'}
              </button>
            </div>
          </div>
        </div>

        {/* Infinite Marquee Track Viewport with Gradient Fade Edges */}
        <div className="group relative overflow-hidden">
          {/* Left & Right Gradient Shadows */}
          <div className="from-background via-background/80 pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r to-transparent sm:w-28" />
          <div className="from-background via-background/80 pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l to-transparent sm:w-28" />

          {/* Double Track Container for Seamless Infinite Scrolling */}
          <div
            className={cn(
              'flex w-max items-center gap-4 py-3',
              !isPaused && 'animate-marquee',
              isFastSpeed ? '[animation-duration:15s]' : '[animation-duration:32s]',
            )}
            style={{
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          >
            {/* Repeat partners array twice for infinite seamless loop */}
            {[...filteredPartners, ...filteredPartners].map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="border-border bg-card/80 hover:bg-card hover:border-primary/50 relative flex shrink-0 cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 shadow-xs backdrop-blur-md transition-all duration-200"
                onMouseEnter={() => setHoveredBrand(item)}
                onMouseLeave={() => setHoveredBrand(null)}
              >
                <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-lg font-mono text-xs font-bold">
                  {item.name.charAt(0)}
                </div>

                <div className="text-left">
                  <p className="text-foreground font-mono text-xs font-semibold tracking-tight">{item.name}</p>
                  <p className="text-muted-foreground text-xs">{item.role}</p>
                </div>

                <Badge
                  variant="outline"
                  className="ml-1 border-emerald-500/20 bg-emerald-500/10 font-mono text-xs text-emerald-600 dark:text-emerald-400"
                >
                  {item.metric}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Live Hover Telemetry Card */}
        {hoveredBrand && (
          <div className="border-border bg-card animate-in fade-in-0 mx-auto max-w-md rounded-xl border p-3 text-left shadow-lg duration-150">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-foreground font-bold">{hoveredBrand.name} Architecture Integration</span>
              <span className="text-emerald-500">{hoveredBrand.region}</span>
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              Connected through {hoveredBrand.role} &bull; Monitored with {hoveredBrand.metric} verified telemetry.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 32s linear infinite;
        }
      `}</style>
    </section>
  )
}
export default LogoTickerInfinite

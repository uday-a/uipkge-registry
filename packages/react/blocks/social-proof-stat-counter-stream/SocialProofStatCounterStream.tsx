import * as React from 'react'
import { Activity, ArrowRight, Cpu, Globe2, Radio, Server, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface StatItem {
  id: string
  label: string
  currentValue: number
  suffix: string
  description: string
}

export interface RegionLatency {
  city: string
  latencyMs: number
}

export interface SocialProofStatCounterStreamProps {
  title?: string
  description?: string
  className?: string
}

export function SocialProofStatCounterStream({
  title = 'Real-time telemetry stream across global edge infrastructure.',
  description = 'Continuously aggregated metrics verifying zero-latency invocation throughput and multi-region synchronization.',
  className,
}: SocialProofStatCounterStreamProps) {
  const [invocations, setInvocations] = React.useState(48291040)
  const [activeClones, setActiveClones] = React.useState(128450)
  const [parityPercentage, setParityPercentage] = React.useState(100)
  const [edgeRegionsCount, setEdgeRegionsCount] = React.useState(36)

  const [latencies, setLatencies] = React.useState<RegionLatency[]>([
    { city: 'San Jose (SJC)', latencyMs: 8 },
    { city: 'Frankfurt (FRA)', latencyMs: 11 },
    { city: 'Tokyo (NRT)', latencyMs: 9 },
    { city: 'Singapore (SIN)', latencyMs: 12 },
    { city: 'London (LHR)', latencyMs: 10 },
    { city: 'Sydney (SYD)', latencyMs: 14 },
  ])

  React.useEffect(() => {
    const tickerInterval = setInterval(() => {
      setInvocations((prev) => prev + Math.floor(Math.random() * 12) + 3)
      setLatencies((prev) => {
        const next = [...prev]
        const randomIdx = Math.floor(Math.random() * next.length)
        const current = next[randomIdx].latencyMs
        const delta = Math.random() > 0.5 ? 1 : -1
        next[randomIdx] = {
          ...next[randomIdx],
          latencyMs: Math.max(5, Math.min(22, current + delta)),
        }
        return next
      })
    }, 1200)

    return () => clearInterval(tickerInterval)
  }, [])

  return (
    <section
      data-slot="social-proof-stat-counter-stream"
      className={cn('bg-background relative overflow-hidden py-16 sm:py-24', className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <a
            href="#telemetry-stream"
            className="group border-border/80 bg-secondary/60 hover:bg-secondary text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium shadow-2xs transition-colors"
          >
            <Radio className="text-primary size-3.5 animate-pulse" />
            <span>Live Infrastructure Telemetry</span>
            <ArrowRight className="text-muted-foreground size-3 transition-transform group-hover:translate-x-0.5" />
          </a>

          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>

          <p className="text-muted-foreground text-base sm:text-lg">{description}</p>
        </div>

        {/* KPI Stat Counter Grid */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Stat Card 1 */}
          <Card className="border-border bg-card shadow-xs">
            <CardContent className="space-y-2 p-6">
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span className="font-medium">Total Edge Invocations</span>
                <Activity className="text-primary size-4" />
              </div>
              <div className="text-foreground font-mono text-3xl font-bold tracking-tight">
                {invocations.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 text-xs font-medium text-emerald-500">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                <span>Streaming live</span>
              </div>
            </CardContent>
          </Card>

          {/* Stat Card 2 */}
          <Card className="border-border bg-card shadow-xs">
            <CardContent className="space-y-2 p-6">
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span className="font-medium">Direct Registry Pulls</span>
                <Cpu className="text-primary size-4" />
              </div>
              <div className="text-foreground font-mono text-3xl font-bold tracking-tight">
                {activeClones.toLocaleString()}+
              </div>
              <div className="text-muted-foreground text-xs">Across shadcn & shadcn-vue</div>
            </CardContent>
          </Card>

          {/* Stat Card 3 */}
          <Card className="border-border bg-card shadow-xs">
            <CardContent className="space-y-2 p-6">
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span className="font-medium">Dual-Framework Parity</span>
                <Sparkles className="size-4 text-emerald-500" />
              </div>
              <div className="text-foreground font-mono text-3xl font-bold tracking-tight">{parityPercentage}%</div>
              <div className="text-xs font-medium text-emerald-500">1:1 Vue & React token sync</div>
            </CardContent>
          </Card>

          {/* Stat Card 4 */}
          <Card className="border-border bg-card shadow-xs">
            <CardContent className="space-y-2 p-6">
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span className="font-medium">Global Edge Locations</span>
                <Globe2 className="text-primary size-4" />
              </div>
              <div className="text-foreground font-mono text-3xl font-bold tracking-tight">{edgeRegionsCount} PoPs</div>
              <div className="text-muted-foreground text-xs">Anycast routed worldwide</div>
            </CardContent>
          </Card>
        </div>

        {/* Regional Latency Live Ticker Band */}
        <div className="border-border bg-muted/30 mt-8 rounded-xl border p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
              <Server className="text-primary size-4" />
              <span>Real-time Global Edge Round-Trip Latency</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {latencies.map((reg) => (
                <div
                  key={reg.city}
                  className="border-border bg-background inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-xs"
                >
                  <span className="text-muted-foreground">{reg.city}:</span>
                  <span className="font-bold text-emerald-500">{reg.latencyMs}ms</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

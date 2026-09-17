import * as React from 'react'
import { Activity, ArrowRight, CheckCircle2, Cpu, Globe, ShieldCheck, Sparkles, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface GrowthStage {
  id: string
  name: string
  stageLabel: string
  mrrRange: string
  description: string
  users: string
  qps: string
  nodes: number
  sla: string
  features: string[]
}

export interface FeatureMetricGrowthStepperProps {
  title?: string
  description?: string
  stages?: GrowthStage[]
  className?: string
}

const DEFAULT_STAGES: GrowthStage[] = [
  {
    id: 'seed',
    name: 'Seed & Validation',
    stageLabel: 'Stage 01',
    mrrRange: '$0 – $10k / mo',
    description:
      'Instant zero-dependency UI primitives copied directly into your repository. Zero lock-in, zero build overhead.',
    users: '1k – 25k MAU',
    qps: '500 req/s',
    nodes: 3,
    sla: '99.9% Best Effort',
    features: [
      'Unbundled component source ownership',
      'Tailwind v4 theme variables',
      'Single-command CLI installation',
    ],
  },
  {
    id: 'series-a',
    name: 'Series A Product-Market Fit',
    stageLabel: 'Stage 02',
    mrrRange: '$10k – $100k / mo',
    description: 'Scale complex dashboards and interactive blocks with full Reka UI/Radix headless accessibility.',
    users: '25k – 250k MAU',
    qps: '4,500 req/s',
    nodes: 12,
    sla: '99.95% Standard SLA',
    features: [
      'Complex KPI grids & interactive charts',
      'RBAC permission workspace switchers',
      'Dual-framework Astro preview integration',
    ],
  },
  {
    id: 'scale',
    name: 'Hypergrowth Expansion',
    stageLabel: 'Stage 03',
    mrrRange: '$100k – $1M / mo',
    description:
      'High-throughput global edge deployment with sub-millisecond component compilation and dedicated design system sync.',
    users: '250k – 2.5M MAU',
    qps: '35,000 req/s',
    nodes: 48,
    sla: '99.99% High Availability',
    features: [
      'Global edge caching mesh',
      'Automated cross-framework AST parity tests',
      'Custom token preset distribution',
    ],
  },
  {
    id: 'enterprise',
    name: 'Global Enterprise Scale',
    stageLabel: 'Stage 04',
    mrrRange: '$1M+ / mo',
    description:
      'Mission-critical resilience with multi-region failover, custom compliance SLAs, and dedicated design engineering support.',
    users: '10M+ MAU',
    qps: '250,000 req/s',
    nodes: 310,
    sla: '99.999% Fault Tolerant',
    features: [
      'SOC2 & HIPAA compliant architecture',
      'Sub-10ms global TTFB guarantees',
      '24/7 dedicated incident commander',
    ],
  },
]

export function FeatureMetricGrowthStepper({
  title = 'Scale your frontend architecture directly as your traffic expands.',
  description = 'From single-developer seed prototypes to global multi-region enterprise platforms, unbundled components adapt to your infrastructure requirements.',
  stages = DEFAULT_STAGES,
  className,
}: FeatureMetricGrowthStepperProps) {
  const [selectedStageId, setSelectedStageId] = React.useState('seed')

  const currentStage = React.useMemo(() => {
    return stages.find((s) => s.id === selectedStageId) || stages[0]
  }, [stages, selectedStageId])

  return (
    <section
      data-slot="feature-metric-growth-stepper"
      className={cn('bg-background relative overflow-hidden py-16 sm:py-24', className)}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <a
            href="#growth-scale"
            className="group border-border/80 bg-secondary/60 hover:bg-secondary text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium shadow-2xs transition-colors"
          >
            <Sparkles className="text-primary size-3.5" />
            <span>Scale-Ready Architecture Stepper</span>
            <ArrowRight className="text-muted-foreground size-3 transition-transform group-hover:translate-x-0.5" />
          </a>

          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>

          <p className="text-muted-foreground text-base sm:text-lg">{description}</p>
        </div>

        {/* Stepper Milestone Bar */}
        <div className="mt-12">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stages.map((stage) => (
              <button
                key={stage.id}
                type="button"
                className={cn(
                  'group relative flex flex-col items-start rounded-xl border p-4 text-left transition-all',
                  selectedStageId === stage.id
                    ? 'border-primary bg-primary/5 ring-primary/20 shadow-xs ring-1'
                    : 'border-border bg-card/60 hover:bg-muted/40 text-muted-foreground hover:text-foreground',
                )}
                onClick={() => setSelectedStageId(stage.id)}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-muted-foreground font-mono text-xs font-semibold tracking-wider uppercase">
                    {stage.stageLabel}
                  </span>
                  <span
                    className={cn(
                      'size-2 rounded-full transition-colors',
                      selectedStageId === stage.id ? 'bg-primary animate-pulse' : 'bg-muted-foreground/30',
                    )}
                  />
                </div>

                <div className="text-foreground mt-2 text-sm font-bold">{stage.name}</div>
                <div className="text-muted-foreground mt-1 font-mono text-xs">{stage.mrrRange}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Active Stage Deep-Dive Workbench */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left: Stage Description & Architecture Capabilities (7 Cols) */}
          <Card className="border-border bg-card/80 shadow-xs backdrop-blur-xs lg:col-span-7">
            <CardContent className="space-y-6 p-6">
              <div className="border-border flex items-center justify-between border-b pb-4">
                <div className="space-y-0.5">
                  <Badge variant="outline" className="text-primary border-primary/30 bg-primary/10 font-mono text-xs">
                    {currentStage.stageLabel} &bull; {currentStage.name}
                  </Badge>
                  <div className="text-foreground pt-1 text-xl font-bold tracking-tight">Architecture Capacity</div>
                </div>
                <div className="text-right">
                  <div className="text-muted-foreground text-xs">Target Growth Band</div>
                  <div className="text-foreground font-mono text-sm font-bold">{currentStage.mrrRange}</div>
                </div>
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed">{currentStage.description}</p>

              {/* Technical Checklist */}
              <div className="space-y-2.5">
                <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Verified Infrastructure Benchmarks
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {currentStage.features.map((feature, fIdx) => (
                    <div
                      key={fIdx}
                      className="border-border/80 bg-muted/20 text-foreground flex items-center gap-2.5 rounded-lg border p-2.5 text-xs"
                    >
                      <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right: Infrastructure Load Telemetry (5 Cols) */}
          <Card className="border-border bg-card/80 flex flex-col justify-between shadow-xs backdrop-blur-xs lg:col-span-5">
            <CardContent className="space-y-6 p-6">
              <div className="border-border flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Cpu className="text-primary size-4" />
                  <span className="text-foreground text-sm font-semibold">Infrastructure Profile</span>
                </div>
                <Badge variant="outline" className="border-border font-mono text-xs text-emerald-500">
                  {currentStage.sla}
                </Badge>
              </div>

              {/* Telemetry Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border-border bg-background space-y-1 rounded-lg border p-3">
                  <div className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Activity className="size-3 text-emerald-500" />
                    <span>Monthly Active Users</span>
                  </div>
                  <div className="text-foreground font-mono text-base font-bold">{currentStage.users}</div>
                </div>

                <div className="border-border bg-background space-y-1 rounded-lg border p-3">
                  <div className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Zap className="text-primary size-3" />
                    <span>Throughput (QPS)</span>
                  </div>
                  <div className="text-foreground font-mono text-base font-bold">{currentStage.qps}</div>
                </div>

                <div className="border-border bg-background space-y-1 rounded-lg border p-3">
                  <div className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Globe className="size-3 text-sky-500" />
                    <span>Edge PoP Nodes</span>
                  </div>
                  <div className="text-foreground font-mono text-base font-bold">{currentStage.nodes} PoPs</div>
                </div>

                <div className="border-border bg-background space-y-1 rounded-lg border p-3">
                  <div className="text-muted-foreground flex items-center gap-1 text-xs">
                    <ShieldCheck className="size-3 text-emerald-500" />
                    <span>Uptime Guarantee</span>
                  </div>
                  <div className="text-foreground font-mono text-base font-bold">{currentStage.sla.split(' ')[0]}</div>
                </div>
              </div>

              <Button className="w-full gap-2 shadow-xs" variant="outline">
                <span>View Infrastructure Blueprint</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

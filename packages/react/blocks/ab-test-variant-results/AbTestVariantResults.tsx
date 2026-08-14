'use client'

import * as React from 'react'
import {
  Activity,
  CheckCheck,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Pause,
  Play,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Trophy,
  Truck,
  Users,
  Zap,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export interface AbTestVariantResultsProps {
  title?: string
  experimentId?: string
  duration?: string
  className?: string
}

const primaryMetrics = [
  {
    id: 'conversion-lift',
    label: 'Overall Conversion Lift',
    value: '+24.8%',
    unit: 'relative',
    badge: '+1.27% Absolute',
    badgeVariant: 'success' as const,
    badgeIcon: TrendingUp,
    description: 'Challenger (6.41%) vs Baseline Control (5.14%)',
    highlight: true,
  },
  {
    id: 'sample-size',
    label: 'Total Sample Size',
    value: '48,290',
    unit: 'unique visitors',
    badge: '50 / 50 Split',
    badgeVariant: 'secondary' as const,
    badgeIcon: Users,
    description: '24,145 unique visitors per variant group',
    highlight: false,
  },
  {
    id: 'statistical-confidence',
    label: 'Statistical Confidence',
    value: '99.2%',
    unit: 'confidence',
    badge: 'p = 0.008',
    badgeVariant: 'outline' as const,
    badgeIcon: Activity,
    description: 'Exceeds 95.0% significance threshold (α = 0.05)',
    highlight: false,
  },
  {
    id: 'revenue-impact',
    label: 'Est. Annual Revenue Impact',
    value: '+$142,000',
    unit: 'ARR',
    badge: '+$1.08 / visitor',
    badgeVariant: 'success' as const,
    badgeIcon: DollarSign,
    description: 'Based on 131,500 annual checkouts ($5.28 vs $4.20 RPV)',
    highlight: true,
  },
]

const variants = [
  {
    id: 'variant-a',
    code: 'Variant A',
    type: 'Control',
    title: 'Multi-Step Wizard',
    description: '3-step segmented checkout flow with separate shipping, billing, and review steps.',
    split: '50%',
    visitors: '24,145',
    conversions: '1,240',
    conversionLabel: '1,240 checkouts',
    conversionRate: '5.14%',
    rateBadge: 'Baseline',
    rateBadgeVariant: 'secondary' as const,
    revenuePerVisitor: '$4.20',
    totalRevenue: '$101,409.00',
    verdict: 'Baseline Control Group',
    verdictVariant: 'outline' as const,
    isWinner: false,
  },
  {
    id: 'variant-b',
    code: 'Variant B',
    type: 'Challenger',
    title: 'Single-Page with Accordion',
    description: 'Unified single-page layout with collapsible accordion sections and sticky order summary.',
    split: '50%',
    visitors: '24,145',
    conversions: '1,548',
    conversionLabel: '1,548 checkouts (+308)',
    conversionRate: '6.41%',
    rateBadge: '+24.8% relative lift',
    rateBadgeVariant: 'success' as const,
    revenuePerVisitor: '$5.28',
    revenueDelta: '+$1.08 / visitor',
    totalRevenue: '$127,485.60',
    verdict: 'Winner · 99.2% probability to beat control',
    verdictVariant: 'success' as const,
    isWinner: true,
  },
]

const funnelSteps = [
  {
    id: 'step-1',
    stepNumber: '01',
    name: 'Cart Review',
    description: 'Initial checkout landing and cart items validation',
    icon: ShoppingCart,
    control: {
      count: '24,145',
      rate: '100.0%',
      progress: 100,
      retention: '100% of traffic',
    },
    challenger: {
      count: '24,145',
      rate: '100.0%',
      progress: 100,
      retention: '100% of traffic',
    },
    delta: '0.0%',
    isPositive: null,
    insight: 'Uniform 50/50 randomized traffic partition without sample ratio bias.',
  },
  {
    id: 'step-2',
    stepNumber: '02',
    name: 'Shipping Address',
    description: 'Delivery destination selection & shipping method',
    icon: Truck,
    control: {
      count: '18,350',
      rate: '76.0%',
      progress: 76,
      retention: '76.0% retained',
    },
    challenger: {
      count: '20,523',
      rate: '85.0%',
      progress: 85,
      retention: '85.0% retained',
    },
    delta: '+11.8% stage lift',
    isPositive: true,
    insight: 'Auto-fill and inline address validation lowered initial drop-off by 9.0 percentage points.',
  },
  {
    id: 'step-3',
    stepNumber: '03',
    name: 'Payment Details',
    description: 'Credit card input, digital wallet, or invoice terms',
    icon: CreditCard,
    control: {
      count: '8,450',
      rate: '35.0%',
      progress: 35,
      retention: '46.0% retained',
    },
    challenger: {
      count: '11,831',
      rate: '49.0%',
      progress: 49,
      retention: '57.6% retained',
    },
    delta: '+40.0% stage lift',
    isPositive: true,
    insight: 'Accordion structure preserved visible cart totals, reducing payment abandonment substantially.',
  },
  {
    id: 'step-4',
    stepNumber: '04',
    name: 'Checkout Completed',
    description: 'Payment authorized & order confirmation rendered',
    icon: CheckCheck,
    control: {
      count: '1,240',
      rate: '5.14%',
      progress: 5.14,
      retention: '14.7% of payment step',
    },
    challenger: {
      count: '1,548',
      rate: '6.41%',
      progress: 6.41,
      retention: '13.1% of payment step',
    },
    delta: '+24.8% final lift',
    isPositive: true,
    insight: 'Yielded 308 net incremental checkouts with statistical significance (p = 0.008).',
  },
]

const guardrails = [
  {
    id: 'srm',
    title: 'Sample Ratio Mismatch (SRM)',
    status: 'Passed',
    badgeVariant: 'success' as const,
    value: 'p = 0.982',
    description: 'Chi-square goodness of fit verifies balanced 50.0% / 50.0% traffic delivery.',
    icon: ShieldCheck,
  },
  {
    id: 'mde',
    title: 'Minimum Detectable Effect',
    status: 'Achieved',
    badgeVariant: 'success' as const,
    value: 'Observed +24.8% vs MDE 5.0%',
    description: 'Statistical power exceeds 99% for primary conversion rate metric.',
    icon: Zap,
  },
  {
    id: 'perf',
    title: 'Performance Guardrail',
    status: 'Healthy',
    badgeVariant: 'secondary' as const,
    value: '1.1s vs 1.3s LCP',
    description: 'Single-page architecture improved largest contentful paint by 180ms.',
    icon: Clock,
  },
]

export function AbTestVariantResults({
  title = 'Checkout Flow: Multi-Step vs Single-Page',
  experimentId = 'EXP-1082',
  duration = 'Running for 14 days · 48,290 visitors',
  className,
}: AbTestVariantResultsProps) {
  const [isPaused, setIsPaused] = React.useState(false)
  const [isWinnerDeclared, setIsWinnerDeclared] = React.useState(false)

  const handleDeclareWinner = () => {
    setIsWinnerDeclared(true)
    setIsPaused(true)
  }

  const togglePause = () => {
    setIsPaused((prev) => !prev)
  }

  return (
    <div data-uipkge="" data-slot="ab-test-variant-results" className={cn('w-full space-y-6', className)}>
      {/* Winner Rollout Banner (if declared) */}
      {isWinnerDeclared && (
        <div className="flex flex-col items-start justify-between gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-900 shadow-xs sm:flex-row sm:items-center dark:text-emerald-100">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-emerald-500 text-white shadow-xs">
              <Trophy className="size-4" aria-hidden="true" />
            </div>
            <div className="space-y-0.5">
              <p className="text-foreground text-sm font-semibold">Variant B (Single-Page Accordion) Declared Winner</p>
              <p className="text-muted-foreground text-xs">
                100% traffic rollout initiated. Estimated annual revenue increase of +$142,000 ARR in effect.
              </p>
            </div>
          </div>
          <Badge variant="success" className="font-semibold">
            100% Traffic Live
          </Badge>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
            <Badge variant="outline" className="font-mono text-xs">
              {experimentId}
            </Badge>
            <Badge
              variant="success"
              className="gap-1.5 border-emerald-500/20 bg-emerald-500/10 font-medium text-emerald-600 dark:text-emerald-400"
            >
              <Sparkles className="size-3" aria-hidden="true" />
              <span>Statistically Significant · 99.2% Confidence</span>
            </Badge>
            {isPaused && (
              <Badge variant="secondary" className="gap-1 font-medium">
                <Pause className="size-3" aria-hidden="true" />
                <span>Paused</span>
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-xs leading-relaxed sm:text-sm">
            {duration} · Primary Goal: <span className="text-foreground font-medium">Completed Checkout Rate</span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button size="sm" variant="outline" className="gap-1.5 shadow-xs" onClick={togglePause}>
            {isPaused ? (
              <Play className="size-3.5" aria-hidden="true" />
            ) : (
              <Pause className="size-3.5" aria-hidden="true" />
            )}
            <span>{isPaused ? 'Resume Test' : 'Pause Test'}</span>
          </Button>
          <Button
            size="sm"
            variant="default"
            disabled={isWinnerDeclared}
            className="gap-1.5 shadow-xs"
            onClick={handleDeclareWinner}
          >
            <Trophy className="size-3.5" aria-hidden="true" />
            <span>{isWinnerDeclared ? 'Winner Rolled Out 100%' : 'Declare Winner & Roll Out 100%'}</span>
          </Button>
        </div>
      </div>

      {/* 4 Primary Experiment Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {primaryMetrics.map((metric) => {
          const BadgeIcon = metric.badgeIcon
          return (
            <Card
              key={metric.id}
              className={cn(
                'border-border bg-card hover:border-border/80 shadow-xs transition-colors',
                metric.highlight && 'border-emerald-500/30 bg-emerald-500/[0.02] dark:bg-emerald-950/[0.1]',
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                    {metric.label}
                  </CardTitle>
                  <Badge variant={metric.badgeVariant} className="gap-1 font-medium tabular-nums">
                    <BadgeIcon className="size-3" aria-hidden="true" />
                    <span>{metric.badge}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-1.5 pb-4">
                <div className="flex items-baseline gap-1.5">
                  <span
                    className={cn(
                      'text-2xl font-bold tracking-tight tabular-nums sm:text-3xl',
                      metric.highlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground',
                    )}
                  >
                    {metric.value}
                  </span>
                  {metric.unit && <span className="text-muted-foreground text-xs font-normal">{metric.unit}</span>}
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">{metric.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Variants Comparison Table Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-foreground text-base font-semibold">
                  Variants Comparison &amp; Statistical Significance
                </CardTitle>
                <Badge variant="outline" className="font-mono text-xs">
                  Statsig / Optimizely Model
                </Badge>
              </div>
              <CardDescription className="mt-1 text-xs">
                Frequentist two-tailed Z-test with continuous monitoring and sample ratio correction.
              </CardDescription>
            </div>
            <div className="border-border/80 bg-muted/30 flex items-center gap-2 self-start rounded-lg border px-3 py-1.5 text-xs sm:self-auto">
              <span className="text-muted-foreground">Significance Alpha:</span>
              <span className="text-foreground font-mono font-semibold tabular-nums">α = 0.05</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-foreground text-xs font-semibold">Variant &amp; Layout</TableHead>
                  <TableHead className="text-foreground text-xs font-semibold">Traffic Split</TableHead>
                  <TableHead className="text-foreground text-right text-xs font-semibold">Conversions</TableHead>
                  <TableHead className="text-foreground text-right text-xs font-semibold">Conversion Rate</TableHead>
                  <TableHead className="text-foreground text-right text-xs font-semibold">Revenue / Visitor</TableHead>
                  <TableHead className="text-foreground text-right text-xs font-semibold">
                    Statistical Verdict
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variants.map((variant) => (
                  <TableRow
                    key={variant.id}
                    className={cn(
                      'border-border transition-colors',
                      variant.isWinner
                        ? 'bg-emerald-500/[0.04] hover:bg-emerald-500/[0.08] dark:bg-emerald-500/[0.07]'
                        : 'hover:bg-muted/30',
                    )}
                  >
                    {/* Variant Name & Description */}
                    <TableCell className="py-4">
                      <div className="flex items-start gap-2.5">
                        <div
                          className={cn(
                            'flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-bold shadow-xs',
                            variant.isWinner
                              ? 'bg-emerald-500 text-white'
                              : 'border-border bg-muted text-muted-foreground border',
                          )}
                        >
                          {variant.code === 'Variant A' ? 'A' : 'B'}
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-foreground text-sm font-semibold">{variant.code}</span>
                            <Badge variant={variant.isWinner ? 'success' : 'secondary'} className="text-xs font-medium">
                              {variant.type}
                            </Badge>
                          </div>
                          <p className="text-foreground text-xs font-medium">{variant.title}</p>
                          <p className="text-muted-foreground text-xs">{variant.description}</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Traffic Split */}
                    <TableCell className="py-4 align-middle">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-foreground text-sm font-semibold tabular-nums">{variant.split}</span>
                          <span className="text-muted-foreground text-xs">allocation</span>
                        </div>
                        <p className="text-muted-foreground text-xs tabular-nums">{variant.visitors} visitors</p>
                      </div>
                    </TableCell>

                    {/* Conversions */}
                    <TableCell className="py-4 text-right align-middle">
                      <div className="space-y-0.5">
                        <span className="text-foreground text-sm font-bold tabular-nums">{variant.conversions}</span>
                        <p className="text-muted-foreground text-xs">completed checkouts</p>
                      </div>
                    </TableCell>

                    {/* Conversion Rate */}
                    <TableCell className="py-4 text-right align-middle">
                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={cn(
                            'text-sm font-bold tabular-nums',
                            variant.isWinner ? 'text-base text-emerald-600 dark:text-emerald-400' : 'text-foreground',
                          )}
                        >
                          {variant.conversionRate}
                        </span>
                        <Badge variant={variant.rateBadgeVariant} className="gap-1 text-xs font-medium tabular-nums">
                          {variant.isWinner && <TrendingUp className="size-3" aria-hidden="true" />}
                          <span>{variant.rateBadge}</span>
                        </Badge>
                      </div>
                    </TableCell>

                    {/* Revenue per Visitor */}
                    <TableCell className="py-4 text-right align-middle">
                      <div className="space-y-0.5">
                        <span
                          className={cn(
                            'text-sm font-bold tabular-nums',
                            variant.isWinner ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground',
                          )}
                        >
                          {variant.revenuePerVisitor}
                        </span>
                        {variant.revenueDelta ? (
                          <p className="text-xs font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                            {variant.revenueDelta}
                          </p>
                        ) : (
                          <p className="text-muted-foreground text-xs tabular-nums">{variant.totalRevenue}</p>
                        )}
                      </div>
                    </TableCell>

                    {/* Statistical Verdict */}
                    <TableCell className="py-4 text-right align-middle">
                      <div className="flex flex-col items-end gap-1">
                        <Badge
                          variant={variant.verdictVariant}
                          className={cn(
                            'gap-1.5 py-1 text-xs font-semibold tabular-nums',
                            variant.isWinner &&
                              'border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
                          )}
                        >
                          {variant.isWinner ? (
                            <Trophy className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                          ) : (
                            <CheckCircle2 className="text-muted-foreground size-3.5" aria-hidden="true" />
                          )}
                          <span>{variant.verdict}</span>
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Funnel Step Drop-off Comparison Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-foreground text-base font-semibold">
                  Conversion Funnel Step Drop-off Comparison
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  4-Stage Funnel
                </Badge>
              </div>
              <CardDescription className="mt-1 text-xs">
                Direct comparison of drop-off, progression, and conversion retention between Control and Challenger at
                each step.
              </CardDescription>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="border-border bg-muted-foreground/30 size-3 rounded-xs border" />
                <span className="text-muted-foreground">Variant A (Control)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-3 rounded-xs bg-emerald-500" />
                <span className="text-foreground font-medium">Variant B (Challenger)</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {funnelSteps.map((step) => {
              const StepIcon = step.icon
              return (
                <div
                  key={step.id}
                  className="border-border bg-card/60 hover:bg-muted/10 rounded-lg border p-4 shadow-xs transition-colors"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    {/* Step Meta */}
                    <div className="flex items-start gap-3 lg:w-1/3">
                      <div className="border-border bg-muted/50 text-foreground flex size-9 shrink-0 items-center justify-center rounded-md border shadow-xs">
                        <StepIcon className="size-4" aria-hidden="true" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground font-mono text-xs font-bold">
                            STEP {step.stepNumber}
                          </span>
                          <span className="text-foreground text-sm font-semibold">{step.name}</span>
                        </div>
                        <p className="text-muted-foreground text-xs">{step.description}</p>
                      </div>
                    </div>

                    {/* Comparative Bars */}
                    <div className="space-y-2 lg:w-1/2">
                      {/* Variant A (Control) Bar */}
                      <div className="space-y-1">
                        <div className="text-muted-foreground flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5">
                            <span className="text-foreground font-medium">Control:</span>
                            <span className="tabular-nums">{step.control.count} visitors</span>
                          </span>
                          <span className="font-mono font-medium tabular-nums">{step.control.rate}</span>
                        </div>
                        <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                          <div
                            className="bg-muted-foreground/40 h-full rounded-full transition-all duration-300"
                            style={{ width: `${step.control.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Variant B (Challenger) Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="flex items-center gap-1.5">
                            <span className="text-foreground font-medium">Challenger:</span>
                            <span className="text-foreground font-semibold tabular-nums">
                              {step.challenger.count} visitors
                            </span>
                          </span>
                          <span className="font-mono font-bold text-emerald-600 tabular-nums dark:text-emerald-400">
                            {step.challenger.rate}
                          </span>
                        </div>
                        <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                          <div
                            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                            style={{ width: `${step.challenger.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Step Lift Badge & Insight */}
                    <div className="flex flex-col items-start gap-1 lg:w-1/6 lg:items-end">
                      <Badge
                        variant={step.isPositive ? 'success' : 'secondary'}
                        className={cn(
                          'gap-1 text-xs font-semibold tabular-nums',
                          step.isPositive &&
                            'border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
                        )}
                      >
                        {step.isPositive && <TrendingUp className="size-3" aria-hidden="true" />}
                        <span>{step.delta}</span>
                      </Badge>
                      <span className="text-muted-foreground text-left text-xs tabular-nums lg:text-right">
                        {step.challenger.retention}
                      </span>
                    </div>
                  </div>

                  {/* Bottom micro insight */}
                  <div className="border-border/60 bg-muted/20 text-muted-foreground mt-3 flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs">
                    <span className="text-foreground shrink-0 font-medium">Stage Note:</span>
                    <span className="leading-relaxed">{step.insight}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Guardrails & Quality Verification Footer */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <CardTitle className="text-foreground text-base font-semibold">
              Statistical Guardrails &amp; Health Checks
            </CardTitle>
            <Badge variant="outline" className="font-mono text-xs">
              Integrity Verified
            </Badge>
          </div>
          <CardDescription className="text-xs">
            Automatic telemetry assertions verifying sample validity, statistical power, and site performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {guardrails.map((guard) => {
              const GuardIcon = guard.icon
              return (
                <div
                  key={guard.id}
                  className="border-border bg-card/60 hover:bg-muted/10 flex flex-col justify-between rounded-lg border p-4 shadow-xs transition-all"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="border-border bg-muted/50 text-foreground flex size-8 items-center justify-center rounded-md border shadow-xs">
                        <GuardIcon className="size-4" aria-hidden="true" />
                      </div>
                      <Badge variant={guard.badgeVariant} className="text-xs font-medium">
                        {guard.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-foreground text-sm font-semibold">{guard.title}</h4>
                      <p className="font-mono text-xs font-semibold text-emerald-600 tabular-nums dark:text-emerald-400">
                        {guard.value}
                      </p>
                      <p className="text-muted-foreground text-xs leading-relaxed">{guard.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AbTestVariantResults

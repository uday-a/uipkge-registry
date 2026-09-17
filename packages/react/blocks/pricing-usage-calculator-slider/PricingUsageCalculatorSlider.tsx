'use client'

import * as React from 'react'
import { ArrowRight, Calculator, Globe, Server, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface PricingUsageCalculatorSliderProps {
  className?: string
}

export function PricingUsageCalculatorSlider({ className }: PricingUsageCalculatorSliderProps) {
  const [mau, setMau] = React.useState(100000)
  const [qps, setQps] = React.useState(500)
  const [edgeReplicas, setEdgeReplicas] = React.useState(3)

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(0) + 'k'
    return num.toString()
  }

  const applyPreset = (preset: 'seed' | 'growth' | 'scale') => {
    if (preset === 'seed') {
      setMau(25000)
      setQps(150)
      setEdgeReplicas(2)
    } else if (preset === 'growth') {
      setMau(350000)
      setQps(2500)
      setEdgeReplicas(5)
    } else {
      setMau(2500000)
      setQps(12000)
      setEdgeReplicas(10)
    }
  }

  const traditionalCost = React.useMemo(() => {
    const baseSeatFee = 350
    const perUserFee = (mau / 1000) * 1.8
    const qpsSurcharge = qps * 0.25
    return Math.round(baseSeatFee + perUserFee + qpsSurcharge)
  }, [mau, qps])

  const uipkgeCost = React.useMemo(() => {
    const rawBandwidth = (mau / 100000) * 4
    const flatProLicense = 24
    return Math.round(flatProLicense + rawBandwidth)
  }, [mau])

  const monthlySavings = Math.max(0, traditionalCost - uipkgeCost)
  const annualSavings = monthlySavings * 12

  return (
    <section
      data-slot="pricing-usage-calculator-slider"
      className={cn('bg-background relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8', className)}
    >
      <div className="mx-auto max-w-6xl space-y-12">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <Badge variant="secondary" className="gap-1.5 px-3 py-1 font-mono text-xs shadow-xs">
            <Calculator className="text-primary size-3.5" />
            Interactive Infrastructure ROI Calculator
          </Badge>
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
            Calculate your annual savings with unbundled architecture.
          </h2>
          <p className="text-muted-foreground text-base">
            See how eliminating proprietary seat licenses and runtime SaaS wrappers cuts your front-end TCO.
          </p>

          {/* Presets Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <Button size="sm" variant="outline" className="font-mono text-xs" onClick={() => applyPreset('seed')}>
              Seed Startup (25k MAU)
            </Button>
            <Button size="sm" variant="outline" className="font-mono text-xs" onClick={() => applyPreset('growth')}>
              Growth Scale (350k MAU)
            </Button>
            <Button size="sm" variant="outline" className="font-mono text-xs" onClick={() => applyPreset('scale')}>
              Hypergrowth (2.5M MAU)
            </Button>
          </div>
        </div>

        {/* 2-Column Split: Sliders Workbench Left (7 Cols), Savings Scorecard Right (5 Cols) */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          {/* Sliders Controls (7 Cols) */}
          <Card className="border-border bg-card/95 flex flex-col justify-between space-y-6 rounded-2xl p-6 text-left shadow-xl sm:p-8 lg:col-span-7">
            <div className="space-y-6">
              <div className="border-border flex items-center justify-between border-b pb-4">
                <h3 className="text-foreground font-mono text-sm font-bold">Traffic &amp; Telemetry Inputs</h3>
                <span className="text-muted-foreground font-mono text-xs">Dynamic Projection</span>
              </div>

              {/* Slider 1: MAU */}
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Users className="text-primary size-3.5" /> Monthly Active Users (MAU)
                  </span>
                  <span className="text-foreground text-sm font-bold">{formatNumber(mau)} users</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="5000000"
                  step="25000"
                  value={mau}
                  onChange={(e) => setMau(Number(e.target.value))}
                  className="accent-primary bg-border h-2 w-full cursor-pointer rounded-lg"
                />
              </div>

              {/* Slider 2: QPS */}
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Server className="text-primary size-3.5" /> Peak Query Throughput
                  </span>
                  <span className="text-foreground text-sm font-bold">{formatNumber(qps)} QPS</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="20000"
                  step="100"
                  value={qps}
                  onChange={(e) => setQps(Number(e.target.value))}
                  className="accent-primary bg-border h-2 w-full cursor-pointer rounded-lg"
                />
              </div>

              {/* Slider 3: Global Replicas */}
              <div className="space-y-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Globe className="text-primary size-3.5" /> Global Edge POP Replicas
                  </span>
                  <span className="text-foreground text-sm font-bold">{edgeReplicas} Edge Regions</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={edgeReplicas}
                  onChange={(e) => setEdgeReplicas(Number(e.target.value))}
                  className="accent-primary bg-border h-2 w-full cursor-pointer rounded-lg"
                />
              </div>
            </div>

            <div className="border-border text-muted-foreground flex items-center justify-between border-t pt-4 font-mono text-xs">
              <span>Formula: Direct AST + Raw Static Hosting</span>
              <span className="font-semibold text-emerald-500">&check; Zero Seat Surcharges</span>
            </div>
          </Card>

          {/* ROI Cost & Savings Projection Card (5 Cols) */}
          <Card className="border-border bg-card/95 flex flex-col justify-between space-y-6 rounded-2xl p-6 text-left shadow-sm sm:p-8 lg:col-span-5">
            <div className="space-y-6">
              <Badge
                variant="outline"
                className="border-emerald-500/20 bg-emerald-500/10 font-mono text-xs text-emerald-600 dark:text-emerald-400"
              >
                Projected Annual Net Savings
              </Badge>

              {/* Big Stat Display */}
              <div className="space-y-1">
                <div className="font-mono text-4xl font-bold tracking-tight text-emerald-500 sm:text-5xl">
                  ${annualSavings.toLocaleString()}
                </div>
                <p className="text-muted-foreground font-mono text-xs">
                  Saved every year (${monthlySavings.toLocaleString()}/month)
                </p>
              </div>

              {/* Comparative Cost Bars */}
              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="text-destructive font-medium">Traditional Monolith Stack:</span>
                    <span className="text-foreground font-bold">${traditionalCost.toLocaleString()}/mo</span>
                  </div>
                  <div className="bg-destructive/20 h-2 overflow-hidden rounded-full">
                    <div className="bg-destructive h-full w-full" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-semibold text-emerald-500">UIPKGE Unbundled Registry:</span>
                    <span className="text-foreground font-bold">${uipkgeCost.toLocaleString()}/mo</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-emerald-500/20">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${Math.max(5, (uipkgeCost / traditionalCost) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button className="mt-4 h-10 w-full gap-1.5 font-mono text-xs shadow-md">
              <span>Lock In Pro Savings</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Card>
        </div>
      </div>
    </section>
  )
}
export default PricingUsageCalculatorSlider

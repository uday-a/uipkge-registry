<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowRight, CheckCircle2, Play, ShieldCheck, Sparkles, TrendingUp } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

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

const activeTimeframe = ref<Timeframe>('live')
const activeMetric = computed(() => metricsByTimeframe[activeTimeframe.value])

const chartSvgPath = computed(() => {
  const points = activeMetric.value.chartPoints
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
})

const chartAreaPath = computed(() => {
  return `${chartSvgPath.value} L 500 120 L 0 120 Z`
})
</script>

<template>
  <section
    data-slot="hero-saas-metrics-dashboard"
    class="bg-background relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
  >
    <!-- Radial Glow Background -->
    <div
      class="bg-primary/10 pointer-events-none absolute top-0 left-1/2 -z-10 h-80 w-full max-w-6xl -translate-x-1/2 rounded-full blur-xl"
    />

    <div class="mx-auto max-w-6xl space-y-12 text-center">
      <!-- Header Copy -->
      <div class="mx-auto max-w-3xl space-y-5">
        <Badge variant="secondary" class="gap-1.5 px-3 py-1 font-mono text-xs shadow-xs">
          <Sparkles class="text-primary size-3.5" />
          Enterprise Revenue & Event Intelligence
        </Badge>

        <h1 class="text-foreground text-4xl leading-[1.12] font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Real-time telemetry for modern engineering teams.
        </h1>

        <p class="text-muted-foreground text-base leading-relaxed sm:text-lg">
          Monitor revenue acceleration, API transaction throughput, and compute workloads with sub-millisecond
          precision.
        </p>

        <!-- CTA Action Buttons -->
        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button as="a" href="#start" size="lg" class="gap-2 font-semibold shadow-xs">
            <span>Start Free Sandbox</span>
            <ArrowRight class="size-4" />
          </Button>

          <Button as="a" href="#demo" variant="outline" size="lg" class="gap-2 font-medium">
            <Play class="size-3.5 fill-current" />
            <span>Interactive Demo</span>
          </Button>
        </div>

        <div class="text-muted-foreground flex items-center justify-center gap-6 pt-2 font-mono text-xs">
          <span class="inline-flex items-center gap-1.5">
            <ShieldCheck class="size-4 text-emerald-500" /> SOC2 Type II Certified
          </span>
          <span class="inline-flex items-center gap-1.5">
            <CheckCircle2 class="text-primary size-4" /> 99.999% SLA Uptime
          </span>
        </div>
      </div>

      <!-- Interactive SaaS Dashboard Preview Card -->
      <div class="relative mx-auto max-w-5xl">
        <Card class="border-border bg-card/95 overflow-hidden rounded-2xl text-left shadow-sm backdrop-blur-md">
          <!-- Mock Window Top Bar -->
          <div class="border-border bg-muted/40 flex items-center justify-between border-b px-4 py-3">
            <div class="flex items-center gap-3">
              <div class="flex gap-1.5">
                <div class="size-3 rounded-full bg-red-500/80" />
                <div class="size-3 rounded-full bg-amber-500/80" />
                <div class="size-3 rounded-full bg-emerald-500/80" />
              </div>
              <span class="text-foreground font-mono text-xs font-medium">console.uipkge.dev/production</span>
            </div>

            <!-- Timeframe Filter Tabs -->
            <div class="bg-background border-border flex items-center gap-1 rounded-lg border p-0.5">
              <button
                v-for="tf in ['live', '24h', '7d', '30d'] as Timeframe[]"
                :key="tf"
                type="button"
                class="rounded-md px-2.5 py-1 font-mono text-xs uppercase transition-all"
                :class="
                  activeTimeframe === tf
                    ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                "
                @click="activeTimeframe = tf"
              >
                {{ tf }}
              </button>
            </div>
          </div>

          <!-- Dashboard Metric Cards Grid -->
          <div class="space-y-6 p-6 sm:p-8">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <!-- MRR Card -->
              <div class="border-border bg-background/50 space-y-1 rounded-xl border p-4">
                <div class="text-muted-foreground flex items-center justify-between text-xs">
                  <span class="font-mono">Recurring Revenue</span>
                  <Badge
                    variant="outline"
                    class="border-emerald-500/20 bg-emerald-500/10 font-mono text-xs text-emerald-600 dark:text-emerald-400"
                  >
                    {{ activeMetric.growth }}
                  </Badge>
                </div>
                <p class="text-foreground font-mono text-2xl font-bold">{{ activeMetric.mrr }}</p>
                <p class="text-muted-foreground text-xs">Calculated across active subscriptions</p>
              </div>

              <!-- Active Workloads Card -->
              <div class="border-border bg-background/50 space-y-1 rounded-xl border p-4">
                <div class="text-muted-foreground flex items-center justify-between text-xs">
                  <span class="font-mono">Active Nodes & Pods</span>
                  <span class="size-2 rounded-full bg-emerald-500" />
                </div>
                <p class="text-foreground font-mono text-2xl font-bold">{{ activeMetric.activeUsers }}</p>
                <p class="text-muted-foreground text-xs">Distributed across 8 global regions</p>
              </div>

              <!-- Request Throughput Card -->
              <div class="border-border bg-background/50 space-y-1 rounded-xl border p-4">
                <div class="text-muted-foreground flex items-center justify-between text-xs">
                  <span class="font-mono">Throughput</span>
                  <TrendingUp class="text-primary size-3.5" />
                </div>
                <p class="text-foreground font-mono text-2xl font-bold">{{ activeMetric.requests }}</p>
                <p class="text-muted-foreground text-xs">Edge cached queries & websocket streams</p>
              </div>
            </div>

            <!-- Interactive Area Trend Chart -->
            <div class="border-border bg-background/30 space-y-3 rounded-xl border p-5">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-muted-foreground font-mono text-xs uppercase">Transaction Velocity & Event Stream</p>
                  <p class="text-foreground text-sm font-semibold">Global Ingestion Rate</p>
                </div>
                <span class="font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400"
                  >99.998% Success</span
                >
              </div>

              <!-- SVG Area Chart -->
              <div class="relative h-28 w-full overflow-hidden">
                <svg class="h-full w-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.35" />
                      <stop offset="100%" stop-color="var(--primary)" stop-opacity="0.0" />
                    </linearGradient>
                  </defs>
                  <!-- Gradient Area -->
                  <path :d="chartAreaPath" fill="url(#chartGlow)" />
                  <!-- Stroke Line -->
                  <path
                    :d="chartSvgPath"
                    fill="none"
                    stroke="var(--primary)"
                    stroke-width="2.5"
                    stroke-linecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </section>
</template>

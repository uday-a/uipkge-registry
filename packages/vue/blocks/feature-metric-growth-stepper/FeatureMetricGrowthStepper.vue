<script setup lang="ts">
import { computed, ref } from 'vue'
import { Activity, ArrowRight, CheckCircle2, Cpu, Globe, ShieldCheck, Sparkles, Zap } from 'lucide-vue-next'
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
  class?: string
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

const props = withDefaults(defineProps<FeatureMetricGrowthStepperProps>(), {
  title: 'Scale your frontend architecture directly as your traffic expands.',
  description:
    'From single-developer seed prototypes to global multi-region enterprise platforms, unbundled components adapt to your infrastructure requirements.',
})

const activeStages = computed(() => props.stages ?? DEFAULT_STAGES)
const selectedStageId = ref('seed')

const activeStageIndex = computed(() => {
  return activeStages.value.findIndex((s) => s.id === selectedStageId.value)
})

const currentStage = computed<GrowthStage>(() => {
  return activeStages.value.find((s) => s.id === selectedStageId.value) || activeStages.value[0]
})
</script>

<template>
  <section
    data-slot="feature-metric-growth-stepper"
    :class="cn('bg-background relative overflow-hidden py-16 sm:py-24', props.class)"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl space-y-4 text-center">
        <a
          href="#growth-scale"
          class="group border-border/80 bg-secondary/60 hover:bg-secondary text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium shadow-2xs transition-colors"
        >
          <Sparkles class="text-primary size-3.5" />
          <span>Scale-Ready Architecture Stepper</span>
          <ArrowRight class="text-muted-foreground size-3 transition-transform group-hover:translate-x-0.5" />
        </a>

        <h2 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          {{ title }}
        </h2>

        <p class="text-muted-foreground text-base sm:text-lg">
          {{ description }}
        </p>
      </div>

      <!-- Stepper Milestone Bar -->
      <div class="mt-12">
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <button
            v-for="(stage, idx) in activeStages"
            :key="stage.id"
            type="button"
            :class="
              cn(
                'group relative flex flex-col items-start rounded-xl border p-4 text-left transition-all',
                selectedStageId === stage.id
                  ? 'border-primary bg-primary/5 ring-primary/20 shadow-xs ring-1'
                  : 'border-border bg-card/60 hover:bg-muted/40 text-muted-foreground hover:text-foreground',
              )
            "
            @click="selectedStageId = stage.id"
          >
            <div class="flex w-full items-center justify-between">
              <span class="text-muted-foreground font-mono text-xs font-semibold tracking-wider uppercase">
                {{ stage.stageLabel }}
              </span>
              <span
                :class="
                  cn(
                    'size-2 rounded-full transition-colors',
                    selectedStageId === stage.id ? 'bg-primary animate-pulse' : 'bg-muted-foreground/30',
                  )
                "
              />
            </div>

            <div class="text-foreground mt-2 text-sm font-bold">{{ stage.name }}</div>
            <div class="text-muted-foreground mt-1 font-mono text-xs">{{ stage.mrrRange }}</div>
          </button>
        </div>
      </div>

      <!-- Active Stage Deep-Dive Workbench -->
      <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <!-- Left: Stage Description & Architecture Capabilities (7 Cols) -->
        <Card class="border-border bg-card/80 shadow-xs backdrop-blur-xs lg:col-span-7">
          <CardContent class="space-y-6 p-6">
            <div class="border-border flex items-center justify-between border-b pb-4">
              <div class="space-y-0.5">
                <Badge variant="outline" class="text-primary border-primary/30 bg-primary/10 font-mono text-xs">
                  {{ currentStage.stageLabel }} &bull; {{ currentStage.name }}
                </Badge>
                <div class="text-foreground pt-1 text-xl font-bold tracking-tight">Architecture Capacity</div>
              </div>
              <div class="text-right">
                <div class="text-muted-foreground text-xs">Target Growth Band</div>
                <div class="text-foreground font-mono text-sm font-bold">{{ currentStage.mrrRange }}</div>
              </div>
            </div>

            <p class="text-muted-foreground text-sm leading-relaxed">
              {{ currentStage.description }}
            </p>

            <!-- Technical Checklist -->
            <div class="space-y-2.5">
              <div class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Verified Infrastructure Benchmarks
              </div>
              <div class="grid grid-cols-1 gap-2">
                <div
                  v-for="(feature, fIdx) in currentStage.features"
                  :key="fIdx"
                  class="border-border/80 bg-muted/20 text-foreground flex items-center gap-2.5 rounded-lg border p-2.5 text-xs"
                >
                  <CheckCircle2 class="size-4 shrink-0 text-emerald-500" />
                  <span>{{ feature }}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Right: Infrastructure Load Telemetry (5 Cols) -->
        <Card class="border-border bg-card/80 flex flex-col justify-between shadow-xs backdrop-blur-xs lg:col-span-5">
          <CardContent class="space-y-6 p-6">
            <div class="border-border flex items-center justify-between border-b pb-3">
              <div class="flex items-center gap-2">
                <Cpu class="text-primary size-4" />
                <span class="text-foreground text-sm font-semibold">Infrastructure Profile</span>
              </div>
              <Badge variant="outline" class="border-border font-mono text-xs text-emerald-500">
                {{ currentStage.sla }}
              </Badge>
            </div>

            <!-- Telemetry Metrics Grid -->
            <div class="grid grid-cols-2 gap-3">
              <div class="border-border bg-background space-y-1 rounded-lg border p-3">
                <div class="text-muted-foreground flex items-center gap-1 text-xs">
                  <Activity class="size-3 text-emerald-500" />
                  <span>Monthly Active Users</span>
                </div>
                <div class="text-foreground font-mono text-base font-bold">{{ currentStage.users }}</div>
              </div>

              <div class="border-border bg-background space-y-1 rounded-lg border p-3">
                <div class="text-muted-foreground flex items-center gap-1 text-xs">
                  <Zap class="text-primary size-3" />
                  <span>Throughput (QPS)</span>
                </div>
                <div class="text-foreground font-mono text-base font-bold">{{ currentStage.qps }}</div>
              </div>

              <div class="border-border bg-background space-y-1 rounded-lg border p-3">
                <div class="text-muted-foreground flex items-center gap-1 text-xs">
                  <Globe class="size-3 text-sky-500" />
                  <span>Edge PoP Nodes</span>
                </div>
                <div class="text-foreground font-mono text-base font-bold">{{ currentStage.nodes }} PoPs</div>
              </div>

              <div class="border-border bg-background space-y-1 rounded-lg border p-3">
                <div class="text-muted-foreground flex items-center gap-1 text-xs">
                  <ShieldCheck class="size-3 text-emerald-500" />
                  <span>Uptime Guarantee</span>
                </div>
                <div class="text-foreground font-mono text-base font-bold">{{ currentStage.sla.split(' ')[0] }}</div>
              </div>
            </div>

            <Button class="w-full gap-2 shadow-xs" variant="outline">
              <span>View Infrastructure Blueprint</span>
              <ArrowRight class="size-3.5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { Activity, ArrowRight, Cpu, Globe2, Radio, Server, Sparkles } from 'lucide-vue-next'
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
  class?: string
}

const props = withDefaults(defineProps<SocialProofStatCounterStreamProps>(), {
  title: 'Real-time telemetry stream across global edge infrastructure.',
  description:
    'Continuously aggregated metrics verifying zero-latency invocation throughput and multi-region synchronization.',
})

const invocations = ref(48291040)
const activeClones = ref(128450)
const parityPercentage = ref(100)
const edgeRegionsCount = ref(36)

const latencies = ref<RegionLatency[]>([
  { city: 'San Jose (SJC)', latencyMs: 8 },
  { city: 'Frankfurt (FRA)', latencyMs: 11 },
  { city: 'Tokyo (NRT)', latencyMs: 9 },
  { city: 'Singapore (SIN)', latencyMs: 12 },
  { city: 'London (LHR)', latencyMs: 10 },
  { city: 'Sydney (SYD)', latencyMs: 14 },
])

let tickerInterval: any = null

onMounted(() => {
  tickerInterval = setInterval(() => {
    invocations.value += Math.floor(Math.random() * 12) + 3
    // Jitter latencies +/- 1ms
    const randomIdx = Math.floor(Math.random() * latencies.value.length)
    const current = latencies.value[randomIdx].latencyMs
    const delta = Math.random() > 0.5 ? 1 : -1
    latencies.value[randomIdx].latencyMs = Math.max(5, Math.min(22, current + delta))
  }, 1200)
})

onUnmounted(() => {
  if (tickerInterval) clearInterval(tickerInterval)
})
</script>

<template>
  <section
    data-slot="social-proof-stat-counter-stream"
    :class="cn('bg-background relative overflow-hidden py-16 sm:py-24', props.class)"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="mx-auto max-w-3xl space-y-4 text-center">
        <a
          href="#telemetry-stream"
          class="group border-border/80 bg-secondary/60 hover:bg-secondary text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-medium shadow-2xs transition-colors"
        >
          <Radio class="text-primary size-3.5 animate-pulse" />
          <span>Live Infrastructure Telemetry</span>
          <ArrowRight class="text-muted-foreground size-3 transition-transform group-hover:translate-x-0.5" />
        </a>

        <h2 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
          {{ title }}
        </h2>

        <p class="text-muted-foreground text-base sm:text-lg">
          {{ description }}
        </p>
      </div>

      <!-- KPI Stat Counter Grid -->
      <div class="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Stat Card 1 -->
        <Card class="border-border bg-card shadow-xs">
          <CardContent class="space-y-2 p-6">
            <div class="text-muted-foreground flex items-center justify-between text-xs">
              <span class="font-medium">Total Edge Invocations</span>
              <Activity class="text-primary size-4" />
            </div>
            <div class="text-foreground font-mono text-3xl font-bold tracking-tight">
              {{ invocations.toLocaleString() }}
            </div>
            <div class="flex items-center gap-1 text-xs font-medium text-emerald-500">
              <span class="size-1.5 rounded-full bg-emerald-500" />
              <span>Streaming live</span>
            </div>
          </CardContent>
        </Card>

        <!-- Stat Card 2 -->
        <Card class="border-border bg-card shadow-xs">
          <CardContent class="space-y-2 p-6">
            <div class="text-muted-foreground flex items-center justify-between text-xs">
              <span class="font-medium">Direct Registry Pulls</span>
              <Cpu class="text-primary size-4" />
            </div>
            <div class="text-foreground font-mono text-3xl font-bold tracking-tight">
              {{ activeClones.toLocaleString() }}+
            </div>
            <div class="text-muted-foreground text-xs">Across shadcn & shadcn-vue</div>
          </CardContent>
        </Card>

        <!-- Stat Card 3 -->
        <Card class="border-border bg-card shadow-xs">
          <CardContent class="space-y-2 p-6">
            <div class="text-muted-foreground flex items-center justify-between text-xs">
              <span class="font-medium">Dual-Framework Parity</span>
              <Sparkles class="size-4 text-emerald-500" />
            </div>
            <div class="text-foreground font-mono text-3xl font-bold tracking-tight">{{ parityPercentage }}%</div>
            <div class="text-xs font-medium text-emerald-500">1:1 Vue & React token sync</div>
          </CardContent>
        </Card>

        <!-- Stat Card 4 -->
        <Card class="border-border bg-card shadow-xs">
          <CardContent class="space-y-2 p-6">
            <div class="text-muted-foreground flex items-center justify-between text-xs">
              <span class="font-medium">Global Edge Locations</span>
              <Globe2 class="text-primary size-4" />
            </div>
            <div class="text-foreground font-mono text-3xl font-bold tracking-tight">{{ edgeRegionsCount }} PoPs</div>
            <div class="text-muted-foreground text-xs">Anycast routed worldwide</div>
          </CardContent>
        </Card>
      </div>

      <!-- Regional Latency Live Ticker Band -->
      <div class="border-border bg-muted/30 mt-8 rounded-xl border p-4">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="text-muted-foreground flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
            <Server class="text-primary size-4" />
            <span>Real-time Global Edge Round-Trip Latency</span>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <div
              v-for="reg in latencies"
              :key="reg.city"
              class="border-border bg-background inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-xs"
            >
              <span class="text-muted-foreground">{{ reg.city }}:</span>
              <span class="font-bold text-emerald-500">{{ reg.latencyMs }}ms</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

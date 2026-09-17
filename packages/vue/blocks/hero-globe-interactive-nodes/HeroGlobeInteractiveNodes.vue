<script setup lang="ts">
import { computed, ref } from 'vue'
import { Activity, ArrowRight, Check, Copy, Globe, Radio, Server, ShieldCheck, Terminal, Zap } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface EdgeNode {
  id: string
  name: string
  region: string
  country: string
  city: string
  latencyMs: number
  p99LatencyMs: number
  cacheHitRatio: number
  qps: number
  status: 'optimal' | 'operational' | 'degraded'
  coordinates: { x: number; y: number }
}

export interface HeroGlobeInteractiveNodesProps {
  title?: string
  description?: string
  cliCommand?: string
  nodes?: EdgeNode[]
  class?: string
}

const DEFAULT_NODES: EdgeNode[] = [
  {
    id: 'node-iad',
    name: 'iad-1',
    region: 'us-east-1',
    country: 'United States',
    city: 'Washington, D.C.',
    latencyMs: 8,
    p99LatencyMs: 14,
    cacheHitRatio: 99.4,
    qps: 18450,
    status: 'optimal',
    coordinates: { x: 28, y: 38 },
  },
  {
    id: 'node-sfo',
    name: 'sfo-1',
    region: 'us-west-1',
    country: 'United States',
    city: 'San Francisco',
    latencyMs: 12,
    p99LatencyMs: 22,
    cacheHitRatio: 99.1,
    qps: 14200,
    status: 'optimal',
    coordinates: { x: 18, y: 40 },
  },
  {
    id: 'node-fra',
    name: 'fra-1',
    region: 'eu-central-1',
    country: 'Germany',
    city: 'Frankfurt',
    latencyMs: 15,
    p99LatencyMs: 27,
    cacheHitRatio: 98.9,
    qps: 21300,
    status: 'optimal',
    coordinates: { x: 52, y: 32 },
  },
  {
    id: 'node-sin',
    name: 'sin-1',
    region: 'ap-southeast-1',
    country: 'Singapore',
    city: 'Singapore',
    latencyMs: 24,
    p99LatencyMs: 41,
    cacheHitRatio: 98.6,
    qps: 16800,
    status: 'optimal',
    coordinates: { x: 76, y: 58 },
  },
  {
    id: 'node-nrt',
    name: 'nrt-1',
    region: 'ap-northeast-1',
    country: 'Japan',
    city: 'Tokyo',
    latencyMs: 19,
    p99LatencyMs: 34,
    cacheHitRatio: 99.2,
    qps: 19400,
    status: 'optimal',
    coordinates: { x: 84, y: 42 },
  },
  {
    id: 'node-syd',
    name: 'syd-1',
    region: 'ap-southeast-2',
    country: 'Australia',
    city: 'Sydney',
    latencyMs: 32,
    p99LatencyMs: 52,
    cacheHitRatio: 98.2,
    qps: 9800,
    status: 'optimal',
    coordinates: { x: 88, y: 78 },
  },
  {
    id: 'node-gru',
    name: 'gru-1',
    region: 'sa-east-1',
    country: 'Brazil',
    city: 'São Paulo',
    latencyMs: 44,
    p99LatencyMs: 68,
    cacheHitRatio: 97.9,
    qps: 7600,
    status: 'optimal',
    coordinates: { x: 36, y: 74 },
  },
  {
    id: 'node-lhr',
    name: 'lhr-1',
    region: 'eu-west-2',
    country: 'United Kingdom',
    city: 'London',
    latencyMs: 11,
    p99LatencyMs: 20,
    cacheHitRatio: 99.5,
    qps: 24600,
    status: 'optimal',
    coordinates: { x: 48, y: 30 },
  },
]

const props = withDefaults(defineProps<HeroGlobeInteractiveNodesProps>(), {
  title: 'Sub-millisecond UI edge delivery across 310+ PoPs globally.',
  description:
    'Compile unbundled Vue 3.5 and React 19 components with instant edge caching. Zero cold starts, deterministic tree-shaking, and hardware-accelerated telemetry.',
  cliCommand: 'npx shadcn-vue add @uipkge/init',
})

const activeNodes = computed(() => props.nodes ?? DEFAULT_NODES)
const selectedNodeId = ref<string>('node-iad')
const copied = ref(false)

const selectedNode = computed<EdgeNode>(() => {
  return activeNodes.value.find((n) => n.id === selectedNodeId.value) || activeNodes.value[0]
})

const avgGlobalLatency = computed(() => {
  if (!activeNodes.value.length) return 0
  const sum = activeNodes.value.reduce((acc, curr) => acc + curr.latencyMs, 0)
  return Math.round(sum / activeNodes.value.length)
})

const totalGlobalQps = computed(() => {
  return activeNodes.value.reduce((acc, curr) => acc + curr.qps, 0).toLocaleString()
})

async function copyCommand() {
  try {
    await navigator.clipboard.writeText(props.cliCommand)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    // clipboard fallback
  }
}
</script>

<template>
  <section
    data-slot="hero-globe-interactive-nodes"
    :class="cn('bg-background relative overflow-hidden py-16 sm:py-24 lg:py-28', props.class)"
  >
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
        <!-- Left: Copy & Actions (6 Cols) -->
        <div class="space-y-6 lg:col-span-6">
          <div
            class="border-primary/20 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium shadow-2xs"
          >
            <Radio class="text-primary size-3.5 animate-pulse" />
            <span>Global Edge CDN Mesh Active &bull; 310+ PoPs</span>
          </div>

          <h1 class="text-foreground text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {{ title }}
          </h1>

          <p class="text-muted-foreground text-base sm:text-lg">
            {{ description }}
          </p>

          <!-- CLI Command Sandbox -->
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div
              class="border-border bg-muted/60 text-foreground flex items-center justify-between rounded-lg border px-3 py-2 font-mono text-xs shadow-2xs sm:w-80"
            >
              <div class="flex items-center gap-2 truncate">
                <Terminal class="text-muted-foreground size-3.5 shrink-0" />
                <span class="truncate">{{ cliCommand }}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                class="text-muted-foreground hover:text-foreground size-7 shrink-0"
                @click="copyCommand"
              >
                <Check v-if="copied" class="text-primary size-3.5" />
                <Copy v-else class="size-3.5" />
              </Button>
            </div>

            <Button size="default" class="gap-1.5 shadow-xs">
              <span>Explore Registry</span>
              <ArrowRight class="size-4" />
            </Button>
          </div>

          <!-- Quick Telemetry Strip -->
          <div class="border-border grid grid-cols-3 gap-4 border-t pt-6">
            <div class="space-y-1">
              <div class="text-muted-foreground text-xs font-medium">Global Avg Ping</div>
              <div class="text-foreground text-xl font-bold tracking-tight">{{ avgGlobalLatency }}ms</div>
              <div class="text-xs font-medium text-emerald-500">&minus;42% vs origin</div>
            </div>
            <div class="space-y-1">
              <div class="text-muted-foreground text-xs font-medium">Network Throughput</div>
              <div class="text-foreground text-xl font-bold tracking-tight">{{ totalGlobalQps }}</div>
              <div class="text-muted-foreground text-xs">req/sec live</div>
            </div>
            <div class="space-y-1">
              <div class="text-muted-foreground text-xs font-medium">Edge Availability</div>
              <div class="text-foreground text-xl font-bold tracking-tight">99.999%</div>
              <div class="text-xs font-medium text-emerald-500">Enterprise SLA</div>
            </div>
          </div>
        </div>

        <!-- Right: Interactive SVG Node Map & Telemetry Workbench (6 Cols) -->
        <div class="space-y-4 lg:col-span-6">
          <Card class="border-border bg-card/80 shadow-sm backdrop-blur-xs">
            <CardContent class="space-y-4 p-4 sm:p-6">
              <!-- Top bar: active node switch -->
              <div class="border-border flex items-center justify-between border-b pb-3">
                <div class="flex items-center gap-2">
                  <Globe class="text-primary size-4" />
                  <span class="text-foreground text-xs font-semibold">Active Edge Inspection</span>
                </div>
                <Badge variant="outline" class="border-border text-muted-foreground font-mono text-xs">
                  {{ selectedNode.city }} ({{ selectedNode.name }})
                </Badge>
              </div>

              <!-- Interactive Node Grid / Map Canvas -->
              <div class="border-border/80 bg-muted/30 relative h-60 w-full overflow-hidden rounded-lg border p-3">
                <!-- SVG Connections Network Layer -->
                <svg class="stroke-border/70 absolute inset-0 size-full" xmlns="http://www.w3.org/2000/svg">
                  <line
                    v-for="(n, idx) in activeNodes.slice(1)"
                    :key="idx"
                    :x1="`${activeNodes[0].coordinates.x}%`"
                    :y1="`${activeNodes[0].coordinates.y}%`"
                    :x2="`${n.coordinates.x}%`"
                    :y2="`${n.coordinates.y}%`"
                    stroke-dasharray="3 3"
                    stroke-width="1"
                  />
                </svg>

                <!-- Interactive Region Nodes -->
                <button
                  v-for="node in activeNodes"
                  :key="node.id"
                  type="button"
                  :style="{ left: `${node.coordinates.x}%`, top: `${node.coordinates.y}%` }"
                  :class="
                    cn(
                      'focus-visible:ring-ring absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-150 focus-visible:ring-2 focus-visible:outline-none',
                      selectedNodeId === node.id
                        ? 'bg-primary text-primary-foreground ring-primary/20 z-10 size-7 scale-110 shadow-sm ring-4'
                        : 'bg-card hover:bg-accent border-border text-foreground size-5 border hover:scale-105',
                    )
                  "
                  @click="selectedNodeId = node.id"
                >
                  <span class="font-mono text-xs leading-none font-bold">
                    {{ selectedNodeId === node.id ? node.name.slice(0, 3).toUpperCase() : '' }}
                  </span>
                  <span v-if="selectedNodeId !== node.id" class="size-2 rounded-full bg-emerald-500" />
                </button>
              </div>

              <!-- Edge Node Telemetry Card -->
              <div class="border-border bg-background grid grid-cols-2 gap-2.5 rounded-lg border p-3 sm:grid-cols-4">
                <div class="space-y-0.5">
                  <div class="text-muted-foreground flex items-center gap-1 text-xs">
                    <Zap class="text-primary size-3" />
                    <span>Ping (p50)</span>
                  </div>
                  <div class="text-foreground font-mono text-sm font-bold">{{ selectedNode.latencyMs }}ms</div>
                </div>

                <div class="space-y-0.5">
                  <div class="text-muted-foreground flex items-center gap-1 text-xs">
                    <Activity class="size-3 text-emerald-500" />
                    <span>Ping (p99)</span>
                  </div>
                  <div class="text-foreground font-mono text-sm font-bold">{{ selectedNode.p99LatencyMs }}ms</div>
                </div>

                <div class="space-y-0.5">
                  <div class="text-muted-foreground flex items-center gap-1 text-xs">
                    <Server class="size-3 text-sky-500" />
                    <span>Cache Hit</span>
                  </div>
                  <div class="text-foreground font-mono text-sm font-bold">{{ selectedNode.cacheHitRatio }}%</div>
                </div>

                <div class="space-y-0.5">
                  <div class="text-muted-foreground flex items-center gap-1 text-xs">
                    <ShieldCheck class="text-primary size-3" />
                    <span>Throughput</span>
                  </div>
                  <div class="text-foreground font-mono text-sm font-bold">
                    {{ selectedNode.qps.toLocaleString() }} qps
                  </div>
                </div>
              </div>

              <!-- Quick Node Pill Selector -->
              <div class="flex flex-wrap gap-1.5 pt-1">
                <button
                  v-for="node in activeNodes"
                  :key="node.id"
                  type="button"
                  :class="
                    cn(
                      'rounded-md border px-2 py-1 font-mono text-xs font-medium transition-colors',
                      selectedNodeId === node.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-accent/50',
                    )
                  "
                  @click="selectedNodeId = node.id"
                >
                  {{ node.name }} &bull; {{ node.city }}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </section>
</template>

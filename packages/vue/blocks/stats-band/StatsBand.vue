<script setup lang="ts">
import { ref } from 'vue'
import { Check, Clock, Copy, Globe, ShieldCheck, Sparkles, TrendingUp, Zap } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  variant?: 'plain' | 'bordered'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'bordered',
})

type Timeframe = 'realtime' | '24h' | '7d' | '30d'

const selectedTimeframe = ref<Timeframe>('realtime')
const activeStatIndex = ref<number | null>(null)
const copied = ref(false)

interface MetricData {
  id: string
  label: string
  subtitle: string
  values: Record<Timeframe, { main: string; change: string; isPositive: boolean; note: string }>
  icon: any
  breakdown: { region: string; val: string; status: string }[]
}

const stats: MetricData[] = [
  {
    id: 'uptime',
    label: 'Platform Availability',
    subtitle: 'Multi-region Active-Active SLA',
    icon: ShieldCheck,
    values: {
      realtime: { main: '100.00%', change: '0 incident in 90d', isPositive: true, note: 'Zero degradation' },
      '24h': { main: '99.999%', change: '+0.001%', isPositive: true, note: '100% healthy' },
      '7d': { main: '99.995%', change: '+0.005%', isPositive: true, note: 'Target > 99.99%' },
      '30d': { main: '99.988%', change: '+0.02%', isPositive: true, note: 'Statutory SLA met' },
    },
    breakdown: [
      { region: 'us-east-1 (N. Virginia)', val: '100.0%', status: 'Operational' },
      { region: 'eu-west-1 (Frankfurt)', val: '100.0%', status: 'Operational' },
      { region: 'ap-southeast-1 (Singapore)', val: '100.0%', status: 'Operational' },
      { region: 'sa-east-1 (São Paulo)', val: '99.99%', status: 'Operational' },
    ],
  },
  {
    id: 'throughput',
    label: 'Component Installs & Pulls',
    subtitle: 'Daily registry resolutions',
    icon: Zap,
    values: {
      realtime: { main: '1.42M', change: '+34.2k / hr', isPositive: true, note: 'Peak throughput' },
      '24h': { main: '3.89M', change: '+22.4% vs prev', isPositive: true, note: '320k unique repos' },
      '7d': { main: '26.4M', change: '+18.8%', isPositive: true, note: '1.4k new teams' },
      '30d': { main: '104.2M', change: '+41.0%', isPositive: true, note: 'Global scale' },
    },
    breakdown: [
      { region: 'Vue 3 / Nuxt 3 Core', val: '58.2%', status: 'Dominant' },
      { region: 'React 19 / Next.js Mirror', val: '41.8%', status: 'Growing' },
      { region: 'Direct CLI Installations', val: '88.4%', status: 'Automated' },
      { region: 'Manual Source Downloads', val: '11.6%', status: 'Direct' },
    ],
  },
  {
    id: 'latency',
    label: 'Global Edge P99 Latency',
    subtitle: 'Cloudflare Workers cache hits',
    icon: Clock,
    values: {
      realtime: { main: '12ms', change: '-4ms reduction', isPositive: true, note: 'Global median: 8ms' },
      '24h': { main: '14ms', change: '-2ms vs baseline', isPositive: true, note: '99.9% cache hit' },
      '7d': { main: '16ms', change: '-12ms optimization', isPositive: true, note: 'Zero edge cold-starts' },
      '30d': { main: '18ms', change: '-24ms', isPositive: true, note: 'V4 pipeline rollout' },
    },
    breakdown: [
      { region: 'North America (Edge)', val: '9ms', status: 'Fastest' },
      { region: 'Europe (Edge)', val: '11ms', status: 'Optimal' },
      { region: 'Asia-Pacific (Edge)', val: '14ms', status: 'Optimal' },
      { region: 'Latin America (Edge)', val: '18ms', status: 'Optimal' },
    ],
  },
  {
    id: 'satisfaction',
    label: 'Enterprise Developer NPS',
    subtitle: 'Surveyed across 450+ companies',
    icon: Sparkles,
    values: {
      realtime: { main: '+78', change: 'Top 1% dev tools', isPositive: true, note: 'Verified feedback' },
      '24h': { main: '4.94 / 5', change: '99.2% positive', isPositive: true, note: 'From 1,240 ratings' },
      '7d': { main: '+76', change: '+4 pts vs qtr', isPositive: true, note: '98% retention' },
      '30d': { main: '+74', change: '+12 pts YoY', isPositive: true, note: 'Industry benchmark' },
    },
    breakdown: [
      { region: 'Code Quality & Typing', val: '99.6%', status: '5 Stars' },
      { region: 'Zero-Lockin Ownership', val: '98.8%', status: '5 Stars' },
      { region: 'Visual Design Aesthetics', val: '99.2%', status: '5 Stars' },
      { region: 'Documentation & Demos', val: '97.4%', status: '4.9 Stars' },
    ],
  },
]

function copyStatsPayload() {
  navigator.clipboard.writeText(JSON.stringify(stats, null, 2))
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <section
    data-slot="stats-band"
    :class="
      cn(
        'bg-card relative w-full overflow-hidden',
        props.variant === 'bordered' ? 'border-border rounded-2xl border shadow-xs' : '',
      )
    "
  >
    <!-- Top Telemetry Header Bar -->
    <div
      class="border-border bg-muted/20 flex flex-col justify-between gap-4 border-b px-6 py-4 sm:flex-row sm:items-center"
    >
      <div class="flex items-center gap-2.5">
        <div class="flex size-2.5 animate-pulse rounded-full bg-emerald-500" />
        <span class="text-foreground font-mono text-xs font-semibold tracking-wider uppercase">
          Real-time Telemetry & Performance Matrix
        </span>
        <Badge
          variant="outline"
          class="hidden border-emerald-500/20 bg-emerald-500/10 font-mono text-xs text-emerald-600 sm:inline-flex dark:text-emerald-400"
        >
          All Systems Operational
        </Badge>
      </div>

      <div class="flex items-center gap-2 self-end sm:self-auto">
        <!-- Timeframe Selectors -->
        <div class="bg-background border-border flex items-center rounded-lg border p-0.5">
          <button
            v-for="tf in [
              { id: 'realtime', label: 'Live P99' },
              { id: '24h', label: '24H' },
              { id: '7d', label: '7D' },
              { id: '30d', label: '30D' },
            ]"
            :key="tf.id"
            type="button"
            class="rounded px-2.5 py-1 font-mono text-xs transition-all"
            :class="
              selectedTimeframe === tf.id
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:text-foreground'
            "
            @click="selectedTimeframe = tf.id as any"
          >
            {{ tf.label }}
          </button>
        </div>

        <Button variant="outline" size="sm" class="h-7 gap-1.5 px-2 font-mono text-xs" @click="copyStatsPayload">
          <Check v-if="copied" class="size-3 text-emerald-500" />
          <Copy v-else class="size-3" />
          <span>{{ copied ? 'Copied' : 'JSON' }}</span>
        </Button>
      </div>
    </div>

    <!-- 4-Column KPI Metric Cards -->
    <div class="divide-border grid grid-cols-1 divide-y sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
      <div
        v-for="(item, idx) in stats"
        :key="item.id"
        class="hover:bg-muted/30 group relative cursor-pointer p-6 transition-colors"
        :class="activeStatIndex === idx ? 'bg-muted/40 ring-primary/30 ring-1 ring-inset' : ''"
        @click="activeStatIndex = activeStatIndex === idx ? null : idx"
      >
        <div class="flex items-start justify-between">
          <p class="text-muted-foreground font-mono text-xs tracking-wider uppercase">{{ item.label }}</p>
          <component :is="item.icon" class="text-muted-foreground group-hover:text-primary size-4 transition-colors" />
        </div>

        <div class="mt-3 flex items-baseline gap-2">
          <span class="text-foreground font-mono text-3xl font-bold tracking-tight">
            {{ item.values[selectedTimeframe].main }}
          </span>
        </div>

        <p class="text-muted-foreground mt-1 line-clamp-1 text-xs">
          {{ item.subtitle }}
        </p>

        <div class="border-border/60 mt-4 flex items-center justify-between border-t pt-3">
          <span
            class="inline-flex items-center gap-1 font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400"
          >
            <TrendingUp class="size-3" />
            {{ item.values[selectedTimeframe].change }}
          </span>
          <span class="text-muted-foreground font-mono text-xs">
            {{ item.values[selectedTimeframe].note }}
          </span>
        </div>
      </div>
    </div>

    <!-- Telemetry Regional Drilldown Drawer when a card is selected -->
    <div v-if="activeStatIndex !== null" class="bg-muted/20 border-border space-y-4 border-t p-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Globe class="text-primary size-4" />
          <span class="text-foreground text-xs font-semibold">
            Regional Telemetry & Infrastructure Breakdown: {{ stats[activeStatIndex].label }}
          </span>
        </div>
        <Button variant="ghost" size="sm" class="h-6 text-xs" @click="activeStatIndex = null"> Close Breakdown </Button>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="sub in stats[activeStatIndex].breakdown"
          :key="sub.region"
          class="border-border bg-background flex items-center justify-between rounded-lg border p-3 shadow-xs"
        >
          <div>
            <p class="text-foreground text-xs font-medium">{{ sub.region }}</p>
            <p class="text-muted-foreground mt-0.5 font-mono text-xs">{{ sub.status }}</p>
          </div>
          <span class="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">{{ sub.val }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

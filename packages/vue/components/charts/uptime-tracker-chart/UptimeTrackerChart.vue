<script setup lang="ts">
import { computed } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

export type DayStatus = 'up' | 'degraded' | 'down' | 'unknown'

export interface StatusDay {
  date: string
  status: DayStatus
}

interface Props {
  days: StatusDay[]
  height?: number | string
  /** Gap between bars in px. Default 2. */
  gap?: number
  /** Bar corner radius in px. Default 2. */
  rounded?: number
  /** Show the legend row with the computed uptime %. Default true. */
  showLegend?: boolean
  class?: HTMLAttributes['class']
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: 48,
  gap: 2,
  rounded: 2,
  showLegend: true,
})

const heightStyle = computed(() => (/^\d+$/.test(String(props.height)) ? `${props.height}px` : String(props.height)))

const COLORS: Record<DayStatus, string> = {
  up: 'var(--chart-2)',
  degraded: 'var(--chart-4)',
  down: 'var(--destructive)',
  unknown: 'var(--border)',
}

const uptime = computed(() => {
  if (!props.days.length) return '—'
  const up = props.days.filter((d) => d.status === 'up').length
  return `${((up / props.days.length) * 100).toFixed(1)}%`
})

const summary = computed(() => {
  const counts = (s: DayStatus) => props.days.filter((d) => d.status === s).length
  return `${counts('up')} up, ${counts('degraded')} degraded, ${counts('down')} down days`
})
</script>

<template>
  <div
    data-slot="uptime-tracker-chart"
    role="img"
    tabindex="0"
    :aria-label="ariaLabel || `Uptime tracker: ${summary}`"
    :class="cn('focus-visible:ring-ring w-full focus-visible:ring-2 focus-visible:outline-none', props.class)"
  >
    <div class="flex min-h-6 items-stretch" :style="{ height: heightStyle, gap: `${gap}px` }">
      <div
        v-for="(d, i) in days"
        :key="`${d.date}-${i}`"
        class="min-w-0 flex-1"
        :style="{ background: COLORS[d.status], borderRadius: `${rounded}px` }"
        :title="`${d.date} — ${d.status}`"
      />
    </div>
    <div v-if="showLegend" class="mt-2 flex items-center gap-3 text-xs">
      <span class="text-foreground font-semibold tabular-nums">{{ uptime }} uptime</span>
      <span class="text-muted-foreground">{{ days.length }} days</span>
      <span class="ml-auto flex items-center gap-2">
        <span class="flex items-center gap-1"
          ><span class="size-2 rounded-[2px]" :style="{ background: COLORS.up }" />Up</span
        >
        <span class="flex items-center gap-1"
          ><span class="size-2 rounded-[2px]" :style="{ background: COLORS.degraded }" />Degraded</span
        >
        <span class="flex items-center gap-1"
          ><span class="size-2 rounded-[2px]" :style="{ background: COLORS.down }" />Down</span
        >
      </span>
    </div>
  </div>
</template>

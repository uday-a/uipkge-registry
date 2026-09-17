<script setup lang="ts">
import { computed } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

export interface DistributionSlice {
  label: string
  /** Share of the whole; auto-normalised when the sum is not 100. */
  percentage: number
  value?: string | number
  color?: string
}

interface Props {
  primaryValue: string | number
  primaryLabel?: string
  trend?: { value: string; direction: 'up' | 'down' }
  categories: DistributionSlice[]
  height?: number | string
  showLegend?: boolean
  colors?: string[]
  class?: HTMLAttributes['class']
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: 220,
  showLegend: true,
  colors: () => ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'],
})

const heightStyle = computed(() => (/^\d+$/.test(String(props.height)) ? `${props.height}px` : String(props.height)))
const total = computed(() => props.categories.reduce((s, c) => s + c.percentage, 0) || 1)
const slices = computed(() =>
  props.categories.map((c, i) => ({
    ...c,
    share: (c.percentage / total.value) * 100,
    color: c.color ?? props.colors[i % props.colors.length]!,
  })),
)
</script>

<template>
  <div
    data-slot="category-distribution-chart"
    :style="{ height: heightStyle }"
    :class="cn('flex w-full flex-col justify-center', props.class)"
  >
    <div class="flex items-baseline gap-2">
      <span class="text-foreground text-3xl font-bold tabular-nums">{{ primaryValue }}</span>
      <span
        v-if="trend"
        class="text-xs font-semibold tabular-nums"
        :style="{ color: trend.direction === 'up' ? 'var(--chart-2)' : '#dc2626' }"
      >
        {{ trend.direction === 'up' ? '+' : '−' }}{{ trend.value }}
      </span>
      <span v-if="primaryLabel" class="text-muted-foreground text-xs">{{ primaryLabel }}</span>
    </div>
    <div class="mt-3 flex h-3 w-full overflow-hidden rounded-full" role="presentation">
      <div
        v-for="s in slices"
        :key="s.label"
        class="h-full"
        :style="{ width: `${s.share}%`, background: s.color }"
        :title="`${s.label} — ${Math.round(s.share)}%`"
      />
    </div>
    <ul v-if="showLegend" class="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
      <li v-for="s in slices" :key="s.label" class="flex min-w-0 items-center gap-2">
        <span class="size-2.5 shrink-0 rounded-[3px]" :style="{ background: s.color }" />
        <span class="text-foreground truncate font-medium">{{ s.label }}</span>
        <span class="text-muted-foreground ml-auto shrink-0 tabular-nums">{{
          s.value ?? `${Math.round(s.share)}%`
        }}</span>
      </li>
    </ul>
  </div>
</template>

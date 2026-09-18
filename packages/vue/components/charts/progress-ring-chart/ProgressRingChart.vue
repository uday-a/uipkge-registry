<script setup lang="ts">
import { computed } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

export interface ProgressRing {
  /** 0..100. */
  value: number
  /** Defaults to chart-1..N tokens. */
  color?: string
  label?: string
}

interface Props {
  rings: ProgressRing[]
  height?: number | string
  /** Ring thickness in SVG units. Default 14. */
  stroke?: number
  /** Show the centre label (first ring value or custom). Default true. */
  showLabel?: boolean
  /** Centre label override. */
  centerLabel?: string
  colors?: string[]
  class?: HTMLAttributes['class']
  /** Accessible name announced for the chart image. Defaults to "Chart". */
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: 220,
  stroke: 14,
  showLabel: true,
  colors: () => ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)'],
})

const heightStyle = computed(() => (/^\d+$/.test(String(props.height)) ? `${props.height}px` : String(props.height)))
const C = 2 * Math.PI * 80
const arcs = computed(() =>
  props.rings.map((r, i) => {
    const pct = Math.max(0, Math.min(100, r.value)) / 100
    return {
      dash: `${(pct * C).toFixed(1)} ${C.toFixed(1)}`,
      color: r.color ?? props.colors[i % props.colors.length],
      r: 80 - i * (props.stroke + 6),
      label: r.label,
      value: r.value,
    }
  }),
)
const view = computed(() => 200 + (props.rings.length - 1) * (props.stroke + 6) * 2)
const center = computed(() => view.value / 2)
const summary = computed(
  () =>
    props.centerLabel ??
    (props.rings.length === 1 ? `${Math.round(props.rings[0]?.value ?? 0)}%` : `${props.rings.length} rings`),
)
</script>

<template>
  <div
    data-slot="progress-ring-chart"
    role="img"
    tabindex="0"
    :aria-label="
      ariaLabel ||
      `Progress ring chart: ${rings.map((r) => `${r.label ?? 'value'} ${Math.round(r.value)}%`).join(', ')}`
    "
    :style="{ height: heightStyle }"
    :class="
      cn(
        'focus-visible:ring-ring flex w-full items-center justify-center focus-visible:ring-2 focus-visible:outline-none',
        props.class,
      )
    "
  >
    <svg :viewBox="`0 0 ${view} ${view}`" class="aspect-square h-full max-h-full" role="presentation">
      <g :transform="`rotate(-90 ${center} ${center})`">
        <circle
          v-for="(a, i) in arcs"
          :key="`t${i}`"
          :cx="center"
          :cy="center"
          :r="a.r"
          fill="none"
          stroke="currentColor"
          :stroke-width="stroke"
          class="text-border"
          opacity="0.35"
        />
        <circle
          v-for="(a, i) in arcs"
          :key="`v${i}`"
          :cx="center"
          :cy="center"
          :r="a.r"
          fill="none"
          :stroke="a.color"
          :stroke-width="stroke"
          stroke-linecap="round"
          :stroke-dasharray="a.dash"
        />
      </g>
      <text
        v-if="showLabel"
        :x="center"
        :y="center"
        text-anchor="middle"
        dominant-baseline="middle"
        class="fill-foreground"
        font-size="26"
        font-weight="700"
      >
        {{ summary }}
      </text>
    </svg>
  </div>
</template>

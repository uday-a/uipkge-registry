<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { cn } from '@/lib/utils'
import { circularProgressVariants } from './circular-progress.variants'

// Inlined union: SFC compiler can't extract runtime props from
// `CircularProgressVariants['size']`.
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    /** Progress value 0-100. Ignored when indeterminate is true. */
    value?: number
    /** Diameter in pixels. */
    size?: 'sm' | 'default' | 'lg' | number
    /** Stroke thickness in pixels. */
    thickness?: number
    /** Progress arc color. Defaults to primary. */
    color?: string
    /** Track (background ring) color. */
    trackColor?: string
    /** Indeterminate spinning mode. */
    indeterminate?: boolean
    /** Show the numeric value in the center. */
    showValue?: boolean
    /** Suffix appended to the value (e.g. '%'). */
    suffix?: string
    /** Accessible label. */
    ariaLabel?: string
  }>(),
  {
    value: 0,
    size: 'default',
    thickness: 8,
    indeterminate: false,
    showValue: false,
    suffix: '%',
    ariaLabel: 'Progress',
  },
)

const sizePx = computed(() => {
  if (typeof props.size === 'number') return props.size
  switch (props.size) {
    case 'sm':
      return 40
    case 'lg':
      return 80
    default:
      return 56
  }
})

const normalizedValue = computed(() => Math.min(100, Math.max(0, props.value)))
const isComplete = computed(() => !props.indeterminate && normalizedValue.value >= 100)

/** One-shot pulse only when value crosses into complete — not on static 100 mounts. */
const pulseComplete = ref(false)
let pulseTimer: ReturnType<typeof setTimeout> | undefined

watch(
  () => [props.indeterminate, normalizedValue.value] as const,
  ([indeterminate, value], prev) => {
    if (indeterminate || value < 100) {
      pulseComplete.value = false
      clearTimeout(pulseTimer)
      return
    }
    const prevValue = prev?.[1]
    if (prevValue === undefined) return
    if (value >= 100 && prevValue < 100) {
      pulseComplete.value = false
      // Retrigger CSS animation if complete→incomplete→complete in quick succession.
      requestAnimationFrame(() => {
        pulseComplete.value = true
        clearTimeout(pulseTimer)
        pulseTimer = setTimeout(() => {
          pulseComplete.value = false
        }, 600)
      })
    }
  },
)

onBeforeUnmount(() => {
  clearTimeout(pulseTimer)
})

const radius = computed(() => (sizePx.value - props.thickness) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const strokeDashoffset = computed(() => {
  if (props.indeterminate) return circumference.value * 0.25
  return circumference.value * (1 - normalizedValue.value / 100)
})

const resolvedColor = computed(() => props.color || 'var(--primary)')
const resolvedTrackColor = computed(() => props.trackColor || 'var(--muted)')

const viewBox = computed(() => `0 0 ${sizePx.value} ${sizePx.value}`)
const center = computed(() => sizePx.value / 2)

const fontSize = computed(() => {
  const s = sizePx.value
  if (s <= 40) return 'text-xs'
  if (s <= 56) return 'text-sm'
  return 'text-base'
})
</script>

<template>
  <div
    data-uipkge
    data-slot="circular-progress"
    :data-size="typeof size === 'string' ? size : 'custom'"
    :data-indeterminate="indeterminate ? 'true' : 'false'"
    :data-complete="isComplete ? 'true' : 'false'"
    :class="cn(circularProgressVariants(), props.class)"
    :style="{ width: `${sizePx}px`, height: `${sizePx}px` }"
    role="progressbar"
    :aria-valuemin="0"
    :aria-valuemax="100"
    :aria-valuenow="indeterminate ? undefined : normalizedValue"
    :aria-busy="indeterminate ? 'true' : undefined"
    :aria-label="ariaLabel"
  >
    <svg :width="sizePx" :height="sizePx" :viewBox="viewBox" class="block">
      <!-- Track -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="resolvedTrackColor"
        :stroke-width="thickness"
      />
      <!-- Progress arc -->
      <g
        :transform="indeterminate ? undefined : `rotate(-90 ${center} ${center})`"
        :class="indeterminate ? 'animate-spin-circular' : ''"
        :style="indeterminate ? { transformBox: 'fill-box', transformOrigin: 'center' } : undefined"
      >
        <circle
          :cx="center"
          :cy="center"
          :r="radius"
          fill="none"
          :stroke="resolvedColor"
          :stroke-width="thickness"
          stroke-linecap="round"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="strokeDashoffset"
          :class="
            cn(
              !indeterminate && 'transition-[stroke-dashoffset] duration-500 ease-out motion-reduce:transition-none',
              pulseComplete && 'animate-circular-complete',
            )
          "
        />
      </g>
    </svg>

    <div v-if="showValue || $slots.default" class="absolute inset-0 flex items-center justify-center">
      <slot :value="normalizedValue">
        <span v-if="showValue" :class="cn('text-foreground font-medium tabular-nums', fontSize)">
          {{ Math.round(normalizedValue) }}{{ suffix }}
        </span>
      </slot>
    </div>
  </div>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .animate-spin-circular {
    animation: spin-circular 1.4s linear infinite;
  }

  /* Soft acknowledge when the arc lands on 100 — one shot per enter. */
  .animate-circular-complete {
    animation: circular-progress-complete 0.55s ease-out 1;
  }
}

@keyframes spin-circular {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes circular-progress-complete {
  0%,
  100% {
    opacity: 1;
  }
  45% {
    opacity: 0.72;
  }
}
</style>

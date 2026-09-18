<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

/**
 * Tweened number display. Counts up on mount, then smoothly retargets
 * from the currently displayed value whenever `value` changes.
 * Server render outputs the final value so hydration always matches.
 */
const props = withDefaults(
  defineProps<{
    value: number
    /** Value the first animation starts from. */
    from?: number
    /** ms per tween. */
    duration?: number
    /** ms before the first tween starts. */
    delay?: number
    format?: (value: number) => string
    /** Render the target value instantly, no tween. */
    disabled?: boolean
    class?: HTMLAttributes['class']
  }>(),
  {
    from: 0,
    duration: 900,
    delay: 0,
    format: undefined,
    disabled: false,
  },
)

const defaultFormat = (v: number) => String(Math.round(v))

const display = ref(props.value)

let raf = 0
let startTimer: number | undefined

function cancel() {
  if (raf) cancelAnimationFrame(raf)
  raf = 0
  if (startTimer !== undefined) {
    clearTimeout(startTimer)
    startTimer = undefined
  }
}

function tweenTo(target: number, animateFrom: number, withDelay: boolean) {
  cancel()
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (props.disabled || reduce) {
    display.value = target
    return
  }
  const startTime = performance.now()
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
  const run = () => {
    const t = Math.min(1, (performance.now() - startTime) / props.duration)
    display.value = animateFrom + (target - animateFrom) * easeOutCubic(t)
    raf = t < 1 ? requestAnimationFrame(run) : 0
  }
  if (withDelay && props.delay > 0) {
    startTimer = window.setTimeout(() => {
      startTimer = undefined
      run()
    }, props.delay)
  } else {
    run()
  }
}

onMounted(() => {
  // First paint showed the final value (SSR-safe); snap to `from`, then animate.
  tweenTo(props.value, props.from, true)
})

watch(
  () => props.value,
  (next) => {
    // Retarget smoothly from whatever is on screen right now.
    tweenTo(next, display.value, false)
  },
)

onBeforeUnmount(cancel)

const formatted = computed(() => (props.format ?? defaultFormat)(display.value))
</script>

<template>
  <span data-uipkge data-slot="animated-number" :class="cn('tabular-nums', props.class)">{{ formatted }}</span>
</template>

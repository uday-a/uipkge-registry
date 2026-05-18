<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

type Format = 'DD:HH:MM:SS' | 'HH:MM:SS' | 'MM:SS' | 'SS'

const props = withDefaults(
  defineProps<{
    /** Target date/time. Accepts a Date, ISO string, or epoch ms number. */
    target: Date | string | number
    /** Display format. Custom tokens: DD days, HH hours, MM minutes, SS seconds. */
    format?: Format | string
    /** Pause the countdown. */
    paused?: boolean
    /** Optional label rendered above the countdown. */
    label?: string
    /** Show leading zeros (e.g. 05 vs 5). */
    pad?: boolean
    /** Separator between units. */
    separator?: string
    class?: HTMLAttributes['class']
  }>(),
  {
    format: 'DD:HH:MM:SS',
    paused: false,
    label: '',
    pad: true,
    separator: ':',
  },
)

const emit = defineEmits<{
  (e: 'finish'): void
  (e: 'tick', remaining: number): void
}>()

const now = ref(Date.now())
let timer: ReturnType<typeof setInterval> | null = null
const finished = ref(false)

const targetMs = computed(() => {
  if (props.target instanceof Date) return props.target.getTime()
  if (typeof props.target === 'number') return props.target
  return new Date(props.target).getTime()
})

const remainingMs = computed(() => Math.max(0, targetMs.value - now.value))

const parts = computed(() => {
  const total = remainingMs.value
  const days = Math.floor(total / 86_400_000)
  const hours = Math.floor((total % 86_400_000) / 3_600_000)
  const minutes = Math.floor((total % 3_600_000) / 60_000)
  const seconds = Math.floor((total % 60_000) / 1000)
  return { days, hours, minutes, seconds }
})

/** Values actually painted for each unit under the active format (rolled-up totals for compact formats). */
const displayParts = computed(() => {
  const { days, hours, minutes, seconds } = parts.value
  const f = props.format
  if (f === 'HH:MM:SS') {
    return { days, hours: days * 24 + hours, minutes, seconds }
  }
  if (f === 'MM:SS') {
    return { days, hours, minutes: days * 24 * 60 + hours * 60 + minutes, seconds }
  }
  if (f === 'SS') {
    return { days, hours, minutes, seconds: Math.floor(remainingMs.value / 1000) }
  }
  // DD:HH:MM:SS and custom token formats use modular parts.
  return { days, hours, minutes, seconds }
})

function pad2(n: number) {
  return props.pad ? String(n).padStart(2, '0') : String(n)
}

/** Split a unit string into chars so only changed digits remount + flip. */
function unitChars(n: number) {
  return [...pad2(n)]
}

const display = computed(() => {
  const f = props.format
  const { days, hours, minutes, seconds } = parts.value
  const sep = props.separator
  if (f === 'DD:HH:MM:SS') return `${pad2(days)}${sep}${pad2(hours)}${sep}${pad2(minutes)}${sep}${pad2(seconds)}`
  if (f === 'HH:MM:SS') return `${pad2(days * 24 + hours)}${sep}${pad2(minutes)}${sep}${pad2(seconds)}`
  if (f === 'MM:SS') return `${pad2(days * 24 * 60 + hours * 60 + minutes)}${sep}${pad2(seconds)}`
  if (f === 'SS') return pad2(Math.floor(remainingMs.value / 1000))
  // Custom token format: replace DD, HH, MM, SS tokens.
  return f
    .replace('DD', pad2(days))
    .replace('HH', pad2(hours))
    .replace('MM', pad2(minutes))
    .replace('SS', pad2(seconds))
})

function checkFinished() {
  if (remainingMs.value <= 0 && !finished.value) {
    finished.value = true
    stopTimer()
    emit('finish')
    return true
  }
  return false
}

function startTimer() {
  stopTimer()
  // Fire finish immediately when the target is already past (don't wait for first tick).
  if (checkFinished()) return
  if (props.paused) return
  timer = setInterval(() => {
    now.value = Date.now()
    emit('tick', remainingMs.value)
    checkFinished()
  }, 1000)
}

function stopTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

watch(
  () => props.paused,
  (paused) => {
    if (paused) stopTimer()
    else startTimer()
  },
)

watch(
  () => props.target,
  () => {
    finished.value = false
    now.value = Date.now()
    startTimer()
  },
)

onBeforeUnmount(stopTimer)

// Kick off immediately.
now.value = Date.now()
startTimer()
</script>

<template>
  <div
    data-uipkge
    data-slot="countdown"
    :data-finished="finished"
    :data-paused="paused"
    :class="cn('inline-flex flex-col gap-1', props.class)"
  >
    <span
      v-if="label"
      data-slot="countdown-label"
      class="text-muted-foreground text-xs font-medium tracking-wide uppercase"
    >
      {{ label }}
    </span>
    <div
      data-slot="countdown-display"
      class="flex items-baseline gap-1 font-mono tabular-nums"
      role="timer"
      :aria-live="finished || paused ? 'off' : 'polite'"
      aria-atomic="true"
    >
      <slot
        name="default"
        :days="parts.days"
        :hours="parts.hours"
        :minutes="parts.minutes"
        :seconds="parts.seconds"
        :display="display"
        :finished="finished"
      >
        <slot name="days" :days="parts.days">
          <span
            v-if="format.includes('DD')"
            data-slot="countdown-days"
            class="text-foreground inline-flex text-2xl font-semibold"
          >
            <span
              v-for="(ch, i) in unitChars(displayParts.days)"
              :key="`d-${i}-${ch}`"
              class="countdown-digit inline-block tabular-nums"
              >{{ ch }}</span
            >
          </span>
        </slot>
        <span v-if="format.includes('DD') && format.includes('HH')" class="text-muted-foreground text-2xl">{{
          separator
        }}</span>
        <slot name="hours" :hours="parts.hours">
          <span
            v-if="format.includes('HH')"
            data-slot="countdown-hours"
            class="text-foreground inline-flex text-2xl font-semibold"
          >
            <span
              v-for="(ch, i) in unitChars(displayParts.hours)"
              :key="`h-${i}-${ch}`"
              class="countdown-digit inline-block tabular-nums"
              >{{ ch }}</span
            >
          </span>
        </slot>
        <span v-if="format.includes('HH') && format.includes('MM')" class="text-muted-foreground text-2xl">{{
          separator
        }}</span>
        <slot name="minutes" :minutes="parts.minutes">
          <span
            v-if="format.includes('MM')"
            data-slot="countdown-minutes"
            class="text-foreground inline-flex text-2xl font-semibold"
          >
            <span
              v-for="(ch, i) in unitChars(displayParts.minutes)"
              :key="`m-${i}-${ch}`"
              class="countdown-digit inline-block tabular-nums"
              >{{ ch }}</span
            >
          </span>
        </slot>
        <span v-if="format.includes('MM') && format.includes('SS')" class="text-muted-foreground text-2xl">{{
          separator
        }}</span>
        <slot name="seconds" :seconds="parts.seconds">
          <span
            v-if="format.includes('SS')"
            data-slot="countdown-seconds"
            class="text-foreground inline-flex text-2xl font-semibold"
          >
            <span
              v-for="(ch, i) in unitChars(displayParts.seconds)"
              :key="`s-${i}-${ch}`"
              class="countdown-digit inline-block tabular-nums"
              >{{ ch }}</span
            >
          </span>
        </slot>
      </slot>
    </div>
  </div>
</template>

<style>
@keyframes countdown-digit-flip {
  0% {
    opacity: 0;
    transform: translateY(45%) scale(0.92);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

[data-slot='countdown'] .countdown-digit {
  animation: countdown-digit-flip 280ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

@media (prefers-reduced-motion: reduce) {
  [data-slot='countdown'] .countdown-digit {
    animation: none !important;
  }
}
</style>

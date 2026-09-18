<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import {
  formatAbsoluteTime,
  formatVisibleTime,
  toDate,
  type RelativeTimeDisplay,
  type RelativeTimeNumeric,
  type RelativeTimeParseAs,
  type RelativeTimeStyle,
} from './format-relative-time'

const props = withDefaults(
  defineProps<{
    /** Instant to display. Accepts a Date, ISO string, or epoch ms. */
    date: Date | string | number
    /** Clock used for the delta. Pass in tests and SSR to keep output stable. */
    now?: Date | string | number
    /** Intl relative style. Named `formatStyle` so it does not collide with the HTML style attribute. */
    formatStyle?: RelativeTimeStyle
    /** `auto` yields "yesterday"; `always` yields "1 day ago". */
    numeric?: RelativeTimeNumeric
    /** BCP 47 locale. Defaults to the runtime locale. */
    locale?: string
    /** Visible label: relative (default), absolute clock, or both. */
    display?: RelativeTimeDisplay
    /** IANA zone for absolute text and the title tooltip. Omit for the browser local zone. Pass `UTC` for UTC. */
    timeZone?: string
    /** How to parse date strings with no offset. `local` is JS default; `utc` treats naive ISO as UTC. */
    parseAs?: RelativeTimeParseAs
    /** Tick interval in ms. `0` freezes the clock. */
    updateInterval?: number
    class?: HTMLAttributes['class']
  }>(),
  {
    formatStyle: 'long',
    numeric: 'auto',
    display: 'relative',
    parseAs: 'local',
    updateInterval: 30_000,
  },
)

const tick = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

const resolvedNow = computed(() => {
  tick.value
  return props.now === undefined ? new Date() : toDate(props.now, props.parseAs)
})

const resolvedDate = computed(() => toDate(props.date, props.parseAs))

const label = computed(() =>
  formatVisibleTime(resolvedDate.value, resolvedNow.value, {
    display: props.display,
    style: props.formatStyle,
    numeric: props.numeric,
    locale: props.locale,
    timeZone: props.timeZone,
  }),
)

const absolute = computed(() => formatAbsoluteTime(resolvedDate.value, props.locale, props.timeZone))
const iso = computed(() => resolvedDate.value.toISOString())

function stop() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function start() {
  stop()
  if (props.updateInterval <= 0 || props.now !== undefined) return
  timer = setInterval(() => {
    tick.value += 1
  }, props.updateInterval)
}

onMounted(start)
watch(() => [props.updateInterval, props.now], start)
onBeforeUnmount(stop)
</script>

<template>
  <time
    data-uipkge
    data-slot="relative-time"
    :datetime="iso"
    :title="absolute"
    :data-display="display"
    :data-timezone="timeZone || 'local'"
    :data-parse-as="parseAs"
    :class="cn('text-muted-foreground text-sm tabular-nums', props.class)"
  >
    <slot :label="label" :absolute="absolute">{{ label }}</slot>
  </time>
</template>

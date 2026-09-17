<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { ScrollArea } from '@/components/ui/scroll-area'

export interface TimeParts {
  hour24: number
  minute: number
  second: number
}

export type TimeFormat = 'HH:mm' | 'HH:mm:ss' | 'hh:mm A'

interface Props {
  /** Time value. HH:mm or HH:mm:ss depending on format. Empty = no selection. */
  modelValue?: string
  use24Hour?: boolean
  use12Hours?: boolean
  minuteStep?: number
  hourStep?: number
  secondStep?: number
  /** 24h HH:mm or HH:mm:ss. */
  minTime?: string
  /** 24h HH:mm or HH:mm:ss. */
  maxTime?: string
  format?: TimeFormat
  disabledHours?: () => number[]
  disabledMinutes?: (selectedHour: number) => number[]
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[]
  hideDisabledOptions?: boolean
  /** Auto-scroll active rows into view when this becomes true. */
  visible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  use24Hour: false,
  use12Hours: false,
  minuteStep: 5,
  hourStep: 1,
  secondStep: 1,
  format: 'HH:mm',
  hideDisabledOptions: false,
  visible: true,
})

const emits = defineEmits<{
  'update:modelValue': [value: string]
}>()

function parse(v: string): TimeParts | null {
  if (!v) return null
  const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(v.trim())
  if (!m) return null
  const h = Number(m[1])
  const min = Number(m[2])
  const s = m[3] ? Number(m[3]) : 0
  if (
    Number.isNaN(h) ||
    Number.isNaN(min) ||
    Number.isNaN(s) ||
    h < 0 ||
    h > 23 ||
    min < 0 ||
    min > 59 ||
    s < 0 ||
    s > 59
  )
    return null
  return { hour24: h, minute: min, second: s }
}

function format24(p: TimeParts) {
  if (props.format === 'HH:mm:ss') {
    return `${String(p.hour24).padStart(2, '0')}:${String(p.minute).padStart(2, '0')}:${String(p.second).padStart(2, '0')}`
  }
  return `${String(p.hour24).padStart(2, '0')}:${String(p.minute).padStart(2, '0')}`
}

function toMinutes(p: TimeParts) {
  return p.hour24 * 60 + p.minute + p.second / 60
}

const parts = ref<TimeParts | null>(parse(props.modelValue))
watch(
  () => props.modelValue,
  (v) => {
    parts.value = parse(v)
  },
)

const showSeconds = computed(() => props.format === 'HH:mm:ss')

// Default to 24h columns. Opt into 12h via format="hh:mm A" or use12Hours.
// (use24Hour remains as an explicit 24h force for API compat; it no longer
// inverts the default when false — that made HH:mm demos show AM/PM by accident.)
const effective12Hour = computed(() => {
  if (props.format === 'hh:mm A') return true
  if (props.use12Hours) return true
  if (props.use24Hour) return false
  return false
})

const hour12 = computed(() => {
  if (!parts.value) return null
  const h = parts.value.hour24 % 12
  return h === 0 ? 12 : h
})
const period = computed(() => (parts.value && parts.value.hour24 >= 12 ? 'PM' : 'AM'))

const minBound = computed(() => parse(props.minTime ?? '') ?? null)
const maxBound = computed(() => parse(props.maxTime ?? '') ?? null)

function withinBounds(p: TimeParts) {
  const m = toMinutes(p)
  if (minBound.value && m < toMinutes(minBound.value)) return false
  if (maxBound.value && m > toMinutes(maxBound.value)) return false
  return true
}

const disabledHoursSet = computed(() => {
  const arr = props.disabledHours ? props.disabledHours() : []
  return new Set(arr)
})

const disabledMinutesSet = computed(() => {
  const h = parts.value?.hour24 ?? 0
  const arr = props.disabledMinutes ? props.disabledMinutes(h) : []
  return new Set(arr)
})

const disabledSecondsSet = computed(() => {
  const h = parts.value?.hour24 ?? 0
  const m = parts.value?.minute ?? 0
  const arr = props.disabledSeconds ? props.disabledSeconds(h, m) : []
  return new Set(arr)
})

function isHourDisabledItem(h: number) {
  if (disabledHoursSet.value.has(h)) return true
  const cur = parts.value ?? { hour24: 0, minute: 0, second: 0 }
  if (effective12Hour.value) {
    const isPM = period.value === 'PM'
    return !withinBounds({ hour24: (h % 12) + (isPM ? 12 : 0), minute: cur.minute, second: cur.second })
  }
  return !withinBounds({ hour24: h, minute: cur.minute, second: cur.second })
}

function isMinuteDisabledItem(m: number) {
  if (disabledMinutesSet.value.has(m)) return true
  const cur = parts.value ?? { hour24: 0, minute: 0, second: 0 }
  return !withinBounds({ hour24: cur.hour24, minute: m, second: cur.second })
}

function isSecondDisabledItem(s: number) {
  if (disabledSecondsSet.value.has(s)) return true
  const cur = parts.value ?? { hour24: 0, minute: 0, second: 0 }
  return !withinBounds({ hour24: cur.hour24, minute: cur.minute, second: s })
}

const hours12List = computed(() => {
  const step = Math.max(1, props.hourStep)
  const list = Array.from({ length: 12 }, (_, i) => i + 1).filter((h) => (h - 1) % step === 0)
  if (!props.hideDisabledOptions) return list
  return list.filter((h) => !isHourDisabledItem(h))
})

const hours24List = computed(() => {
  const step = Math.max(1, props.hourStep)
  const list = Array.from({ length: 24 }, (_, i) => i).filter((h) => h % step === 0)
  if (!props.hideDisabledOptions) return list
  return list.filter((h) => !isHourDisabledItem(h))
})

const minutesList = computed(() => {
  const step = Math.max(1, Math.min(60, props.minuteStep))
  const list = Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step)
  if (!props.hideDisabledOptions) return list
  return list.filter((m) => !isMinuteDisabledItem(m))
})

const secondsList = computed(() => {
  const step = Math.max(1, Math.min(60, props.secondStep))
  const list = Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step)
  if (!props.hideDisabledOptions) return list
  return list.filter((s) => !isSecondDisabledItem(s))
})

function commit(p: TimeParts) {
  if (!withinBounds(p)) return
  parts.value = p
  emits('update:modelValue', format24(p))
}

function pickHour12(h: number) {
  const cur = parts.value ?? { hour24: 0, minute: 0, second: 0 }
  const isPM = period.value === 'PM'
  commit({ hour24: (h % 12) + (isPM ? 12 : 0), minute: cur.minute, second: cur.second })
}

function pickHour24(h: number) {
  const cur = parts.value ?? { hour24: 0, minute: 0, second: 0 }
  commit({ hour24: h, minute: cur.minute, second: cur.second })
}

function pickMinute(m: number) {
  const cur = parts.value ?? { hour24: 0, minute: 0, second: 0 }
  commit({ hour24: cur.hour24, minute: m, second: cur.second })
}

function pickSecond(s: number) {
  const cur = parts.value ?? { hour24: 0, minute: 0, second: 0 }
  commit({ hour24: cur.hour24, minute: cur.minute, second: s })
}

function pickPeriod(p: 'AM' | 'PM') {
  const cur = parts.value ?? { hour24: 0, minute: 0, second: 0 }
  const h12 = cur.hour24 % 12
  commit({ hour24: h12 + (p === 'PM' ? 12 : 0), minute: cur.minute, second: cur.second })
}

// ScrollArea is a component; resolve to the DOM root before querySelector.
const hourCol = ref<{ $el?: HTMLElement } | HTMLElement | null>(null)
const minCol = ref<{ $el?: HTMLElement } | HTMLElement | null>(null)
const secCol = ref<{ $el?: HTMLElement } | HTMLElement | null>(null)

function resolveEl(node: { $el?: HTMLElement } | HTMLElement | null | undefined): HTMLElement | null {
  if (!node) return null
  if (node instanceof HTMLElement) return node
  const el = node.$el
  return el instanceof HTMLElement ? el : null
}

function scrollActiveIntoView() {
  for (const col of [hourCol.value, minCol.value, secCol.value]) {
    resolveEl(col)?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({ block: 'center' })
  }
}

watch(
  () => props.visible,
  (v) => {
    if (!v) return
    nextTick(scrollActiveIntoView)
  },
  { immediate: true },
)

function isHourActive(h: number) {
  if (!parts.value) return false
  return effective12Hour.value ? hour12.value === h : parts.value.hour24 === h
}

function isHourDisabled(h: number) {
  if (!props.hideDisabledOptions) return isHourDisabledItem(h)
  return false
}

function isMinuteDisabled(m: number) {
  if (!props.hideDisabledOptions) return isMinuteDisabledItem(m)
  return false
}

function isSecondDisabled(s: number) {
  if (!props.hideDisabledOptions) return isSecondDisabledItem(s)
  return false
}
</script>

<template>
  <div class="flex divide-x" data-uipkge data-slot="time-columns">
    <ScrollArea ref="hourCol" class="h-56">
      <div class="flex w-14 flex-col p-1">
        <button
          v-for="h in effective12Hour ? hours12List : hours24List"
          :key="h"
          type="button"
          :data-active="isHourActive(h)"
          :disabled="isHourDisabled(h)"
          class="hover:bg-accent focus-visible:ring-ring rounded px-2 py-1 text-center text-sm tabular-nums transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-30 disabled:hover:bg-transparent"
          :class="isHourActive(h) ? 'bg-primary text-primary-foreground hover:bg-primary' : ''"
          @click="effective12Hour ? pickHour12(h) : pickHour24(h)"
        >
          {{ String(h).padStart(2, '0') }}
        </button>
      </div>
    </ScrollArea>

    <ScrollArea ref="minCol" class="h-56">
      <div class="flex w-14 flex-col p-1">
        <button
          v-for="m in minutesList"
          :key="m"
          type="button"
          :data-active="parts?.minute === m"
          :disabled="isMinuteDisabled(m)"
          class="hover:bg-accent focus-visible:ring-ring rounded px-2 py-1 text-center text-sm tabular-nums transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-30 disabled:hover:bg-transparent"
          :class="parts?.minute === m ? 'bg-primary text-primary-foreground hover:bg-primary' : ''"
          @click="pickMinute(m)"
        >
          {{ String(m).padStart(2, '0') }}
        </button>
      </div>
    </ScrollArea>

    <ScrollArea v-if="showSeconds" ref="secCol" class="h-56">
      <div class="flex w-14 flex-col p-1">
        <button
          v-for="s in secondsList"
          :key="s"
          type="button"
          :data-active="parts?.second === s"
          :disabled="isSecondDisabled(s)"
          class="hover:bg-accent focus-visible:ring-ring rounded px-2 py-1 text-center text-sm tabular-nums transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:opacity-30 disabled:hover:bg-transparent"
          :class="parts?.second === s ? 'bg-primary text-primary-foreground hover:bg-primary' : ''"
          @click="pickSecond(s)"
        >
          {{ String(s).padStart(2, '0') }}
        </button>
      </div>
    </ScrollArea>

    <div v-if="effective12Hour" class="flex w-12 flex-col p-1">
      <button
        v-for="p in ['AM', 'PM']"
        :key="p"
        type="button"
        class="hover:bg-accent focus-visible:ring-ring rounded px-2 py-1 text-center text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
        :class="period === p ? 'bg-primary text-primary-foreground hover:bg-primary' : ''"
        @click="pickPeriod(p as 'AM' | 'PM')"
      >
        {{ p }}
      </button>
    </div>
  </div>
</template>

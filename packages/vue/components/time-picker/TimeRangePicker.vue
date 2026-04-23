<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, ref, watch } from 'vue'
import { Clock, X } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import TimeColumns, { type TimeFormat } from './TimeColumns.vue'
import { cn } from '@/lib/utils'

export interface TimeRangePreset {
  label: string
  value: [string, string]
}

export type TimeRangePickerSize = 'small' | 'middle' | 'large'
export type TimeRangePickerStatus = 'error' | 'warning'

interface Props {
  /** Controlled value as [startTime, endTime] in 24h format. */
  modelValue?: [string, string] | null
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
  clearable?: boolean
  allowClear?: boolean
  minuteStep?: number
  hourStep?: number
  secondStep?: number
  use24Hour?: boolean
  use12Hours?: boolean
  minTime?: string
  maxTime?: string
  format?: TimeFormat
  disabledHours?: () => number[]
  disabledMinutes?: (selectedHour: number) => number[]
  disabledSeconds?: (selectedHour: number, selectedMinute: number) => number[]
  hideDisabledOptions?: boolean
  presets?: TimeRangePreset[]
  size?: TimeRangePickerSize
  status?: TimeRangePickerStatus
  triggerClass?: HTMLAttributes['class']
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  placeholder: 'Pick a time range',
  disabled: false,
  readOnly: false,
  clearable: true,
  allowClear: undefined,
  minuteStep: 5,
  hourStep: 1,
  secondStep: 1,
  use24Hour: false,
  use12Hours: false,
  format: 'HH:mm',
  hideDisabledOptions: false,
  presets: () => [],
  size: 'middle',
})

const emits = defineEmits<{
  'update:modelValue': [value: [string, string] | null]
}>()

const open = ref(false)

const effectiveAllowClear = computed(() => {
  if (props.allowClear !== undefined) return props.allowClear
  return props.clearable
})

function parse(v: string) {
  if (!v) return null
  const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(v.trim())
  if (!m) return null
  return { hour24: Number(m[1]), minute: Number(m[2]), second: m[3] ? Number(m[3]) : 0 }
}

const startValue = computed(() => props.modelValue?.[0] ?? '')
const endValue = computed(() => props.modelValue?.[1] ?? '')

const startParsed = computed(() => parse(startValue.value))
const endParsed = computed(() => parse(endValue.value))

function formatDisplay(h: number, m: number, s: number) {
  if (props.format === 'hh:mm A') {
    const h12 = h % 12 === 0 ? 12 : h % 12
    const period = h >= 12 ? 'PM' : 'AM'
    return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`
  }
  if (props.format === 'HH:mm:ss') {
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

const display = computed(() => {
  const hasStart = startParsed.value !== null
  const hasEnd = endParsed.value !== null
  if (!hasStart && !hasEnd) return ''
  const startStr = hasStart
    ? formatDisplay(startParsed.value!.hour24, startParsed.value!.minute, startParsed.value!.second)
    : ''
  const endStr = hasEnd ? formatDisplay(endParsed.value!.hour24, endParsed.value!.minute, endParsed.value!.second) : ''
  if (hasStart && hasEnd) return `${startStr} ~ ${endStr}`
  return startStr || endStr
})

function emitRange(start: string, end: string) {
  emits('update:modelValue', [start, end])
}

function emitStart(v: string) {
  emitRange(v, endValue.value || v)
}

function emitEnd(v: string) {
  emitRange(startValue.value || v, v)
}

function pickNow(which: 'start' | 'end') {
  if (props.readOnly) return
  const d = new Date()
  const sStep = Math.max(1, props.secondStep)
  const rawS = d.getSeconds()
  const snappedS = Math.round(rawS / sStep) * sStep
  const secCarry = Math.floor(snappedS / 60)
  const s = snappedS % 60

  const mStep = Math.max(1, props.minuteStep)
  const rawM = d.getMinutes() + secCarry
  const snappedM = Math.round(rawM / mStep) * mStep
  const minCarry = Math.floor(snappedM / 60)
  const min = snappedM % 60

  const h = (d.getHours() + minCarry) % 24
  const hourStr = String(h).padStart(2, '0')
  const minStr = String(min).padStart(2, '0')
  const secStr = String(s).padStart(2, '0')
  const v = props.format === 'HH:mm:ss' ? `${hourStr}:${minStr}:${secStr}` : `${hourStr}:${minStr}`
  if (which === 'start') emitStart(v)
  else emitEnd(v)
}

function applyPreset(preset: TimeRangePreset) {
  if (props.readOnly) return
  emits('update:modelValue', preset.value)
  open.value = false
}

function clear(event: Event) {
  event.stopPropagation()
  if (props.disabled || props.readOnly) return
  emits('update:modelValue', null)
}

const sizeClasses: Record<TimeRangePickerSize, string> = {
  small: 'h-8 text-xs px-2.5 py-1',
  middle: 'h-9 text-sm px-3 py-1.5',
  large: 'h-11 text-base px-4 py-2',
}

const statusClasses: Record<string, string> = {
  error: 'border-destructive focus-visible:ring-destructive',
  warning: 'border-warning focus-visible:ring-warning',
}

const triggerClasses = computed(() =>
  cn(
    'min-w-48 justify-start gap-2 text-left font-normal',
    !display.value && 'text-muted-foreground',
    sizeClasses[props.size],
    props.status && statusClasses[props.status],
    props.triggerClass,
    props.class,
  ),
)

const columnsVisible = ref(false)
watch(open, (v) => {
  columnsVisible.value = v
})
</script>

<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        type="button"
        variant="outline"
        :disabled="disabled"
        :class="triggerClasses"
        data-uipkge
        data-slot="time-range-picker"
      >
        <Clock class="size-4 shrink-0" aria-hidden="true" />
        <span class="flex-1 truncate">{{ display || placeholder }}</span>
        <!-- span (not button): nested interactive elements inside Button are invalid HTML -->
        <span
          v-if="effectiveAllowClear && display && !disabled && !readOnly"
          role="button"
          tabindex="-1"
          class="text-muted-foreground hover:text-foreground focus-visible:ring-ring -mr-1 inline-flex size-5 items-center justify-center rounded transition-colors focus-visible:ring-2 focus-visible:outline-none"
          aria-label="Clear time range"
          @click.stop="clear"
          @mousedown.prevent
        >
          <X class="size-3.5" aria-hidden="true" />
        </span>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0" align="start">
      <div v-if="presets.length" class="flex flex-col gap-0.5 border-b p-2">
        <button
          v-for="p in presets"
          :key="p.label"
          type="button"
          class="hover:bg-accent focus-visible:ring-ring rounded-md px-2 py-1.5 text-left text-xs transition-colors focus-visible:ring-2 focus-visible:outline-none"
          @click="applyPreset(p)"
        >
          {{ p.label }}
        </button>
      </div>
      <div class="flex items-center justify-between border-b px-3 py-2">
        <span class="text-muted-foreground text-xs tracking-widest uppercase">Time Range</span>
        <div class="flex gap-2">
          <button
            type="button"
            class="text-muted-foreground hover:text-foreground focus-visible:ring-ring text-xs focus-visible:ring-2 focus-visible:outline-none"
            @click="pickNow('start')"
          >
            Now (Start)
          </button>
          <button
            type="button"
            class="text-muted-foreground hover:text-foreground focus-visible:ring-ring text-xs focus-visible:ring-2 focus-visible:outline-none"
            @click="pickNow('end')"
          >
            Now (End)
          </button>
        </div>
      </div>
      <div class="flex">
        <div class="flex flex-col">
          <div class="text-muted-foreground border-b px-3 py-1.5 text-center text-xs font-medium">Start</div>
          <TimeColumns
            :model-value="startValue"
            :use24-hour="use24Hour"
            :use12-hours="use12Hours"
            :minute-step="minuteStep"
            :hour-step="hourStep"
            :second-step="secondStep"
            :min-time="minTime"
            :max-time="maxTime"
            :format="format"
            :disabled-hours="disabledHours"
            :disabled-minutes="disabledMinutes"
            :disabled-seconds="disabledSeconds"
            :hide-disabled-options="hideDisabledOptions"
            :visible="columnsVisible"
            @update:model-value="emitStart"
          />
        </div>
        <div class="bg-border w-px" />
        <div class="flex flex-col">
          <div class="text-muted-foreground border-b px-3 py-1.5 text-center text-xs font-medium">End</div>
          <TimeColumns
            :model-value="endValue"
            :use24-hour="use24Hour"
            :use12-hours="use12Hours"
            :minute-step="minuteStep"
            :hour-step="hourStep"
            :second-step="secondStep"
            :min-time="minTime"
            :max-time="maxTime"
            :format="format"
            :disabled-hours="disabledHours"
            :disabled-minutes="disabledMinutes"
            :disabled-seconds="disabledSeconds"
            :hide-disabled-options="hideDisabledOptions"
            :visible="columnsVisible"
            @update:model-value="emitEnd"
          />
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import type { SliderRootProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { computed, ref, useId, watch } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { SliderRange, SliderRoot, SliderThumb, SliderTrack, useForwardProps } from 'reka-ui'
import { cn } from '@/lib/utils'

// CLAUDE.md mandate: avoid `interface extends ReakUiX` (SFC compiler bails
// in Vue 3.5+ because reka-ui has no exports.types). Intersection form below.
export type RangeSliderProps = Omit<SliderRootProps, 'defaultValue'> & {
  class?: HTMLAttributes['class']
  /** The controlled value of the range slider. Can be binded with v-model. */
  modelValue?: [number, number]
  /** The value of the range slider that should be checked when initially rendered. */
  defaultValue?: [number, number]
  /** When `true`, prevents the user from interacting with the range slider */
  disabled?: boolean
  /** Minimum value */
  min?: number
  /** Maximum value */
  max?: number
  /** Step value */
  step?: number
  /** Label for the range slider */
  label?: string
  /** Hint text for the range slider */
  hint?: string
  /** Error messages to display */
  errorMessages?: string | string[]
  /** Whether to show error state */
  error?: boolean
  /** Custom color for the track fill */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | string
  /** Thumb size */
  thumbSize?: 'sm' | 'md' | 'lg'
  /** Track height */
  trackHeight?: 'sm' | 'md' | 'lg'
  /** Show ticks */
  showTicks?: boolean
  /** Tick interval */
  tickInterval?: number
  /** Show thumb labels */
  thumbLabel?: boolean
  /** Invert the slider */
  inverted?: boolean
  /** Format thumb label */
  thumbLabelFormat?: (value: number) => string
}

const props = withDefaults(defineProps<RangeSliderProps>(), {
  min: 0,
  max: 100,
  step: 1,
  thumbSize: 'md',
  trackHeight: 'md',
})

const emits = defineEmits<{
  'update:modelValue': [value: [number, number]]
}>()

const delegatedProps = reactiveOmit(
  props,
  'class',
  'label',
  'hint',
  'errorMessages',
  'error',
  'color',
  'thumbSize',
  'trackHeight',
  'showTicks',
  'tickInterval',
  'thumbLabel',
  'thumbLabelFormat',
)

// Props only — value updates go through onValueUpdate so side displays stay in sync
// without double-emitting via useForwardPropsEmits.
const forwarded = useForwardProps(delegatedProps)
const fieldId = useId()

// Track displayed values for controlled + uncontrolled (defaultValue) modes.
const displayValue = ref<[number, number]>(props.modelValue ?? props.defaultValue ?? [props.min, props.max])
watch(
  () => props.modelValue,
  (v) => {
    if (v) displayValue.value = v
  },
)

function onValueUpdate(val: number[] | undefined) {
  if (!val || val.length < 2) return
  const tuple = [val[0], val[1]] as [number, number]
  displayValue.value = tuple
  emits('update:modelValue', tuple)
}

// Color classes
const colorClasses: Record<string, string> = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  success: 'bg-success',
  warning: 'bg-warning',
  error: 'bg-destructive',
  info: 'bg-info',
}

// Track height classes
const trackHeightClasses = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2',
}

// Thumb size classes
const thumbSizeClasses = {
  sm: 'size-3',
  md: 'size-4',
  lg: 'size-5',
}

// Generate ticks
const ticks = computed(() => {
  if (!props.showTicks || !props.tickInterval) return []
  const result: number[] = []
  for (let i = props.min; i <= props.max; i += props.tickInterval) {
    result.push(i)
  }
  return result
})

// Build error state
const hasError = computed(() => {
  if (props.error) return true
  if (
    props.errorMessages &&
    (typeof props.errorMessages === 'string' ? props.errorMessages : props.errorMessages.length > 0)
  )
    return true
  return false
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" :for="fieldId" class="text-sm font-medium">
      {{ label }}
    </label>

    <p v-if="hint && !hasError" :id="`${fieldId}-hint`" class="text-muted-foreground text-xs">
      {{ hint }}
    </p>

    <div class="flex items-center gap-4">
      <!-- Min value display -->
      <div class="text-muted-foreground min-w-[3rem] text-sm tabular-nums" aria-hidden="true">
        {{ displayValue[0] }}
      </div>

      <SliderRoot
        v-slot="{ modelValue }"
        v-bind="{ 'data-slot': 'range-slider', ...forwarded }"
        :id="fieldId"
        class="relative flex w-full touch-none items-center select-none"
        :aria-describedby="hint && !hasError ? `${fieldId}-hint` : hasError ? `${fieldId}-error` : undefined"
        :aria-invalid="hasError || undefined"
        @update:model-value="onValueUpdate"
      >
        <SliderTrack
          data-uipkge
          data-slot="slider-track"
          :class="cn('bg-muted relative w-full overflow-hidden rounded-full', trackHeightClasses[trackHeight])"
        >
          <SliderRange
            data-uipkge
            data-slot="slider-range"
            :class="cn('absolute h-full', colorClasses[color as string] || colorClasses.primary)"
          />
        </SliderTrack>

        <!-- Ticks -->
        <div
          v-if="showTicks && ticks.length > 0"
          class="pointer-events-none absolute top-1/2 right-0 left-0 flex -translate-y-1/2 justify-between"
          aria-hidden="true"
        >
          <div v-for="tick in ticks" :key="tick" class="bg-muted-foreground/30 h-2 w-0.5 rounded-full" />
        </div>

        <!-- Start Thumb (Min) -->
        <SliderThumb
          data-uipkge
          data-slot="slider-thumb"
          :index="0"
          :aria-label="label ? `${label} minimum` : 'Minimum value'"
          :class="
            cn(
              'border-primary ring-ring/50 bg-background block rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50',
              thumbSizeClasses[thumbSize],
              hasError && 'border-destructive',
            )
          "
        >
          <span
            v-if="thumbLabel"
            class="bg-background absolute -top-6 left-1/2 -translate-x-1/2 rounded px-1 text-xs whitespace-nowrap"
          >
            {{ thumbLabelFormat ? thumbLabelFormat(modelValue?.[0] ?? 0) : (modelValue?.[0] ?? 0) }}
          </span>
        </SliderThumb>

        <!-- End Thumb (Max) -->
        <SliderThumb
          data-uipkge
          data-slot="slider-thumb"
          :index="1"
          :aria-label="label ? `${label} maximum` : 'Maximum value'"
          :class="
            cn(
              'border-primary ring-ring/50 bg-background block rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50',
              thumbSizeClasses[thumbSize],
              hasError && 'border-destructive',
            )
          "
        >
          <span
            v-if="thumbLabel"
            class="bg-background absolute -top-6 left-1/2 -translate-x-1/2 rounded px-1 text-xs whitespace-nowrap"
          >
            {{ thumbLabelFormat ? thumbLabelFormat(modelValue?.[1] ?? 0) : (modelValue?.[1] ?? 0) }}
          </span>
        </SliderThumb>
      </SliderRoot>

      <!-- Max value display -->
      <div class="text-muted-foreground min-w-[3rem] text-sm tabular-nums" aria-hidden="true">
        {{ displayValue[1] }}
      </div>
    </div>

    <!-- Tick labels -->
    <div v-if="showTicks && ticks.length > 0" class="text-muted-foreground flex justify-between px-1 text-xs">
      <span>{{ min }}</span>
      <span>{{ max }}</span>
    </div>

    <div v-if="hasError" :id="`${fieldId}-error`" class="flex flex-col gap-0.5" role="alert">
      <p v-if="typeof errorMessages === 'string'" class="text-destructive text-xs">
        {{ errorMessages }}
      </p>
      <template v-else>
        <p v-for="(msg, i) in errorMessages" :key="i" class="text-destructive text-xs">
          {{ msg }}
        </p>
      </template>
    </div>
  </div>
</template>

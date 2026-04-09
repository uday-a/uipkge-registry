<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, useAttrs } from 'vue'
import { useVModel } from '@vueuse/core'
import { ChevronDown } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

export interface NativeSelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

interface Props {
  modelValue?: string | number
  defaultValue?: string | number
  options?: (NativeSelectOption | string)[]
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  class?: HTMLAttributes['class']
  selectClass?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const emits = defineEmits<{
  (e: 'update:modelValue', val: string | number): void
}>()

const attrs = useAttrs()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})

const sizeClasses: Record<string, string> = {
  sm: 'h-8 text-xs pl-2.5 pr-8',
  md: 'h-9 text-sm pl-3 pr-9',
  lg: 'h-11 text-base pl-4 pr-10',
}

const iconSizes: Record<string, string> = {
  sm: 'size-3.5 right-2.5',
  md: 'size-4 right-3',
  lg: 'size-5 right-3.5',
}

const normalizedOptions = computed(() => {
  if (!props.options) return []
  return props.options.map((opt) => {
    if (typeof opt === 'string') {
      return { label: opt, value: opt, disabled: false }
    }
    return opt
  })
})
</script>

<template>
  <div
    data-uipkge
    data-slot="native-select-wrapper"
    :class="cn('relative inline-flex w-full items-center', props.class)"
  >
    <select
      data-slot="native-select"
      :disabled="disabled"
      :value="modelValue"
      :class="
        cn(
          'border-input bg-background w-full appearance-none rounded-md border shadow-xs transition-[color,box-shadow]',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none',
          'disabled:bg-muted/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
          sizeClasses[size],
          props.selectClass,
        )
      "
      v-bind="attrs"
      @change="modelValue = ($event.target as HTMLSelectElement).value"
    >
      <template v-if="normalizedOptions.length > 0">
        <option v-for="opt in normalizedOptions" :key="String(opt.value)" :value="opt.value" :disabled="opt.disabled">
          {{ opt.label }}
        </option>
      </template>
      <slot v-else />
    </select>
    <ChevronDown
      data-slot="native-select-icon"
      aria-hidden="true"
      :class="
        cn(
          'text-muted-foreground pointer-events-none absolute transition-opacity',
          disabled && 'opacity-50',
          iconSizes[size],
        )
      "
    />
  </div>
</template>

<script setup lang="ts">
import type { AcceptableValue } from 'reka-ui'
import { computed } from 'vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { ChevronDownIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

defineOptions({
  inheritAttrs: false,
})

interface Props {
  modelValue?: AcceptableValue | AcceptableValue[]
  class?: HTMLAttributes['class']
  label?: string
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  error?: boolean
  errorMessages?: string | string[]
  successMessages?: string | string[]
  hint?: string
  variant?: 'outlined' | 'filled' | 'solo' | 'underlined'
  density?: 'compact' | 'default' | 'comfortable'
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info'
  hideDetails?: boolean
  bgColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: undefined,
  label: '',
  placeholder: '',
  disabled: false,
  readonly: false,
  error: false,
  errorMessages: () => [],
  successMessages: () => [],
  hint: '',
  variant: 'outlined',
  density: 'default',
  color: 'primary',
  hideDetails: false,
})

const emit = defineEmits<{
  'update:modelValue': AcceptableValue
}>()

const modelValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const delegatedProps = reactiveOmit(
  props,
  'class',
  'label',
  'placeholder',
  'disabled',
  'readonly',
  'error',
  'errorMessages',
  'successMessages',
  'hint',
  'variant',
  'density',
  'color',
  'hideDetails',
  'bgColor',
  'modelValue',
)

const hasError = computed(
  () => props.error || (Array.isArray(props.errorMessages) ? props.errorMessages.length > 0 : !!props.errorMessages),
)
const hasSuccess = computed(
  () =>
    !hasError.value &&
    (Array.isArray(props.successMessages) ? props.successMessages.length > 0 : !!props.successMessages),
)

const densityClasses = {
  compact: 'h-8 text-xs',
  default: 'h-9 text-sm',
  comfortable: 'h-10 text-base',
}

const variantClasses = {
  outlined: 'border bg-transparent',
  filled: 'border-b-2 bg-muted/30 border-transparent',
  solo: 'border bg-card shadow-md',
  underlined: 'border-b bg-transparent rounded-none border-x-0 border-t-0',
}

const stateClasses = computed(() => {
  if (hasError.value) return 'border-destructive focus-visible:ring-destructive/20'
  if (hasSuccess.value) return 'border-success focus-visible:border-success'
  return 'border-input focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]'
})
</script>

<template>
  <div class="relative w-full" :class="densityClasses[density]">
    <!-- Label -->
    <label v-if="label" class="mb-1 block text-sm font-medium" :class="{ 'text-destructive': hasError }">
      {{ label }}
    </label>

    <!-- Select Wrapper -->
    <div class="group/native-select relative w-full" :class="props.class">
      <select
        v-bind="{ ...$attrs, ...delegatedProps }"
        v-model="modelValue"
        data-uipkge
        data-slot="native-select"
        :disabled="disabled"
        :readonly="readonly"
        :class="
          cn(
            'border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 dark:hover:bg-input/50',
            variantClasses[variant],
            stateClasses,
            densityClasses[density],
            'w-full min-w-0 appearance-none rounded-md border bg-transparent px-3 pr-9 shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
            bgColor,
          )
        "
      >
        <slot />
      </select>
      <ChevronDownIcon
        class="text-muted-foreground pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 opacity-50 select-none"
        :class="{
          'top-1/2': density === 'default' || density === 'compact' || density === 'comfortable',
        }"
        aria-hidden="true"
        data-uipkge
        data-slot="native-select-icon"
      />
    </div>

    <!-- Details: hint, error, success -->
    <div
      v-if="!hideDetails"
      class="mt-1 text-xs"
      :class="{
        'text-destructive': hasError,
        'text-success': hasSuccess,
        'text-muted-foreground': !hasError && !hasSuccess,
      }"
    >
      <template v-if="hasError">
        <span v-if="typeof errorMessages === 'string'">{{ errorMessages }}</span>
        <span v-else>{{ errorMessages[0] }}</span>
      </template>
      <template v-else-if="hasSuccess">
        <span v-if="typeof successMessages === 'string'">{{ successMessages }}</span>
        <span v-else>{{ successMessages[0] }}</span>
      </template>
      <template v-else>{{ hint }}</template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { provide, computed, ref, nextTick, watch, onMounted } from 'vue'
import { useId } from 'reka-ui'
import { useVModel } from '@vueuse/core'
import { cn } from '@/lib/utils'
import { Loader, Check, AlertCircle, X } from 'lucide-vue-next'
import { Label } from '@/components/ui/label'

export interface TextareaProps {
  // Core
  modelValue?: string | number
  defaultValue?: string | number
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  success?: string
  messages?: string[]
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  autofocus?: boolean
  name?: string
  id?: string

  // Variants (Vuetify-style)
  variant?: 'outlined' | 'filled' | 'solo' | 'underlined' | 'plain'
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'
  density?: 'compact' | 'comfortable' | 'default'

  // Appearance
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'pill' | 'circle' | 'full'

  // Auto size (Ant Design API)
  autoSize?: boolean | { minRows?: number; maxRows?: number }

  // Legacy auto grow / resize
  autoGrow?: boolean
  noResize?: boolean
  autoResize?: boolean

  // Rows -- accept both number and string ("3" vs :rows="3") so unbound
  // attribute usage doesn't trip the Vue prop-type warning.
  rows?: number | string
  rowHeight?: number

  // Prefix/Suffix
  prefix?: string
  suffix?: string

  // Counter (legacy)
  counter?: boolean | number

  // Show count (Ant Design API)
  showCount?: boolean | { formatter?: (count: number, maxLength?: number) => string }

  // Max length
  maxLength?: number

  // Allow clear
  allowClear?: boolean

  // Validation
  rules?: Array<(value: any) => true | string>
  errorMessages?: string | string[]
  successMessages?: string | string[]
  validateOn?: 'blur' | 'input' | 'submit' | 'lazy' | 'blurlazy' | 'inputlazy'

  // States
  loading?: boolean
  persistentHint?: boolean
  persistentError?: boolean
  persistentPlaceholder?: boolean
  persistentPrefix?: boolean
  persistentSuffix?: boolean

  // Misc
  class?: HTMLAttributes['class']
  inputClass?: HTMLAttributes['class']
  labelClass?: HTMLAttributes['class']
  hintClass?: HTMLAttributes['class']
  bgColor?: string
  flat?: boolean
  bordered?: boolean

  // Browser
  spellcheck?: boolean
  autocomplete?: string

  // Direction
  direction?: 'ltr' | 'rtl'
}

const props = withDefaults(defineProps<TextareaProps>(), {
  variant: 'outlined',
  density: 'default',
  rounded: 'none',
  rows: 3,
  rowHeight: 24,
  autoGrow: false,
  noResize: false,
  autoResize: false,
  flat: false,
  bordered: true,
  persistentHint: false,
  persistentError: false,
  persistentPlaceholder: false,
  direction: 'ltr',
})

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
  (e: 'click:clear'): void
  (e: 'focus'): void
  (e: 'blur'): void
  (e: 'keydown', event: KeyboardEvent): void
  (e: 'keyup'): void
}>()

const textareaId = props.id ?? `textarea-${useId()}`
const descriptionId = `${textareaId}-description`
const messageId = `${textareaId}-message`

provide('form-item', {
  id: textareaId,
  descriptionId,
  messageId,
})

// Internal state
const internalValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
const focused = ref(false)
const internalErrorMessages = ref<string[]>([])
const validated = ref(false) // set by validate(); reserved for future rule-success UI
const textareaRef = ref<HTMLTextAreaElement | null>(null)

// Auto size
const autoSizeEnabled = computed(() => props.autoSize !== undefined)
const anyAutoResize = computed(() => autoSizeEnabled.value || props.autoResize || props.autoGrow)

const autoSizeConfig = computed<{ minRows?: number; maxRows?: number }>(() => {
  if (typeof props.autoSize === 'object') {
    return props.autoSize
  }
  return {}
})

const minHeightPx = ref(0)
const maxHeightPx = ref(Infinity)

const measureHeights = () => {
  if (!textareaRef.value) return
  if (!autoSizeEnabled.value) return

  const el = textareaRef.value
  const originalValue = el.value
  const originalRows = el.rows
  const originalOverflow = el.style.overflowY

  el.value = ''
  el.style.overflowY = 'hidden'

  const { minRows, maxRows } = autoSizeConfig.value

  if (minRows) {
    el.rows = minRows
    minHeightPx.value = el.scrollHeight
  } else {
    minHeightPx.value = 0
  }

  if (maxRows) {
    el.rows = maxRows
    maxHeightPx.value = el.scrollHeight
  } else {
    maxHeightPx.value = Infinity
  }

  el.value = originalValue
  el.rows = originalRows
  el.style.overflowY = originalOverflow

  autoResize()
}

watch(() => autoSizeConfig.value, measureHeights, { deep: true })

// Auto grow functionality (legacy)
const rowsNum = computed(() => Number(props.rows) || 3)

const computedRows = computed(() => {
  if (autoSizeEnabled.value || props.autoResize) return rowsNum.value
  if (!props.autoGrow) return rowsNum.value
  if (!textareaRef.value) return rowsNum.value

  const lineHeight = props.rowHeight
  const computedHeight = textareaRef.value.scrollHeight
  const newRows = Math.ceil((computedHeight - lineHeight) / lineHeight) + 1
  return Math.max(rowsNum.value, newRows)
})

// Validation
const validate = () => {
  if (!props.rules || props.rules.length === 0) {
    validated.value = true
    return true
  }
  internalErrorMessages.value = []
  for (const rule of props.rules) {
    const result = rule(internalValue.value)
    if (result !== true) {
      internalErrorMessages.value.push(result as string)
    }
  }
  const ok = internalErrorMessages.value.length === 0
  validated.value = ok
  return ok
}

// Handle input
const handleInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement
  internalValue.value = target.value

  if (anyAutoResize.value) {
    autoResize()
  }

  if (props.validateOn === 'input' || props.validateOn === 'inputlazy') {
    // nextTick so internalValue is settled before rules run
    nextTick(() => validate())
  }
}

const autoResize = () => {
  if (!textareaRef.value) return
  if (!anyAutoResize.value) return

  const el = textareaRef.value

  el.style.height = 'auto'
  let newHeight = el.scrollHeight

  if (minHeightPx.value && newHeight < minHeightPx.value) {
    newHeight = minHeightPx.value
  }

  if (newHeight > maxHeightPx.value) {
    newHeight = maxHeightPx.value
    el.style.overflowY = 'auto'
  } else {
    el.style.overflowY = 'hidden'
  }

  el.style.height = `${newHeight}px`
}

// Handle clear
const handleClear = () => {
  internalValue.value = ''
  emits('click:clear')
  nextTick(() => {
    autoResize()
    textareaRef.value?.focus()
  })
}

// Handle focus/blur
const handleFocus = () => {
  focused.value = true
  emits('focus')
}

const handleBlur = () => {
  focused.value = false
  if (props.validateOn === 'blur' || props.validateOn === 'blurlazy') {
    validate()
  }
  emits('blur')
}

// Compute error/success messages
const computedErrorMessages = computed(() => {
  if (props.errorMessages) {
    return Array.isArray(props.errorMessages) ? props.errorMessages : [props.errorMessages]
  }
  if (props.error) {
    return [props.error]
  }
  return internalErrorMessages.value
})

const computedSuccessMessages = computed(() => {
  if (props.successMessages) {
    return Array.isArray(props.successMessages) ? props.successMessages : [props.successMessages]
  }
  if (props.success) {
    return [props.success]
  }
  return []
})

const hasError = computed(() => computedErrorMessages.value.length > 0)
// Success messages are authoritative when provided by the consumer; `validated`
// only gates rule-based success (set after a passing validate() call).
const hasSuccess = computed(() => computedSuccessMessages.value.length > 0)

// Counter (legacy)
const computedCounter = computed(() => {
  if (typeof props.counter === 'number') return props.counter
  if (props.counter) return props.maxLength ?? 100
  return null
})

const currentLength = computed(() => String(internalValue.value ?? '').length)

// Show count (Ant Design API)
const showCountEnabled = computed(() => {
  return props.showCount !== undefined && props.showCount !== false
})

const showCountConfig = computed<{ formatter?: (count: number, maxLength?: number) => string }>(() => {
  if (typeof props.showCount === 'object') {
    return props.showCount
  }
  return {}
})

const countText = computed(() => {
  const formatter = showCountConfig.value.formatter
  if (formatter) {
    return formatter(currentLength.value, props.maxLength)
  }
  if (props.maxLength !== undefined) {
    return `${currentLength.value} / ${props.maxLength}`
  }
  return `${currentLength.value}`
})

// Allow clear
const showClear = computed(() => {
  return props.allowClear && !props.disabled && !props.readonly && String(internalValue.value ?? '').length > 0
})

// Variant classes
const variantClasses = computed(() => {
  const base = 'w-full transition-colors duration-200'

  switch (props.variant) {
    case 'outlined':
      return cn(
        base,
        'border-2 rounded-lg',
        focused.value ? 'border-primary ring-2 ring-primary/20' : 'border-input',
        hasError.value && 'border-destructive focus:border-destructive focus:ring-destructive/20',
      )
    case 'filled':
      return cn(
        base,
        'border-b-2 bg-muted/50 rounded-t-lg',
        focused.value ? 'border-primary bg-muted' : 'border-transparent',
        hasError.value && 'border-destructive',
      )
    case 'solo':
      return cn(
        base,
        'rounded-lg shadow-sm',
        focused.value ? 'shadow-md' : 'shadow-sm',
        'bg-card border border-transparent',
      )
    case 'underlined':
      return cn(
        base,
        'border-b-2 rounded-none border-x-0 border-t-0 px-0',
        focused.value ? 'border-primary' : 'border-muted-foreground/30',
        hasError.value && 'border-destructive',
      )
    case 'plain':
      return cn(base, 'border-0 bg-transparent')
    default:
      return base
  }
})

// Density classes
const densityClasses = computed(() => {
  switch (props.density) {
    case 'compact':
      return 'text-sm min-h-8'
    case 'comfortable':
      return 'text-base min-h-10'
    case 'default':
    default:
      return 'text-base min-h-12'
  }
})

// Resize classes
const resizeClasses = computed(() => {
  if (props.noResize) return 'resize-none'
  if (anyAutoResize.value) return 'resize-none'
  return 'resize-y'
})

// Watch for programmatic value changes to trigger auto-resize
watch(internalValue, () => {
  if (anyAutoResize.value) {
    nextTick(() => autoResize())
  }
})

onMounted(() => {
  nextTick(() => {
    measureHeights()
    if (anyAutoResize.value) {
      autoResize()
    }
  })
})
</script>

<template>
  <div :class="cn('relative space-y-2', props.class)">
    <!-- Label -->
    <Label
      v-if="label"
      :for="textareaId"
      :class="[
        'text-foreground text-sm font-medium',
        props.labelClass,
        focused && 'text-primary',
        hasError && 'text-destructive',
      ]"
    >
      {{ label }}
      <span v-if="required" class="text-destructive ml-0.5">*</span>
    </Label>

    <!-- Control wrapper -->
    <div
      :class="
        cn(
          'relative flex items-center',
          variantClasses,
          densityClasses,
          disabled && 'pointer-events-none opacity-50',
          props.readonly && !disabled && 'cursor-default',
          props.rounded !== 'none' && `rounded-${props.rounded}`,
        )
      "
      :style="props.bgColor ? { backgroundColor: props.bgColor } : {}"
    >
      <!-- Prefix -->
      <span
        v-if="prefix"
        class="text-muted-foreground pointer-events-none absolute top-3 left-3 text-sm"
        :class="{ 'opacity-50': !persistentPrefix && !focused }"
      >
        {{ prefix }}
      </span>

      <!-- Textarea -->
      <textarea
        :id="textareaId"
        :ref="
          (el) => {
            textareaRef = el as HTMLTextAreaElement
          }
        "
        :value="internalValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :name="name"
        :autocomplete="autocomplete"
        :autofocus="autofocus"
        :spellcheck="spellcheck"
        :maxlength="maxLength"
        :rows="computedRows"
        :aria-describedby="hasError || hasSuccess || hint ? descriptionId : undefined"
        :aria-invalid="hasError || undefined"
        :class="
          cn(
            'w-full flex-1 resize-y bg-transparent outline-none',
            densityClasses,
            resizeClasses,
            prefix ? 'pl-16' : 'pl-3',
            suffix ? 'pr-16' : showClear ? 'pr-10' : 'pr-3',
            showCountEnabled && 'pb-6',
            'py-2',
            props.inputClass,
          )
        "
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="emits('keydown', $event)"
        @keyup="emits('keyup')"
      />

      <!-- Suffix -->
      <span
        v-if="suffix"
        class="text-muted-foreground pointer-events-none absolute top-3 right-3 text-sm"
        :class="{ 'opacity-50': !persistentSuffix && !focused }"
      >
        {{ suffix }}
      </span>

      <!-- Clear button -->
      <button
        v-if="showClear"
        type="button"
        tabindex="-1"
        aria-label="Clear"
        class="text-muted-foreground hover:text-foreground focus-visible:ring-ring absolute top-3 flex items-center justify-center rounded-sm transition-colors focus-visible:ring-2 focus-visible:outline-none"
        :class="suffix ? 'right-10' : 'right-3'"
        @click="handleClear"
      >
        <X class="size-4" aria-hidden="true" />
      </button>

      <!-- Loading spinner -->
      <div v-if="loading" class="absolute top-3 right-3 flex items-center justify-center">
        <Loader class="text-muted-foreground size-4 animate-spin" />
      </div>

      <!-- Success/Error indicators -->
      <div v-if="hasSuccess && !loading" class="text-success absolute top-3 right-3 flex items-center justify-center">
        <Check class="size-4" aria-hidden="true" />
      </div>
      <div v-if="hasError && !loading" class="text-destructive absolute top-3 right-3 flex items-center justify-center">
        <AlertCircle class="size-4" aria-hidden="true" />
      </div>

      <!-- Show count -->
      <div
        v-if="showCountEnabled"
        class="text-muted-foreground pointer-events-none absolute right-3 bottom-1.5 text-xs"
        :class="{ 'text-destructive': props.maxLength !== undefined && currentLength > props.maxLength }"
      >
        {{ countText }}
      </div>
    </div>

    <!-- Messages (hint, error, success) -->
    <div :id="descriptionId" class="mt-1.5">
      <!-- Hint -->
      <p
        v-if="hint && (!hasError || persistentHint) && !focused"
        :class="cn('text-muted-foreground text-sm', props.hintClass)"
      >
        {{ hint }}
      </p>

      <!-- Error messages -->
      <p
        v-for="(msg, i) in computedErrorMessages"
        :key="`error-${i}`"
        class="text-destructive flex items-center gap-1 text-sm"
        role="alert"
      >
        <AlertCircle class="size-3 shrink-0" aria-hidden="true" />
        {{ msg }}
      </p>

      <!-- Success messages -->
      <p
        v-for="(msg, i) in computedSuccessMessages"
        :key="`success-${i}`"
        class="text-success flex items-center gap-1 text-sm"
      >
        <Check class="size-3 shrink-0" aria-hidden="true" />
        {{ msg }}
      </p>

      <!-- Counter (legacy) -->
      <div
        v-if="computedCounter !== null"
        class="text-muted-foreground mt-1 text-right text-xs"
        :class="{ 'text-destructive': currentLength > computedCounter }"
      >
        {{ currentLength }} / {{ computedCounter }}
      </div>
    </div>

    <slot />
  </div>
</template>

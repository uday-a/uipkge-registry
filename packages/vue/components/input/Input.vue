<script setup lang="ts">
import type { Component, HTMLAttributes } from 'vue'
import { computed, ref, useAttrs, useSlots } from 'vue'
import { useVModel } from '@vueuse/core'
import { cn } from '@/lib/utils'
import { X, Eye, EyeOff } from 'lucide-vue-next'

defineOptions({
  inheritAttrs: false,
})

interface Props {
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes['class']
  size?: 'small' | 'middle' | 'large'
  variant?: 'outlined' | 'filled' | 'borderless'
  status?: 'error' | 'warning'
  prefix?: string
  suffix?: string
  // Convenience props for the very common "icon at the start/end" case.
  // Pass a lucide-vue-next (or any) component: `:prefix-icon="Mail"`.
  // If both `prefix` (string) and `prefixIcon` are set, the icon wins.
  prefixIcon?: Component
  suffixIcon?: Component
  addonBefore?: string
  addonAfter?: string
  allowClear?: boolean
  showCount?: boolean
  showPasswordToggle?: boolean
  disabled?: boolean
  readonly?: boolean
  maxlength?: number | string
  minlength?: number | string
  type?: string
  placeholder?: string
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'middle',
  variant: 'outlined',
  type: 'text',
})

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const slots = useSlots()
const attrs = useAttrs()

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})

const inputRef = ref<HTMLInputElement | null>(null)
const focused = ref(false)
const hovered = ref(false)
const passwordVisible = ref(false)

const isPassword = computed(() => props.type === 'password')
const hasPrefix = computed(() => !!props.prefix || !!props.prefixIcon || !!slots.prefix)
const hasSuffix = computed(() => !!props.suffix || !!props.suffixIcon || !!slots.suffix)
const hasAddonBefore = computed(() => !!props.addonBefore || !!slots.addonBefore)
const hasAddonAfter = computed(() => !!props.addonAfter || !!slots.addonAfter)

const hasRightConfig = computed(() => {
  const hasCount = props.showCount && props.maxlength != null
  const hasPasswordToggle = props.showPasswordToggle && isPassword.value
  return props.allowClear || hasPasswordToggle || hasCount
})

const hasRight = computed(() => hasSuffix.value || hasRightConfig.value)

const currentLength = computed(() => String(modelValue.value ?? '').length)

const showClear = computed(() => {
  return (
    props.allowClear && !!modelValue.value && (focused.value || hovered.value) && !props.disabled && !props.readonly
  )
})

const showPasswordToggleBtn = computed(() => {
  return isPassword.value && props.showPasswordToggle && !props.disabled && !props.readonly
})

const showCountDisplay = computed(() => {
  return props.showCount && props.maxlength != null
})

const computedType = computed(() => {
  if (!isPassword.value) return props.type
  return passwordVisible.value ? 'text' : 'password'
})

const sizeClasses = {
  small: 'h-8 text-xs',
  middle: 'h-9 text-base md:text-sm',
  large: 'h-11 text-base',
}

const wrapperRounded = computed(() => {
  if (hasAddonBefore.value && hasAddonAfter.value) return 'rounded-none'
  if (hasAddonBefore.value) return 'rounded-l-none rounded-r-md'
  if (hasAddonAfter.value) return 'rounded-r-none rounded-l-md'
  return 'rounded-md'
})

const resolvedAriaInvalid = computed(() => {
  if (props.status === 'error') return true as const
  const raw = attrs['aria-invalid']
  if (raw === true || raw === 'true' || raw === '' || raw === 'grammar' || raw === 'spelling') {
    return raw === '' ? true : (raw as boolean | 'true' | 'false' | 'grammar' | 'spelling')
  }
  if (raw === false || raw === 'false') return false as const
  return undefined
})

const wrapperClasses = computed(() => {
  const base = 'flex w-full items-center gap-1.5 overflow-hidden border transition-[color,box-shadow] outline-none'
  const sizeClass = sizeClasses[props.size]

  const variantMap = {
    outlined: 'border-input bg-transparent shadow-xs',
    filled: 'border-transparent bg-muted/50 shadow-none',
    borderless: 'border-transparent bg-transparent shadow-none',
  }
  const variantClass = variantMap[props.variant]

  const statusMap = {
    error:
      'border-destructive focus-within:border-destructive focus-within:ring-destructive/20 dark:focus-within:ring-destructive/40',
    warning: 'border-warning focus-within:border-warning focus-within:ring-warning/20',
  }
  const statusClass = props.status ? statusMap[props.status] : ''

  const focusClass = !props.status ? 'focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]' : ''

  const disabledClass = props.disabled ? 'pointer-events-none opacity-50 cursor-not-allowed bg-muted/30' : ''

  const ariaInvalidClass =
    'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'

  return cn(
    base,
    sizeClass,
    variantClass,
    statusClass,
    focusClass,
    disabledClass,
    ariaInvalidClass,
    wrapperRounded.value,
    props.class,
  )
})

function addonClasses(position: 'before' | 'after') {
  const roundedClass =
    position === 'before' ? 'rounded-l-md rounded-r-none border-r-0' : 'rounded-r-md rounded-l-none border-l-0'
  return cn(
    'flex items-center bg-muted px-3 text-sm text-muted-foreground border border-input',
    roundedClass,
    sizeClasses[props.size],
  )
}

const inputPadding = computed(() => {
  const hasLeft = hasPrefix.value
  const right = hasRight.value
  const leftPad = props.size === 'small' ? 'pl-2' : props.size === 'large' ? 'pl-3' : 'pl-2.5'
  const rightPad = props.size === 'small' ? 'pr-2' : props.size === 'large' ? 'pr-3' : 'pr-2.5'

  if (!hasLeft && !right) return cn(leftPad, rightPad)
  if (hasLeft && !right) return cn('pl-0', rightPad)
  if (!hasLeft && right) return cn(leftPad, 'pr-0')
  return 'px-0'
})

function handleClear() {
  modelValue.value = ''
  inputRef.value?.focus()
}

function togglePassword() {
  passwordVisible.value = !passwordVisible.value
  inputRef.value?.focus()
}
</script>

<template>
  <div class="flex w-full">
    <!-- Addon before -->
    <div v-if="hasAddonBefore" :class="addonClasses('before')">
      <slot name="addonBefore">{{ addonBefore }}</slot>
    </div>

    <!-- Input wrapper -->
    <div
      :class="wrapperClasses"
      data-uipkge
      data-slot="input"
      :aria-invalid="resolvedAriaInvalid"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
      @click="inputRef?.focus()"
    >
      <!-- Prefix -->
      <span
        v-if="hasPrefix"
        class="text-muted-foreground pointer-events-none shrink-0 select-none"
        :class="props.size === 'small' ? 'pl-2' : props.size === 'large' ? 'pl-3' : 'pl-2.5'"
      >
        <slot name="prefix">
          <component :is="prefixIcon" v-if="prefixIcon" class="size-4" aria-hidden="true" />
          <template v-else>{{ prefix }}</template>
        </slot>
      </span>

      <!-- Native input -->
      <input
        :id="id"
        ref="inputRef"
        v-model="modelValue"
        v-bind="attrs"
        :type="computedType"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :minlength="minlength"
        :placeholder="placeholder"
        :aria-invalid="resolvedAriaInvalid"
        :class="
          cn(
            'w-full min-w-0 flex-1 bg-transparent outline-none',
            'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
            'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'disabled:cursor-not-allowed',
            inputPadding,
          )
        "
        @focus="focused = true"
        @blur="focused = false"
      />

      <!-- Suffix / Actions -- only render when there is something on the
           right; otherwise an empty padded flex child steals horizontal
           space from plain inputs. Built-in actions (clear / password
           toggle / count) render first, then the user's suffix so the
           slotted content is always the rightmost element in the row. -->
      <div
        v-if="hasRight"
        class="flex shrink-0 items-center gap-1"
        :class="props.size === 'small' ? 'pr-2' : props.size === 'large' ? 'pr-3' : 'pr-2.5'"
      >
        <button
          v-if="showClear"
          type="button"
          aria-label="Clear input"
          class="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 shrink-0 rounded p-0.5 transition-colors focus-visible:ring-1 focus-visible:outline-none"
          @mousedown.prevent="handleClear"
          @click="handleClear"
        >
          <X class="size-4" aria-hidden="true" />
        </button>

        <button
          v-if="showPasswordToggleBtn"
          type="button"
          :aria-label="passwordVisible ? 'Hide password' : 'Show password'"
          :aria-pressed="passwordVisible"
          class="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 shrink-0 rounded p-0.5 transition-colors focus-visible:ring-1 focus-visible:outline-none"
          @mousedown.prevent="togglePassword"
          @click="togglePassword"
        >
          <EyeOff v-if="passwordVisible" class="size-4" aria-hidden="true" />
          <Eye v-else class="size-4" aria-hidden="true" />
        </button>

        <span v-if="showCountDisplay" class="text-muted-foreground pointer-events-none text-xs select-none">
          {{ currentLength }}/{{ maxlength }}
        </span>

        <span v-if="hasSuffix" class="text-muted-foreground pointer-events-none select-none">
          <slot name="suffix">
            <component :is="suffixIcon" v-if="suffixIcon" class="size-4" aria-hidden="true" />
            <template v-else>{{ suffix }}</template>
          </slot>
        </span>
      </div>
    </div>

    <!-- Addon after -->
    <div v-if="hasAddonAfter" :class="addonClasses('after')">
      <slot name="addonAfter">{{ addonAfter }}</slot>
    </div>
  </div>
</template>

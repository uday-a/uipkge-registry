<script setup lang="ts">
import type { CheckboxRootProps } from 'reka-ui'
import type { ComputedRef, HTMLAttributes } from 'vue'
import { computed, getCurrentInstance, inject, useId } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { Check, Minus, Loader2 } from 'lucide-vue-next'
import { CheckboxIndicator, CheckboxRoot, useForwardPropsEmits } from 'reka-ui'
import { cn } from '@/lib/utils'

// CLAUDE.md mandate: `interface Props extends ReakUiX` bails in Vue 3.5+
// because reka-ui's package.json lacks an `exports.types` condition. The
// `defineProps<External & Extra>()` intersection delegates type extraction
// back to the installed TypeScript and is the documented workaround.
export type CheckboxProps = Omit<CheckboxRootProps<boolean | string>, 'defaultValue' | 'modelValue'> & {
  class?: HTMLAttributes['class']
  /** The controlled checked state of the checkbox. Can be binded with v-model. */
  modelValue?: boolean | 'indeterminate' | null
  /** The value given as data when submitted with a name. */
  value?: string
  /** Id of the element */
  id?: string
  /** The value used when the checkbox is checked. Defaults to `true`. */
  trueValue?: boolean | string
  /** The value used when the checkbox is unchecked. Defaults to `false`. */
  falseValue?: boolean | string
  /** Size of the checkbox */
  size?: 'sm' | 'md' | 'lg'
  /** Custom color for the checked state - matches Vuetify color system */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | string
  /** Label text displayed next to the checkbox */
  label?: string
  /** Hint text shown below the checkbox */
  hint?: string
  /** Error message to display */
  errorMessages?: string | string[]
  /** Whether to show error state */
  error?: boolean
  /** When `true`, prevents the user from interacting with the checkbox */
  disabled?: boolean
  /** When `true`, the checkbox is in readonly state */
  readonly?: boolean
  /** When `true`, shows an indeterminate state */
  indeterminate?: boolean
  /** Density of the checkbox - affects spacing */
  density?: 'compact' | 'default' | 'comfortable'
  /** When `true`, the icon is hidden */
  hideIcon?: boolean
  /** Loading state - shows a spinner */
  loading?: boolean
  /** Ripple effect on click */
  ripple?: boolean
  /** Custom icon to show when checked */
  checkedIcon?: any
  /** Custom icon to show when indeterminate */
  indeterminateIcon?: any
  /** Label position - before or after the checkbox */
  labelPosition?: 'before' | 'after'
  /** Whether the checkbox appears flat (no elevation) */
  flat?: boolean
  /** Whether the checkbox has a background color */
  bgColor?: boolean
  /** Inline text style */
  inline?: boolean
  /** Name attribute for form submission */
  name?: string
}

const props = withDefaults(defineProps<CheckboxProps>(), {
  size: 'md',
  density: 'default',
  color: 'primary',
  trueValue: true,
  falseValue: false,
  hideIcon: false,
  ripple: true,
  labelPosition: 'after',
  flat: false,
  bgColor: false,
  inline: false,
})

const emits = defineEmits<{
  'update:modelValue': [value: boolean | 'indeterminate']
  change: [value: boolean | 'indeterminate']
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const delegatedProps = reactiveOmit(
  props,
  'class',
  'size',
  'color',
  'label',
  'hint',
  'errorMessages',
  'error',
  'disabled',
  'readonly',
  'indeterminate',
  'density',
  'hideIcon',
  'loading',
  'ripple',
  'checkedIcon',
  'indeterminateIcon',
  'labelPosition',
  'flat',
  'bgColor',
  'inline',
  'trueValue',
  'falseValue',
  'modelValue',
  'name',
)

const forwarded = useForwardPropsEmits(delegatedProps, emits)

// Injected group context
const groupContext = inject<{ name?: ComputedRef<string | undefined> } | null>('checkboxGroupContext', null)
const actualName = computed(() => props.name ?? groupContext?.name?.value)

// When `label` is provided without an explicit `id`, generate one so the
// associated <label for> actually toggles the control.
const autoId = useId()
const resolvedId = computed(() => props.id ?? (props.label ? autoId : undefined))

// Size classes
const sizeClasses = {
  sm: 'size-3.5',
  md: 'size-4',
  lg: 'size-5',
}

const iconSizes = {
  sm: 'size-2.5',
  md: 'size-3.5',
  lg: 'size-4',
}

// Color classes for checked state
const colorClasses: Record<string, string> = {
  primary:
    'data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:border-primary',
  secondary:
    'data-[state=checked]:bg-secondary data-[state=checked]:border-secondary data-[state=indeterminate]:bg-secondary data-[state=indeterminate]:border-secondary',
  success:
    'data-[state=checked]:bg-success data-[state=checked]:border-success data-[state=indeterminate]:bg-success data-[state=indeterminate]:border-success',
  warning:
    'data-[state=checked]:bg-warning data-[state=checked]:border-warning data-[state=indeterminate]:bg-warning data-[state=indeterminate]:border-warning',
  error:
    'data-[state=checked]:bg-destructive data-[state=checked]:border-destructive data-[state=indeterminate]:bg-destructive data-[state=indeterminate]:border-destructive',
  info: 'data-[state=checked]:bg-info data-[state=checked]:border-info data-[state=indeterminate]:bg-info data-[state=indeterminate]:border-info',
}

// Density classes
const densityClasses = {
  compact: 'gap-1',
  default: 'gap-2',
  comfortable: 'gap-3',
}

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

// Determine if the checkbox is in an indeterminate state
const isIndeterminate = computed(() => {
  return props.indeterminate || props.modelValue === 'indeterminate'
})

// Detect whether the parent bound v-model (looks for an onUpdate:modelValue
// listener) and whether they passed an initial modelValue prop at all (Vue
// auto-coerces Boolean-union props to `false` when not provided, so a prop
// check alone can't distinguish controlled vs unbound usage).
const instance = getCurrentInstance()
const isControlled = computed(() => Boolean(instance?.vnode?.props?.['onUpdate:modelValue']))
const userPassedModelValue = computed(() => {
  const raw = instance?.vnode?.props
  return Boolean(raw && ('modelValue' in raw || 'model-value' in raw))
})

// Bind model-value only when actually controlled. Otherwise seed Reka's
// internal state via default-value so click toggles work.
const checkboxStateBindings = computed(() => {
  if (isIndeterminate.value) return { 'model-value': 'indeterminate' as const }
  if (isControlled.value) return { 'model-value': props.modelValue }
  if (userPassedModelValue.value) return { 'default-value': Boolean(props.modelValue) }
  return { 'default-value': false }
})

// Build checkbox classes
const checkboxClasses = computed(() => {
  return cn(
    'peer border-input data-[state=checked]:text-primary-foreground data-[state=indeterminate]:text-primary-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shrink-0 rounded-[4px] border shadow-xs transition-colors duration-200 outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50',
    sizeClasses[props.size],
    colorClasses[props.color] || colorClasses.primary,
    hasError.value &&
      'border-destructive data-[state=checked]:!bg-destructive data-[state=checked]:!border-destructive data-[state=indeterminate]:!bg-destructive data-[state=indeterminate]:!border-destructive',
    props.flat && 'shadow-none',
    props.class,
  )
})
</script>

<template>
  <div class="flex items-start" :class="[densityClasses[density], inline ? 'inline-flex' : 'flex-col']">
    <label
      v-if="label && labelPosition === 'before'"
      :for="resolvedId"
      class="mr-2 cursor-pointer text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      :class="[hasError ? 'text-destructive' : '', disabled && 'cursor-not-allowed opacity-50']"
    >
      {{ label }}
    </label>

    <div class="flex items-center">
      <CheckboxRoot
        v-bind="{ 'data-slot': 'checkbox', ...forwarded, ...checkboxStateBindings }"
        :id="resolvedId"
        v-slot="slotProps"
        :value="value"
        :disabled="disabled"
        :name="actualName"
        :aria-invalid="hasError || undefined"
        :class="checkboxClasses"
        @update:model-value="(val: boolean | 'indeterminate') => emits('update:modelValue', val)"
      >
        <CheckboxIndicator
          data-uipkge
          data-slot="checkbox-indicator"
          class="grid place-content-center text-current transition-none"
          :force-mount="isIndeterminate || hideIcon"
        >
          <slot v-bind="slotProps">
            <Loader2 v-if="loading" :class="[iconSizes[size], 'animate-spin']" />
            <Minus v-else-if="isIndeterminate" :class="[iconSizes[size], 'checkbox-indicator-icon']" />
            <Check v-else-if="!hideIcon" :class="[iconSizes[size], 'checkbox-indicator-icon']" />
          </slot>
        </CheckboxIndicator>
      </CheckboxRoot>

      <label
        v-if="label && labelPosition === 'after'"
        :for="resolvedId"
        class="ml-2 cursor-pointer text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        :class="[hasError ? 'text-destructive' : '', disabled && 'cursor-not-allowed opacity-50']"
      >
        {{ label }}
      </label>
    </div>

    <p v-if="hint && !hasError" class="text-muted-foreground mt-1 text-xs">
      {{ hint }}
    </p>

    <div v-if="hasError" class="mt-1 flex flex-col gap-0.5">
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

<style>
/* Subtle scale-in when the check / indeterminate mark mounts. */
@keyframes checkbox-check-in {
  0% {
    opacity: 0;
    transform: scale(0.55);
  }
  70% {
    opacity: 1;
    transform: scale(1.08);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

[data-slot='checkbox-indicator'] .checkbox-indicator-icon {
  animation: checkbox-check-in 200ms cubic-bezier(0.22, 1.2, 0.36, 1) both;
}

@media (prefers-reduced-motion: reduce) {
  [data-slot='checkbox-indicator'] .checkbox-indicator-icon {
    animation: none !important;
  }
}
</style>

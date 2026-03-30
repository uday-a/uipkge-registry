<script setup lang="ts">
import type { RadioGroupRootProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { computed, getCurrentInstance, provide, reactive, toRef } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { RadioGroupRoot, useForwardPropsEmits } from 'reka-ui'
import { cn } from '@/lib/utils'

export type RadioOption = string | { label: string; value: string; disabled?: boolean }

// CLAUDE.md mandate: avoid `interface extends ReakUiX` (SFC compiler bails
// in Vue 3.5+ because reka-ui has no exports.types). The intersection form
// `defineProps<External & Extra>()` delegates type extraction to TS.
export type RadioGroupProps = Omit<RadioGroupRootProps, 'defaultValue' | 'modelValue'> & {
  class?: HTMLAttributes['class']
  /** The controlled value of the radio items to check. Can be binded with v-model. */
  modelValue?: any
  /** The value of the radio items that should be checked when initially rendered. */
  defaultValue?: any
  /** When `true`, prevents the user from interacting with the radio group */
  disabled?: boolean
  /** The orientation of the radio items */
  orientation?: 'horizontal' | 'vertical'
  /** When `true`, keyboard navigation will loop from last item to first, and vice versa */
  loop?: boolean
  /** Label for the radio group */
  label?: string
  /** Hint text for the radio group */
  hint?: string
  /** Error messages to display */
  errorMessages?: string | string[]
  /** Whether to show error state */
  error?: boolean
  /** Density of the radio items */
  density?: 'compact' | 'default' | 'comfortable'
  /** Whether the radio group appears flat */
  flat?: boolean
  /** Whether to show a border around the group */
  bordered?: boolean
  /** The reading direction */
  dir?: 'ltr' | 'rtl'
  /** Array of options to render automatically */
  options?: RadioOption[]
  /** Size of button-style radios */
  size?: 'small' | 'middle' | 'large'
  /** Type of options to render */
  optionType?: 'default' | 'button'
  /** Visual variant for button-style radios */
  buttonVariant?: 'outline' | 'solid'
}

const props = withDefaults(defineProps<RadioGroupProps>(), {
  orientation: 'vertical',
  density: 'default',
  flat: false,
  bordered: false,
  loop: true,
  disabled: false,
  size: 'middle',
  optionType: 'default',
  buttonVariant: 'outline',
})

const emits = defineEmits<{
  'update:modelValue': [value: any]
}>()

// reactive + toRef so children see prop updates (plain object would freeze first render).
provide(
  'radioGroup',
  reactive({
    disabled: toRef(props, 'disabled'),
    size: toRef(props, 'size'),
    optionType: toRef(props, 'optionType'),
    buttonVariant: toRef(props, 'buttonVariant'),
    orientation: toRef(props, 'orientation'),
  }),
)

const delegatedProps = reactiveOmit(
  props,
  'class',
  'label',
  'hint',
  'errorMessages',
  'error',
  'density',
  'flat',
  'bordered',
  'defaultValue',
  'modelValue',
  'options',
  'size',
  'optionType',
  'buttonVariant',
)

const forwarded = useForwardPropsEmits(delegatedProps, emits)

const instance = getCurrentInstance()
const isControlled = computed(() => Boolean(instance?.vnode?.props?.['onUpdate:modelValue']))
const userPassedModelValue = computed(() => {
  const raw = instance?.vnode?.props
  return Boolean(raw && ('modelValue' in raw || 'model-value' in raw))
})

const radioStateBindings = computed(() => {
  if (isControlled.value) return { 'model-value': props.modelValue }
  // Uncontrolled — seed default-value from explicit modelValue or defaultValue prop.
  if (props.defaultValue !== undefined) return { 'default-value': props.defaultValue }
  if (userPassedModelValue.value) return { 'default-value': props.modelValue }
  return {}
})

// Density classes
const densityClasses = {
  compact: 'gap-1',
  default: 'gap-3',
  comfortable: 'gap-4',
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

function normalizeOption(option: RadioOption): { label: string; value: string; disabled?: boolean } {
  if (typeof option === 'string') {
    return { label: option, value: option }
  }
  return option
}
</script>

<template>
  <!--
    `props.class` is forwarded ONLY to RadioGroupRoot below (per shadcn
    convention). Applying it on the outer wrapper as well caused grid-*
    utilities to fight the wrapper's `flex flex-col`, so consumers had
    to fall back to column-count hacks. Forwarding to one element keeps
    layout intent unambiguous.
  -->
  <div class="flex flex-col gap-2">
    <label v-if="label" class="text-sm font-medium">
      {{ label }}
    </label>

    <p v-if="hint && !hasError" class="text-muted-foreground text-xs">
      {{ hint }}
    </p>

    <RadioGroupRoot
      v-slot="slotProps"
      v-bind="{ 'data-slot': 'radio-group', ...forwarded, ...radioStateBindings }"
      :class="
        cn(
          'grid gap-3',
          orientation === 'horizontal' && 'flex flex-row items-center gap-4',
          optionType === 'button' && orientation === 'horizontal' && 'flex flex-row items-stretch gap-0',
          optionType === 'button' && orientation === 'vertical' && 'flex flex-col items-stretch gap-0',
          optionType !== 'button' && densityClasses[density],
          bordered && 'rounded-lg border p-4',
          props.class,
        )
      "
      @update:model-value="(val: any) => emits('update:modelValue', val)"
    >
      <template v-if="options && options.length > 0">
        <template v-if="optionType === 'button'">
          <RadioButton
            v-for="option in options"
            :key="normalizeOption(option).value"
            :value="normalizeOption(option).value"
            :disabled="normalizeOption(option).disabled"
            :label="normalizeOption(option).label"
          />
        </template>
        <template v-else>
          <div v-for="option in options" :key="normalizeOption(option).value" class="flex items-center gap-2">
            <RadioGroupItem
              :id="normalizeOption(option).value"
              :value="normalizeOption(option).value"
              :disabled="normalizeOption(option).disabled"
            />
            <label
              :for="normalizeOption(option).value"
              class="cursor-pointer text-sm font-medium select-none"
              :class="normalizeOption(option).disabled && 'cursor-not-allowed opacity-50'"
            >
              {{ normalizeOption(option).label }}
            </label>
          </div>
        </template>
      </template>

      <slot v-bind="slotProps" />
    </RadioGroupRoot>

    <div v-if="hasError" class="flex flex-col gap-0.5">
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

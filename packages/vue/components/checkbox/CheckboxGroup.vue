<script setup lang="ts">
import { computed, provide } from 'vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { CheckboxGroupRoot, useForwardProps } from 'reka-ui'
import Checkbox from './Checkbox.vue'

export interface CheckboxOption {
  label: string
  value: string
  disabled?: boolean
}

export interface CheckboxGroupProps {
  class?: HTMLAttributes['class']
  /** The value of the checkbox items that should be checked when initially rendered. */
  defaultValue?: string[]
  /** When `true`, prevents the user from interacting with the checkboxes. */
  disabled?: boolean
  /** Specifies whether the checkbox group is in an error state */
  error?: boolean
  /** Error messages to display */
  errorMessages?: string | string[]
  /** Label for the group */
  label?: string
  /** Hint text for the group */
  hint?: string
  /** The orientation of the checkboxes */
  orientation?: 'horizontal' | 'vertical'
  /** Whether to show a border around the group */
  bordered?: boolean
  /** Density of the checkboxes */
  density?: 'compact' | 'default' | 'comfortable'
  /** Options to render as checkboxes automatically */
  options?: (string | CheckboxOption)[]
  /** Name attribute for all checkboxes in the group */
  name?: string
  /** Inline layout (alias for horizontal) */
  inline?: boolean
}

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
  orientation: 'vertical',
  density: 'default',
  bordered: false,
})

const modelValue = defineModel<string[]>()

const forwarded = useForwardProps(
  reactiveOmit(
    props,
    'class',
    'label',
    'hint',
    'error',
    'errorMessages',
    'density',
    'bordered',
    'options',
    'name',
    'inline',
  ),
)

const actualOrientation = computed(() => (props.inline ? 'horizontal' : props.orientation))

provide('checkboxGroupContext', {
  name: computed(() => props.name),
})
</script>

<template>
  <CheckboxGroupRoot
    v-bind="forwarded"
    data-slot="checkbox-group"
    :model-value="modelValue"
    @update:model-value="modelValue = $event"
    :name="name"
    :orientation="actualOrientation"
    class="flex flex-col gap-2"
    :class="[
      actualOrientation === 'horizontal' ? 'flex-row items-center' : 'flex-col',
      bordered && 'rounded-lg border p-4',
      props.class,
    ]"
  >
    <label v-if="label" class="text-sm font-medium">
      {{ label }}
    </label>

    <p v-if="hint && !error" class="text-muted-foreground text-xs">
      {{ hint }}
    </p>

    <div
      class="flex gap-4"
      :class="[actualOrientation === 'horizontal' ? 'flex-row flex-wrap items-center' : 'flex-col']"
    >
      <template v-if="options && options.length > 0">
        <Checkbox
          v-for="(option, i) in options"
          :key="i"
          :value="typeof option === 'string' ? option : option.value"
          :label="typeof option === 'string' ? option : option.label"
          :disabled="disabled || (typeof option === 'string' ? undefined : option.disabled)"
          :name="name"
          :density="density"
        />
      </template>

      <slot v-else :model-value="modelValue" />
    </div>

    <div v-if="error || errorMessages" class="flex flex-col gap-0.5">
      <p v-if="typeof errorMessages === 'string'" class="text-destructive text-xs">
        {{ errorMessages }}
      </p>
      <template v-else>
        <p v-for="(msg, i) in errorMessages" :key="i" class="text-destructive text-xs">
          {{ msg }}
        </p>
      </template>
    </div>
  </CheckboxGroupRoot>
</template>

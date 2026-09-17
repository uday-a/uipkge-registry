<script setup lang="ts">
import type { ToggleEmits } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { computed, getCurrentInstance } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { Toggle, useForwardPropsEmits } from 'reka-ui'
import { cn } from '@/lib/utils'
import { toggleVariants } from './toggle.variants'

// Inlined unions for variant/size: Vue's SFC compiler can't extract
// runtime props from indexed-access types like `ToggleVariants['variant']`,
// so we spell the unions out. cva still validates at runtime.
// Same goes for `ToggleProps` from reka-ui (no exports.types condition);
// we inline only the props we actually expose.
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    variant?: 'default' | 'outline'
    size?: 'default' | 'sm' | 'lg'
    asChild?: boolean
    as?: string | object
    defaultValue?: boolean
    modelValue?: boolean
    pressed?: boolean
    disabled?: boolean
    name?: string
    required?: boolean
  }>(),
  {
    variant: 'default',
    size: 'default',
    disabled: false,
  },
)

const emits = defineEmits<ToggleEmits>()

const delegatedProps = reactiveOmit(props, 'class', 'size', 'variant', 'modelValue')
const forwarded = useForwardPropsEmits(delegatedProps, emits)

const instance = getCurrentInstance()
const isControlled = computed(() => Boolean(instance?.vnode?.props?.['onUpdate:modelValue']))
const userPassedModelValue = computed(() => {
  const raw = instance?.vnode?.props
  return Boolean(raw && ('modelValue' in raw || 'model-value' in raw))
})

const toggleStateBindings = computed(() => {
  if (isControlled.value) return { 'model-value': props.modelValue }
  if (userPassedModelValue.value) return { 'default-value': Boolean(props.modelValue) }
  return { 'default-value': false }
})
</script>

<template>
  <Toggle
    v-slot="slotProps"
    data-uipkge
    data-slot="toggle"
    v-bind="{ ...forwarded, ...toggleStateBindings }"
    :class="cn(toggleVariants({ variant, size }), props.class)"
  >
    <slot v-bind="slotProps" />
  </Toggle>
</template>

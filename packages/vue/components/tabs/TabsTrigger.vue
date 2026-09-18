<script setup lang="ts">
import { computed, inject } from 'vue'
import type { HTMLAttributes } from 'vue'
import { TabsTrigger } from 'reka-ui'
import { cn } from '@/lib/utils'
import { tabsTriggerVariants } from './tabs.variants'

// Inlined unions: SFC compiler can't extract runtime props from
// indexed-access types like TabsTriggerVariants['size'].
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    size?: 'default' | 'sm' | 'lg'
    variant?: 'segmented' | 'pill' | 'underline'
    orientation?: 'horizontal' | 'vertical'
    value: string
    disabled?: boolean
  }>(),
  {
    disabled: false,
  },
)

const tabsOrientation = inject<{ value: 'horizontal' | 'vertical' } | 'horizontal' | 'vertical'>(
  Symbol.for('tabsOrientation'),
  'horizontal',
)
const effectiveOrientation = computed(() => {
  if (props.orientation) return props.orientation
  return typeof tabsOrientation === 'string' ? tabsOrientation : tabsOrientation.value
})
</script>

<template>
  <TabsTrigger
    v-slot="slotProps"
    :value="props.value"
    :disabled="props.disabled"
    data-uipkge
    data-slot="tabs-trigger"
    :class="
      cn(
        tabsTriggerVariants({
          size: props.size,
          variant: props.variant,
          orientation: effectiveOrientation,
        }),
        props.class,
      )
    "
  >
    <slot v-bind="slotProps" />
  </TabsTrigger>
</template>

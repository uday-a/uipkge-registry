<script setup lang="ts">
import { computed, provide } from 'vue'
import type { AccordionRootEmits } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { AccordionRoot, useForwardPropsEmits } from 'reka-ui'
import { cn } from '@/lib/utils'
import { accordionVariants } from './accordion.variants'

// Inlined unions: SFC compiler can't extract runtime props from
// `NonNullable<AccordionVariants['variant']>` or reka-ui's
// `AccordionRootProps`. Inline only the surface we expose.
const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    variant?: 'default' | 'separated' | 'ghost'
    type?: 'single' | 'multiple'
    modelValue?: string | string[]
    defaultValue?: string | string[]
    collapsible?: boolean
    disabled?: boolean
    dir?: 'ltr' | 'rtl'
    orientation?: 'horizontal' | 'vertical'
    asChild?: boolean
    as?: string | object
  }>(),
  {
    variant: 'default',
  },
)

const emits = defineEmits<AccordionRootEmits>()

const delegated = reactiveOmit(props, 'class', 'variant')
const forwarded = useForwardPropsEmits(delegated, emits)

provide(
  Symbol.for('accordionVariant'),
  computed(() => props.variant),
)
</script>

<template>
  <AccordionRoot
    data-uipkge
    data-slot="accordion"
    :data-variant="variant"
    v-bind="forwarded"
    :class="cn(accordionVariants({ variant }), props.class)"
  >
    <slot />
  </AccordionRoot>
</template>

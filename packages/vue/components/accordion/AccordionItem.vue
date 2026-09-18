<script setup lang="ts">
import { computed, inject } from 'vue'
import type { AccordionItemProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { AccordionItem as RkAccordionItem } from 'reka-ui'
import { cn } from '@/lib/utils'
import { accordionItemVariants } from './accordion.variants'

const props = defineProps<AccordionItemProps & { class?: HTMLAttributes['class'] }>()
const delegated = reactiveOmit(props, 'class')

const variantRef = inject<{ value: 'default' | 'separated' | 'ghost' } | undefined>(
  Symbol.for('accordionVariant'),
  undefined,
)
const variant = computed(() => variantRef?.value ?? 'default')
</script>

<template>
  <RkAccordionItem
    data-uipkge
    data-slot="accordion-item"
    v-bind="delegated"
    :class="cn(accordionItemVariants({ variant }), props.class)"
  >
    <slot />
  </RkAccordionItem>
</template>

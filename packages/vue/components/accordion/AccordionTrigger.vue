<script setup lang="ts">
import { computed, inject } from 'vue'
import type { AccordionTriggerProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { AccordionTrigger as RkAccordionTrigger } from 'reka-ui'
import { ChevronDown } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { accordionTriggerVariants } from './accordion.variants'

const props = defineProps<AccordionTriggerProps & { class?: HTMLAttributes['class'] }>()
const delegated = reactiveOmit(props, 'class')

const variantRef = inject<{ value: 'default' | 'separated' | 'ghost' } | undefined>(
  Symbol.for('accordionVariant'),
  undefined,
)
const variant = computed(() => variantRef?.value ?? 'default')
</script>

<template>
  <RkAccordionTrigger
    data-uipkge
    data-slot="accordion-trigger"
    v-bind="delegated"
    :class="cn(accordionTriggerVariants({ variant }), props.class)"
  >
    <slot />
    <ChevronDown
      class="text-muted-foreground size-4 shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] group-data-[state=open]/accordion-trigger:rotate-180 motion-reduce:transition-none"
      aria-hidden="true"
    />
  </RkAccordionTrigger>
</template>

<script setup lang="ts">
import type { AccordionContentProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { AccordionContent as RkAccordionContent } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps<AccordionContentProps & { class?: HTMLAttributes['class'] }>()
const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <RkAccordionContent
    data-uipkge
    data-slot="accordion-content"
    v-bind="delegated"
    :class="
      cn(
        'text-muted-foreground overflow-hidden text-sm',
        // Height via Reka CSS vars + tw-animate-css (not height:auto).
        // duration/ease set --tw-duration/--tw-ease consumed by the utility.
        'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
        'duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]',
        'motion-reduce:animate-none',
        props.class,
      )
    "
  >
    <div class="pt-0 pb-4">
      <slot />
    </div>
  </RkAccordionContent>
</template>

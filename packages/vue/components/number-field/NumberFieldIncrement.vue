<script setup lang="ts">
import type { NumberFieldIncrementProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { Plus } from 'lucide-vue-next'
import { NumberFieldIncrement, useForwardProps } from 'reka-ui'
import { cn } from '@/lib/utils'
import { injectNumberFieldContext } from './NumberFieldContext'

const props = defineProps<NumberFieldIncrementProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardProps(delegatedProps)

const uiContext = injectNumberFieldContext()

const isRight = computed(() => uiContext.controlsPosition.value === 'right')

const iconSize = computed(() => {
  switch (uiContext.size.value) {
    case 'small':
      return 'h-3 w-3'
    case 'large':
      return 'h-5 w-5'
    default:
      return 'h-4 w-4'
  }
})
</script>

<template>
  <NumberFieldIncrement
    data-uipkge
    data-slot="increment"
    v-bind="forwarded"
    :class="
      cn(
        'focus-visible:ring-ring inline-flex shrink-0 items-center justify-center transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30',
        !isRight && 'absolute top-1/2 right-0 z-10 -translate-y-1/2',
        !isRight && uiContext.size.value === 'small' && 'p-1.5',
        !isRight && uiContext.size.value === 'middle' && 'p-3',
        !isRight && uiContext.size.value === 'large' && 'p-4',
        isRight && 'hover:bg-accent col-start-2 row-start-1 h-full w-auto rounded-none border-l p-0 px-2',
        props.class,
      )
    "
  >
    <slot>
      <Plus :class="iconSize" aria-hidden="true" />
    </slot>
  </NumberFieldIncrement>
</template>

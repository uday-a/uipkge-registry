<script setup lang="ts">
import { computed, inject } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { TIMELINE_ITEM_CONTEXT } from './context'

const props = defineProps<{
  class?: HTMLAttributes['class']
  hideConnector?: boolean
}>()

const item = inject(TIMELINE_ITEM_CONTEXT, null)
const direction = computed(() => item?.direction.value ?? 'vertical')
const isLast = computed(() => item?.isLast.value ?? true)
const showConnector = computed(() => !props.hideConnector && !isLast.value)
</script>

<template>
  <div
    data-uipkge
    data-slot="timeline-separator"
    :class="
      cn(
        'relative flex shrink-0 items-center',
        direction === 'vertical' ? 'w-4 flex-col self-stretch' : 'h-4 flex-row items-center self-stretch',
        props.class,
      )
    "
    v-bind="$attrs"
  >
    <div
      data-slot="timeline-separator-marker"
      class="bg-primary ring-background relative z-10 flex size-4 items-center justify-center rounded-full shadow-2xs ring-4"
    >
      <slot name="dot">
        <div class="bg-primary-foreground size-1.5 rounded-full" />
      </slot>
    </div>

    <div
      v-if="showConnector"
      aria-hidden="true"
      data-slot="timeline-media-connector"
      :class="cn('bg-border', direction === 'vertical' ? 'my-1.5 w-0.5 flex-1' : 'mx-1.5 h-0.5 flex-1')"
    />
  </div>
</template>

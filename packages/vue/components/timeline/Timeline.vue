<script setup lang="ts">
import { provide, ref, toRef } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import {
  TIMELINE_CONTEXT,
  type TimelineAlign,
  type TimelineDensity,
  type TimelineDirection,
  type TimelineSide,
} from './context'

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    direction?: TimelineDirection
    align?: TimelineAlign
    side?: TimelineSide
    density?: TimelineDensity
  }>(),
  {
    direction: 'vertical',
    align: 'start',
    density: 'default',
  },
)

const itemIds = ref<symbol[]>([])

provide(TIMELINE_CONTEXT, {
  direction: toRef(props, 'direction'),
  align: toRef(props, 'align'),
  side: toRef(() => props.side ?? (props.direction === 'horizontal' ? 'top' : 'left')),
  density: toRef(props, 'density'),
  itemIds,
  register: (id) => {
    if (!itemIds.value.includes(id)) itemIds.value.push(id)
  },
  unregister: (id) => {
    itemIds.value = itemIds.value.filter((i) => i !== id)
  },
})
</script>

<template>
  <div
    data-uipkge
    data-slot="timeline"
    :data-direction="direction"
    :data-align="align"
    :class="cn('relative', direction === 'vertical' ? 'flex flex-col' : 'flex flex-row', props.class)"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import type { GanttTask } from './types'

interface Props {
  task: GanttTask
  left: number
  top: number
  size?: number
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  size: 16,
})

const emits = defineEmits<{
  (e: 'click', task: GanttTask): void
}>()
</script>

<template>
  <div
    data-uipkge
    data-slot="gantt-milestone"
    :style="{
      left: `${left - size / 2}px`,
      top: `${top - size / 2}px`,
      width: `${size}px`,
      height: `${size}px`,
    }"
    :class="
      cn(
        'border-primary bg-primary absolute z-20 rotate-45 cursor-pointer rounded-xs border-2 shadow-sm transition-transform hover:scale-125',
        props.class,
      )
    "
    :title="`${task.name} (${task.startDate})`"
    @click="$emit('click', task)"
  />
</template>

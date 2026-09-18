<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, provide, ref, toRef } from 'vue'
import { cn } from '@/lib/utils'
import type { GanttScale, GanttTask } from './types'

interface Props {
  tasks: GanttTask[]
  scale?: GanttScale
  startDate?: string
  endDate?: string
  rowHeight?: number
  headerHeight?: number
  treeWidth?: number
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  scale: 'day',
  rowHeight: 40,
  headerHeight: 48,
  treeWidth: 280,
})

const emits = defineEmits<{
  (e: 'update:scale', scale: GanttScale): void
  (e: 'task-click', task: GanttTask): void
  (e: 'task-change', task: GanttTask): void
}>()

const currentScale = ref<GanttScale>(props.scale)

// Compute start and end dates from tasks if not explicitly provided
const resolvedStartDate = computed(() => {
  if (props.startDate) return new Date(props.startDate)
  if (props.tasks.length === 0) return new Date()
  const dates = props.tasks.map((t) => new Date(t.startDate).getTime())
  const min = Math.min(...dates)
  const d = new Date(min)
  d.setDate(d.getDate() - 3) // padding
  return d
})

const resolvedEndDate = computed(() => {
  if (props.endDate) return new Date(props.endDate)
  if (props.tasks.length === 0) {
    const d = new Date()
    d.setDate(d.getDate() + 30)
    return d
  }
  const dates = props.tasks.map((t) => new Date(t.endDate).getTime())
  const max = Math.max(...dates)
  const d = new Date(max)
  d.setDate(d.getDate() + 7) // padding
  return d
})

const totalDays = computed(() => {
  const diff = resolvedEndDate.value.getTime() - resolvedStartDate.value.getTime()
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
})

const columnWidth = computed(() => {
  switch (currentScale.value) {
    case 'day':
      return 44
    case 'week':
      return 120
    case 'month':
      return 180
    case 'year':
      return 240
    default:
      return 44
  }
})

provide('ganttContext', {
  scale: currentScale,
  startDate: resolvedStartDate,
  endDate: resolvedEndDate,
  totalDays,
  columnWidth,
  rowHeight: toRef(props, 'rowHeight'),
  headerHeight: toRef(props, 'headerHeight'),
  treeWidth: toRef(props, 'treeWidth'),
  tasks: toRef(props, 'tasks'),
  onTaskClick: (task: GanttTask) => emits('task-click', task),
  onTaskChange: (task: GanttTask) => emits('task-change', task),
})
</script>

<template>
  <div
    data-uipkge
    data-slot="gantt"
    :class="
      cn(
        'border-border bg-card text-card-foreground relative flex w-full flex-col overflow-hidden rounded-xl border shadow-xs',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>

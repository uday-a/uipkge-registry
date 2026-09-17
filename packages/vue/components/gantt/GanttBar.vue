<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import type { GanttTask } from './types'

interface Props {
  task: GanttTask
  left: number
  width: number
  top: number
  height: number
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const emits = defineEmits<{
  (e: 'click', task: GanttTask): void
}>()

const statusColors: Record<string, string> = {
  done: 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40',
  'in-progress': 'bg-primary/20 text-primary border-primary/40',
  'at-risk': 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40',
  todo: 'bg-muted/80 text-muted-foreground border-border',
  blocked: 'bg-destructive/20 text-destructive border-destructive/40',
}

const progressColors: Record<string, string> = {
  done: 'bg-emerald-500/40',
  'in-progress': 'bg-primary/40',
  'at-risk': 'bg-amber-500/40',
  todo: 'bg-muted-foreground/20',
  blocked: 'bg-destructive/40',
}
</script>

<template>
  <!-- Group Parent Task Bracket Bar -->
  <div
    v-if="task.isGroup"
    data-uipkge
    data-slot="gantt-group-bar"
    :style="{
      left: `${left}px`,
      width: `${Math.max(24, width)}px`,
      top: `${top + 4}px`,
      height: `${height - 8}px`,
    }"
    :class="
      cn(
        'group/bar bg-foreground/80 text-background hover:bg-foreground absolute z-10 flex cursor-pointer items-center justify-between rounded-xs px-2 text-xs font-semibold shadow-xs select-none',
        props.class,
      )
    "
    @click="$emit('click', task)"
  >
    <span class="truncate">{{ task.name }}</span>
    <span v-if="task.progress != null" class="font-mono text-xs opacity-80"> {{ task.progress }}% </span>
  </div>

  <!-- Standard Deliverable Bar -->
  <div
    v-else
    data-uipkge
    data-slot="gantt-bar"
    :style="{
      left: `${left}px`,
      width: `${Math.max(24, width)}px`,
      top: `${top}px`,
      height: `${height}px`,
    }"
    :class="
      cn(
        'group/bar absolute z-10 flex cursor-pointer items-center overflow-hidden rounded-md border text-xs font-medium shadow-xs transition-[box-shadow,transform] select-none hover:scale-[1.01] hover:shadow-md',
        task.color ? task.color : statusColors[task.status ?? 'in-progress'],
        props.class,
      )
    "
    @click="$emit('click', task)"
  >
    <!-- Progress fill -->
    <div
      v-if="task.progress != null && task.progress > 0"
      :style="{ width: `${task.progress}%` }"
      :class="cn('absolute inset-y-0 left-0 transition-all', progressColors[task.status ?? 'in-progress'])"
    />

    <!-- Content -->
    <div class="relative z-10 flex w-full min-w-0 items-center justify-between px-2">
      <span class="truncate font-medium">{{ task.name }}</span>
      <span v-if="task.progress != null" class="ml-1 shrink-0 font-mono text-xs opacity-80">
        {{ task.progress }}%
      </span>
    </div>

    <!-- Left / Right Resize Handles -->
    <div
      aria-hidden="true"
      class="bg-foreground/20 absolute inset-y-0 left-0 w-1.5 cursor-ew-resize opacity-0 transition-opacity group-hover/bar:opacity-100"
    />
    <div
      aria-hidden="true"
      class="bg-foreground/20 absolute inset-y-0 right-0 w-1.5 cursor-ew-resize opacity-0 transition-opacity group-hover/bar:opacity-100"
    />
  </div>
</template>

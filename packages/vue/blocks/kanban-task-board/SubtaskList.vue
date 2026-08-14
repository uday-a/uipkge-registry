<script setup lang="ts">
import { computed, inject } from 'vue'
import type { KanbanColumn } from '@/composables/useKanban'
import { findTaskById, getTaskColumn } from '@/composables/useKanban'
import { kanbanLinkKey } from './link-injection'

const props = defineProps<{
  subtaskIds: string[]
  columns: KanbanColumn[]
  compact?: boolean
}>()

const subtasks = computed(() => {
  return props.subtaskIds
    .map((id) => {
      const task = findTaskById(props.columns, id)
      const column = getTaskColumn(props.columns, id)
      return task ? { task, column } : null
    })
    .filter(Boolean) as {
    task: NonNullable<ReturnType<typeof findTaskById>>
    column: ReturnType<typeof getTaskColumn>
  }[]
})

const doneCount = computed(() => subtasks.value.filter((s) => s.column?.id === 'done').length)

const linkComponent = inject(
  kanbanLinkKey,
  computed(() => 'a' as const),
)
</script>

<template>
  <div data-slot="kanban-board" v-if="subtasks.length">
    <div class="mb-2 flex items-center justify-between">
      <span class="text-muted-foreground text-xs tabular-nums"> {{ doneCount }}/{{ subtasks.length }} done </span>
      <span class="text-muted-foreground text-xs font-medium tabular-nums">
        {{ subtasks.length > 0 ? Math.round((doneCount / subtasks.length) * 100) : 0 }}%
      </span>
    </div>
    <div class="bg-muted mb-3 h-1.5 overflow-hidden rounded-full">
      <div
        :class="[
          'h-full rounded-full transition-all duration-500',
          doneCount === subtasks.length ? 'bg-success' : 'bg-primary',
        ]"
        :style="{ width: `${subtasks.length > 0 ? Math.round((doneCount / subtasks.length) * 100) : 0}%` }"
      />
    </div>

    <div :class="compact ? 'space-y-0.5' : 'space-y-1'">
      <component
        :is="linkComponent"
        v-for="{ task, column } in subtasks"
        :key="task.id"
        :to="`/dashboard/kanban/${task.id}`"
        :href="`/dashboard/kanban/${task.id}`"
        :class="[
          'group/subtask flex items-center gap-2 rounded-md transition-colors',
          compact ? 'px-1 py-1' : 'px-1.5 py-1.5',
          'hover:bg-muted/50',
        ]"
      >
        <span :class="['size-1.5 shrink-0 rounded-full', column?.dotColor ?? 'bg-muted-foreground']" />
        <span class="text-muted-foreground/70 shrink-0 font-mono text-xs">
          {{ task.id }}
        </span>
        <span
          :class="[
            'min-w-0 flex-1 truncate',
            compact ? 'text-xs' : 'text-sm',
            column?.id === 'done' ? 'text-muted-foreground line-through' : 'text-foreground',
          ]"
        >
          {{ task.title }}
        </span>
        <span
          :class="['shrink-0 rounded-md px-1.5 py-0.5 text-xs font-medium', column?.color ?? 'text-muted-foreground']"
        >
          {{ column?.title ?? 'Unknown' }}
        </span>
      </component>
    </div>
  </div>
  <p v-else :class="compact ? 'text-muted-foreground text-xs' : 'text-muted-foreground text-sm'">No subtasks yet.</p>
</template>

<script setup lang="ts">
import { Plus, MoreHorizontal, ChevronsLeft, ChevronsRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import KanbanCard from './KanbanCard.vue'
import type { KanbanColumn as KanbanColumnType, KanbanTask } from '@/composables/useKanban'

defineProps<{
  column: { id: string; title: string; color: string; dotColor: string; tasks: KanbanTask[] }
  columns: KanbanColumnType[]
  collapsed: boolean
  draggedTask: string | null
  dragOverColumn: string | null
  dropTargetIndex: number
}>()

defineEmits<{
  'toggle-collapse': [columnId: string]
  'add-task': [columnId: string]
  'card-click': [task: KanbanTask]
  'card-quick-view': [task: KanbanTask]
  'drag-start': [event: DragEvent, taskId: string]
  'drag-end': []
  'card-drag-over': [event: DragEvent, columnId: string, taskIndex: number]
  'lane-drag-over': [event: DragEvent, columnId: string, taskCount: number]
  drop: []
}>()
</script>

<template>
  <div
    data-slot="kanban-board"
    :class="['group/col flex shrink-0 flex-col transition-all duration-200', collapsed ? 'w-12' : 'w-80']"
    @dragover.prevent
    @drop="$emit('drop')"
  >
    <button
      v-if="collapsed"
      class="bg-muted/40 hover:bg-muted/60 flex h-full flex-col items-center gap-2 rounded-xl px-1 pt-3 pb-4 transition-colors"
      @click="$emit('toggle-collapse', column.id)"
    >
      <span :class="['size-2 shrink-0 rounded-full', column.dotColor]" />
      <span :class="['text-xs font-semibold tracking-tight', column.color, 'rotate-180 [writing-mode:vertical-lr]']">
        {{ column.title }}
      </span>
      <Badge variant="secondary" class="mt-1 h-5 min-w-5 justify-center rounded-md px-1 text-xs">
        {{ column.tasks.length }}
      </Badge>
      <ChevronsRight class="text-muted-foreground mt-auto size-3.5" />
    </button>

    <template v-else>
      <div class="bg-background/95 sticky top-0 z-10 mb-2 flex items-center gap-2 px-2 py-1.5 backdrop-blur-sm">
        <button
          class="text-muted-foreground/50 hover:text-muted-foreground shrink-0 transition-colors"
          title="Collapse column"
          @click="$emit('toggle-collapse', column.id)"
        >
          <ChevronsLeft class="size-3.5" />
        </button>
        <span :class="['size-2 shrink-0 rounded-full', column.dotColor]" />
        <h3 :class="['text-sm font-semibold tracking-tight', column.color]">{{ column.title }}</h3>
        <span class="text-muted-foreground bg-muted rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums">
          {{ column.tasks.length }}
        </span>
        <div class="ml-auto flex items-center">
          <Button
            aria-label="Column options"
            variant="ghost"
            size="icon"
            class="text-muted-foreground size-6 opacity-0 transition-opacity group-hover/col:opacity-100"
          >
            <MoreHorizontal class="size-3.5" />
          </Button>
          <Button
            aria-label="Add task"
            variant="ghost"
            size="icon"
            class="text-muted-foreground size-6"
            @click="$emit('add-task', column.id)"
          >
            <Plus class="size-3.5" />
          </Button>
        </div>
      </div>

      <div
        :class="[
          'kanban-lane flex flex-col rounded-xl p-2 transition-all duration-200',
          dragOverColumn === column.id && draggedTask
            ? 'bg-primary/[0.06] ring-primary/25 ring-1 ring-inset'
            : 'bg-muted/40',
        ]"
        @dragover.prevent="$emit('lane-drag-over', $event, column.id, column.tasks.length)"
      >
        <template v-for="(task, taskIndex) in column.tasks" :key="task.id">
          <div
            :class="[
              'drop-indicator mx-1 transition-all duration-150',
              dragOverColumn === column.id && dropTargetIndex === taskIndex && draggedTask && draggedTask !== task.id
                ? 'bg-primary h-0.5 rounded-full'
                : 'h-0',
            ]"
          />
          <div
            :data-task-id="task.id"
            draggable="true"
            :class="['mt-2 first:mt-0', draggedTask === task.id ? 'scale-95 rotate-1 opacity-30' : 'opacity-100']"
            @dragstart="$emit('drag-start', $event, task.id)"
            @dragend="$emit('drag-end')"
            @dragover.stop.prevent="$emit('card-drag-over', $event, column.id, taskIndex)"
          >
            <KanbanCard
              :task="task"
              :columns="columns"
              :is-done="column.id === 'done'"
              @click="$emit('card-click', $event)"
              @quick-view="$emit('card-quick-view', $event)"
            />
          </div>
        </template>

        <div
          v-if="column.tasks.length > 0"
          :class="[
            'drop-indicator mx-1 transition-all duration-150',
            dragOverColumn === column.id && dropTargetIndex === column.tasks.length && draggedTask
              ? 'bg-primary mt-2 h-0.5 rounded-full'
              : 'h-0',
          ]"
        />

        <button
          aria-label="Add task"
          v-if="column.tasks.length === 0"
          class="text-muted-foreground/50 hover:text-muted-foreground hover:border-muted-foreground/30 flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed py-10 transition-colors"
          @click="$emit('add-task', column.id)"
        >
          <Plus class="mb-1 size-4" />
          <p class="text-xs">No tasks</p>
        </button>
      </div>

      <button
        aria-label="Add task"
        class="text-muted-foreground hover:text-foreground hover:bg-muted/60 mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed py-2 text-xs transition-colors"
        @click="$emit('add-task', column.id)"
      >
        <Plus class="size-3.5" />
        Add task
      </button>
    </template>
  </div>
</template>

<style scoped>
.kanban-lane {
  min-height: 60px;
}
</style>

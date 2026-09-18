<script setup lang="ts">
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { Edit2, Copy, Trash2, Clock, Flag, Layers } from 'lucide-vue-next'
import type { GanttTask, GanttTaskStatus, GanttTaskPriority } from './types'

const props = defineProps<{
  task: GanttTask
}>()

const emits = defineEmits<{
  (e: 'edit', task: GanttTask): void
  (e: 'status-change', task: GanttTask, status: GanttTaskStatus): void
  (e: 'priority-change', task: GanttTask, priority: GanttTaskPriority): void
  (e: 'duplicate', task: GanttTask): void
  (e: 'delete', task: GanttTask): void
}>()

function copyTaskId() {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(props.task.id)
  }
}
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger as-child>
      <slot />
    </ContextMenuTrigger>
    <ContextMenuContent class="w-56">
      <ContextMenuLabel class="flex items-center justify-between text-xs">
        <span class="truncate font-semibold">{{ task.name }}</span>
        <span class="text-muted-foreground font-mono text-xs">{{ task.id }}</span>
      </ContextMenuLabel>
      <ContextMenuSeparator />

      <!-- Edit / Inspect -->
      <ContextMenuItem @select="$emit('edit', task)">
        <Edit2 class="mr-2 size-3.5" />
        <span>View Details</span>
        <ContextMenuShortcut>↵</ContextMenuShortcut>
      </ContextMenuItem>

      <!-- Status Submenu -->
      <ContextMenuSub>
        <ContextMenuSubTrigger>
          <Clock class="text-primary mr-2 size-3.5" />
          <span>Change Status</span>
        </ContextMenuSubTrigger>
        <ContextMenuSubContent class="w-44">
          <ContextMenuRadioGroup :model-value="task.status ?? 'todo'">
            <ContextMenuRadioItem value="done" @select="$emit('status-change', task, 'done')">
              <span class="mr-2 size-2 rounded-full bg-emerald-500" />
              <span>Completed</span>
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="in-progress" @select="$emit('status-change', task, 'in-progress')">
              <span class="bg-primary mr-2 size-2 rounded-full" />
              <span>In Progress</span>
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="at-risk" @select="$emit('status-change', task, 'at-risk')">
              <span class="mr-2 size-2 rounded-full bg-amber-500" />
              <span>At Risk</span>
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="blocked" @select="$emit('status-change', task, 'blocked')">
              <span class="bg-destructive mr-2 size-2 rounded-full" />
              <span>Blocked</span>
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="todo" @select="$emit('status-change', task, 'todo')">
              <span class="bg-muted-foreground/40 mr-2 size-2 rounded-full" />
              <span>To Do</span>
            </ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuSubContent>
      </ContextMenuSub>

      <!-- Priority Submenu -->
      <ContextMenuSub>
        <ContextMenuSubTrigger>
          <Flag class="mr-2 size-3.5 text-amber-500" />
          <span>Set Priority</span>
        </ContextMenuSubTrigger>
        <ContextMenuSubContent class="w-40">
          <ContextMenuRadioGroup :model-value="task.priority ?? 'medium'">
            <ContextMenuRadioItem value="urgent" @select="$emit('priority-change', task, 'urgent')">
              <Flag class="text-destructive mr-2 size-3" />
              <span>Urgent</span>
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="high" @select="$emit('priority-change', task, 'high')">
              <Flag class="mr-2 size-3 text-amber-500" />
              <span>High</span>
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="medium" @select="$emit('priority-change', task, 'medium')">
              <Flag class="text-primary mr-2 size-3" />
              <span>Medium</span>
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="low" @select="$emit('priority-change', task, 'low')">
              <Flag class="text-muted-foreground mr-2 size-3" />
              <span>Low</span>
            </ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuSubContent>
      </ContextMenuSub>

      <ContextMenuSeparator />

      <!-- Copy ID -->
      <ContextMenuItem @select="copyTaskId">
        <Copy class="mr-2 size-3.5" />
        <span>Copy Task ID</span>
        <ContextMenuShortcut>⌘C</ContextMenuShortcut>
      </ContextMenuItem>

      <!-- Duplicate -->
      <ContextMenuItem @select="$emit('duplicate', task)">
        <Layers class="mr-2 size-3.5" />
        <span>Duplicate</span>
        <ContextMenuShortcut>⌘D</ContextMenuShortcut>
      </ContextMenuItem>

      <ContextMenuSeparator />

      <!-- Delete -->
      <ContextMenuItem class="text-destructive focus:text-destructive" @select="$emit('delete', task)">
        <Trash2 class="mr-2 size-3.5" />
        <span>Delete Deliverable</span>
        <ContextMenuShortcut>⌫</ContextMenuShortcut>
      </ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
</template>

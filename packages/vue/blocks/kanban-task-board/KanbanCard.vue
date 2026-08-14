<script setup lang="ts">
import { computed, inject } from 'vue'
import { type KanbanTask, type KanbanColumn, priorityConfig, getTaskColumn } from '@/composables/useKanban'
import TagBadge from './TagBadge.vue'
import SubtaskProgress from './SubtaskProgress.vue'
import DueDateBadge from './DueDateBadge.vue'
import UserAvatar from './UserAvatar.vue'
import { kanbanLinkKey } from './link-injection'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { MoreHorizontal, MessageSquare, Paperclip, ExternalLink } from 'lucide-vue-next'

const linkComponent = inject(
  kanbanLinkKey,
  computed(() => 'a' as const),
)

const props = defineProps<{
  task: KanbanTask
  isDone: boolean
  columns: KanbanColumn[]
}>()

const subtasksDone = computed(() => {
  if (!props.columns || !props.task.subtaskIds.length) return 0
  return props.task.subtaskIds.filter((id) => getTaskColumn(props.columns, id)?.id === 'done').length
})

defineEmits<{
  click: [task: KanbanTask]
  'quick-view': [task: KanbanTask]
}>()
</script>

<template>
  <div
    data-slot="kanban-board"
    :class="[
      'kanban-card group/card bg-card relative cursor-grab rounded-lg border p-3 transition-all duration-150',
      'hover:border-border hover:shadow-md active:scale-[0.97] active:cursor-grabbing',
      isDone ? 'opacity-75 hover:opacity-100' : '',
    ]"
    @click="$emit('click', task)"
  >
    <div
      :class="[
        'kanban-accent absolute top-3 bottom-3 left-0 w-[0.09375rem] rounded-full transition-all duration-150',
        priorityConfig[task.priority].bg,
        task.priority === 'low' ? 'opacity-40' : task.priority === 'medium' ? 'opacity-60' : 'opacity-90',
      ]"
    />

    <div class="mb-1 flex items-center justify-between pl-2">
      <span class="text-muted-foreground/70 font-mono text-xs">{{ task.id }}</span>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button
            aria-label="Card options"
            variant="ghost"
            size="icon"
            class="text-muted-foreground -mr-1 size-6 opacity-0 transition-opacity group-hover/card:opacity-100"
            @click.stop
          >
            <MoreHorizontal class="size-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-36">
          <DropdownMenuItem @click.stop="$emit('quick-view', task)">Quick view</DropdownMenuItem>
          <DropdownMenuItem as-child>
            <component
              :is="linkComponent"
              :to="`/dashboard/kanban/${task.id}`"
              :href="`/dashboard/kanban/${task.id}`"
              class="gap-2"
            >
              <ExternalLink class="size-3.5" />
              Open detail
            </component>
          </DropdownMenuItem>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Move to...</DropdownMenuItem>
          <DropdownMenuItem>Assign to...</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="text-destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <p
      :class="[
        'mb-2 pl-2 text-sm leading-snug font-medium',
        isDone ? 'decoration-muted-foreground/40 line-through' : '',
      ]"
    >
      {{ task.title }}
    </p>

    <div v-if="task.tags.length" class="mb-2 flex flex-wrap gap-1 pl-2">
      <TagBadge v-for="tag in task.tags" :key="tag.label" :label="tag.label" :color="tag.color" />
    </div>

    <div v-if="task.subtaskIds.length" class="mb-2 pl-2">
      <SubtaskProgress :done="subtasksDone" :total="task.subtaskIds.length" />
    </div>

    <div class="flex items-center gap-2 pl-2">
      <DueDateBadge v-if="task.dueDate" :due-date="task.dueDate" variant="chip" />

      <div v-if="task.commentItems.length" class="text-muted-foreground/70 flex items-center gap-1 text-xs">
        <MessageSquare class="size-3" />
        {{ task.commentItems.length }}
      </div>

      <div v-if="task.fileItems.length" class="text-muted-foreground/70 flex items-center gap-1 text-xs">
        <Paperclip class="size-3" />
        {{ task.fileItems.length }}
      </div>

      <div class="ml-auto">
        <TooltipProvider :delay-duration="200">
          <Tooltip>
            <TooltipTrigger as-child>
              <UserAvatar :name="task.assignee.name" :color="task.assignee.color" size="xs" />
            </TooltipTrigger>
            <TooltipContent side="bottom" class="text-xs">{{ task.assignee.name }}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kanban-card {
  animation: card-in 0.25s ease-out both;
}
@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
}
.kanban-card:hover .kanban-accent {
  box-shadow: 0 0 3px currentColor;
}
</style>

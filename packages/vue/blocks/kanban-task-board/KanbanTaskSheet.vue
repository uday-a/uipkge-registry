<script setup lang="ts">
import { computed, inject } from 'vue'
import { type KanbanTask, type KanbanColumn, priorityConfig, fileIconMap } from '@/composables/useKanban'
import PriorityBadge from './PriorityBadge.vue'
import TagBadge from './TagBadge.vue'
import DueDateBadge from './DueDateBadge.vue'
import UserAvatar from './UserAvatar.vue'
import CommentList from './CommentList.vue'
import SubtaskList from './SubtaskList.vue'
import { kanbanLinkKey } from './link-injection'
import { Sheet, SheetContent, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Clock, Download, ExternalLink } from 'lucide-vue-next'

const linkComponent = inject(
  kanbanLinkKey,
  computed(() => 'a' as const),
)

const props = defineProps<{
  open: boolean
  task: KanbanTask | null
  columns: KanbanColumn[]
}>()

defineEmits<{
  'update:open': [value: boolean]
  'move-task': [task: KanbanTask, columnId: string]
  'add-comment': [task: KanbanTask, text: string]
}>()

const columnIdForTask = computed(() => {
  if (!props.task) return ''
  return props.columns.find((c) => c.tasks.some((t) => t.id === props.task!.id))?.id ?? ''
})
</script>

<template>
  <Sheet data-slot="kanban-board" :open="open" @update:open="$emit('update:open', $event)">
    <SheetContent class="flex max-w-[420px] flex-col gap-0 overflow-hidden p-0 sm:max-w-full">
      <template v-if="task">
        <div :class="['h-1 w-full shrink-0', priorityConfig[task.priority]?.bg]" />

        <div class="shrink-0 px-5 pt-4 pb-3">
          <div class="mb-3 flex items-center gap-2">
            <span class="text-muted-foreground font-mono text-xs tracking-tight">{{ task.id }}</span>
            <span class="text-muted-foreground/30">·</span>
            <Select
              :model-value="columnIdForTask"
              @update:model-value="(val) => task && $emit('move-task', task, String(val))"
            >
              <SelectTrigger
                class="hover:bg-secondary h-5 w-auto gap-1 rounded-md border-none bg-transparent px-1.5 text-xs font-medium shadow-none"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="col in columns" :key="col.id" :value="col.id">
                  <span class="flex items-center gap-1.5">
                    <span :class="['size-1.5 rounded-full', col.dotColor]" />
                    {{ col.title }}
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            <PriorityBadge :priority="task.priority" icon-size="size-3" class="ml-auto" />
          </div>

          <SheetTitle class="text-sm leading-snug font-semibold tracking-tight">
            {{ task.title }}
          </SheetTitle>
          <SheetDescription class="sr-only">Task details</SheetDescription>
          <div
            v-if="task.description"
            class="text-muted-foreground rich-text-content prose prose-sm dark:prose-invert mt-1.5 max-w-none text-sm leading-relaxed"
            v-html="task.description"
          />
          <p v-else class="text-muted-foreground mt-1.5 text-sm leading-relaxed">No description provided.</p>

          <div class="mt-3 flex flex-wrap gap-1.5">
            <template v-if="task.tags.length">
              <TagBadge v-for="tag in task.tags" :key="tag.label" :label="tag.label" :color="tag.color" />
            </template>
            <span v-else class="text-muted-foreground text-xs">No tags</span>
          </div>
        </div>

        <div class="bg-border mx-5 h-px" />

        <div class="flex-1 overflow-y-auto">
          <div class="space-y-4 px-5 py-3">
            <div class="flex items-center gap-3">
              <UserAvatar :name="task.assignee.name" :color="task.assignee.color" size="md" />
              <div>
                <p class="text-sm leading-tight font-medium">{{ task.assignee.name }}</p>
                <p class="text-muted-foreground text-xs">Assignee</p>
              </div>
              <div class="ml-auto text-right">
                <DueDateBadge v-if="task.dueDate" :due-date="task.dueDate" />
                <p v-else class="text-muted-foreground flex items-center gap-1 text-sm leading-tight">
                  <Clock class="size-3" />
                  No due date
                </p>
              </div>
            </div>

            <div v-if="task.parentId" class="flex items-center gap-2">
              <span class="text-muted-foreground text-xs">Parent:</span>
              <component
                :is="linkComponent"
                :to="`/dashboard/kanban/${task.parentId}`"
                :href="`/dashboard/kanban/${task.parentId}`"
                class="text-primary text-xs font-medium hover:underline"
                @click="$emit('update:open', false)"
              >
                {{ task.parentId }}
              </component>
            </div>

            <div>
              <h4 class="mb-2 text-sm font-semibold">
                Subtasks
                <span v-if="task.subtaskIds.length" class="text-muted-foreground font-normal">
                  ({{ task.subtaskIds.length }})
                </span>
              </h4>
              <SubtaskList :subtask-ids="task.subtaskIds" :columns="columns" compact />
            </div>

            <div class="bg-border h-px" />

            <div>
              <h4 class="mb-2 text-sm font-semibold">
                Comments
                <span v-if="task.commentItems.length" class="text-muted-foreground font-normal">
                  ({{ task.commentItems.length }})
                </span>
              </h4>
              <CommentList
                :comments="task.commentItems"
                compact
                @add="(text) => task && $emit('add-comment', task, text)"
              />
            </div>

            <div class="bg-border h-px" />

            <div>
              <h4 class="mb-2 text-sm font-semibold">
                Files
                <span v-if="task.fileItems.length" class="text-muted-foreground font-normal">
                  ({{ task.fileItems.length }})
                </span>
              </h4>
              <div v-if="task.fileItems.length" class="space-y-1">
                <div
                  v-for="file in task.fileItems"
                  :key="file.id"
                  class="hover:bg-muted/50 group/file flex items-center gap-2.5 rounded-md px-1.5 py-1.5 transition-colors"
                >
                  <div class="bg-muted flex size-8 shrink-0 items-center justify-center rounded-md">
                    <component :is="fileIconMap[file.type]" class="text-muted-foreground size-4" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-xs font-medium">{{ file.name }}</p>
                    <p class="text-muted-foreground text-xs">{{ file.size }}</p>
                  </div>
                  <Button
                    aria-label="Download attachment"
                    variant="ghost"
                    size="icon"
                    class="size-7 shrink-0 opacity-0 transition-opacity group-hover/file:opacity-100"
                  >
                    <Download class="size-3.5" />
                  </Button>
                </div>
              </div>
              <p v-else class="text-muted-foreground text-xs">No files attached.</p>
            </div>
          </div>
        </div>

        <SheetFooter class="shrink-0 border-t px-5 py-3">
          <div class="flex w-full items-center gap-2">
            <component
              :is="linkComponent"
              :to="`/dashboard/kanban/${task.id}`"
              :href="`/dashboard/kanban/${task.id}`"
              class="flex-1"
              @click="$emit('update:open', false)"
            >
              <Button variant="outline" size="sm" class="w-full gap-1.5">
                <ExternalLink class="size-3.5" />
                View full detail
              </Button>
            </component>
            <SheetClose as-child>
              <Button variant="ghost" size="sm">Close</Button>
            </SheetClose>
          </div>
        </SheetFooter>
      </template>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import type { KanbanTask, KanbanColumn } from '@/composables/useKanban'
import { getTaskColumn } from '@/composables/useKanban'
import PriorityBadge from './PriorityBadge.vue'
import TagBadge from './TagBadge.vue'
import DueDateBadge from './DueDateBadge.vue'
import UserAvatar from './UserAvatar.vue'
import SubtaskProgress from './SubtaskProgress.vue'
import { kanbanLinkKey } from './link-injection'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { MessageSquare, Paperclip, ExternalLink, ArrowUpDown, ChevronDown, ChevronRight } from 'lucide-vue-next'

const linkComponent = inject(
  kanbanLinkKey,
  computed(() => 'a' as const),
)

const props = defineProps<{
  columns: KanbanColumn[]
  allColumns: KanbanColumn[]
}>()

defineEmits<{
  'task-click': [task: KanbanTask]
  'move-task': [task: KanbanTask, targetColumnId: string]
}>()

type SortField = 'id' | 'title' | 'priority' | 'assignee' | 'dueDate' | 'status'
type SortDir = 'asc' | 'desc'

const sortField = ref<SortField>('status')
const sortDir = ref<SortDir>('asc')

const priorityOrder: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 }

function toggleSort(field: SortField) {
  if (sortField.value === field) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDir.value = 'asc'
  }
}

const groupByStatus = ref(true)
const collapsedGroups = ref<Set<string>>(new Set())

function toggleGroup(columnId: string) {
  const next = new Set(collapsedGroups.value)
  if (next.has(columnId)) next.delete(columnId)
  else next.add(columnId)
  collapsedGroups.value = next
}

interface FlatTask {
  task: KanbanTask
  columnId: string
  columnTitle: string
  dotColor: string
}

function sortTasks(tasks: FlatTask[]): FlatTask[] {
  return [...tasks].sort((a, b) => {
    let cmp = 0
    switch (sortField.value) {
      case 'id': {
        const numA = parseInt(a.task.id.replace(/^[A-Z]+-/, ''), 10)
        const numB = parseInt(b.task.id.replace(/^[A-Z]+-/, ''), 10)
        cmp = numA - numB
        break
      }
      case 'title':
        cmp = a.task.title.localeCompare(b.task.title)
        break
      case 'priority':
        cmp = (priorityOrder[a.task.priority] ?? 99) - (priorityOrder[b.task.priority] ?? 99)
        break
      case 'assignee':
        cmp = a.task.assignee.name.localeCompare(b.task.assignee.name)
        break
      case 'dueDate':
        cmp = (a.task.dueDate ?? '9999').localeCompare(b.task.dueDate ?? '9999')
        break
      case 'status': {
        const colOrder = props.allColumns.map((c) => c.id)
        cmp = colOrder.indexOf(a.columnId) - colOrder.indexOf(b.columnId)
        break
      }
    }
    return sortDir.value === 'desc' ? -cmp : cmp
  })
}

const flatTasks = computed<FlatTask[]>(() => {
  const items: FlatTask[] = []
  for (const col of props.columns) {
    for (const task of col.tasks) {
      items.push({
        task,
        columnId: col.id,
        columnTitle: col.title,
        dotColor: col.dotColor,
      })
    }
  }
  return sortTasks(items)
})

const groupedTasks = computed(() => {
  if (!groupByStatus.value) return null
  const groups: { column: KanbanColumn; tasks: FlatTask[] }[] = []
  for (const col of props.allColumns) {
    const tasks = flatTasks.value.filter((t) => t.columnId === col.id)
    groups.push({ column: col, tasks })
  }
  return groups
})

function subtasksDone(task: KanbanTask): number {
  if (!task.subtaskIds.length) return 0
  return task.subtaskIds.filter((id) => getTaskColumn(props.allColumns, id)?.id === 'done').length
}
</script>

<template>
  <div data-slot="kanban-board" class="kanban-list flex min-h-0 flex-1 flex-col overflow-auto pb-3">
    <div
      class="bg-muted/50 sticky top-0 z-10 grid grid-cols-[60px_1fr_100px_110px_130px_100px_80px] items-center gap-2 rounded-t-lg border px-3 py-2 text-xs font-semibold tracking-wider uppercase"
    >
      <button class="flex items-center gap-1 text-left" @click="toggleSort('id')">
        ID
        <ArrowUpDown :class="['size-3', sortField === 'id' ? 'text-foreground' : 'text-muted-foreground/50']" />
      </button>
      <button class="flex items-center gap-1 text-left" @click="toggleSort('title')">
        Task
        <ArrowUpDown :class="['size-3', sortField === 'title' ? 'text-foreground' : 'text-muted-foreground/50']" />
      </button>
      <button class="flex items-center gap-1 text-left" @click="toggleSort('status')">
        Status
        <ArrowUpDown :class="['size-3', sortField === 'status' ? 'text-foreground' : 'text-muted-foreground/50']" />
      </button>
      <button class="flex items-center gap-1 text-left" @click="toggleSort('priority')">
        Priority
        <ArrowUpDown :class="['size-3', sortField === 'priority' ? 'text-foreground' : 'text-muted-foreground/50']" />
      </button>
      <button class="flex items-center gap-1 text-left" @click="toggleSort('assignee')">
        Assignee
        <ArrowUpDown :class="['size-3', sortField === 'assignee' ? 'text-foreground' : 'text-muted-foreground/50']" />
      </button>
      <button class="flex items-center gap-1 text-left" @click="toggleSort('dueDate')">
        Due
        <ArrowUpDown :class="['size-3', sortField === 'dueDate' ? 'text-foreground' : 'text-muted-foreground/50']" />
      </button>
      <span class="text-center">Info</span>
    </div>

    <template v-if="groupedTasks">
      <template v-for="group in groupedTasks" :key="group.column.id">
        <button
          class="bg-muted/30 hover:bg-muted/50 flex items-center gap-2 border-x border-b px-3 py-1.5 text-left transition-colors"
          @click="toggleGroup(group.column.id)"
        >
          <component
            :is="collapsedGroups.has(group.column.id) ? ChevronRight : ChevronDown"
            class="text-muted-foreground size-3.5"
          />
          <span :class="['size-2 rounded-full', group.column.dotColor]" />
          <span class="text-sm font-medium">{{ group.column.title }}</span>
          <Badge variant="secondary" class="ml-1 h-4 px-1.5 text-xs tabular-nums">
            {{ group.tasks.length }}
          </Badge>
        </button>

        <template v-if="!collapsedGroups.has(group.column.id)">
          <div
            v-for="item in group.tasks"
            :key="item.task.id"
            class="hover:bg-muted/30 grid cursor-pointer grid-cols-[60px_1fr_100px_110px_130px_100px_80px] items-center gap-2 border-x border-b px-3 py-2 transition-colors"
            @click="$emit('task-click', item.task)"
          >
            <span class="text-muted-foreground font-mono text-xs">{{ item.task.id }}</span>

            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <span
                  :class="[
                    'truncate text-sm font-medium',
                    item.columnId === 'done' ? 'text-muted-foreground line-through' : '',
                  ]"
                >
                  {{ item.task.title }}
                </span>
                <component
                  :is="linkComponent"
                  :to="`/dashboard/kanban/${item.task.id}`"
                  :href="`/dashboard/kanban/${item.task.id}`"
                  class="text-muted-foreground hover:text-foreground shrink-0 opacity-0 transition-opacity group-hover/row:opacity-100"
                  @click.stop
                >
                  <ExternalLink class="size-3" />
                </component>
              </div>
              <div v-if="item.task.tags.length || item.task.subtaskIds.length" class="mt-0.5 flex items-center gap-1.5">
                <TagBadge
                  v-for="tag in item.task.tags"
                  :key="tag.label"
                  :label="tag.label"
                  :color="tag.color"
                  class="!px-1.5 !py-0 !text-xs"
                />
                <SubtaskProgress
                  v-if="item.task.subtaskIds.length"
                  :done="subtasksDone(item.task)"
                  :total="item.task.subtaskIds.length"
                  class="ml-1"
                />
              </div>
            </div>

            <div>
              <Select
                :model-value="item.columnId"
                @update:model-value="(val) => $emit('move-task', item.task, String(val))"
              >
                <SelectTrigger
                  class="hover:bg-muted h-6 w-auto gap-1 rounded-md border-none bg-transparent px-1.5 text-xs font-medium shadow-none"
                  @click.stop
                >
                  <span class="flex items-center gap-1.5">
                    <span :class="['size-1.5 rounded-full', item.dotColor]" />
                    <SelectValue />
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem v-for="col in allColumns" :key="col.id" :value="col.id">
                    <span class="flex items-center gap-1.5">
                      <span :class="['size-1.5 rounded-full', col.dotColor]" />
                      {{ col.title }}
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <PriorityBadge :priority="item.task.priority" />

            <div class="flex items-center gap-2">
              <UserAvatar :name="item.task.assignee.name" :color="item.task.assignee.color" size="xs" />
              <span class="truncate text-xs">{{ item.task.assignee.name }}</span>
            </div>

            <div>
              <DueDateBadge v-if="item.task.dueDate" :due-date="item.task.dueDate" variant="chip" />
              <span v-else class="text-muted-foreground/50 text-xs">—</span>
            </div>

            <div class="flex items-center justify-center gap-2">
              <TooltipProvider :delay-duration="200">
                <Tooltip v-if="item.task.commentItems.length">
                  <TooltipTrigger as-child>
                    <span class="text-muted-foreground/70 flex items-center gap-0.5 text-xs">
                      <MessageSquare class="size-3" />
                      {{ item.task.commentItems.length }}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent class="text-xs">{{ item.task.commentItems.length }} comments</TooltipContent>
                </Tooltip>
                <Tooltip v-if="item.task.fileItems.length">
                  <TooltipTrigger as-child>
                    <span class="text-muted-foreground/70 flex items-center gap-0.5 text-xs">
                      <Paperclip class="size-3" />
                      {{ item.task.fileItems.length }}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent class="text-xs">{{ item.task.fileItems.length }} files</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </template>
      </template>
    </template>

    <div
      v-if="flatTasks.length === 0"
      class="text-muted-foreground flex flex-1 items-center justify-center rounded-b-lg border-x border-b py-12 text-sm"
    >
      No tasks match your filters.
    </div>
  </div>
</template>

<style scoped>
.kanban-list {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--border)) transparent;
}
.kanban-list::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}
.kanban-list::-webkit-scrollbar-thumb {
  background-color: hsl(var(--border));
  border-radius: 3px;
}
</style>

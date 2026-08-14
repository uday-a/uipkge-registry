<script setup lang="ts">
import { computed, onMounted, onUnmounted, provide, ref } from 'vue'
import type { Component } from 'vue'
import { Plus } from 'lucide-vue-next'
import { PageHeader, PageHeaderHeading } from '@/components/ui/page'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import KanbanToolbar from './KanbanToolbar.vue'
import KanbanColumn from './KanbanColumn.vue'
import KanbanListView from './KanbanListView.vue'
import KanbanTaskSheet from './KanbanTaskSheet.vue'
import KanbanAddTaskDialog from './KanbanAddTaskDialog.vue'
import type { KanbanColumn as KanbanColumnType, KanbanTask } from '@/composables/useKanban'
import { kanbanLinkKey } from './link-injection'

interface Props {
  columns: KanbanColumnType[]
  title?: string | null
  description?: string | null
  defaultColumnId?: string
  hideHeader?: boolean
  hideToolbar?: boolean
  lockParentScroll?: boolean
  linkComponent?: string | Component
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Kanban Board',
  description: 'Drag tasks across columns to update their status.',
  defaultColumnId: 'backlog',
  hideHeader: false,
  hideToolbar: false,
  lockParentScroll: true,
  linkComponent: 'a',
})

// Provide the link component to all child views (KanbanCard, KanbanListView,
// KanbanTaskSheet, SubtaskList) so they render SPA-aware links without
// hard-coding NuxtLink. Defaults to a plain <a> for framework-agnostic use;
// pass NuxtLink or RouterLink for SPA routing.
provide(
  kanbanLinkKey,
  computed(() => props.linkComponent),
)

const emits = defineEmits<{
  'update:columns': [value: KanbanColumnType[]]
}>()

const columnsRef = computed({
  get: () => props.columns,
  set: (v) => emits('update:columns', v),
})

const kanbanEl = ref<HTMLElement | null>(null)
let parentMain: HTMLElement | null = null

onMounted(() => {
  if (!props.lockParentScroll) return
  parentMain = kanbanEl.value?.closest('main[data-slot="sidebar-inset"]') as HTMLElement | null
  if (parentMain) parentMain.style.overflow = 'hidden'
  document.documentElement.style.overflow = 'hidden'
})

onUnmounted(() => {
  if (parentMain) {
    parentMain.style.overflow = ''
    parentMain = null
  }
  if (props.lockParentScroll) document.documentElement.style.overflow = ''
})

const searchQuery = ref('')
const selectedPriority = ref<string | null>(null)
const selectedAssignee = ref<string | null>(null)
const viewMode = ref<'board' | 'list'>('board')

const filteredColumns = computed(() => {
  return columnsRef.value.map((col) => ({
    ...col,
    tasks: col.tasks.filter((task) => {
      const q = searchQuery.value.toLowerCase()
      const matchesSearch = !q || task.title.toLowerCase().includes(q) || task.id.toLowerCase().includes(q)
      const matchesPriority = !selectedPriority.value || task.priority === selectedPriority.value
      const matchesAssignee = !selectedAssignee.value || task.assignee.name === selectedAssignee.value
      return matchesSearch && matchesPriority && matchesAssignee
    }),
  }))
})

const totalTasks = computed(() => columnsRef.value.reduce((sum, col) => sum + col.tasks.length, 0))

const collapsedColumns = ref<Set<string>>(new Set())

function toggleCollapse(columnId: string) {
  const next = new Set(collapsedColumns.value)
  if (next.has(columnId)) next.delete(columnId)
  else next.add(columnId)
  collapsedColumns.value = next
}

function addComment(task: KanbanTask, text: string) {
  task.commentItems.push({
    id: `c${Date.now()}`,
    author: 'Admin User',
    authorColor: 'bg-chart-1/15 text-chart-1',
    text,
    time: 'Just now',
  })
}

function moveTask(task: KanbanTask, targetColumnId: string) {
  const sourceCol = columnsRef.value.find((c) => c.tasks.some((t) => t.id === task.id))
  const targetCol = columnsRef.value.find((c) => c.id === targetColumnId)
  if (!sourceCol || !targetCol || sourceCol.id === targetColumnId) return
  const taskIndex = sourceCol.tasks.findIndex((t) => t.id === task.id)
  if (taskIndex === -1) return
  const removed = sourceCol.tasks.splice(taskIndex, 1)
  if (removed[0]) targetCol.tasks.push(removed[0])
}

const detailOpen = ref(false)
const detailTask = ref<KanbanTask | null>(null)

function openTaskDetail(task: KanbanTask) {
  detailTask.value = task
  detailOpen.value = true
}

const draggedTask = ref<string | null>(null)
const dragOverColumn = ref<string | null>(null)
const dropTargetIndex = ref<number>(-1)
let lastDragEnd = 0

function onDragStart(event: DragEvent, taskId: string) {
  draggedTask.value = taskId
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', taskId)
  }
}

function resetDrag() {
  draggedTask.value = null
  dragOverColumn.value = null
  dropTargetIndex.value = -1
  lastDragEnd = Date.now()
}

function onDrop() {
  if (!draggedTask.value || !dragOverColumn.value) {
    resetDrag()
    return
  }

  let sourceColIdx = -1
  let taskIdx = -1
  for (let c = 0; c < columnsRef.value.length; c++) {
    const col = columnsRef.value[c]
    if (!col) continue
    const tIdx = col.tasks.findIndex((t) => t.id === draggedTask.value)
    if (tIdx !== -1) {
      sourceColIdx = c
      taskIdx = tIdx
      break
    }
  }
  const targetColIdx = columnsRef.value.findIndex((c) => c.id === dragOverColumn.value)
  if (sourceColIdx === -1 || targetColIdx === -1) {
    resetDrag()
    return
  }

  const sourceCol = columnsRef.value[sourceColIdx]
  const targetCol = columnsRef.value[targetColIdx]
  if (!sourceCol || !targetCol) {
    resetDrag()
    return
  }

  const [task] = sourceCol.tasks.splice(taskIdx, 1)
  if (!task) {
    resetDrag()
    return
  }

  let insertAt = dropTargetIndex.value
  if (insertAt < 0) insertAt = targetCol.tasks.length
  if (sourceColIdx === targetColIdx && taskIdx < insertAt) insertAt--

  targetCol.tasks.splice(insertAt, 0, task)
  resetDrag()
}

function onCardClick(task: KanbanTask) {
  if (Date.now() - lastDragEnd < 200) return
  openTaskDetail(task)
}

function onCardDragOver(event: DragEvent, columnId: string, taskIndex: number) {
  dragOverColumn.value = columnId
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const midY = rect.top + rect.height / 2
  dropTargetIndex.value = event.clientY < midY ? taskIndex : taskIndex + 1
}

function onLaneDragOver(_event: DragEvent, columnId: string, taskCount: number) {
  dragOverColumn.value = columnId
  dropTargetIndex.value = taskCount
}

const addTaskOpen = ref(false)
const addTaskColumnId = ref(props.defaultColumnId)

function openAddTask(columnId: string) {
  addTaskColumnId.value = columnId
  addTaskOpen.value = true
}

function onCreateTask(columnId: string, tasks: KanbanTask[]) {
  const col = columnsRef.value.find((c) => c.id === columnId)
  if (col) col.tasks.push(...tasks)
}
</script>

<template>
  <div
    ref="kanbanEl"
    data-slot="kanban-board"
    class="kanban-page flex h-[calc(100dvh-3.5rem-3rem)] flex-col overflow-hidden lg:h-[calc(100dvh-3.5rem-3rem)]"
  >
    <div v-if="!hideHeader" class="mb-3 shrink-0">
      <PageHeader>
        <div class="flex items-start justify-between gap-4">
          <PageHeaderHeading :title="title ?? ''" :description="description ?? ''" />
          <div class="flex shrink-0 items-center gap-2">
            <Badge variant="secondary" class="font-mono text-xs tabular-nums">{{ totalTasks }} tasks</Badge>
            <Button size="sm" @click="openAddTask(defaultColumnId)">
              <Plus class="size-4" />
              Add Task
            </Button>
          </div>
        </div>
      </PageHeader>
    </div>

    <KanbanToolbar
      v-if="!hideToolbar"
      v-model:search-query="searchQuery"
      v-model:selected-priority="selectedPriority"
      v-model:selected-assignee="selectedAssignee"
      v-model:view-mode="viewMode"
    />

    <div
      v-if="viewMode === 'board'"
      class="kanban-board relative flex min-h-0 flex-1 items-start gap-3 overflow-auto pb-3"
    >
      <KanbanColumn
        v-for="column in filteredColumns"
        :key="column.id"
        :column="column"
        :columns="columnsRef"
        :collapsed="collapsedColumns.has(column.id)"
        :dragged-task="draggedTask"
        :drag-over-column="dragOverColumn"
        :drop-target-index="dropTargetIndex"
        @toggle-collapse="toggleCollapse"
        @add-task="openAddTask"
        @card-click="onCardClick"
        @card-quick-view="openTaskDetail"
        @drag-start="onDragStart"
        @drag-end="resetDrag"
        @card-drag-over="onCardDragOver"
        @lane-drag-over="onLaneDragOver"
        @drop="onDrop"
      />
    </div>

    <KanbanListView
      v-else
      :columns="filteredColumns"
      :all-columns="columnsRef"
      @task-click="openTaskDetail"
      @move-task="moveTask"
    />

    <KanbanTaskSheet
      v-model:open="detailOpen"
      :task="detailTask"
      :columns="columnsRef"
      @move-task="moveTask"
      @add-comment="addComment"
    />

    <KanbanAddTaskDialog
      v-model:open="addTaskOpen"
      :columns="columnsRef"
      :initial-column-id="addTaskColumnId"
      @create="onCreateTask"
    />
  </div>
</template>

<style scoped>
.kanban-board {
  scrollbar-width: thin;
  scrollbar-color: hsl(var(--border)) transparent;
}
.kanban-board::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}
.kanban-board::-webkit-scrollbar-thumb {
  background-color: hsl(var(--border));
  border-radius: 3px;
}
.kanban-board::-webkit-scrollbar-corner {
  background: transparent;
}
</style>

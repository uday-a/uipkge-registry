<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Calendar, GripVertical, Check } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export interface SimpleKanbanItem {
  id: string
  title: string
  description?: string
  date?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  tag?: string
  tagColor?: string
  assignee?: {
    name: string
    initials?: string
    avatar?: string
  }
}

export interface SimpleKanbanColumn {
  id: string
  title: string
  color?: string
  dotColor?: string
  items: SimpleKanbanItem[]
}

interface Props {
  columns: SimpleKanbanColumn[]
  allowAdd?: boolean
  className?: string
  cardClassName?: string
}

const props = withDefaults(defineProps<Props>(), {
  allowAdd: true,
})

const emits = defineEmits<{
  'update:columns': [value: SimpleKanbanColumn[]]
  'card-click': [item: SimpleKanbanItem, columnId: string]
  'card-move': [item: SimpleKanbanItem, fromColumnId: string, toColumnId: string, newIndex: number]
  'add-item': [columnId: string, title: string]
}>()

const DEFAULT_DOT_COLORS: Record<string, string> = {
  backlog: 'bg-slate-400 dark:bg-slate-500',
  todo: 'bg-sky-500',
  'in-progress': 'bg-amber-500',
  review: 'bg-purple-500',
  done: 'bg-emerald-500',
}

const PRIORITY_STYLES: Record<string, { label: string; class: string }> = {
  low: { label: 'Low', class: 'bg-slate-500/10 text-slate-600 dark:text-slate-400' },
  medium: { label: 'Medium', class: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  high: { label: 'High', class: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  urgent: { label: 'Urgent', class: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium' },
}

const draggedId = ref<string | null>(null)
const dragOverColumnId = ref<string | null>(null)
const dropTargetIndex = ref<number>(-1)
const addingColumnId = ref<string | null>(null)
const newTitle = ref('')
let lastDragTime = 0

function handleDragStart(e: DragEvent, id: string) {
  draggedId.value = id
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', id)
  }
}

function handleDragEnd() {
  draggedId.value = null
  dragOverColumnId.value = null
  dropTargetIndex.value = -1
  lastDragTime = Date.now()
}

function handleDragOverColumn(e: DragEvent, columnId: string, itemsCount: number) {
  e.preventDefault()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
  dragOverColumnId.value = columnId
  dropTargetIndex.value = itemsCount
}

function handleCardDragOver(e: DragEvent, columnId: string, index: number) {
  e.preventDefault()
  e.stopPropagation()
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
  dragOverColumnId.value = columnId
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const midY = rect.top + rect.height / 2
  dropTargetIndex.value = e.clientY < midY ? index : index + 1
}

function handleDrop(e: DragEvent, targetColumnId: string) {
  e.preventDefault()
  if (!draggedId.value || !targetColumnId) {
    handleDragEnd()
    return
  }

  const next = props.columns.map((col) => ({
    ...col,
    items: [...col.items],
  }))

  let sourceColIdx = -1
  let itemIdx = -1
  for (let c = 0; c < next.length; c++) {
    const col = next[c]
    if (!col) continue
    const idx = col.items.findIndex((item) => item.id === draggedId.value)
    if (idx !== -1) {
      sourceColIdx = c
      itemIdx = idx
      break
    }
  }

  const targetColIdx = next.findIndex((c) => c.id === targetColumnId)
  if (sourceColIdx === -1 || targetColIdx === -1) {
    handleDragEnd()
    return
  }

  const sourceCol = next[sourceColIdx]
  const targetCol = next[targetColIdx]
  if (!sourceCol || !targetCol) {
    handleDragEnd()
    return
  }

  const [removed] = sourceCol.items.splice(itemIdx, 1)
  if (!removed) {
    handleDragEnd()
    return
  }

  let at = dropTargetIndex.value
  if (at < 0) at = targetCol.items.length
  if (sourceColIdx === targetColIdx && itemIdx < at) at--

  targetCol.items.splice(at, 0, removed)
  emits('update:columns', next)
  emits('card-move', removed, sourceCol.id, targetColumnId, at)

  handleDragEnd()
}

function handleInlineAdd(columnId: string) {
  if (!newTitle.value.trim()) {
    addingColumnId.value = null
    return
  }

  const text = newTitle.value.trim()
  emits('add-item', columnId, text)

  const next = props.columns.map((col) => ({
    ...col,
    items: [...col.items],
  }))
  const col = next.find((c) => c.id === columnId)
  if (col) {
    col.items.push({
      id: `item-${Date.now()}`,
      title: text,
    })
    emits('update:columns', next)
  }

  newTitle.value = ''
  addingColumnId.value = null
}

function onCardClick(item: SimpleKanbanItem, columnId: string) {
  if (Date.now() - lastDragTime < 150) return
  emits('card-click', item, columnId)
}
</script>

<template>
  <div
    data-slot="simple-kanban"
    :class="
      cn('flex min-h-[380px] w-full [scrollbar-width:thin] items-start gap-4 overflow-x-auto pb-4', props.className)
    "
  >
    <div
      v-for="column in columns"
      :key="column.id"
      data-slot="kanban-column"
      :class="
        cn(
          'bg-muted/40 border-border/80 flex w-72 shrink-0 flex-col rounded-xl border p-3 transition-colors',
          dragOverColumnId === column.id && 'border-primary/50 bg-muted/60 ring-primary/10 ring-2',
        )
      "
      @dragover="(e) => handleDragOverColumn(e, column.id, column.items.length)"
      @drop="(e) => handleDrop(e, column.id)"
    >
      <!-- Column Header -->
      <div class="mb-3 flex items-center justify-between gap-2 px-1">
        <div class="flex items-center gap-2">
          <span
            :class="
              cn(
                'size-2 rounded-full',
                column.dotColor || column.color || DEFAULT_DOT_COLORS[column.id] || 'bg-primary',
              )
            "
          />
          <h3 class="text-foreground text-sm font-semibold tracking-tight">{{ column.title }}</h3>
          <span class="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums">
            {{ column.items.length }}
          </span>
        </div>
        <Button
          v-if="allowAdd"
          variant="ghost"
          size="icon"
          class="text-muted-foreground hover:text-foreground size-7 rounded-lg"
          :aria-label="`Add item to ${column.title}`"
          @click="
            () => {
              addingColumnId = column.id
              newTitle = ''
            }
          "
        >
          <Plus class="size-3.5" />
        </Button>
      </div>

      <!-- Column Cards Container -->
      <div class="flex min-h-[120px] flex-1 flex-col gap-2.5">
        <!-- Inline quick add input -->
        <div
          v-if="addingColumnId === column.id"
          class="bg-card border-border animate-in fade-in zoom-in-95 rounded-lg border p-2.5 shadow-xs duration-150"
        >
          <input
            v-model="newTitle"
            type="text"
            autofocus
            placeholder="Item title..."
            class="placeholder:text-muted-foreground/60 w-full bg-transparent text-sm font-medium outline-none"
            @keydown.enter="handleInlineAdd(column.id)"
            @keydown.esc="addingColumnId = null"
          />
          <div class="mt-2.5 flex items-center justify-end gap-1.5">
            <Button size="sm" variant="ghost" class="h-7 px-2 text-xs" @click="addingColumnId = null"> Cancel </Button>
            <Button size="sm" class="h-7 gap-1 px-2.5 text-xs" @click="handleInlineAdd(column.id)">
              <Check class="size-3" />
              Add
            </Button>
          </div>
        </div>

        <!-- Cards list -->
        <template v-for="(item, index) in column.items" :key="item.id">
          <div
            v-if="dragOverColumnId === column.id && dropTargetIndex === index && draggedId !== item.id"
            class="bg-primary/20 h-1.5 w-full rounded-full transition-all duration-150"
          />
          <div
            role="button"
            tabindex="0"
            draggable="true"
            data-slot="kanban-card"
            :class="
              cn(
                'group bg-card text-card-foreground border-border/80 hover:border-border relative flex cursor-grab flex-col gap-2 rounded-lg border p-3 shadow-xs transition-all hover:shadow-sm active:cursor-grabbing',
                draggedId === item.id && 'ring-primary/40 opacity-40 shadow-md ring-2',
                props.cardClassName,
              )
            "
            @dragstart="(e) => handleDragStart(e, item.id)"
            @dragend="handleDragEnd"
            @dragover="(e) => handleCardDragOver(e, column.id, index)"
            @click="onCardClick(item, column.id)"
            @keydown.enter.prevent="onCardClick(item, column.id)"
            @keydown.space.prevent="onCardClick(item, column.id)"
          >
            <!-- Top row: Title + Grip handle -->
            <div class="flex items-start justify-between gap-2">
              <p class="text-foreground line-clamp-2 text-sm leading-snug font-medium">
                {{ item.title }}
              </p>
              <GripVertical
                class="text-muted-foreground/30 size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
              />
            </div>

            <!-- Optional description -->
            <p v-if="item.description" class="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
              {{ item.description }}
            </p>

            <!-- Metadata row: Date, Tag, Priority, Assignee -->
            <div
              v-if="item.date || item.tag || item.priority || item.assignee"
              class="border-border/40 mt-1 flex flex-wrap items-center justify-between gap-1.5 border-t pt-1 text-xs"
            >
              <div class="flex flex-wrap items-center gap-1.5">
                <div v-if="item.date" class="text-muted-foreground flex items-center gap-1 text-xs">
                  <Calendar class="text-muted-foreground/70 size-3" />
                  <span>{{ item.date }}</span>
                </div>

                <span
                  v-if="item.tag"
                  :class="
                    cn(
                      'rounded-md px-1.5 py-0.5 text-xs font-medium',
                      item.tagColor || 'bg-secondary text-secondary-foreground',
                    )
                  "
                >
                  {{ item.tag }}
                </span>

                <span
                  v-if="item.priority && PRIORITY_STYLES[item.priority]"
                  :class="cn('rounded-md px-1.5 py-0.5 text-xs', PRIORITY_STYLES[item.priority].class)"
                >
                  {{ PRIORITY_STYLES[item.priority].label }}
                </span>
              </div>

              <Avatar v-if="item.assignee" class="border-background size-5 shrink-0 border">
                <AvatarFallback class="text-xs font-medium">
                  {{ item.assignee.initials || item.assignee.name.slice(0, 2).toUpperCase() }}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </template>

        <!-- Trailing drop indicator -->
        <div
          v-if="dragOverColumnId === column.id && dropTargetIndex >= column.items.length && draggedId"
          class="bg-primary/20 h-1.5 w-full rounded-full transition-all duration-150"
        />

        <!-- Empty column placeholder -->
        <div
          v-if="column.items.length === 0 && addingColumnId !== column.id"
          class="border-border/60 text-muted-foreground/60 flex flex-1 items-center justify-center rounded-lg border border-dashed py-8 text-center text-xs"
        >
          Drop items here
        </div>
      </div>
    </div>
  </div>
</template>

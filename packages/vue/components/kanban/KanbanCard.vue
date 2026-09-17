<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { KanbanColumnContextKey, KanbanContextKey } from './context'
import { kanbanCardVariants } from './kanban.variants'

interface Props {
  id: string
  disabled?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})

const kanban = inject(KanbanContextKey)
const column = inject(KanbanColumnContextKey)

const isDragging = computed(() => kanban?.draggingCardId.value === props.id)

function handleDragStart(e: DragEvent) {
  if (props.disabled) {
    e.preventDefault()
    return
  }
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', props.id)
  }
  kanban?.setDraggingCard(props.id, column?.columnId ?? null)
}

function handleDragEnd() {
  kanban?.setDraggingCard(null, null)
  kanban?.setOverColumn(null)
}
</script>

<template>
  <div
    data-slot="kanban-card"
    :data-card-id="id"
    :draggable="!disabled"
    :class="cn(kanbanCardVariants({ isDragging }), disabled && 'pointer-events-none opacity-50', props.class)"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <slot :is-dragging="isDragging" />
  </div>
</template>

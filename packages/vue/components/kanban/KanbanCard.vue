<script setup lang="ts">
import { computed, inject, ref, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { KanbanColumnContextKey, KanbanContextKey } from './context'
import { kanbanCardVariants } from './kanban.variants'

interface Props {
  id: string
  disabled?: boolean
  /** Disable the keyboard grab (Space / arrows) while leaving pointer
   *  dragging intact. Default: enabled. */
  keyboardDraggable?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  keyboardDraggable: true,
})

const kanban = inject(KanbanContextKey)
const column = inject(KanbanColumnContextKey)

const cardEl = ref<HTMLElement | null>(null)

const isGrabbed = computed(() => kanban?.grabbedCardId.value === props.id)
const isDragging = computed(() => kanban?.draggingCardId.value === props.id || isGrabbed.value)

const canKeyboardDrag = computed(() => props.keyboardDraggable && !props.disabled && !!kanban && !!column)

function columnName(el: HTMLElement | null) {
  return el?.getAttribute('aria-label') || el?.dataset.columnId || 'column'
}

/** Ordered, enabled columns of the board this card sits in. */
function boardColumns(): HTMLElement[] {
  const board = cardEl.value?.closest('[data-slot="kanban"]') ?? document
  return Array.from(board.querySelectorAll<HTMLElement>('[data-slot="kanban-column"]'))
}

function focusSelfAfterMove() {
  // The consumer owns the data, so the card is re-rendered (often as a new
  // node) in its new column. Re-find it by id and restore focus.
  requestAnimationFrame(() => {
    const moved = document.querySelector<HTMLElement>(`[data-slot="kanban-card"][data-card-id="${props.id}"]`)
    moved?.focus()
  })
}

function grab() {
  if (!canKeyboardDrag.value) return
  kanban!.setGrabbedCard(props.id)
  kanban!.setDraggingCard(props.id, column!.columnId)
  kanban!.setOverColumn(column!.columnId)
  kanban!.announce(`Picked up card. Use the arrow keys to move it, space to drop, escape to cancel.`)
}

function release(cancelled: boolean) {
  if (!kanban) return
  kanban.setGrabbedCard(null)
  kanban.setDraggingCard(null, null)
  kanban.setOverColumn(null)
  kanban.announce(cancelled ? 'Move cancelled.' : 'Card dropped.')
}

function moveToColumn(delta: -1 | 1) {
  const columns = boardColumns()
  const currentIdx = columns.findIndex((el) => el.dataset.columnId === column!.columnId)
  if (currentIdx === -1) return
  const target = columns[currentIdx + delta]
  // Deliberately not wrapping: running off the end of a board should stop,
  // not teleport the card back to the first column.
  if (!target?.dataset.columnId) return
  kanban!.emitMove({
    cardId: props.id,
    fromColumnId: column!.columnId,
    toColumnId: target.dataset.columnId,
  })
  kanban!.setDraggingCard(props.id, target.dataset.columnId)
  kanban!.setOverColumn(target.dataset.columnId)
  kanban!.announce(`Moved to ${columnName(target)}.`)
  focusSelfAfterMove()
}

function moveWithinColumn(delta: -1 | 1) {
  const columnEl = cardEl.value?.closest<HTMLElement>('[data-slot="kanban-column"]')
  if (!columnEl) return
  const cards = Array.from(columnEl.querySelectorAll<HTMLElement>('[data-slot="kanban-card"]'))
  const currentIdx = cards.findIndex((el) => el.dataset.cardId === props.id)
  if (currentIdx === -1) return
  const targetIdx = currentIdx + delta
  if (targetIdx < 0 || targetIdx > cards.length - 1) return
  kanban!.emitMove({
    cardId: props.id,
    fromColumnId: column!.columnId,
    toColumnId: column!.columnId,
    toIndex: targetIdx,
  })
  kanban!.announce(`Position ${targetIdx + 1} of ${cards.length}.`)
  focusSelfAfterMove()
}

function handleKeydown(e: KeyboardEvent) {
  if (!canKeyboardDrag.value) return

  if (e.key === ' ' || e.key === 'Spacebar') {
    e.preventDefault()
    if (isGrabbed.value) release(false)
    else grab()
    return
  }
  if (!isGrabbed.value) return
  if (e.key === 'Escape') {
    e.preventDefault()
    release(true)
    return
  }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    e.preventDefault()
    moveToColumn(e.key === 'ArrowLeft' ? -1 : 1)
    return
  }
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.preventDefault()
    moveWithinColumn(e.key === 'ArrowUp' ? -1 : 1)
  }
}

function handleBlur() {
  // A grabbed card that loses focus (click elsewhere, Tab) would otherwise
  // stay stuck in the held state with no way back to it.
  if (isGrabbed.value) release(true)
}

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
  <!-- `role="button"` rather than a real <button> so consumers can nest
       interactive content (menus, links) inside a card — the HTML spec
       forbids that inside <button>. Matches <BoardCard>. -->
  <div
    ref="cardEl"
    data-uipkge
    data-slot="kanban-card"
    :data-card-id="id"
    :data-state="isGrabbed ? 'grabbed' : isDragging ? 'dragging' : 'idle'"
    :data-disabled="disabled || undefined"
    :role="canKeyboardDrag ? 'button' : undefined"
    :tabindex="canKeyboardDrag ? 0 : undefined"
    :aria-disabled="disabled || undefined"
    :aria-roledescription="canKeyboardDrag ? 'draggable card' : undefined"
    :aria-pressed="canKeyboardDrag ? isGrabbed : undefined"
    :draggable="!disabled"
    :class="cn(kanbanCardVariants({ isDragging }), disabled && 'pointer-events-none opacity-50', props.class)"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
    @keydown="handleKeydown"
    @blur="handleBlur"
  >
    <slot :is-dragging="isDragging" :is-grabbed="isGrabbed" />
  </div>
</template>

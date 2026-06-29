<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, provide, ref, toRef, watch } from 'vue'
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { BOARD_CARD_CONTEXT, BOARD_CONTEXT, BOARD_LANE_CONTEXT } from './context'
import { boardCardVariants } from './board.variants'

interface Props {
  id: string
  class?: HTMLAttributes['class']
  /** Disable keyboard grab (e.g. for read-only boards). Default: enabled. */
  keyboardDraggable?: boolean
  /** Disable the card entirely — non-draggable, non-clickable, dimmed.
   *  Use for cards locked by a workflow rule or a server policy. */
  disabled?: boolean
  /** Per-card allow-list. When set, the card can only be dropped into
   *  these lane ids; useBoard rejects any other target silently. Omit
   *  to allow every lane the global `accepts` predicate permits. */
  allowedLanes?: readonly string[]
  /** Show the click-to-select chrome (ring + cmd/shift-click multi-select).
   *  Default true. Turn off for read-only or single-tap-to-open boards. */
  selectable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  keyboardDraggable: true,
  disabled: false,
  selectable: true,
})

const board = inject(BOARD_CONTEXT)!
const lane = inject(BOARD_LANE_CONTEXT)!
if (!board || !lane) {
  throw new Error('<BoardCard> must be a descendant of <Board> and <BoardLane>.')
}

const emits = defineEmits<{
  dragstart: [e: DragEvent]
  dragend: []
  click: [e: MouseEvent]
}>()

const isKeyboardGrabbed = ref(false)
// Either source of truth wins — `draggingIds` is the multi-select-aware
// list, `draggingId` is the single-anchor (backward-compat for consumers
// that don't pass the multi state through). Keyboard-grabbed adds the
// same visual without touching parent state.
const isDragging = computed(
  () => board.draggingIds.value.includes(props.id) || board.draggingId.value === props.id || isKeyboardGrabbed.value,
)
const isJustMoved = computed(() => board.justMovedId.value === props.id)
const isSelected = computed(() => board.selectedIds.value.has(props.id))

provide(BOARD_CARD_CONTEXT, {
  cardId: toRef(props, 'id'),
  laneId: lane.laneId,
  isDragging,
  isJustMoved,
  isSelected,
  disabled: toRef(props, 'disabled'),
})

// Per-card allowed-lanes registry. Re-run if the id OR the list changes.
onMounted(() => board.registerAllowedLanes(props.id, props.allowedLanes))
onBeforeUnmount(() => board.unregisterAllowedLanes(props.id))
watch(
  () => [props.id, props.allowedLanes] as const,
  ([id, lanes], _prev) => {
    const prevId = _prev?.[0]
    if (prevId && prevId !== id) board.unregisterAllowedLanes(prevId)
    board.registerAllowedLanes(id, lanes)
  },
  { deep: true },
)

const state = computed<'idle' | 'dragging' | 'moved'>(() => {
  if (isDragging.value) return 'dragging'
  if (isJustMoved.value) return 'moved'
  return 'idle'
})

const cardEl = ref<HTMLDivElement | null>(null)

function onKeydown(e: KeyboardEvent) {
  if (props.disabled) return
  // Enter activates the card (default action) — emits @click for the
  // consumer to open a detail panel / navigate / etc. Native <button>
  // gets this for free; we re-emit because the card root is a
  // <div role="button"> (chosen so consumers can nest <button>/links
  // inside the card without violating "no interactive content in a
  // button" — see commit context). The event still surfaces through
  // the standard @click slot.
  if (e.key === 'Enter') {
    e.preventDefault()
    emits('click', new MouseEvent('click', { bubbles: true, cancelable: true }))
    return
  }
  if (!props.keyboardDraggable) return
  if (e.key === ' ') {
    e.preventDefault()
    isKeyboardGrabbed.value = !isKeyboardGrabbed.value
    return
  }
  if (e.key === 'Escape' && isKeyboardGrabbed.value) {
    e.preventDefault()
    isKeyboardGrabbed.value = false
    return
  }
  if (!isKeyboardGrabbed.value) return
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    e.preventDefault()
    const allLanes = Array.from(document.querySelectorAll<HTMLElement>('[data-board-lane]')).filter(
      (el) => !el.hasAttribute('data-disabled'),
    )
    const currentIdx = allLanes.findIndex((el) => el.dataset.laneId === lane.laneId.value)
    if (currentIdx === -1 || allLanes.length === 0) return
    const delta = e.key === 'ArrowLeft' ? -1 : 1
    const nextLane = allLanes[(currentIdx + delta + allLanes.length) % allLanes.length]
    if (nextLane?.dataset.laneId) {
      board.moveItem(props.id, nextLane.dataset.laneId)
      requestAnimationFrame(() => {
        const moved = document.querySelector<HTMLElement>(`[data-board-card-id="${props.id}"]`)
        moved?.focus()
      })
    }
    return
  }
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    e.preventDefault()
    const laneEl = cardEl.value?.closest('[data-board-lane]')
    if (!laneEl) return
    const cards = Array.from(laneEl.querySelectorAll<HTMLElement>('[data-board-card]'))
    const currentIdx = cards.findIndex((el) => el.dataset.boardCardId === props.id)
    if (currentIdx === -1) return
    const delta = e.key === 'ArrowUp' ? -1 : 1
    const targetIdx = Math.max(0, Math.min(cards.length - 1, currentIdx + delta))
    if (targetIdx !== currentIdx) board.moveItem(props.id, lane.laneId.value, targetIdx)
  }
}

function onDragStart(e: DragEvent) {
  if (props.disabled) {
    e.preventDefault()
    return
  }
  emits('dragstart', e)
}
function onDragEnd() {
  emits('dragend')
}
function onClick(e: MouseEvent) {
  if (props.disabled) {
    e.preventDefault()
    return
  }
  // Cmd/Ctrl/Shift+click toggles the selection (multi-select for drag);
  // plain click clears any selection and just emits to the consumer
  // (typically opens a detail Sheet).
  if (props.selectable && (e.metaKey || e.ctrlKey || e.shiftKey)) {
    e.preventDefault()
    board.toggleSelection(props.id, true)
    return
  }
  if (board.draggingIds.value.includes(props.id)) return
  if (board.selectedIds.value.size > 0) board.clearSelection()
  emits('click', e)
}
</script>

<template>
  <!-- Root is `<div role="button">` rather than `<button type="button">`
       so consumers can nest interactive content (buttons, links, menus)
       inside cards. The HTML5 spec forbids interactive content inside a
       <button>; browsers silently de-nest the inner element which
       breaks its events. Enter is wired manually in onKeydown to match
       the native button default-action behaviour. -->
  <div
    ref="cardEl"
    role="button"
    data-uipkge
    data-slot="board-card"
    data-board-card
    :data-board-card-id="id"
    :data-state="state"
    :data-selected="isSelected || undefined"
    :data-disabled="disabled || undefined"
    :aria-disabled="disabled || undefined"
    :aria-pressed="selectable ? isSelected : undefined"
    :class="
      cn(
        boardCardVariants({ state }),
        isSelected && 'ring-primary/60 ring-offset-background ring-2 ring-offset-1',
        disabled && 'pointer-events-none cursor-not-allowed opacity-50 shadow-none grayscale hover:translate-y-0',
        props.class,
      )
    "
    :draggable="disabled ? false : true"
    :tabindex="disabled ? -1 : 0"
    :aria-roledescription="keyboardDraggable && !disabled ? 'draggable card' : undefined"
    @click="onClick"
    @keydown="onKeydown"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <slot />
  </div>
</template>

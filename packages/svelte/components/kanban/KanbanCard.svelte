<script lang="ts" module>
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  export interface KanbanCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
    id: string
    disabled?: boolean
    /** Disable the keyboard grab (Space / arrows) while leaving pointer
     *  dragging intact. Default: enabled. */
    keyboardDraggable?: boolean
    children?: Snippet<[{ isDragging: boolean; isGrabbed: boolean }]>
    ref?: HTMLDivElement | null
  }
</script>

<script lang="ts">
  import { cn } from '$lib/utils'
  import { getKanbanColumnContext, getKanbanContext } from './context'
  import { kanbanCardVariants } from './kanban.variants'

  let {
    class: className,
    id,
    disabled = false,
    keyboardDraggable = true,
    children,
    ref = $bindable(null),
    ...restProps
  }: KanbanCardProps = $props()

  const kanban = getKanbanContext()
  const column = getKanbanColumnContext()

  const isGrabbed = $derived(kanban?.grabbedCardId === id)
  const isDragging = $derived(kanban?.draggingCardId === id || isGrabbed)

  const canKeyboardDrag = $derived(keyboardDraggable && !disabled && !!kanban && !!column)

  function columnName(el: HTMLElement | null) {
    return el?.getAttribute('aria-label') || el?.dataset.columnId || 'column'
  }

  /** Ordered, enabled columns of the board this card sits in. */
  function boardColumns(): HTMLElement[] {
    const board = ref?.closest('[data-slot="kanban"]') ?? document
    return Array.from(board.querySelectorAll<HTMLElement>('[data-slot="kanban-column"]'))
  }

  function focusSelfAfterMove() {
    // The consumer owns the data, so the card is re-rendered (often as a new
    // node) in its new column. Re-find it by id and restore focus.
    requestAnimationFrame(() => {
      const moved = document.querySelector<HTMLElement>(`[data-slot="kanban-card"][data-card-id="${id}"]`)
      moved?.focus()
    })
  }

  function grab() {
    if (!canKeyboardDrag) return
    kanban!.setGrabbedCard(id)
    kanban!.setDraggingCard(id, column!.columnId)
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
      cardId: id,
      fromColumnId: column!.columnId,
      toColumnId: target.dataset.columnId,
    })
    kanban!.setDraggingCard(id, target.dataset.columnId)
    kanban!.setOverColumn(target.dataset.columnId)
    kanban!.announce(`Moved to ${columnName(target)}.`)
    focusSelfAfterMove()
  }

  function moveWithinColumn(delta: -1 | 1) {
    const columnEl = ref?.closest<HTMLElement>('[data-slot="kanban-column"]')
    if (!columnEl) return
    const cards = Array.from(columnEl.querySelectorAll<HTMLElement>('[data-slot="kanban-card"]'))
    const currentIdx = cards.findIndex((el) => el.dataset.cardId === id)
    if (currentIdx === -1) return
    const targetIdx = currentIdx + delta
    if (targetIdx < 0 || targetIdx > cards.length - 1) return
    kanban!.emitMove({
      cardId: id,
      fromColumnId: column!.columnId,
      toColumnId: column!.columnId,
      toIndex: targetIdx,
    })
    kanban!.announce(`Position ${targetIdx + 1} of ${cards.length}.`)
    focusSelfAfterMove()
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!canKeyboardDrag) return

    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault()
      if (isGrabbed) release(false)
      else grab()
      return
    }
    if (!isGrabbed) return
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
    if (isGrabbed) release(true)
  }

  function handleDragStart(e: DragEvent) {
    if (disabled) {
      e.preventDefault()
      return
    }
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', id)
    }
    kanban?.setDraggingCard(id, column?.columnId ?? null)
  }

  function handleDragEnd() {
    kanban?.setDraggingCard(null, null)
    kanban?.setOverColumn(null)
  }
</script>

<!-- `role="button"` rather than a real <button> so consumers can nest
     interactive content (menus, links) inside a card — the HTML spec
     forbids that inside <button>. Matches <BoardCard>. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex: role is button whenever the card is focusable -->
<div
  bind:this={ref}
  data-uipkge=""
  data-slot="kanban-card"
  data-card-id={id}
  data-state={isGrabbed ? 'grabbed' : isDragging ? 'dragging' : 'idle'}
  data-disabled={disabled || undefined}
  role={canKeyboardDrag ? 'button' : undefined}
  tabindex={canKeyboardDrag ? 0 : undefined}
  aria-disabled={disabled || undefined}
  aria-roledescription={canKeyboardDrag ? 'draggable card' : undefined}
  aria-pressed={canKeyboardDrag ? isGrabbed : undefined}
  draggable={!disabled}
  class={cn(kanbanCardVariants({ isDragging }), disabled && 'pointer-events-none opacity-50', className)}
  ondragstart={handleDragStart}
  ondragend={handleDragEnd}
  onkeydown={handleKeydown}
  onblur={handleBlur}
  {...restProps}
>
  {@render children?.({ isDragging, isGrabbed })}
</div>

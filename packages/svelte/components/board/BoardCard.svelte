<script lang="ts" module>
  import type { HTMLAttributes } from 'svelte/elements'

  export interface BoardCardProps
    extends Omit<HTMLAttributes<HTMLDivElement>, 'onclick' | 'onkeydown' | 'ondragstart' | 'ondragend'> {
    id: string
    /** Disable keyboard grab (e.g. for read-only boards). Default: enabled. */
    keyboardDraggable?: boolean
    /** Disable the card entirely — non-draggable, non-clickable, dimmed.
     *  Use for cards locked by a workflow rule or a server policy. */
    disabled?: boolean
    /** Per-card allow-list. When set, the card can only be dropped into
     *  these lane ids; the state helper rejects any other target silently.
     *  Omit to allow every lane the global `accepts` predicate permits. */
    allowedLanes?: readonly string[]
    /** Show the click-to-select chrome (ring + cmd/shift-click multi-select).
     *  Default true. Turn off for read-only or single-tap-to-open boards. */
    selectable?: boolean
    /** The card <div>, via `bind:ref`. */
    ref?: HTMLDivElement | null
    /** Merged with the internal handlers (selection, Enter-to-activate). */
    onclick?: (e: MouseEvent) => void
    onkeydown?: (e: KeyboardEvent) => void
    ondragstart?: (e: DragEvent) => void
    ondragend?: () => void
  }
</script>

<script lang="ts">
  import { getContext, onMount, setContext } from 'svelte'
  import { cn } from '$lib/utils'
  import { BOARD_CARD_CONTEXT, BOARD_CONTEXT, BOARD_LANE_CONTEXT } from './context'
  import type { BoardCardContext, BoardContext, BoardLaneContext } from './context'
  import { boardCardVariants } from './board.variants'

  let {
    class: className,
    id,
    keyboardDraggable = true,
    disabled = false,
    allowedLanes = undefined,
    selectable = true,
    children,
    ref = $bindable(null),
    onclick,
    onkeydown,
    ondragstart,
    ondragend,
    ...restProps
  }: BoardCardProps = $props()

  const boardContext = getContext<BoardContext | null>(BOARD_CONTEXT)
  const laneContext = getContext<BoardLaneContext | null>(BOARD_LANE_CONTEXT)
  if (!boardContext || !laneContext) {
    throw new Error('<BoardCard> must be a descendant of <Board> and <BoardLane>.')
  }
  // Non-nullable aliases: the throw above proves presence, and plain consts
  // keep the narrowing inside every closure below.
  const board: BoardContext = boardContext
  const lane: BoardLaneContext = laneContext

  let isKeyboardGrabbed = $state(false)
  // Either source of truth wins — `draggingIds` is the multi-select-aware
  // list, `draggingId` is the single-anchor (backward-compat for consumers
  // that don't pass the multi state through). Keyboard-grabbed adds the
  // same visual without touching parent state.
  const isDragging = $derived(
    board.draggingIds.includes(id) || board.draggingId === id || isKeyboardGrabbed,
  )
  const isJustMoved = $derived(board.justMovedId === id)
  const isSelected = $derived(board.selectedIds.has(id))

  setContext<BoardCardContext>(BOARD_CARD_CONTEXT, {
    get cardId() {
      return id
    },
    get laneId() {
      return lane.laneId
    },
    get isDragging() {
      return isDragging
    },
    get isJustMoved() {
      return isJustMoved
    },
    get isSelected() {
      return isSelected
    },
    get disabled() {
      return disabled
    },
  })

  // Per-card allowed-lanes registry. Re-run if the id OR the list changes.
  onMount(() => {
    board.registerAllowedLanes(id, allowedLanes)
    return () => board.unregisterAllowedLanes(prevCardId)
  })
  let prevCardId = id
  $effect(() => {
    if (prevCardId !== id) {
      board.unregisterAllowedLanes(prevCardId)
      prevCardId = id
    }
    board.registerAllowedLanes(id, allowedLanes)
  })

  const cardState = $derived.by<'idle' | 'dragging' | 'moved'>(() => {
    if (isDragging) return 'dragging'
    if (isJustMoved) return 'moved'
    return 'idle'
  })

  function onKeydown(e: KeyboardEvent) {
    if (!disabled) {
      // Enter activates the card (default action) — calls onclick for the
      // consumer to open a detail panel / navigate / etc. Native <button>
      // gets this for free; we re-emit because the card root is a
      // <div role="button"> (chosen so consumers can nest <button>/links
      // inside the card without violating "no interactive content in a
      // button" — see commit context). The event still surfaces through
      // the standard onclick handler.
      if (e.key === 'Enter') {
        e.preventDefault()
        onclick?.(new MouseEvent('click', { bubbles: true, cancelable: true }))
      } else if (keyboardDraggable) {
        if (e.key === ' ') {
          e.preventDefault()
          isKeyboardGrabbed = !isKeyboardGrabbed
        } else if (e.key === 'Escape' && isKeyboardGrabbed) {
          e.preventDefault()
          isKeyboardGrabbed = false
        } else if (isKeyboardGrabbed && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
          e.preventDefault()
          const allLanes = Array.from(document.querySelectorAll<HTMLElement>('[data-board-lane]')).filter(
            (el) => !el.hasAttribute('data-disabled'),
          )
          const currentIdx = allLanes.findIndex((el) => el.dataset.laneId === lane.laneId)
          if (currentIdx !== -1 && allLanes.length > 0) {
            const delta = e.key === 'ArrowLeft' ? -1 : 1
            const nextLane = allLanes[(currentIdx + delta + allLanes.length) % allLanes.length]
            if (nextLane?.dataset.laneId) {
              board.moveItem(id, nextLane.dataset.laneId)
              requestAnimationFrame(() => {
                const moved = document.querySelector<HTMLElement>(`[data-board-card-id="${id}"]`)
                moved?.focus()
              })
            }
          }
        } else if (isKeyboardGrabbed && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
          e.preventDefault()
          const laneEl = ref?.closest('[data-board-lane]')
          if (laneEl) {
            const cards = Array.from(laneEl.querySelectorAll<HTMLElement>('[data-board-card]'))
            const currentIdx = cards.findIndex((el) => el.dataset.boardCardId === id)
            if (currentIdx !== -1) {
              const delta = e.key === 'ArrowUp' ? -1 : 1
              const targetIdx = Math.max(0, Math.min(cards.length - 1, currentIdx + delta))
              if (targetIdx !== currentIdx) board.moveItem(id, lane.laneId, targetIdx)
            }
          }
        }
      }
    }
    onkeydown?.(e)
  }

  function onDragStart(e: DragEvent) {
    if (disabled) {
      e.preventDefault()
      return
    }
    ondragstart?.(e)
  }
  function onDragEnd() {
    ondragend?.()
  }
  function onClick(e: MouseEvent) {
    if (disabled) {
      e.preventDefault()
      return
    }
    // Cmd/Ctrl/Shift+click toggles the selection (multi-select for drag);
    // plain click clears any selection and just calls through to the
    // consumer (typically opens a detail Sheet).
    if (selectable && (e.metaKey || e.ctrlKey || e.shiftKey)) {
      e.preventDefault()
      board.toggleSelection(id, true)
      return
    }
    if (board.draggingIds.includes(id)) return
    if (board.selectedIds.size > 0) board.clearSelection()
    onclick?.(e)
  }
</script>

<!-- Root is `<div role="button">` rather than `<button type="button">`
     so consumers can nest interactive content (buttons, links, menus)
     inside cards. The HTML5 spec forbids interactive content inside a
     <button>; browsers silently de-nest the inner element which
     breaks its events. Enter is wired manually in onKeydown to match
     the native button default-action behaviour. -->
<div
  bind:this={ref}
  role="button"
  data-uipkge=""
  data-slot="board-card"
  data-board-card=""
  data-board-card-id={id}
  data-state={cardState}
  data-selected={isSelected || undefined}
  data-disabled={disabled || undefined}
  aria-disabled={disabled || undefined}
  aria-pressed={selectable ? isSelected : undefined}
  class={cn(
    boardCardVariants({ state: cardState }),
    isSelected && 'ring-primary/60 ring-offset-background ring-2 ring-offset-1',
    disabled && 'pointer-events-none cursor-not-allowed opacity-50 shadow-none grayscale hover:translate-y-0',
    className,
  )}
  draggable={disabled ? false : true}
  tabindex={disabled ? -1 : 0}
  aria-roledescription={keyboardDraggable && !disabled ? 'draggable card' : undefined}
  onclick={onClick}
  onkeydown={onKeydown}
  ondragstart={onDragStart}
  ondragend={onDragEnd}
  {...restProps}
>
  {@render children?.()}
</div>

import { reactive, ref, type ComputedRef, type Ref } from 'vue'
import type { BoardAcceptsFn, BoardDropEvent } from '@/components/ui/board/context'

export interface UseBoardOptions<TItem extends { id: string }> {
  /** Reactive source of truth: lane id → items in that lane. */
  lanes: Ref<Record<string, TItem[]>> | ComputedRef<Record<string, TItem[]>>
  /** Optional accept predicate (runs in addition to per-card allowedLanes
   *  and per-lane disabled flags). Returning false rejects the drop. */
  accepts?: BoardAcceptsFn
  /** Fires on every successful move (DnD or imperative). */
  onChange?: (event: BoardDropEvent) => void
  /** ms before `state.justMovedId` clears. Default 600. */
  highlightMs?: number
}

export interface UseBoardReturn {
  state: {
    draggingId: string | null
    draggingIds: readonly string[]
    dragOverLaneId: string | null
    justMovedId: string | null
    selectedIds: ReadonlySet<string>
  }
  handlers: {
    onDragStart: (e: DragEvent, itemId: string, laneId: string) => void
    onLaneDragOver: (e: DragEvent, laneId: string) => void
    onLaneDragLeave: (laneId: string) => void
    onLaneDrop: (e: DragEvent, laneId: string) => void
    onDragEnd: () => void
  }
  /** Imperative — used by keyboard handlers, undo, server-pushed updates.
   *  Pass a single id OR an array of ids; arrays move as a group while
   *  preserving their relative order. */
  moveItem: (itemId: string | string[], toLaneId: string, toIndex?: number) => void
  /** Toggle one item in the selection set. When `additive=false` (the
   *  default for plain clicks), the call replaces the selection with
   *  just this item; when `true` (cmd/shift+click), the call adds or
   *  removes the item from the existing set. */
  toggleSelection: (itemId: string, additive?: boolean) => void
  clearSelection: () => void
  /** Per-card allowed-lanes registry — Board's `<BoardCard>` writes here
   *  on mount; lanes call `isLaneAcceptingFor` (exposed through context)
   *  to query. Exported for advanced consumers that want to drive it
   *  externally. */
  registerAllowedLanes: (cardId: string, lanes: readonly string[] | undefined) => void
  unregisterAllowedLanes: (cardId: string) => void
  registerLaneDisabled: (laneId: string, disabled: boolean) => void
  unregisterLaneDisabled: (laneId: string) => void
  isLaneAcceptingFor: (laneId: string) => boolean
  accepts: BoardAcceptsFn
}

const ALWAYS = () => true

/**
 * Board state + DnD orchestration. Designed to back the `@uipkge/board`
 * compositional primitive but usable with any rendering layer — the lane
 * components only need to bind handlers and read the reactive state.
 *
 * Capabilities:
 *   - Insertion-index drop: pointer Y vs each card's bounding-box midpoint
 *   - Multi-item drag: grabbing a selected card drags the whole selection
 *   - Per-card `allowedLanes` allow-list (BoardCard registers on mount)
 *   - Per-lane `disabled` flag (BoardLane registers on mount)
 *   - `accepts` predicate runs in addition to the two above
 */
export function useBoard<TItem extends { id: string }>(opts: UseBoardOptions<TItem>): UseBoardReturn {
  const accepts: BoardAcceptsFn = opts.accepts ?? ALWAYS
  const highlightMs = opts.highlightMs ?? 600

  const state = reactive({
    draggingId: null as string | null,
    draggingIds: [] as readonly string[],
    dragOverLaneId: null as string | null,
    justMovedId: null as string | null,
    selectedIds: new Set<string>() as ReadonlySet<string>,
  })

  const sourceLaneByDragId = ref<string | null>(null)
  let _highlightTimer: ReturnType<typeof setTimeout> | null = null

  // Per-card allowed-lanes + per-lane disabled registries. Both are
  // reactive enough through Map mutation + array reassignment because
  // we only read them on event dispatch (not in templates).
  const allowedLanesByCard = new Map<string, readonly string[]>()
  const disabledLanes = new Set<string>()

  function findItem(itemId: string): { item: TItem; laneId: string; index: number } | null {
    const lanes = opts.lanes.value
    for (const laneId of Object.keys(lanes)) {
      const idx = lanes[laneId]!.findIndex((it) => it.id === itemId)
      if (idx !== -1) return { item: lanes[laneId]![idx]!, laneId, index: idx }
    }
    return null
  }

  function isAllowed(itemId: string, fromLaneId: string, toLaneId: string): boolean {
    if (disabledLanes.has(toLaneId)) return false
    const allow = allowedLanesByCard.get(itemId)
    if (allow && !allow.includes(toLaneId)) return false
    return accepts(itemId, fromLaneId, toLaneId)
  }

  function flashMoved(itemId: string) {
    state.justMovedId = itemId
    if (_highlightTimer) clearTimeout(_highlightTimer)
    _highlightTimer = setTimeout(() => {
      if (state.justMovedId === itemId) state.justMovedId = null
    }, highlightMs)
  }

  function moveItem(itemId: string | string[], toLaneId: string, toIndex?: number) {
    const ids = Array.isArray(itemId) ? itemId : [itemId]
    if (ids.length === 0) return

    // Resolve each, in DOM order across lanes (snapshot before mutation).
    const resolved = ids
      .map((id) => findItem(id))
      .filter((x): x is { item: TItem; laneId: string; index: number } => !!x)
    if (resolved.length === 0) return

    // All-or-nothing: if ANY item is rejected by the destination
    // (per-card allowedLanes / lane disabled / accepts predicate), the
    // whole move aborts. Matches the dragover visual which already
    // refuses to highlight as accepting when one item in the selection
    // isn't allowed — keeps single + multi-select drops feeling the same.
    const allAllowed = resolved.every((r) => isAllowed(r.item.id, r.laneId, toLaneId))
    if (!allAllowed) return
    const movable = resolved

    const lanes = { ...opts.lanes.value }
    // 1. Remove every movable item from its current lane (in reverse-index
    //    order per-lane so indices stay valid during splice).
    const byLane = new Map<string, number[]>()
    for (const r of movable) {
      if (!byLane.has(r.laneId)) byLane.set(r.laneId, [])
      byLane.get(r.laneId)!.push(r.index)
    }
    for (const [laneId, indices] of byLane.entries()) {
      const next = [...lanes[laneId]!]
      indices.sort((a, b) => b - a).forEach((idx) => next.splice(idx, 1))
      lanes[laneId] = next
    }

    // 2. Insert all movable items into the destination at toIndex, in their
    //    original cross-lane order.
    const inserts = movable.map((r) => r.item)
    const dest = [...(lanes[toLaneId] ?? [])]
    // If the target previously held some of the moved items, the index the
    // consumer asked for (toIndex) was computed against the pre-splice
    // layout. Clamp post-splice.
    const insertAt = Math.max(0, Math.min(dest.length, toIndex ?? dest.length))
    dest.splice(insertAt, 0, ...inserts)
    lanes[toLaneId] = dest
    ;(opts.lanes as Ref<Record<string, TItem[]>>).value = lanes

    flashMoved(movable[0]!.item.id)
    opts.onChange?.({
      itemId: movable[0]!.item.id,
      itemIds: movable.map((r) => r.item.id),
      from: movable[0]!.laneId,
      to: toLaneId,
      index: insertAt,
    })
  }

  function computeInsertIndex(e: DragEvent, laneId: string): number {
    const laneEl = (e.currentTarget as HTMLElement | null) ?? null
    if (!laneEl) return opts.lanes.value[laneId]?.length ?? 0
    const cards = Array.from(laneEl.querySelectorAll<HTMLElement>('[data-board-card]'))
    // Exclude every card currently being dragged from the insertion math —
    // those rows will close once we splice, and we want the pointer-relative
    // position among the remaining cards.
    const dragging = new Set(state.draggingIds)
    const otherCards = cards.filter((c) => {
      const id = c.getAttribute('data-board-card-id')
      return id ? !dragging.has(id) : true
    })
    for (let i = 0; i < otherCards.length; i++) {
      const rect = otherCards[i]!.getBoundingClientRect()
      const midpoint = rect.top + rect.height / 2
      if (e.clientY < midpoint) return i
    }
    return otherCards.length
  }

  function toggleSelection(itemId: string, additive = false) {
    const next = new Set(state.selectedIds)
    if (additive) {
      if (next.has(itemId)) next.delete(itemId)
      else next.add(itemId)
    } else {
      next.clear()
      next.add(itemId)
    }
    state.selectedIds = next
  }

  function clearSelection() {
    if (state.selectedIds.size === 0) return
    state.selectedIds = new Set<string>()
  }

  const handlers: UseBoardReturn['handlers'] = {
    onDragStart(e, itemId, laneId) {
      // If the grabbed card is part of the current selection, drag the
      // whole set; otherwise drag this one alone (and clear selection so
      // the next single click doesn't surprise the user).
      const inSelection = state.selectedIds.has(itemId)
      const ids = inSelection && state.selectedIds.size > 1 ? Array.from(state.selectedIds) : [itemId]
      if (!inSelection) clearSelection()
      state.draggingId = itemId
      state.draggingIds = ids
      sourceLaneByDragId.value = laneId
      if (e.dataTransfer) {
        e.dataTransfer.setData('text/plain', itemId)
        e.dataTransfer.effectAllowed = 'move'
      }
    },
    onLaneDragOver(e, laneId) {
      if (!state.draggingId) return
      const fromLane = sourceLaneByDragId.value ?? laneId
      // All dragging items must be allowed at the target — reject the
      // whole drop if any one is blocked.
      const allOk = state.draggingIds.every((id) => isAllowed(id, fromLane, laneId))
      // dragOverLaneId is set in BOTH branches so the lane can show its
      // rejecting visual (red ring) on hover, not just its accepting
      // visual. preventDefault only fires on accept — without it the
      // browser refuses the drop, exactly what we want for rejected hits.
      state.dragOverLaneId = laneId
      if (!allOk) {
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'none'
        return
      }
      e.preventDefault()
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
    },
    onLaneDragLeave(laneId) {
      if (state.dragOverLaneId === laneId) state.dragOverLaneId = null
    },
    onLaneDrop(e, laneId) {
      e.preventDefault()
      const fallbackId = e.dataTransfer?.getData('text/plain') || state.draggingId
      const ids = state.draggingIds.length > 0 ? state.draggingIds : fallbackId ? [fallbackId] : []
      if (ids.length === 0) return
      const insertAt = computeInsertIndex(e, laneId)
      moveItem([...ids], laneId, insertAt)
      state.draggingId = null
      state.draggingIds = []
      state.dragOverLaneId = null
      sourceLaneByDragId.value = null
    },
    onDragEnd() {
      state.draggingId = null
      state.draggingIds = []
      state.dragOverLaneId = null
      sourceLaneByDragId.value = null
    },
  }

  return {
    state,
    handlers,
    moveItem,
    toggleSelection,
    clearSelection,
    accepts,
    registerAllowedLanes: (cardId, lanes) => {
      if (lanes && lanes.length > 0) allowedLanesByCard.set(cardId, lanes)
      else allowedLanesByCard.delete(cardId)
    },
    unregisterAllowedLanes: (cardId) => {
      allowedLanesByCard.delete(cardId)
    },
    registerLaneDisabled: (laneId, disabled) => {
      if (disabled) disabledLanes.add(laneId)
      else disabledLanes.delete(laneId)
    },
    unregisterLaneDisabled: (laneId) => {
      disabledLanes.delete(laneId)
    },
    isLaneAcceptingFor: (laneId) => {
      if (!state.draggingId) return false
      const fromLane = sourceLaneByDragId.value ?? laneId
      return state.draggingIds.every((id) => isAllowed(id, fromLane, laneId))
    },
  }
}

/** Type-only helper for consumers that want to type the lanes ref locally. */
export type BoardLanes<TItem extends { id: string }> = Record<string, TItem[]>

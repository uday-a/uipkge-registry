import type { InjectionKey, Ref } from 'vue'

export type BoardOrientation = 'horizontal' | 'vertical'
export type BoardDensity = 'compact' | 'default' | 'comfortable'

/** Drop event emitted by useBoard handlers. */
export interface BoardDropEvent {
  /** First (anchor) item moved. For multi-item drops, see `itemIds`. */
  itemId: string
  /** All items moved in this drop, in their final visual order. */
  itemIds: string[]
  from: string
  to: string
  /** Insertion index of the first item in the target lane. */
  index: number
}

/** Predicate consumers pass to control which items each lane accepts. */
export type BoardAcceptsFn = (itemId: string, fromLaneId: string, toLaneId: string) => boolean

export interface BoardContext {
  orientation: Ref<BoardOrientation>
  density: Ref<BoardDensity>
  /** TransitionGroup name. Defaults to `motion-list` (the @uipkge motion preset). */
  motion: Ref<string>
  /** Currently-grabbed primary card id (pointer drag OR keyboard grab). */
  draggingId: Ref<string | null>
  /** All cards being dragged this turn — usually `[draggingId]`, but
   *  expands to the full selection when the user grabs one of a multi-
   *  selected set. Lanes read this to compute drop math (the dragged
   *  cards are excluded from the insertion-index walk). */
  draggingIds: Ref<readonly string[]>
  /** Lane currently under the pointer/keyboard cursor. */
  dragOverLaneId: Ref<string | null>
  /** Card that just landed — used by consumers for a momentary highlight. */
  justMovedId: Ref<string | null>
  /** Multi-select set. Click-and-drag any selected card moves the whole
   *  set; click a non-selected card to drag that one alone. */
  selectedIds: Ref<ReadonlySet<string>>
  /** Predicate run by lanes; defaults to always-accept. */
  accepts: Ref<BoardAcceptsFn>
  /** Imperative move — used by keyboard handlers + external callers. */
  moveItem: (itemId: string | string[], toLaneId: string, toIndex?: number) => void
  /** Toggle one item in the selection set (or replace it if `additive` is false). */
  toggleSelection: (itemId: string, additive?: boolean) => void
  /** Drop the entire selection. */
  clearSelection: () => void
  /** Per-card allow-list registry. BoardCard registers its own `allowedLanes`
   *  on mount; lanes consult this to short-circuit rejected drops without
   *  the consumer having to encode the rule inside `accepts`. */
  registerAllowedLanes: (cardId: string, lanes: readonly string[] | undefined) => void
  unregisterAllowedLanes: (cardId: string) => void
  /** Whether the lane's drops are accepted for the dragging item, given
   *  the current `accepts` + per-card allowedLanes + lane disabled state. */
  isLaneAcceptingFor: (laneId: string) => boolean
  /** Lane registration (mirrors Timeline pattern). */
  laneIds: Ref<symbol[]>
  registerLane: (id: symbol) => void
  unregisterLane: (id: symbol) => void
  /** Lane disabled registry — lanes call register/unregister; useBoard +
   *  isLaneAcceptingFor read from it. */
  registerLaneDisabled: (laneId: string, disabled: boolean) => void
  unregisterLaneDisabled: (laneId: string) => void
}

export const BOARD_CONTEXT: InjectionKey<BoardContext> = Symbol('BoardContext')

export interface BoardLaneContext {
  laneId: Ref<string>
  isDragOver: Ref<boolean>
  isAccepting: Ref<boolean>
  disabled: Ref<boolean>
}

export const BOARD_LANE_CONTEXT: InjectionKey<BoardLaneContext> = Symbol('BoardLaneContext')

export interface BoardCardContext {
  cardId: Ref<string>
  laneId: Ref<string>
  isDragging: Ref<boolean>
  isJustMoved: Ref<boolean>
  isSelected: Ref<boolean>
  disabled: Ref<boolean>
}

export const BOARD_CARD_CONTEXT: InjectionKey<BoardCardContext> = Symbol('BoardCardContext')

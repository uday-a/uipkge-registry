import { getContext } from 'svelte'

export type BoardOrientation = 'horizontal' | 'vertical'
export type BoardDensity = 'compact' | 'default' | 'comfortable'

/** Drop event emitted by board state helpers (see the `use-board` hook twin). */
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

/**
 * External state snapshot — mirrors React `useBoard`'s `state`
 * (`UseBoardState`). Pass the whole object as `<Board state={...}>` instead
 * of threading the five fields as individual props.
 */
export interface BoardState {
  draggingId?: string | null
  draggingIds?: readonly string[]
  dragOverLaneId?: string | null
  justMovedId?: string | null
  selectedIds?: ReadonlySet<string>
}

export interface BoardContext {
  orientation: BoardOrientation
  density: BoardDensity
  /** Transition name for lane bodies. Defaults to `motion-list` (the @uipkge motion preset). */
  motion: string
  /** Currently-grabbed primary card id (pointer drag OR keyboard grab). */
  draggingId: string | null
  /** All cards being dragged this turn — usually `[draggingId]`, but
   *  expands to the full selection when the user grabs one of a multi-
   *  selected set. Lanes read this to compute drop math (the dragged
   *  cards are excluded from the insertion-index walk). */
  draggingIds: readonly string[]
  /** Lane currently under the pointer/keyboard cursor. */
  dragOverLaneId: string | null
  /** Card that just landed — used by consumers for a momentary highlight. */
  justMovedId: string | null
  /** Multi-select set. Click-and-drag any selected card moves the whole
   *  set; click a non-selected card to drag that one alone. */
  selectedIds: ReadonlySet<string>
  /** Predicate run by lanes; defaults to always-accept. */
  accepts: BoardAcceptsFn
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
  laneIds: symbol[]
  registerLane: (id: symbol) => void
  unregisterLane: (id: symbol) => void
  /** Lane disabled registry — lanes call register/unregister; board state
   *  helpers + isLaneAcceptingFor read from it. */
  registerLaneDisabled: (laneId: string, disabled: boolean) => void
  unregisterLaneDisabled: (laneId: string) => void
}

export const BOARD_CONTEXT = Symbol('BoardContext')

/** React-parity alias: React names this interface `BoardContextValue`. */
export type BoardContextValue = BoardContext

export interface BoardLaneContext {
  laneId: string
  isDragOver: boolean
  isAccepting: boolean
  disabled: boolean
}

export const BOARD_LANE_CONTEXT = Symbol('BoardLaneContext')

/** React-parity alias: React names this interface `BoardLaneContextValue`. */
export type BoardLaneContextValue = BoardLaneContext

export interface BoardCardContext {
  cardId: string
  laneId: string
  isDragging: boolean
  isJustMoved: boolean
  isSelected: boolean
  disabled: boolean
}

export const BOARD_CARD_CONTEXT = Symbol('BoardCardContext')

/** React-parity alias: React names this interface `BoardCardContextValue`. */
export type BoardCardContextValue = BoardCardContext

// ---------------------------------------------------------------------------
// Context helpers (Svelte-idiomatic `get*` twins of React's `useBoard*` hooks)
// ---------------------------------------------------------------------------

/** Read the board context. Throws outside `<Board>` — mirrors React's `useBoardContext`. */
export function getBoardContext(): BoardContext {
  const ctx = getContext<BoardContext | null>(BOARD_CONTEXT)
  if (!ctx) throw new Error('<BoardCard> / <BoardLane> must be a descendant of <Board>.')
  return ctx
}

/** Read the lane context. Throws outside `<BoardLane>` — mirrors React's `useBoardLaneContext`. */
export function getBoardLaneContext(): BoardLaneContext {
  const ctx = getContext<BoardLaneContext | null>(BOARD_LANE_CONTEXT)
  if (!ctx) throw new Error('<BoardCard> must be a descendant of <BoardLane>.')
  return ctx
}

/** Read the card context. Throws outside `<BoardCard>`. */
export function getBoardCardContext(): BoardCardContext {
  const ctx = getContext<BoardCardContext | null>(BOARD_CARD_CONTEXT)
  if (!ctx) throw new Error('Board card parts must be a descendant of <BoardCard>.')
  return ctx
}

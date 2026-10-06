import { getContext, setContext } from 'svelte'

export interface KanbanMoveEvent {
  cardId: string
  fromColumnId: string
  toColumnId: string
  toIndex?: number
}

export interface KanbanContext {
  readonly draggingCardId: string | null
  readonly draggingColumnId: string | null
  readonly overColumnId: string | null
  /** Set while a card is held by keyboard (Space), not by pointer drag. */
  readonly grabbedCardId: string | null
  setDraggingCard: (cardId: string | null, columnId: string | null) => void
  setOverColumn: (columnId: string | null) => void
  setGrabbedCard: (cardId: string | null) => void
  emitMove: (event: KanbanMoveEvent) => void
  /** Speak a message through the board's polite live region. */
  announce: (message: string) => void
}

const KanbanContextKey = Symbol('KanbanContext')

export function setKanbanContext(ctx: KanbanContext): void {
  setContext(KanbanContextKey, ctx)
}

export function getKanbanContext(): KanbanContext | undefined {
  return getContext<KanbanContext | undefined>(KanbanContextKey)
}

export interface KanbanColumnContext {
  columnId: string
  /** True while a dragged (pointer or keyboard-grabbed) card hovers this column. React twin: `isOver`. */
  readonly isOver: boolean
  /** Column label, used to announce keyboard moves. Falls back to the id. */
  readonly label: string | undefined
}

const KanbanColumnContextKey = Symbol('KanbanColumnContext')

export function setKanbanColumnContext(ctx: KanbanColumnContext): void {
  setContext(KanbanColumnContextKey, ctx)
}

export function getKanbanColumnContext(): KanbanColumnContext | undefined {
  return getContext<KanbanColumnContext | undefined>(KanbanColumnContextKey)
}

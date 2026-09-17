import type { InjectionKey, Ref } from 'vue'

export interface KanbanMoveEvent {
  cardId: string
  fromColumnId: string
  toColumnId: string
  toIndex?: number
}

export interface KanbanContext {
  draggingCardId: Ref<string | null>
  draggingColumnId: Ref<string | null>
  overColumnId: Ref<string | null>
  setDraggingCard: (cardId: string | null, columnId: string | null) => void
  setOverColumn: (columnId: string | null) => void
  emitMove: (event: KanbanMoveEvent) => void
}

export const KanbanContextKey: InjectionKey<KanbanContext> = Symbol('KanbanContext')

export interface KanbanColumnContext {
  columnId: string
}

export const KanbanColumnContextKey: InjectionKey<KanbanColumnContext> = Symbol('KanbanColumnContext')

import type { InjectionKey, Ref } from "vue";

export interface KanbanMoveEvent {
  cardId: string;
  fromColumnId: string;
  toColumnId: string;
  toIndex?: number;
}

export interface KanbanContext {
  draggingCardId: Ref<string | null>;
  draggingColumnId: Ref<string | null>;
  overColumnId: Ref<string | null>;
  /** Set while a card is held by keyboard (Space), not by pointer drag. */
  grabbedCardId: Ref<string | null>;
  setDraggingCard: (cardId: string | null, columnId: string | null) => void;
  setOverColumn: (columnId: string | null) => void;
  setGrabbedCard: (cardId: string | null) => void;
  emitMove: (event: KanbanMoveEvent) => void;
  /** Speak a message through the board's polite live region. */
  announce: (message: string) => void;
}

export const KanbanContextKey: InjectionKey<KanbanContext> =
  Symbol("KanbanContext");

export interface KanbanColumnContext {
  columnId: string;
  /** Column label, used to announce keyboard moves. Falls back to the id. */
  label: Ref<string | undefined>;
}

export const KanbanColumnContextKey: InjectionKey<KanbanColumnContext> = Symbol(
  "KanbanColumnContext",
);

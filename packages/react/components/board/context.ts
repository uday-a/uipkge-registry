"use client";

import * as React from "react";

export type BoardOrientation = "horizontal" | "vertical";
export type BoardDensity = "compact" | "default" | "comfortable";

/** Drop event emitted by useBoard handlers. */
export interface BoardDropEvent {
  /** First (anchor) item moved. For multi-item drops, see `itemIds`. */
  itemId: string;
  /** All items moved in this drop, in their final visual order. */
  itemIds: string[];
  from: string;
  to: string;
  /** Insertion index of the first item in the target lane. */
  index: number;
}

/** Predicate consumers pass to control which items each lane accepts. */
export type BoardAcceptsFn = (
  itemId: string,
  fromLaneId: string,
  toLaneId: string,
) => boolean;

export interface BoardContextValue {
  orientation: BoardOrientation;
  density: BoardDensity;
  /** Animation preset class name. Defaults to `motion-list` (the @uipkge motion preset). */
  motion: string;
  /** Currently-grabbed primary card id (pointer drag OR keyboard grab). */
  draggingId: string | null;
  /** All cards being dragged this turn — usually `[draggingId]`, but
   *  expands to the full selection when the user grabs one of a multi-
   *  selected set. Lanes read this to compute drop math (the dragged
   *  cards are excluded from the insertion-index walk). */
  draggingIds: readonly string[];
  /** Lane currently under the pointer/keyboard cursor. */
  dragOverLaneId: string | null;
  /** Card that just landed — used by consumers for a momentary highlight. */
  justMovedId: string | null;
  /** Multi-select set. Click-and-drag any selected card moves the whole
   *  set; click a non-selected card to drag that one alone. */
  selectedIds: ReadonlySet<string>;
  /** Predicate run by lanes; defaults to always-accept. */
  accepts: BoardAcceptsFn;
  /** Imperative move — used by keyboard handlers + external callers. */
  moveItem: (
    itemId: string | string[],
    toLaneId: string,
    toIndex?: number,
  ) => void;
  /** Toggle one item in the selection set (or replace it if `additive` is false). */
  toggleSelection: (itemId: string, additive?: boolean) => void;
  /** Drop the entire selection. */
  clearSelection: () => void;
  /** Per-card allow-list registry. BoardCard registers its own `allowedLanes`
   *  on mount; lanes consult this to short-circuit rejected drops without
   *  the consumer having to encode the rule inside `accepts`. */
  registerAllowedLanes: (
    cardId: string,
    lanes: readonly string[] | undefined,
  ) => void;
  unregisterAllowedLanes: (cardId: string) => void;
  /** Whether the lane's drops are accepted for the dragging item, given
   *  the current `accepts` + per-card allowedLanes + lane disabled state. */
  isLaneAcceptingFor: (laneId: string) => boolean;
  /** Lane disabled registry — lanes call register/unregister; useBoard +
   *  isLaneAcceptingFor read from it. */
  registerLaneDisabled: (laneId: string, disabled: boolean) => void;
  unregisterLaneDisabled: (laneId: string) => void;
}

export const BoardContext = React.createContext<BoardContextValue | null>(null);

export function useBoardContext(): BoardContextValue {
  const ctx = React.useContext(BoardContext);
  if (!ctx)
    throw new Error(
      "<BoardCard> / <BoardLane> must be a descendant of <Board>.",
    );
  return ctx;
}

export interface BoardLaneContextValue {
  laneId: string;
  isDragOver: boolean;
  isAccepting: boolean;
  disabled: boolean;
}

export const BoardLaneContext =
  React.createContext<BoardLaneContextValue | null>(null);

export function useBoardLaneContext(): BoardLaneContextValue {
  const ctx = React.useContext(BoardLaneContext);
  if (!ctx) throw new Error("<BoardCard> must be a descendant of <BoardLane>.");
  return ctx;
}

export interface BoardCardContextValue {
  cardId: string;
  laneId: string;
  isDragging: boolean;
  isJustMoved: boolean;
  isSelected: boolean;
  disabled: boolean;
}

export const BoardCardContext =
  React.createContext<BoardCardContextValue | null>(null);

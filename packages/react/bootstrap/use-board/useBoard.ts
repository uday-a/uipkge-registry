"use client";

import * as React from "react";
import type {
  BoardAcceptsFn,
  BoardDropEvent,
} from "@/components/ui/board/context";

export interface UseBoardOptions<TItem extends { id: string }> {
  /** Source of truth: lane id → items in that lane. */
  lanes: Record<string, TItem[]>;
  /** Called with the next lanes map on every successful move. The hook
   *  does NOT mutate your store directly — you stay in control (useState,
   *  Zustand, server, …). */
  onLanesChange: (next: Record<string, TItem[]>) => void;
  /** Optional accept predicate (runs in addition to per-card allowedLanes
   *  and per-lane disabled flags). Returning false rejects the drop. */
  accepts?: BoardAcceptsFn;
  /** Fires on every successful move (DnD or imperative). */
  onChange?: (event: BoardDropEvent) => void;
  /** ms before `state.justMovedId` clears. Default 600. */
  highlightMs?: number;
}

export interface UseBoardState {
  draggingId: string | null;
  draggingIds: readonly string[];
  dragOverLaneId: string | null;
  justMovedId: string | null;
  selectedIds: ReadonlySet<string>;
}

export interface UseBoardReturn {
  state: UseBoardState;
  handlers: {
    onDragStart: (e: React.DragEvent, itemId: string, laneId: string) => void;
    onLaneDragOver: (e: React.DragEvent, laneId: string) => void;
    onLaneDragLeave: (laneId: string) => void;
    onLaneDrop: (e: React.DragEvent, laneId: string) => void;
    onDragEnd: () => void;
  };
  /** Imperative — used by keyboard handlers, undo, server-pushed updates.
   *  Pass a single id OR an array of ids; arrays move as a group while
   *  preserving their relative order. */
  moveItem: (
    itemId: string | string[],
    toLaneId: string,
    toIndex?: number,
  ) => void;
  /** Toggle one item in the selection set. When `additive=false` (the
   *  default for plain clicks), the call replaces the selection with
   *  just this item; when `true` (cmd/shift+click), the call adds or
   *  removes the item from the existing set. */
  toggleSelection: (itemId: string, additive?: boolean) => void;
  clearSelection: () => void;
  /** Per-card allowed-lanes registry — Board's `<BoardCard>` writes here
   *  on mount; lanes call `isLaneAcceptingFor` (exposed through context)
   *  to query. Exported for advanced consumers that want to drive it
   *  externally. */
  registerAllowedLanes: (
    cardId: string,
    lanes: readonly string[] | undefined,
  ) => void;
  unregisterAllowedLanes: (cardId: string) => void;
  registerLaneDisabled: (laneId: string, disabled: boolean) => void;
  unregisterLaneDisabled: (laneId: string) => void;
  isLaneAcceptingFor: (laneId: string) => boolean;
  accepts: BoardAcceptsFn;
}

const ALWAYS: BoardAcceptsFn = () => true;

/**
 * Board state + DnD orchestration. Designed to back the `@uipkge/board`
 * compositional primitive but usable with any rendering layer — the lane
 * components only need to bind handlers and read the returned state.
 *
 * Capabilities:
 *   - Insertion-index drop: pointer Y vs each card's bounding-box midpoint
 *   - Multi-item drag: grabbing a selected card drags the whole selection
 *   - Per-card `allowedLanes` allow-list (BoardCard registers on mount)
 *   - Per-lane `disabled` flag (BoardLane registers on mount)
 *   - `accepts` predicate runs in addition to the two above
 */
export function useBoard<TItem extends { id: string }>(
  opts: UseBoardOptions<TItem>,
): UseBoardReturn {
  const accepts: BoardAcceptsFn = opts.accepts ?? ALWAYS;
  const highlightMs = opts.highlightMs ?? 600;

  const [draggingId, setDraggingId] = React.useState<string | null>(null);
  const [draggingIds, setDraggingIds] = React.useState<readonly string[]>([]);
  const [dragOverLaneId, setDragOverLaneId] = React.useState<string | null>(
    null,
  );
  const [justMovedId, setJustMovedId] = React.useState<string | null>(null);
  const [selectedIds, setSelectedIds] = React.useState<ReadonlySet<string>>(
    new Set<string>(),
  );

  // Mirror render state into refs so event handlers always read the latest
  // value without being re-created (and without re-binding on every render).
  const draggingIdRef = React.useRef<string | null>(null);
  draggingIdRef.current = draggingId;
  const draggingIdsRef = React.useRef<readonly string[]>([]);
  draggingIdsRef.current = draggingIds;
  const dragOverLaneIdRef = React.useRef<string | null>(null);
  dragOverLaneIdRef.current = dragOverLaneId;
  const justMovedIdRef = React.useRef<string | null>(null);
  justMovedIdRef.current = justMovedId;
  const selectedIdsRef = React.useRef<ReadonlySet<string>>(selectedIds);
  selectedIdsRef.current = selectedIds;

  // Latest props (lanes + callbacks) without re-binding handlers.
  const lanesRef = React.useRef(opts.lanes);
  lanesRef.current = opts.lanes;
  const onLanesChangeRef = React.useRef(opts.onLanesChange);
  onLanesChangeRef.current = opts.onLanesChange;
  const onChangeRef = React.useRef(opts.onChange);
  onChangeRef.current = opts.onChange;
  const acceptsRef = React.useRef(accepts);
  acceptsRef.current = accepts;

  const sourceLaneByDragId = React.useRef<string | null>(null);
  const highlightTimer = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // Per-card allowed-lanes + per-lane disabled registries. Both are plain
  // refs because we only read them on event dispatch (not in render).
  const allowedLanesByCard = React.useRef(new Map<string, readonly string[]>());
  const disabledLanes = React.useRef(new Set<string>());

  React.useEffect(() => {
    return () => {
      if (highlightTimer.current) clearTimeout(highlightTimer.current);
    };
  }, []);

  function findItem(
    itemId: string,
  ): { item: TItem; laneId: string; index: number } | null {
    const lanes = lanesRef.current;
    for (const laneId of Object.keys(lanes)) {
      const idx = lanes[laneId]!.findIndex((it) => it.id === itemId);
      if (idx !== -1) return { item: lanes[laneId]![idx]!, laneId, index: idx };
    }
    return null;
  }

  function isAllowed(
    itemId: string,
    fromLaneId: string,
    toLaneId: string,
  ): boolean {
    if (disabledLanes.current.has(toLaneId)) return false;
    const allow = allowedLanesByCard.current.get(itemId);
    if (allow && !allow.includes(toLaneId)) return false;
    return acceptsRef.current(itemId, fromLaneId, toLaneId);
  }

  function flashMoved(itemId: string) {
    setJustMovedId(itemId);
    if (highlightTimer.current) clearTimeout(highlightTimer.current);
    highlightTimer.current = setTimeout(() => {
      setJustMovedId((cur) => (cur === itemId ? null : cur));
    }, highlightMs);
  }

  const moveItem = React.useCallback(
    (itemId: string | string[], toLaneId: string, toIndex?: number) => {
      const ids = Array.isArray(itemId) ? itemId : [itemId];
      if (ids.length === 0) return;

      // Resolve each, in DOM order across lanes (snapshot before mutation).
      const resolved = ids
        .map((id) => findItem(id))
        .filter(
          (x): x is { item: TItem; laneId: string; index: number } => !!x,
        );
      if (resolved.length === 0) return;

      // All-or-nothing: if ANY item is rejected by the destination
      // (per-card allowedLanes / lane disabled / accepts predicate), the
      // whole move aborts. Matches the dragover visual which already
      // refuses to highlight as accepting when one item in the selection
      // isn't allowed — keeps single + multi-select drops feeling the same.
      const allAllowed = resolved.every((r) =>
        isAllowed(r.item.id, r.laneId, toLaneId),
      );
      if (!allAllowed) return;
      const movable = resolved;

      const lanes = { ...lanesRef.current };
      // 1. Remove every movable item from its current lane (in reverse-index
      //    order per-lane so indices stay valid during splice).
      const byLane = new Map<string, number[]>();
      for (const r of movable) {
        if (!byLane.has(r.laneId)) byLane.set(r.laneId, []);
        byLane.get(r.laneId)!.push(r.index);
      }
      for (const [laneId, indices] of byLane.entries()) {
        const next = [...lanes[laneId]!];
        indices.sort((a, b) => b - a).forEach((idx) => next.splice(idx, 1));
        lanes[laneId] = next;
      }

      // 2. Insert all movable items into the destination at toIndex, in their
      //    original cross-lane order.
      const inserts = movable.map((r) => r.item);
      const dest = [...(lanes[toLaneId] ?? [])];
      // If the target previously held some of the moved items, the index the
      // consumer asked for (toIndex) was computed against the pre-splice
      // layout. Clamp post-splice.
      const insertAt = Math.max(
        0,
        Math.min(dest.length, toIndex ?? dest.length),
      );
      dest.splice(insertAt, 0, ...inserts);
      lanes[toLaneId] = dest;
      onLanesChangeRef.current(lanes);

      flashMoved(movable[0]!.item.id);
      onChangeRef.current?.({
        itemId: movable[0]!.item.id,
        itemIds: movable.map((r) => r.item.id),
        from: movable[0]!.laneId,
        to: toLaneId,
        index: insertAt,
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [],
  );

  function computeInsertIndex(e: React.DragEvent, laneId: string): number {
    const laneEl = (e.currentTarget as HTMLElement | null) ?? null;
    if (!laneEl) return lanesRef.current[laneId]?.length ?? 0;
    const cards = Array.from(
      laneEl.querySelectorAll<HTMLElement>("[data-board-card]"),
    );
    // Exclude every card currently being dragged from the insertion math —
    // those rows will close once we splice, and we want the pointer-relative
    // position among the remaining cards.
    const dragging = new Set(draggingIdsRef.current);
    const otherCards = cards.filter((c) => {
      const id = c.getAttribute("data-board-card-id");
      return id ? !dragging.has(id) : true;
    });
    for (let i = 0; i < otherCards.length; i++) {
      const rect = otherCards[i]!.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      if (e.clientY < midpoint) return i;
    }
    return otherCards.length;
  }

  const toggleSelection = React.useCallback(
    (itemId: string, additive = false) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (additive) {
          if (next.has(itemId)) next.delete(itemId);
          else next.add(itemId);
        } else {
          next.clear();
          next.add(itemId);
        }
        return next;
      });
    },
    [],
  );

  const clearSelection = React.useCallback(() => {
    setSelectedIds((prev) => (prev.size === 0 ? prev : new Set<string>()));
  }, []);

  const handlers = React.useMemo<UseBoardReturn["handlers"]>(
    () => ({
      onDragStart(e, itemId, laneId) {
        // If the grabbed card is part of the current selection, drag the
        // whole set; otherwise drag this one alone (and clear selection so
        // the next single click doesn't surprise the user).
        const selected = selectedIdsRef.current;
        const inSelection = selected.has(itemId);
        const ids =
          inSelection && selected.size > 1 ? Array.from(selected) : [itemId];
        if (!inSelection) clearSelection();
        setDraggingId(itemId);
        setDraggingIds(ids);
        sourceLaneByDragId.current = laneId;
        if (e.dataTransfer) {
          e.dataTransfer.setData("text/plain", itemId);
          e.dataTransfer.effectAllowed = "move";
        }
      },
      onLaneDragOver(e, laneId) {
        if (!draggingIdRef.current) return;
        const fromLane = sourceLaneByDragId.current ?? laneId;
        // All dragging items must be allowed at the target — reject the
        // whole drop if any one is blocked.
        const allOk = draggingIdsRef.current.every((id) =>
          isAllowed(id, fromLane, laneId),
        );
        // dragOverLaneId is set in BOTH branches so the lane can show its
        // rejecting visual (red ring) on hover, not just its accepting
        // visual. preventDefault only fires on accept — without it the
        // browser refuses the drop, exactly what we want for rejected hits.
        setDragOverLaneId(laneId);
        if (!allOk) {
          if (e.dataTransfer) e.dataTransfer.dropEffect = "none";
          return;
        }
        e.preventDefault();
        if (e.dataTransfer) e.dataTransfer.dropEffect = "move";
      },
      onLaneDragLeave(laneId) {
        setDragOverLaneId((cur) => (cur === laneId ? null : cur));
      },
      onLaneDrop(e, laneId) {
        e.preventDefault();
        const fallbackId =
          e.dataTransfer?.getData("text/plain") || draggingIdRef.current;
        const ids =
          draggingIdsRef.current.length > 0
            ? draggingIdsRef.current
            : fallbackId
              ? [fallbackId]
              : [];
        if (ids.length === 0) return;
        const insertAt = computeInsertIndex(e, laneId);
        moveItem([...ids], laneId, insertAt);
        setDraggingId(null);
        setDraggingIds([]);
        setDragOverLaneId(null);
        sourceLaneByDragId.current = null;
      },
      onDragEnd() {
        setDraggingId(null);
        setDraggingIds([]);
        setDragOverLaneId(null);
        sourceLaneByDragId.current = null;
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clearSelection, moveItem],
  );

  const registerAllowedLanes = React.useCallback(
    (cardId: string, lanes: readonly string[] | undefined) => {
      if (lanes && lanes.length > 0)
        allowedLanesByCard.current.set(cardId, lanes);
      else allowedLanesByCard.current.delete(cardId);
    },
    [],
  );
  const unregisterAllowedLanes = React.useCallback((cardId: string) => {
    allowedLanesByCard.current.delete(cardId);
  }, []);
  const registerLaneDisabled = React.useCallback(
    (laneId: string, disabled: boolean) => {
      if (disabled) disabledLanes.current.add(laneId);
      else disabledLanes.current.delete(laneId);
    },
    [],
  );
  const unregisterLaneDisabled = React.useCallback((laneId: string) => {
    disabledLanes.current.delete(laneId);
  }, []);
  const isLaneAcceptingFor = React.useCallback((laneId: string) => {
    if (!draggingIdRef.current) return false;
    const fromLane = sourceLaneByDragId.current ?? laneId;
    return draggingIdsRef.current.every((id) =>
      isAllowed(id, fromLane, laneId),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const state: UseBoardState = {
    draggingId,
    draggingIds,
    dragOverLaneId,
    justMovedId,
    selectedIds,
  };

  return {
    state,
    handlers,
    moveItem,
    toggleSelection,
    clearSelection,
    accepts,
    registerAllowedLanes,
    unregisterAllowedLanes,
    registerLaneDisabled,
    unregisterLaneDisabled,
    isLaneAcceptingFor,
  };
}

/** Type-only helper for consumers that want to type the lanes locally. */
export type BoardLanes<TItem extends { id: string }> = Record<string, TItem[]>;

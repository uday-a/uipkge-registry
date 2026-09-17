"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  BoardCardContext,
  BoardContext,
  BoardLaneContext,
  useBoardContext,
  useBoardLaneContext,
  type BoardAcceptsFn,
  type BoardContextValue,
  type BoardDensity,
  type BoardOrientation,
} from "./context";
import { boardCardVariants, boardLaneVariants } from "./board.variants";

/* ------------------------------------------------------------------ */
/* Board (Root)                                                        */
/* ------------------------------------------------------------------ */

const ALWAYS_ACCEPT: BoardAcceptsFn = () => true;
const NOOP = () => {};

export interface BoardProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  orientation?: BoardOrientation;
  density?: BoardDensity;
  /** Animation preset class applied by BoardLaneBody. Defaults to `motion-list`. */
  motion?: string;
  /** Predicate run per drop. Defaults to always-accept. */
  accepts?: BoardAcceptsFn;
  /** Imperative move from a parent's useBoard hook. */
  moveItem?: (
    itemId: string | string[],
    toLaneId: string,
    toIndex?: number,
  ) => void;
  /** External state — pass `state.draggingId` etc. from useBoard. */
  draggingId?: string | null;
  draggingIds?: readonly string[];
  dragOverLaneId?: string | null;
  justMovedId?: string | null;
  selectedIds?: ReadonlySet<string>;
  /** Optional toggle/clearSelection from useBoard so the primitive can
   *  expose selection mutations through context (consumed by BoardCard
   *  click handler). Both default to no-ops, so Board still works with
   *  consumers that don't wire selection. */
  toggleSelection?: (itemId: string, additive?: boolean) => void;
  clearSelection?: () => void;
  registerAllowedLanes?: (
    cardId: string,
    lanes: readonly string[] | undefined,
  ) => void;
  unregisterAllowedLanes?: (cardId: string) => void;
  registerLaneDisabled?: (laneId: string, disabled: boolean) => void;
  unregisterLaneDisabled?: (laneId: string) => void;
  isLaneAcceptingFor?: (laneId: string) => boolean;
  children?: React.ReactNode;
}

const EMPTY_IDS: readonly string[] = [];
const EMPTY_SELECTION: ReadonlySet<string> = new Set<string>();

const Board = React.forwardRef<HTMLDivElement, BoardProps>(
  (
    {
      className,
      orientation = "horizontal",
      density = "default",
      motion = "motion-list",
      accepts = ALWAYS_ACCEPT,
      moveItem = NOOP,
      draggingId = null,
      draggingIds = EMPTY_IDS,
      dragOverLaneId = null,
      justMovedId = null,
      selectedIds = EMPTY_SELECTION,
      toggleSelection = NOOP,
      clearSelection = NOOP,
      registerAllowedLanes = NOOP,
      unregisterAllowedLanes = NOOP,
      registerLaneDisabled = NOOP,
      unregisterLaneDisabled = NOOP,
      isLaneAcceptingFor = () => true,
      children,
      ...props
    },
    ref,
  ) => {
    const ctx = React.useMemo<BoardContextValue>(
      () => ({
        orientation,
        density,
        motion,
        draggingId,
        draggingIds,
        dragOverLaneId,
        justMovedId,
        selectedIds,
        accepts,
        moveItem,
        toggleSelection,
        clearSelection,
        registerAllowedLanes,
        unregisterAllowedLanes,
        registerLaneDisabled,
        unregisterLaneDisabled,
        isLaneAcceptingFor,
      }),
      [
        orientation,
        density,
        motion,
        draggingId,
        draggingIds,
        dragOverLaneId,
        justMovedId,
        selectedIds,
        accepts,
        moveItem,
        toggleSelection,
        clearSelection,
        registerAllowedLanes,
        unregisterAllowedLanes,
        registerLaneDisabled,
        unregisterLaneDisabled,
        isLaneAcceptingFor,
      ],
    );

    return (
      <BoardContext.Provider value={ctx}>
        <div
          ref={ref}
          data-uipkge=""
          data-slot="board"
          data-orientation={orientation}
          className={cn("w-full", className)}
          {...props}
        >
          {children}
        </div>
      </BoardContext.Provider>
    );
  },
);
Board.displayName = "Board";

/* ------------------------------------------------------------------ */
/* BoardLane                                                           */
/* ------------------------------------------------------------------ */

export interface BoardLaneRenderProps {
  isDragOver: boolean;
  isAccepting: boolean;
  disabled: boolean;
}

export interface BoardLaneProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children" | "id"
> {
  id: string;
  tone?: "default" | "plain";
  /** Disable drops on this lane. Cards inside still render and stay
   *  draggable; only the drop target is inert + visually dimmed. */
  disabled?: boolean;
  onLaneDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onLaneDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onLaneDragLeave?: () => void;
  children?:
    React.ReactNode | ((props: BoardLaneRenderProps) => React.ReactNode);
}

const BoardLane = React.forwardRef<HTMLDivElement, BoardLaneProps>(
  (
    {
      id,
      className,
      tone = "default",
      disabled = false,
      onLaneDragOver,
      onLaneDrop,
      onLaneDragLeave,
      children,
      ...props
    },
    ref,
  ) => {
    const board = useBoardContext();

    // Register the lane's disabled flag; keep it in sync when id/disabled change.
    React.useEffect(() => {
      board.registerLaneDisabled(id, disabled);
      return () => board.unregisterLaneDisabled(id);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, disabled]);

    const isDragOver = board.dragOverLaneId === id;
    const isAccepting = (() => {
      if (!board.draggingId) return false;
      if (disabled) return false;
      return board.isLaneAcceptingFor(id);
    })();

    const laneCtx = React.useMemo(
      () => ({ laneId: id, isDragOver, isAccepting, disabled }),
      [id, isDragOver, isAccepting, disabled],
    );

    const state: "idle" | "over" | "rejecting" = !isDragOver
      ? "idle"
      : isAccepting
        ? "over"
        : "rejecting";

    // Emit unconditionally so the hook can set dragOverLaneId
    // (drives the rejecting-ring visual). The hook's isAllowed
    // checks the disabled-lane registry and refuses preventDefault when
    // it should — the browser's own refuse-to-drop semantics + our
    // rejecting visual cover the rest.
    function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
      onLaneDragOver?.(e);
    }
    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
      if (disabled) {
        e.preventDefault();
        return;
      }
      onLaneDrop?.(e);
    }
    function handleDragLeave() {
      onLaneDragLeave?.();
    }

    return (
      <BoardLaneContext.Provider value={laneCtx}>
        <div
          ref={ref}
          data-uipkge=""
          data-slot="board-lane"
          data-board-lane=""
          data-lane-id={id}
          data-state={state}
          data-disabled={disabled || undefined}
          aria-disabled={disabled || undefined}
          className={cn(
            boardLaneVariants({ tone, state }),
            // Disabled lane dims only the lane chrome (border, background,
            // header). Cards inside stay legible — the rejection signal is
            // carried by the no-drop cursor + the missing accept-ring.
            disabled &&
              "opacity-80 [&>[data-slot=board-lane-header]]:opacity-60",
            className,
          )}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragLeave={handleDragLeave}
          {...props}
        >
          {typeof children === "function"
            ? children({ isDragOver, isAccepting, disabled })
            : children}
        </div>
      </BoardLaneContext.Provider>
    );
  },
);
BoardLane.displayName = "BoardLane";

/* ------------------------------------------------------------------ */
/* BoardLaneHeader                                                     */
/* ------------------------------------------------------------------ */

const BoardLaneHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-uipkge=""
    data-slot="board-lane-header"
    className={cn("flex items-center justify-between gap-2", className)}
    {...props}
  />
));
BoardLaneHeader.displayName = "BoardLaneHeader";

/* ------------------------------------------------------------------ */
/* BoardLaneBody                                                       */
/* ------------------------------------------------------------------ */

export interface BoardLaneBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Override the animation preset class. Defaults to the board-level motion preset. */
  motion?: string;
}

const BoardLaneBody = React.forwardRef<HTMLDivElement, BoardLaneBodyProps>(
  ({ className, motion, children, ...props }, ref) => {
    const board = React.useContext(BoardContext);
    const motionName = motion ?? board?.motion ?? "motion-list";
    return (
      // Inner padding (py-1 / px-0.5) reserves breathing room for the
      // per-card hover-lift (-translate-y-0.5), the focus / drag / moved
      // rings (ring-2 + ring-offset-1 ≈ 3px outward), and the hover
      // shadow halo. Without it, the first / last cards' hover state
      // crops against the overflow-y-auto edge. pr-1 still wins on the
      // right so the thin scrollbar has a gutter.
      <div
        ref={ref}
        data-uipkge=""
        data-slot="board-lane-body"
        className={cn(
          "flex min-h-0 flex-1 [scrollbar-width:thin] flex-col gap-2 overflow-y-auto px-0.5 py-1 pr-1",
          className,
        )}
        {...props}
      >
        {/* The Vue source wraps cards in a TransitionGroup for enter/leave/move
            animations (the `motion-list` preset). React has no built-in
            equivalent — the per-card transitions live on the card variants
            (transform/box-shadow/opacity). The motion preset class is still
            applied so consumers can target it with their own keyframes. */}
        <div className={cn("relative flex flex-col gap-2", motionName)}>
          {children}
        </div>
      </div>
    );
  },
);
BoardLaneBody.displayName = "BoardLaneBody";

/* ------------------------------------------------------------------ */
/* BoardLaneEmpty                                                      */
/* ------------------------------------------------------------------ */

export interface BoardLaneEmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show only when this is true (consumer wires from `lane.length === 0`). */
  when?: boolean;
}

const BoardLaneEmpty = React.forwardRef<HTMLDivElement, BoardLaneEmptyProps>(
  ({ className, when, children, ...props }, ref) => {
    if (when === false) return null;
    return (
      <div
        ref={ref}
        data-uipkge=""
        data-slot="board-lane-empty"
        className={cn(
          "text-muted-foreground/70 border-border/60 rounded-lg border border-dashed py-6 text-center text-xs",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
BoardLaneEmpty.displayName = "BoardLaneEmpty";

/* ------------------------------------------------------------------ */
/* BoardCard                                                           */
/* ------------------------------------------------------------------ */

export interface BoardCardProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "id" | "onDragStart" | "onDragEnd" | "onClick"
> {
  id: string;
  /** Disable keyboard grab (e.g. for read-only boards). Default: enabled. */
  keyboardDraggable?: boolean;
  /** Disable the card entirely — non-draggable, non-clickable, dimmed.
   *  Use for cards locked by a workflow rule or a server policy. */
  disabled?: boolean;
  /** Per-card allow-list. When set, the card can only be dropped into
   *  these lane ids; useBoard rejects any other target silently. Omit
   *  to allow every lane the global `accepts` predicate permits. */
  allowedLanes?: readonly string[];
  /** Show the click-to-select chrome (ring + cmd/shift-click multi-select).
   *  Default true. Turn off for read-only or single-tap-to-open boards. */
  selectable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: () => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const BoardCard = React.forwardRef<HTMLDivElement, BoardCardProps>(
  (
    {
      id,
      className,
      keyboardDraggable = true,
      disabled = false,
      allowedLanes,
      selectable = true,
      onDragStart,
      onDragEnd,
      onClick,
      children,
      ...props
    },
    ref,
  ) => {
    const board = useBoardContext();
    const lane = useBoardLaneContext();

    const [isKeyboardGrabbed, setIsKeyboardGrabbed] = React.useState(false);

    const cardElRef = React.useRef<HTMLDivElement | null>(null);
    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        cardElRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref)
          (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref],
    );

    // Either source of truth wins — `draggingIds` is the multi-select-aware
    // list, `draggingId` is the single-anchor (backward-compat for consumers
    // that don't pass the multi state through). Keyboard-grabbed adds the
    // same visual without touching parent state.
    const isDragging =
      board.draggingIds.includes(id) ||
      board.draggingId === id ||
      isKeyboardGrabbed;
    const isJustMoved = board.justMovedId === id;
    const isSelected = board.selectedIds.has(id);

    const cardCtx = React.useMemo(
      () => ({
        cardId: id,
        laneId: lane.laneId,
        isDragging,
        isJustMoved,
        isSelected,
        disabled,
      }),
      [id, lane.laneId, isDragging, isJustMoved, isSelected, disabled],
    );

    // Per-card allowed-lanes registry. Re-run if the id OR the list changes.
    React.useEffect(() => {
      board.registerAllowedLanes(id, allowedLanes);
      return () => board.unregisterAllowedLanes(id);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, allowedLanes]);

    const state: "idle" | "dragging" | "moved" = isDragging
      ? "dragging"
      : isJustMoved
        ? "moved"
        : "idle";

    function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
      if (disabled) return;
      // Enter activates the card (default action) — emits onClick for the
      // consumer to open a detail panel / navigate / etc. Native <button>
      // gets this for free; we re-emit because the card root is a
      // <div role="button"> (chosen so consumers can nest <button>/links
      // inside the card without violating "no interactive content in a
      // button").
      if (e.key === "Enter") {
        e.preventDefault();
        onClick?.(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
          }) as unknown as React.MouseEvent<HTMLDivElement>,
        );
        return;
      }
      if (!keyboardDraggable) return;
      if (e.key === " ") {
        e.preventDefault();
        setIsKeyboardGrabbed((v) => !v);
        return;
      }
      if (e.key === "Escape" && isKeyboardGrabbed) {
        e.preventDefault();
        setIsKeyboardGrabbed(false);
        return;
      }
      if (!isKeyboardGrabbed) return;
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        const allLanes = Array.from(
          document.querySelectorAll<HTMLElement>("[data-board-lane]"),
        ).filter((el) => !el.hasAttribute("data-disabled"));
        const currentIdx = allLanes.findIndex(
          (el) => el.dataset.laneId === lane.laneId,
        );
        if (currentIdx === -1 || allLanes.length === 0) return;
        const delta = e.key === "ArrowLeft" ? -1 : 1;
        const nextLane =
          allLanes[(currentIdx + delta + allLanes.length) % allLanes.length];
        if (nextLane?.dataset.laneId) {
          board.moveItem(id, nextLane.dataset.laneId);
          requestAnimationFrame(() => {
            const moved = document.querySelector<HTMLElement>(
              `[data-board-card-id="${id}"]`,
            );
            moved?.focus();
          });
        }
        return;
      }
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        const laneEl = cardElRef.current?.closest("[data-board-lane]");
        if (!laneEl) return;
        const cards = Array.from(
          laneEl.querySelectorAll<HTMLElement>("[data-board-card]"),
        );
        const currentIdx = cards.findIndex(
          (el) => el.dataset.boardCardId === id,
        );
        if (currentIdx === -1) return;
        const delta = e.key === "ArrowUp" ? -1 : 1;
        const targetIdx = Math.max(
          0,
          Math.min(cards.length - 1, currentIdx + delta),
        );
        if (targetIdx !== currentIdx)
          board.moveItem(id, lane.laneId, targetIdx);
      }
    }

    function handleDragStart(e: React.DragEvent<HTMLDivElement>) {
      if (disabled) {
        e.preventDefault();
        return;
      }
      onDragStart?.(e);
    }
    function handleDragEnd() {
      onDragEnd?.();
    }
    function handleClick(e: React.MouseEvent<HTMLDivElement>) {
      if (disabled) {
        e.preventDefault();
        return;
      }
      // Cmd/Ctrl/Shift+click toggles the selection (multi-select for drag);
      // plain click clears any selection and just emits to the consumer
      // (typically opens a detail Sheet).
      if (selectable && (e.metaKey || e.ctrlKey || e.shiftKey)) {
        e.preventDefault();
        board.toggleSelection(id, true);
        return;
      }
      if (board.draggingIds.includes(id)) return;
      if (board.selectedIds.size > 0) board.clearSelection();
      onClick?.(e);
    }

    return (
      // Root is `<div role="button">` rather than `<button type="button">`
      // so consumers can nest interactive content (buttons, links, menus)
      // inside cards. The HTML5 spec forbids interactive content inside a
      // <button>; browsers silently de-nest the inner element which
      // breaks its events. Enter is wired manually in handleKeyDown to match
      // the native button default-action behaviour.
      <BoardCardContext.Provider value={cardCtx}>
        <div
          ref={setRefs}
          role="button"
          data-uipkge=""
          data-slot="board-card"
          data-board-card=""
          data-board-card-id={id}
          data-state={state}
          data-selected={isSelected || undefined}
          data-disabled={disabled || undefined}
          aria-disabled={disabled || undefined}
          aria-pressed={selectable ? isSelected : undefined}
          className={cn(
            boardCardVariants({ state }),
            isSelected &&
              "ring-primary/60 ring-offset-background ring-2 ring-offset-1",
            disabled &&
              "pointer-events-none cursor-not-allowed opacity-50 shadow-none grayscale hover:translate-y-0",
            className,
          )}
          draggable={disabled ? false : true}
          tabIndex={disabled ? -1 : 0}
          aria-roledescription={
            keyboardDraggable && !disabled ? "draggable card" : undefined
          }
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          {...props}
        >
          {children}
        </div>
      </BoardCardContext.Provider>
    );
  },
);
BoardCard.displayName = "BoardCard";

export {
  Board,
  BoardLane,
  BoardLaneHeader,
  BoardLaneBody,
  BoardLaneEmpty,
  BoardCard,
};

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { kanbanCardVariants, kanbanColumnVariants } from "./kanban.variants";
import { Plus } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Contexts                                                           */
/* ------------------------------------------------------------------ */

export interface KanbanMoveEvent {
  cardId: string;
  fromColumnId: string;
  toColumnId: string;
  toIndex?: number;
}

interface KanbanContextValue {
  draggingCardId: string | null;
  draggingColumnId: string | null;
  overColumnId: string | null;
  /** Set while a card is held by keyboard (Space), not by pointer drag. */
  grabbedCardId: string | null;
  setDraggingCard: (cardId: string | null, columnId: string | null) => void;
  setOverColumn: (columnId: string | null) => void;
  setGrabbedCard: (cardId: string | null) => void;
  /** Speak a message through the board's polite live region. */
  announce: (message: string) => void;
  onCardMove?: (event: KanbanMoveEvent) => void;
}

const KanbanContext = React.createContext<KanbanContextValue | null>(null);

export function useKanbanContext() {
  const ctx = React.useContext(KanbanContext);
  if (!ctx) {
    throw new Error(
      "Kanban components must be used within a <Kanban /> provider",
    );
  }
  return ctx;
}

interface KanbanColumnContextValue {
  columnId: string;
  isOver: boolean;
  /** Column label, used to announce keyboard moves. Falls back to the id. */
  label?: string;
}

const KanbanColumnContext =
  React.createContext<KanbanColumnContextValue | null>(null);

export function useKanbanColumnContext() {
  const ctx = React.useContext(KanbanColumnContext);
  if (!ctx) {
    throw new Error(
      "Kanban column sub-components must be used within a <KanbanColumn />",
    );
  }
  return ctx;
}

/* ------------------------------------------------------------------ */
/* Kanban (Root Provider)                                             */
/* ------------------------------------------------------------------ */

export interface KanbanProps extends React.HTMLAttributes<HTMLDivElement> {
  onCardMove?: (event: KanbanMoveEvent) => void;
}

export const Kanban = React.forwardRef<HTMLDivElement, KanbanProps>(
  ({ className, onCardMove, children, ...props }, ref) => {
    const [draggingCardId, setDraggingCardId] = React.useState<string | null>(
      null,
    );
    const [draggingColumnId, setDraggingColumnId] = React.useState<
      string | null
    >(null);
    const [overColumnId, setOverColumnId] = React.useState<string | null>(null);
    const [grabbedCardId, setGrabbedCardId] = React.useState<string | null>(
      null,
    );
    // Keyboard moves are silent to a screen reader — the card just appears
    // somewhere else. This region narrates pick up / move / drop / cancel.
    const [announcement, setAnnouncement] = React.useState("");

    const setDraggingCard = React.useCallback(
      (cardId: string | null, columnId: string | null) => {
        setDraggingCardId(cardId);
        setDraggingColumnId(columnId);
      },
      [],
    );

    const setOverColumn = React.useCallback((columnId: string | null) => {
      setOverColumnId(columnId);
    }, []);

    const setGrabbedCard = React.useCallback((cardId: string | null) => {
      setGrabbedCardId(cardId);
    }, []);

    const announce = React.useCallback((message: string) => {
      // Re-assigning the same string would not re-trigger the live region.
      setAnnouncement((current) =>
        current === message ? `${message} ` : message,
      );
    }, []);

    const ctx = React.useMemo<KanbanContextValue>(
      () => ({
        draggingCardId,
        draggingColumnId,
        overColumnId,
        grabbedCardId,
        setDraggingCard,
        setOverColumn,
        setGrabbedCard,
        announce,
        onCardMove,
      }),
      [
        draggingCardId,
        draggingColumnId,
        overColumnId,
        grabbedCardId,
        setDraggingCard,
        setOverColumn,
        setGrabbedCard,
        announce,
        onCardMove,
      ],
    );

    return (
      <KanbanContext.Provider value={ctx}>
        <div
          ref={ref}
          data-uipkge=""
          data-slot="kanban"
          className={cn("w-full", className)}
          {...props}
        >
          {children}
          <div
            data-slot="kanban-live-region"
            className="sr-only"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {announcement}
          </div>
        </div>
      </KanbanContext.Provider>
    );
  },
);
Kanban.displayName = "Kanban";

/* ------------------------------------------------------------------ */
/* KanbanBoard                                                        */
/* ------------------------------------------------------------------ */

export const KanbanBoard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="kanban-board"
    className={cn(
      "flex w-full items-start gap-4 overflow-x-auto pb-4",
      className,
    )}
    {...props}
  >
    {children}
  </div>
));
KanbanBoard.displayName = "KanbanBoard";

/* ------------------------------------------------------------------ */
/* KanbanColumn                                                       */
/* ------------------------------------------------------------------ */

export interface KanbanColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  /** Accessible name for the column, also used in keyboard move
   *  announcements ("moved to In progress"). Falls back to the id. */
  label?: string;
}

export const KanbanColumn = React.forwardRef<HTMLDivElement, KanbanColumnProps>(
  (
    {
      id,
      label,
      className,
      children,
      onDragOver,
      onDragLeave,
      onDrop,
      ...props
    },
    ref,
  ) => {
    const kanban = useKanbanContext();
    const isOver = kanban.overColumnId === id;

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (kanban.overColumnId !== id) {
        kanban.setOverColumn(id);
      }
      onDragOver?.(e);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      if (e.currentTarget.contains(e.relatedTarget as Node)) return;
      if (kanban.overColumnId === id) {
        kanban.setOverColumn(null);
      }
      onDragLeave?.(e);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (kanban.draggingCardId && kanban.draggingColumnId) {
        kanban.onCardMove?.({
          cardId: kanban.draggingCardId,
          fromColumnId: kanban.draggingColumnId,
          toColumnId: id,
        });
      }
      kanban.setDraggingCard(null, null);
      kanban.setOverColumn(null);
      onDrop?.(e);
    };

    const columnCtx = React.useMemo<KanbanColumnContextValue>(
      () => ({ columnId: id, isOver, label }),
      [id, isOver, label],
    );

    return (
      <KanbanColumnContext.Provider value={columnCtx}>
        <div
          ref={ref}
          data-uipkge=""
          data-slot="kanban-column"
          role="group"
          aria-label={label ?? id}
          data-column-id={id}
          data-over={isOver ? "" : undefined}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(kanbanColumnVariants({ isOver }), className)}
          {...props}
        >
          {children}
        </div>
      </KanbanColumnContext.Provider>
    );
  },
);
KanbanColumn.displayName = "KanbanColumn";

/* ------------------------------------------------------------------ */
/* KanbanColumnHeader & Sub-components                                */
/* ------------------------------------------------------------------ */

export const KanbanColumnHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="kanban-column-header"
    className={cn(
      "flex items-center justify-between gap-2 px-1 py-0.5",
      className,
    )}
    {...props}
  >
    {children}
  </div>
));
KanbanColumnHeader.displayName = "KanbanColumnHeader";

export interface KanbanColumnDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: string;
}

export const KanbanColumnDot = React.forwardRef<
  HTMLSpanElement,
  KanbanColumnDotProps
>(({ className, color = "bg-primary", ...props }, ref) => (
  <span
    ref={ref}
    data-slot="kanban-column-dot"
    className={cn("size-2 shrink-0 rounded-full", color, className)}
    {...props}
  />
));
KanbanColumnDot.displayName = "KanbanColumnDot";

export const KanbanColumnTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    data-slot="kanban-column-title"
    className={cn(
      "text-foreground text-sm font-semibold tracking-tight",
      className,
    )}
    {...props}
  >
    {children}
  </h3>
));
KanbanColumnTitle.displayName = "KanbanColumnTitle";

export interface KanbanColumnCountProps extends React.HTMLAttributes<HTMLSpanElement> {
  count?: number | string;
}

export const KanbanColumnCount = React.forwardRef<
  HTMLSpanElement,
  KanbanColumnCountProps
>(({ className, count, children, ...props }, ref) => (
  <span
    ref={ref}
    data-slot="kanban-column-count"
    className={cn(
      "bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums",
      className,
    )}
    {...props}
  >
    {count ?? children}
  </span>
));
KanbanColumnCount.displayName = "KanbanColumnCount";

export const KanbanColumnAdd = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    data-slot="kanban-column-add"
    className={cn(
      "text-muted-foreground hover:bg-background hover:text-foreground focus-visible:ring-ring inline-flex size-6 items-center justify-center rounded-md transition-colors focus-visible:ring-1 focus-visible:outline-none",
      className,
    )}
    {...props}
  >
    {children ?? <Plus className="size-3.5" />}
  </button>
));
KanbanColumnAdd.displayName = "KanbanColumnAdd";

/* ------------------------------------------------------------------ */
/* KanbanColumnBody & Empty                                           */
/* ------------------------------------------------------------------ */

export const KanbanColumnBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="kanban-column-body"
    className={cn("flex flex-1 flex-col gap-2 overflow-y-auto py-1", className)}
    {...props}
  >
    {children}
  </div>
));
KanbanColumnBody.displayName = "KanbanColumnBody";

export const KanbanColumnEmpty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="kanban-column-empty"
    className={cn(
      "border-border/60 text-muted-foreground/60 flex flex-1 items-center justify-center rounded-lg border border-dashed py-8 text-xs",
      className,
    )}
    {...props}
  >
    {children ?? "No cards"}
  </div>
));
KanbanColumnEmpty.displayName = "KanbanColumnEmpty";

/* ------------------------------------------------------------------ */
/* KanbanCard & Sub-components                                        */
/* ------------------------------------------------------------------ */

export interface KanbanCardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string;
  disabled?: boolean;
  /** Disable the keyboard grab (Space / arrows) while leaving pointer
   *  dragging intact. Default: enabled. */
  keyboardDraggable?: boolean;
}

export const KanbanCard = React.forwardRef<HTMLDivElement, KanbanCardProps>(
  (
    {
      id,
      disabled = false,
      keyboardDraggable = true,
      className,
      children,
      onDragStart,
      onDragEnd,
      onKeyDown,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const kanban = useKanbanContext();
    const column = useKanbanColumnContext();
    const cardRef = React.useRef<HTMLDivElement | null>(null);
    const isGrabbed = kanban.grabbedCardId === id;
    const isDragging = kanban.draggingCardId === id || isGrabbed;
    const canKeyboardDrag = keyboardDraggable && !disabled;

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        cardRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", id);
      kanban.setDraggingCard(id, column.columnId);
      onDragStart?.(e);
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
      kanban.setDraggingCard(null, null);
      kanban.setOverColumn(null);
      onDragEnd?.(e);
    };

    const columnName = (el: HTMLElement | null) =>
      el?.getAttribute("aria-label") || el?.dataset.columnId || "column";

    /** Ordered columns of the board this card sits in. */
    const boardColumns = () => {
      const board: ParentNode =
        cardRef.current?.closest('[data-slot="kanban"]') ?? document;
      return Array.from(
        board.querySelectorAll<HTMLElement>('[data-slot="kanban-column"]'),
      );
    };

    // The consumer owns the data, so a moved card unmounts here and mounts
    // again under the new column. Chasing it with requestAnimationFrame races
    // React's commit — the query resolves the node that is on its way out and
    // focus lands on <body>. Instead, whichever instance is mounted while the
    // card is held takes focus back after the commit that rendered it.
    React.useEffect(() => {
      if (!isGrabbed) return;
      const node = cardRef.current;
      if (node && document.activeElement !== node) node.focus();
    }, [isGrabbed]);

    const grab = () => {
      kanban.setGrabbedCard(id);
      kanban.setDraggingCard(id, column.columnId);
      kanban.setOverColumn(column.columnId);
      kanban.announce(
        "Picked up card. Use the arrow keys to move it, space to drop, escape to cancel.",
      );
    };

    const release = (cancelled: boolean) => {
      kanban.setGrabbedCard(null);
      kanban.setDraggingCard(null, null);
      kanban.setOverColumn(null);
      kanban.announce(cancelled ? "Move cancelled." : "Card dropped.");
    };

    const moveToColumn = (delta: -1 | 1) => {
      const columns = boardColumns();
      const currentIdx = columns.findIndex(
        (el) => el.dataset.columnId === column.columnId,
      );
      if (currentIdx === -1) return;
      const target = columns[currentIdx + delta];
      // Deliberately not wrapping: running off the end of a board should
      // stop, not teleport the card back to the first column.
      if (!target?.dataset.columnId) return;
      kanban.onCardMove?.({
        cardId: id,
        fromColumnId: column.columnId,
        toColumnId: target.dataset.columnId,
      });
      kanban.setDraggingCard(id, target.dataset.columnId);
      kanban.setOverColumn(target.dataset.columnId);
      kanban.announce(`Moved to ${columnName(target)}.`);
    };

    const moveWithinColumn = (delta: -1 | 1) => {
      const columnEl = cardRef.current?.closest<HTMLElement>(
        '[data-slot="kanban-column"]',
      );
      if (!columnEl) return;
      const cards = Array.from(
        columnEl.querySelectorAll<HTMLElement>('[data-slot="kanban-card"]'),
      );
      const currentIdx = cards.findIndex((el) => el.dataset.cardId === id);
      if (currentIdx === -1) return;
      const targetIdx = currentIdx + delta;
      if (targetIdx < 0 || targetIdx > cards.length - 1) return;
      kanban.onCardMove?.({
        cardId: id,
        fromColumnId: column.columnId,
        toColumnId: column.columnId,
        toIndex: targetIdx,
      });
      kanban.announce(`Position ${targetIdx + 1} of ${cards.length}.`);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (!canKeyboardDrag || e.defaultPrevented) return;

      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        if (isGrabbed) release(false);
        else grab();
        return;
      }
      if (!isGrabbed) return;
      if (e.key === "Escape") {
        e.preventDefault();
        release(true);
        return;
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        moveToColumn(e.key === "ArrowLeft" ? -1 : 1);
        return;
      }
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        moveWithinColumn(e.key === "ArrowUp" ? -1 : 1);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
      onBlur?.(e);
      // A grabbed card that loses focus (click elsewhere, Tab) would
      // otherwise stay stuck in the held state with no way back to it.
      if (isGrabbed) release(true);
    };

    return (
      <div
        ref={setRefs}
        data-uipkge=""
        data-slot="kanban-card"
        data-card-id={id}
        data-state={isGrabbed ? "grabbed" : isDragging ? "dragging" : "idle"}
        data-disabled={disabled || undefined}
        role={canKeyboardDrag ? "button" : undefined}
        tabIndex={canKeyboardDrag ? 0 : undefined}
        aria-disabled={disabled || undefined}
        aria-roledescription={canKeyboardDrag ? "draggable card" : undefined}
        aria-pressed={canKeyboardDrag ? isGrabbed : undefined}
        draggable={!disabled}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={cn(
          kanbanCardVariants({ isDragging }),
          disabled && "pointer-events-none opacity-50",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);
KanbanCard.displayName = "KanbanCard";

export const KanbanCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="kanban-card-header"
    className={cn("flex flex-col gap-1", className)}
    {...props}
  >
    {children}
  </div>
));
KanbanCardHeader.displayName = "KanbanCardHeader";

export const KanbanCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="kanban-card-title"
    className={cn(
      "text-foreground text-sm leading-snug font-medium",
      className,
    )}
    {...props}
  >
    {children}
  </p>
));
KanbanCardTitle.displayName = "KanbanCardTitle";

export const KanbanCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="kanban-card-description"
    className={cn("text-muted-foreground line-clamp-2 text-xs", className)}
    {...props}
  >
    {children}
  </p>
));
KanbanCardDescription.displayName = "KanbanCardDescription";

export const KanbanCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="kanban-card-footer"
    className={cn(
      "text-muted-foreground mt-1 flex items-center justify-between gap-2 pt-1 text-xs",
      className,
    )}
    {...props}
  >
    {children}
  </div>
));
KanbanCardFooter.displayName = "KanbanCardFooter";

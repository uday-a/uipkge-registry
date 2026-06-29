'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { kanbanCardVariants, kanbanColumnVariants } from './kanban.variants'
import { Plus } from 'lucide-react'

/* ------------------------------------------------------------------ */
/* Contexts                                                           */
/* ------------------------------------------------------------------ */

export interface KanbanMoveEvent {
  cardId: string
  fromColumnId: string
  toColumnId: string
  toIndex?: number
}

interface KanbanContextValue {
  draggingCardId: string | null
  draggingColumnId: string | null
  overColumnId: string | null
  setDraggingCard: (cardId: string | null, columnId: string | null) => void
  setOverColumn: (columnId: string | null) => void
  onCardMove?: (event: KanbanMoveEvent) => void
}

const KanbanContext = React.createContext<KanbanContextValue | null>(null)

export function useKanbanContext() {
  const ctx = React.useContext(KanbanContext)
  if (!ctx) {
    throw new Error('Kanban components must be used within a <Kanban /> provider')
  }
  return ctx
}

interface KanbanColumnContextValue {
  columnId: string
  isOver: boolean
}

const KanbanColumnContext = React.createContext<KanbanColumnContextValue | null>(null)

export function useKanbanColumnContext() {
  const ctx = React.useContext(KanbanColumnContext)
  if (!ctx) {
    throw new Error('Kanban column sub-components must be used within a <KanbanColumn />')
  }
  return ctx
}

/* ------------------------------------------------------------------ */
/* Kanban (Root Provider)                                             */
/* ------------------------------------------------------------------ */

export interface KanbanProps extends React.HTMLAttributes<HTMLDivElement> {
  onCardMove?: (event: KanbanMoveEvent) => void
}

export const Kanban = React.forwardRef<HTMLDivElement, KanbanProps>(
  ({ className, onCardMove, children, ...props }, ref) => {
    const [draggingCardId, setDraggingCardId] = React.useState<string | null>(null)
    const [draggingColumnId, setDraggingColumnId] = React.useState<string | null>(null)
    const [overColumnId, setOverColumnId] = React.useState<string | null>(null)

    const setDraggingCard = React.useCallback((cardId: string | null, columnId: string | null) => {
      setDraggingCardId(cardId)
      setDraggingColumnId(columnId)
    }, [])

    const setOverColumn = React.useCallback((columnId: string | null) => {
      setOverColumnId(columnId)
    }, [])

    const ctx = React.useMemo<KanbanContextValue>(
      () => ({
        draggingCardId,
        draggingColumnId,
        overColumnId,
        setDraggingCard,
        setOverColumn,
        onCardMove,
      }),
      [draggingCardId, draggingColumnId, overColumnId, setDraggingCard, setOverColumn, onCardMove],
    )

    return (
      <KanbanContext.Provider value={ctx}>
        <div ref={ref} data-slot="kanban" className={cn('w-full', className)} {...props}>
          {children}
        </div>
      </KanbanContext.Provider>
    )
  },
)
Kanban.displayName = 'Kanban'

/* ------------------------------------------------------------------ */
/* KanbanBoard                                                        */
/* ------------------------------------------------------------------ */

export const KanbanBoard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="kanban-board"
      className={cn('flex w-full items-start gap-4 overflow-x-auto pb-4', className)}
      {...props}
    >
      {children}
    </div>
  ),
)
KanbanBoard.displayName = 'KanbanBoard'

/* ------------------------------------------------------------------ */
/* KanbanColumn                                                       */
/* ------------------------------------------------------------------ */

export interface KanbanColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string
}

export const KanbanColumn = React.forwardRef<HTMLDivElement, KanbanColumnProps>(
  ({ id, className, children, onDragOver, onDragLeave, onDrop, ...props }, ref) => {
    const kanban = useKanbanContext()
    const isOver = kanban.overColumnId === id

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      if (kanban.overColumnId !== id) {
        kanban.setOverColumn(id)
      }
      onDragOver?.(e)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      if (e.currentTarget.contains(e.relatedTarget as Node)) return
      if (kanban.overColumnId === id) {
        kanban.setOverColumn(null)
      }
      onDragLeave?.(e)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      if (kanban.draggingCardId && kanban.draggingColumnId) {
        kanban.onCardMove?.({
          cardId: kanban.draggingCardId,
          fromColumnId: kanban.draggingColumnId,
          toColumnId: id,
        })
      }
      kanban.setDraggingCard(null, null)
      kanban.setOverColumn(null)
      onDrop?.(e)
    }

    const columnCtx = React.useMemo<KanbanColumnContextValue>(() => ({ columnId: id, isOver }), [id, isOver])

    return (
      <KanbanColumnContext.Provider value={columnCtx}>
        <div
          ref={ref}
          data-slot="kanban-column"
          data-column-id={id}
          data-over={isOver ? '' : undefined}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(kanbanColumnVariants({ isOver }), className)}
          {...props}
        >
          {children}
        </div>
      </KanbanColumnContext.Provider>
    )
  },
)
KanbanColumn.displayName = 'KanbanColumn'

/* ------------------------------------------------------------------ */
/* KanbanColumnHeader & Sub-components                                */
/* ------------------------------------------------------------------ */

export const KanbanColumnHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="kanban-column-header"
      className={cn('flex items-center justify-between gap-2 px-1 py-0.5', className)}
      {...props}
    >
      {children}
    </div>
  ),
)
KanbanColumnHeader.displayName = 'KanbanColumnHeader'

export interface KanbanColumnDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: string
}

export const KanbanColumnDot = React.forwardRef<HTMLSpanElement, KanbanColumnDotProps>(
  ({ className, color = 'bg-primary', ...props }, ref) => (
    <span
      ref={ref}
      data-slot="kanban-column-dot"
      className={cn('size-2 shrink-0 rounded-full', color, className)}
      {...props}
    />
  ),
)
KanbanColumnDot.displayName = 'KanbanColumnDot'

export const KanbanColumnTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => (
    <h3
      ref={ref}
      data-slot="kanban-column-title"
      className={cn('text-foreground text-sm font-semibold tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  ),
)
KanbanColumnTitle.displayName = 'KanbanColumnTitle'

export interface KanbanColumnCountProps extends React.HTMLAttributes<HTMLSpanElement> {
  count?: number | string
}

export const KanbanColumnCount = React.forwardRef<HTMLSpanElement, KanbanColumnCountProps>(
  ({ className, count, children, ...props }, ref) => (
    <span
      ref={ref}
      data-slot="kanban-column-count"
      className={cn(
        'bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums',
        className,
      )}
      {...props}
    >
      {count ?? children}
    </span>
  ),
)
KanbanColumnCount.displayName = 'KanbanColumnCount'

export const KanbanColumnAdd = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      data-slot="kanban-column-add"
      className={cn(
        'text-muted-foreground hover:bg-background hover:text-foreground focus-visible:ring-ring inline-flex size-6 items-center justify-center rounded-md transition-colors focus-visible:ring-1 focus-visible:outline-none',
        className,
      )}
      {...props}
    >
      {children ?? <Plus className="size-3.5" />}
    </button>
  ),
)
KanbanColumnAdd.displayName = 'KanbanColumnAdd'

/* ------------------------------------------------------------------ */
/* KanbanColumnBody & Empty                                           */
/* ------------------------------------------------------------------ */

export const KanbanColumnBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="kanban-column-body"
      className={cn('flex flex-1 flex-col gap-2 overflow-y-auto py-1', className)}
      {...props}
    >
      {children}
    </div>
  ),
)
KanbanColumnBody.displayName = 'KanbanColumnBody'

export const KanbanColumnEmpty = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="kanban-column-empty"
      className={cn(
        'border-border/60 text-muted-foreground/60 flex flex-1 items-center justify-center rounded-lg border border-dashed py-8 text-xs',
        className,
      )}
      {...props}
    >
      {children ?? 'No cards'}
    </div>
  ),
)
KanbanColumnEmpty.displayName = 'KanbanColumnEmpty'

/* ------------------------------------------------------------------ */
/* KanbanCard & Sub-components                                        */
/* ------------------------------------------------------------------ */

export interface KanbanCardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string
  disabled?: boolean
}

export const KanbanCard = React.forwardRef<HTMLDivElement, KanbanCardProps>(
  ({ id, disabled = false, className, children, onDragStart, onDragEnd, ...props }, ref) => {
    const kanban = useKanbanContext()
    const column = useKanbanColumnContext()
    const isDragging = kanban.draggingCardId === id

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
      if (disabled) {
        e.preventDefault()
        return
      }
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', id)
      kanban.setDraggingCard(id, column.columnId)
      onDragStart?.(e)
    }

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
      kanban.setDraggingCard(null, null)
      kanban.setOverColumn(null)
      onDragEnd?.(e)
    }

    return (
      <div
        ref={ref}
        data-slot="kanban-card"
        data-card-id={id}
        draggable={!disabled}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className={cn(kanbanCardVariants({ isDragging }), disabled && 'pointer-events-none opacity-50', className)}
        {...props}
      >
        {children}
      </div>
    )
  },
)
KanbanCard.displayName = 'KanbanCard'

export const KanbanCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} data-slot="kanban-card-header" className={cn('flex flex-col gap-1', className)} {...props}>
      {children}
    </div>
  ),
)
KanbanCardHeader.displayName = 'KanbanCardHeader'

export const KanbanCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      data-slot="kanban-card-title"
      className={cn('text-foreground text-sm leading-snug font-medium', className)}
      {...props}
    >
      {children}
    </p>
  ),
)
KanbanCardTitle.displayName = 'KanbanCardTitle'

export const KanbanCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => (
    <p
      ref={ref}
      data-slot="kanban-card-description"
      className={cn('text-muted-foreground line-clamp-2 text-xs', className)}
      {...props}
    >
      {children}
    </p>
  ),
)
KanbanCardDescription.displayName = 'KanbanCardDescription'

export const KanbanCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="kanban-card-footer"
      className={cn('text-muted-foreground mt-1 flex items-center justify-between gap-2 pt-1 text-xs', className)}
      {...props}
    >
      {children}
    </div>
  ),
)
KanbanCardFooter.displayName = 'KanbanCardFooter'

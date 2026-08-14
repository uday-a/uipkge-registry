'use client'

import * as React from 'react'
import { Plus, Calendar, GripVertical, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export interface SimpleKanbanItem {
  id: string
  title: string
  description?: string
  date?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  tag?: string
  tagColor?: string
  assignee?: {
    name: string
    initials?: string
    avatar?: string
  }
}

export interface SimpleKanbanColumn {
  id: string
  title: string
  color?: string
  dotColor?: string
  items: SimpleKanbanItem[]
}

export interface SimpleKanbanProps {
  columns: SimpleKanbanColumn[]
  onColumnsChange?: (columns: SimpleKanbanColumn[]) => void
  onCardClick?: (item: SimpleKanbanItem, columnId: string) => void
  onCardMove?: (item: SimpleKanbanItem, fromColumnId: string, toColumnId: string, newIndex: number) => void
  allowAdd?: boolean
  onAddItem?: (columnId: string, title: string) => void
  className?: string
  cardClassName?: string
}

const DEFAULT_DOT_COLORS: Record<string, string> = {
  backlog: 'bg-slate-400 dark:bg-slate-500',
  todo: 'bg-sky-500',
  'in-progress': 'bg-amber-500',
  review: 'bg-purple-500',
  done: 'bg-emerald-500',
}

const PRIORITY_STYLES: Record<string, { label: string; class: string }> = {
  low: { label: 'Low', class: 'bg-slate-500/10 text-slate-600 dark:text-slate-400' },
  medium: { label: 'Medium', class: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  high: { label: 'High', class: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  urgent: { label: 'Urgent', class: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-medium' },
}

export function SimpleKanban({
  columns,
  onColumnsChange,
  onCardClick,
  onCardMove,
  allowAdd = true,
  onAddItem,
  className,
  cardClassName,
}: SimpleKanbanProps) {
  const [draggedId, setDraggedId] = React.useState<string | null>(null)
  const [dragOverColumnId, setDragOverColumnId] = React.useState<string | null>(null)
  const [dropTargetIndex, setDropTargetIndex] = React.useState<number>(-1)
  const [addingColumnId, setAddingColumnId] = React.useState<string | null>(null)
  const [newTitle, setNewTitle] = React.useState('')
  const lastDragTimeRef = React.useRef(0)

  // Commit mutation helper
  const commit = React.useCallback(
    (mutator: (cols: SimpleKanbanColumn[]) => void) => {
      const next = columns.map((col) => ({
        ...col,
        items: [...col.items],
      }))
      mutator(next)
      onColumnsChange?.(next)
    },
    [columns, onColumnsChange],
  )

  function handleDragStart(e: React.DragEvent, id: string) {
    setDraggedId(id)
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', id)
    }
  }

  function handleDragEnd() {
    setDraggedId(null)
    setDragOverColumnId(null)
    setDropTargetIndex(-1)
    lastDragTimeRef.current = Date.now()
  }

  function handleDragOverColumn(e: React.DragEvent, columnId: string, itemsCount: number) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColumnId(columnId)
    setDropTargetIndex(itemsCount)
  }

  function handleCardDragOver(e: React.DragEvent, columnId: string, index: number) {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColumnId(columnId)
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const midY = rect.top + rect.height / 2
    const targetIdx = e.clientY < midY ? index : index + 1
    setDropTargetIndex(targetIdx)
  }

  function handleDrop(e: React.DragEvent, targetColumnId: string) {
    e.preventDefault()
    if (!draggedId || !targetColumnId) {
      handleDragEnd()
      return
    }

    let sourceColIdx = -1
    let itemIdx = -1
    for (let c = 0; c < columns.length; c++) {
      const col = columns[c]
      if (!col) continue
      const idx = col.items.findIndex((item) => item.id === draggedId)
      if (idx !== -1) {
        sourceColIdx = c
        itemIdx = idx
        break
      }
    }

    const targetColIdx = columns.findIndex((c) => c.id === targetColumnId)
    if (sourceColIdx === -1 || targetColIdx === -1) {
      handleDragEnd()
      return
    }

    const sourceCol = columns[sourceColIdx]
    const targetCol = columns[targetColIdx]
    if (!sourceCol || !targetCol) {
      handleDragEnd()
      return
    }

    const item = sourceCol.items[itemIdx]
    if (!item) {
      handleDragEnd()
      return
    }

    commit((cols) => {
      const src = cols[sourceColIdx]
      const tgt = cols[targetColIdx]
      if (!src || !tgt) return

      const [removed] = src.items.splice(itemIdx, 1)
      if (!removed) return

      let at = dropTargetIndex
      if (at < 0) at = tgt.items.length
      if (sourceColIdx === targetColIdx && itemIdx < at) at--

      tgt.items.splice(at, 0, removed)
      onCardMove?.(removed, sourceCol.id, targetColumnId, at)
    })

    handleDragEnd()
  }

  function handleInlineAdd(columnId: string) {
    if (!newTitle.trim()) {
      setAddingColumnId(null)
      return
    }

    if (onAddItem) {
      onAddItem(columnId, newTitle.trim())
    } else {
      const newItem: SimpleKanbanItem = {
        id: `item-${Date.now()}`,
        title: newTitle.trim(),
      }
      commit((cols) => {
        const col = cols.find((c) => c.id === columnId)
        if (col) col.items.push(newItem)
      })
    }

    setNewTitle('')
    setAddingColumnId(null)
  }

  return (
    <div
      data-slot="simple-kanban"
      className={cn(
        'flex min-h-[380px] w-full [scrollbar-width:thin] items-start gap-4 overflow-x-auto pb-4',
        className,
      )}
    >
      {columns.map((column) => {
        const isColumnOver = dragOverColumnId === column.id
        const dot = column.dotColor || column.color || DEFAULT_DOT_COLORS[column.id] || 'bg-primary'

        return (
          <div
            key={column.id}
            data-slot="kanban-column"
            className={cn(
              'bg-muted/40 border-border/80 flex w-72 shrink-0 flex-col rounded-xl border p-3 transition-colors',
              isColumnOver && 'border-primary/50 bg-muted/60 ring-primary/10 ring-2',
            )}
            onDragOver={(e) => handleDragOverColumn(e, column.id, column.items.length)}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="mb-3 flex items-center justify-between gap-2 px-1">
              <div className="flex items-center gap-2">
                <span className={cn('size-2 rounded-full', dot)} />
                <h3 className="text-foreground text-sm font-semibold tracking-tight">{column.title}</h3>
                <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums">
                  {column.items.length}
                </span>
              </div>
              {allowAdd && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground size-7 rounded-lg"
                  aria-label={`Add item to ${column.title}`}
                  onClick={() => {
                    setAddingColumnId(column.id)
                    setNewTitle('')
                  }}
                >
                  <Plus className="size-3.5" />
                </Button>
              )}
            </div>

            {/* Column Cards Container */}
            <div className="flex min-h-[120px] flex-1 flex-col gap-2.5">
              {/* Inline quick add input */}
              {addingColumnId === column.id && (
                <div className="bg-card border-border animate-in fade-in zoom-in-95 rounded-lg border p-2.5 shadow-xs duration-150">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Item title..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleInlineAdd(column.id)
                      if (e.key === 'Escape') setAddingColumnId(null)
                    }}
                    className="placeholder:text-muted-foreground/60 w-full bg-transparent text-sm font-medium outline-none"
                  />
                  <div className="mt-2.5 flex items-center justify-end gap-1.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs"
                      onClick={() => setAddingColumnId(null)}
                    >
                      Cancel
                    </Button>
                    <Button size="sm" className="h-7 gap-1 px-2.5 text-xs" onClick={() => handleInlineAdd(column.id)}>
                      <Check className="size-3" />
                      Add
                    </Button>
                  </div>
                </div>
              )}

              {/* Cards list */}
              {column.items.map((item, index) => {
                const isDragging = draggedId === item.id
                const isDropTarget = isColumnOver && dropTargetIndex === index

                return (
                  <React.Fragment key={item.id}>
                    {isDropTarget && !isDragging && (
                      <div className="bg-primary/20 h-1.5 w-full rounded-full transition-all duration-150" />
                    )}
                    <div
                      role="button"
                      tabIndex={0}
                      draggable
                      data-slot="kanban-card"
                      onDragStart={(e) => handleDragStart(e, item.id)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleCardDragOver(e, column.id, index)}
                      onClick={() => {
                        if (Date.now() - lastDragTimeRef.current < 150) return
                        onCardClick?.(item, column.id)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          onCardClick?.(item, column.id)
                        }
                      }}
                      className={cn(
                        'group bg-card text-card-foreground border-border/80 hover:border-border relative flex cursor-grab flex-col gap-2 rounded-lg border p-3 shadow-xs transition-all hover:shadow-sm active:cursor-grabbing',
                        isDragging && 'ring-primary/40 opacity-40 shadow-md ring-2',
                        cardClassName,
                      )}
                    >
                      {/* Top row: Title + Grip handle */}
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-foreground line-clamp-2 text-sm leading-snug font-medium">{item.title}</p>
                        <GripVertical className="text-muted-foreground/30 size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>

                      {/* Optional description */}
                      {item.description && (
                        <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">{item.description}</p>
                      )}

                      {/* Metadata row: Date, Tag, Priority, Assignee */}
                      {(item.date || item.tag || item.priority || item.assignee) && (
                        <div className="border-border/40 mt-1 flex flex-wrap items-center justify-between gap-1.5 border-t pt-1 text-xs">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {item.date && (
                              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                                <Calendar className="text-muted-foreground/70 size-3" />
                                <span>{item.date}</span>
                              </div>
                            )}

                            {item.tag && (
                              <span
                                className={cn(
                                  'rounded-md px-1.5 py-0.5 text-xs font-medium',
                                  item.tagColor || 'bg-secondary text-secondary-foreground',
                                )}
                              >
                                {item.tag}
                              </span>
                            )}

                            {item.priority && PRIORITY_STYLES[item.priority] && (
                              <span
                                className={cn('rounded-md px-1.5 py-0.5 text-xs', PRIORITY_STYLES[item.priority].class)}
                              >
                                {PRIORITY_STYLES[item.priority].label}
                              </span>
                            )}
                          </div>

                          {item.assignee && (
                            <Avatar className="border-background size-5 shrink-0 border">
                              <AvatarFallback className="text-xs font-medium">
                                {item.assignee.initials || item.assignee.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      )}
                    </div>
                  </React.Fragment>
                )
              })}

              {/* Trailing drop indicator */}
              {isColumnOver && dropTargetIndex >= column.items.length && draggedId && (
                <div className="bg-primary/20 h-1.5 w-full rounded-full transition-all duration-150" />
              )}

              {/* Empty column placeholder */}
              {column.items.length === 0 && addingColumnId !== column.id && (
                <div className="border-border/60 text-muted-foreground/60 flex flex-1 items-center justify-center rounded-lg border border-dashed py-8 text-center text-xs">
                  Drop items here
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

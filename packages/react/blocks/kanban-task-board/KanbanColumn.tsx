'use client'

import * as React from 'react'
import { Plus, MoreHorizontal, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type KanbanColumn as KanbanColumnType, type KanbanTask } from '@/lib/use-kanban'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { KanbanCard } from './KanbanCard'

export interface FilteredColumn {
  id: string
  title: string
  color: string
  dotColor: string
  tasks: KanbanTask[]
}

export function KanbanColumn({
  column,
  collapsed,
  draggedTask,
  dragOverColumn,
  dropTargetIndex,
  allColumns,
  onToggleCollapse,
  onAddTask,
  onCardClick,
  onCardQuickView,
  onDragStart,
  onDragEnd,
  onCardDragOver,
  onLaneDragOver,
  onDrop,
}: {
  column: FilteredColumn
  collapsed: boolean
  draggedTask: string | null
  dragOverColumn: string | null
  dropTargetIndex: number
  allColumns: KanbanColumnType[]
  onToggleCollapse: (columnId: string) => void
  onAddTask: (columnId: string) => void
  onCardClick: (task: KanbanTask) => void
  onCardQuickView: (task: KanbanTask) => void
  onDragStart: (event: React.DragEvent, taskId: string) => void
  onDragEnd: () => void
  onCardDragOver: (event: React.DragEvent, columnId: string, taskIndex: number) => void
  onLaneDragOver: (event: React.DragEvent, columnId: string, taskCount: number) => void
  onDrop: () => void
}) {
  return (
    <div
      data-slot="kanban-board"
      className={cn('group/col flex shrink-0 flex-col transition-all duration-200', collapsed ? 'w-12' : 'w-[300px]')}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop()}
    >
      {collapsed ? (
        <button
          className="bg-muted/40 hover:bg-muted/60 flex h-full flex-col items-center gap-2 rounded-xl px-1 pt-3 pb-4 transition-colors"
          onClick={() => onToggleCollapse(column.id)}
        >
          <span className={cn('size-2 shrink-0 rounded-full', column.dotColor)} />
          <span
            className={cn(
              'text-xs font-semibold tracking-tight',
              column.color,
              'rotate-180 [writing-mode:vertical-lr]',
            )}
          >
            {column.title}
          </span>
          <Badge variant="secondary" className="mt-1 h-5 min-w-5 justify-center rounded-md px-1 text-xs">
            {column.tasks.length}
          </Badge>
          <ChevronsRight className="text-muted-foreground mt-auto size-3.5" />
        </button>
      ) : (
        <>
          <div className="bg-background/95 sticky top-0 z-10 mb-2 flex items-center gap-2 px-2 py-1.5 backdrop-blur-sm">
            <button
              className="text-muted-foreground/50 hover:text-muted-foreground shrink-0 transition-colors"
              title="Collapse column"
              onClick={() => onToggleCollapse(column.id)}
            >
              <ChevronsLeft className="size-3.5" />
            </button>
            <span className={cn('size-2 shrink-0 rounded-full', column.dotColor)} />
            <h3 className={cn('text-sm font-semibold tracking-tight', column.color)}>{column.title}</h3>
            <span className="text-muted-foreground bg-muted rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums">
              {column.tasks.length}
            </span>
            <div className="ml-auto flex items-center">
              <Button
                aria-label="Column options"
                variant="ghost"
                size="icon"
                className="text-muted-foreground size-6 opacity-0 transition-opacity group-hover/col:opacity-100"
              >
                <MoreHorizontal className="size-3.5" />
              </Button>
              <Button
                aria-label="Add task"
                variant="ghost"
                size="icon"
                className="text-muted-foreground size-6"
                onClick={() => onAddTask(column.id)}
              >
                <Plus className="size-3.5" />
              </Button>
            </div>
          </div>

          <div
            className={cn(
              'kanban-lane flex flex-col rounded-xl p-2 transition-all duration-200',
              dragOverColumn === column.id && draggedTask
                ? 'bg-primary/[0.06] ring-primary/25 ring-1 ring-inset'
                : 'bg-muted/40',
            )}
            onDragOver={(e) => {
              e.preventDefault()
              onLaneDragOver(e, column.id, column.tasks.length)
            }}
          >
            {column.tasks.map((task, taskIndex) => (
              <React.Fragment key={task.id}>
                <div
                  className={cn(
                    'drop-indicator mx-1 transition-all duration-150',
                    dragOverColumn === column.id &&
                      dropTargetIndex === taskIndex &&
                      draggedTask &&
                      draggedTask !== task.id
                      ? 'bg-primary h-0.5 rounded-full'
                      : 'h-0',
                  )}
                />
                <div
                  data-task-id={task.id}
                  draggable="true"
                  className={cn(
                    'mt-2 first:mt-0',
                    draggedTask === task.id ? 'scale-95 rotate-1 opacity-30' : 'opacity-100',
                  )}
                  onDragStart={(e) => onDragStart(e, task.id)}
                  onDragEnd={() => onDragEnd()}
                  onDragOver={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    onCardDragOver(e, column.id, taskIndex)
                  }}
                >
                  <KanbanCard
                    task={task}
                    isDone={column.id === 'done'}
                    columns={allColumns}
                    onClick={onCardClick}
                    onQuickView={onCardQuickView}
                  />
                </div>
              </React.Fragment>
            ))}

            {column.tasks.length > 0 && (
              <div
                className={cn(
                  'drop-indicator mx-1 transition-all duration-150',
                  dragOverColumn === column.id && dropTargetIndex === column.tasks.length && draggedTask
                    ? 'bg-primary mt-2 h-0.5 rounded-full'
                    : 'h-0',
                )}
              />
            )}

            {column.tasks.length === 0 && (
              <button
                aria-label="Add task"
                className="text-muted-foreground/50 hover:text-muted-foreground hover:border-muted-foreground/30 flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed py-10 transition-colors"
                onClick={() => onAddTask(column.id)}
              >
                <Plus className="mb-1 size-4" />
                <p className="text-xs">No tasks</p>
              </button>
            )}
          </div>

          <button
            aria-label="Add task"
            className="text-muted-foreground hover:text-foreground hover:bg-muted/60 mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed py-2 text-xs transition-colors"
            onClick={() => onAddTask(column.id)}
          >
            <Plus className="size-3.5" />
            Add task
          </button>
        </>
      )}
    </div>
  )
}

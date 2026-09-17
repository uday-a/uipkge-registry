'use client'

import * as React from 'react'
import { Plus } from 'lucide-react'
import { type KanbanColumn as KanbanColumnType, type KanbanTask, findTaskById } from '@/lib/use-kanban'
import { PageHeader, PageHeaderHeading } from '@/components/ui/page'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { KanbanToolbar } from './KanbanToolbar'
import { KanbanColumn, type FilteredColumn } from './KanbanColumn'
import { KanbanListView } from './KanbanListView'
import { KanbanTaskSheet } from './KanbanTaskSheet'
import { KanbanAddTaskDialog } from './KanbanAddTaskDialog'
export { SimpleKanban, type SimpleKanbanProps, type SimpleKanbanColumn, type SimpleKanbanItem } from './SimpleKanban'

export interface KanbanBoardProps {
  columns: KanbanColumnType[]
  onColumnsChange?: (value: KanbanColumnType[]) => void
  title?: string | null
  description?: string | null
  defaultColumnId?: string
  hideHeader?: boolean
  hideToolbar?: boolean
  lockParentScroll?: boolean
}

export function KanbanBoard({
  columns,
  onColumnsChange,
  title = 'Kanban Board',
  description = 'Drag tasks across columns to update their status.',
  defaultColumnId = 'backlog',
  hideHeader = false,
  hideToolbar = false,
  lockParentScroll = true,
}: KanbanBoardProps) {
  const kanbanEl = React.useRef<HTMLDivElement | null>(null)

  React.useEffect(() => {
    if (!lockParentScroll) return
    const parentMain = kanbanEl.current?.closest('main[data-slot="sidebar-inset"]') as HTMLElement | null
    if (parentMain) parentMain.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      if (parentMain) parentMain.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [lockParentScroll])

  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedPriority, setSelectedPriority] = React.useState<string | null>(null)
  const [selectedAssignee, setSelectedAssignee] = React.useState<string | null>(null)
  const [viewMode, setViewMode] = React.useState<'board' | 'list'>('board')
  const [collapsedColumns, setCollapsedColumns] = React.useState<Set<string>>(new Set())

  const [detailOpen, setDetailOpen] = React.useState(false)
  const [detailTask, setDetailTask] = React.useState<KanbanTask | null>(null)

  const [addTaskOpen, setAddTaskOpen] = React.useState(false)
  const [addTaskColumnId, setAddTaskColumnId] = React.useState(defaultColumnId)

  const draggedTaskRef = React.useRef<string | null>(null)
  const dragOverColumnRef = React.useRef<string | null>(null)
  const dropTargetIndexRef = React.useRef<number>(-1)
  const lastDragEndRef = React.useRef(0)

  const [draggedTask, setDraggedTask] = React.useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = React.useState<string | null>(null)
  const [dropTargetIndex, setDropTargetIndex] = React.useState<number>(-1)

  // Mutating helper: the consumer owns `columns`, so we clone, mutate the
  // clone, and emit it back via onColumnsChange — mirroring the Vue v-model.
  function commitColumns(mutator: (cols: KanbanColumnType[]) => void) {
    const next = columns.map((c) => ({ ...c, tasks: [...c.tasks] }))
    mutator(next)
    onColumnsChange?.(next)
  }

  const filteredColumns = React.useMemo<FilteredColumn[]>(() => {
    return columns.map((col) => ({
      ...col,
      tasks: col.tasks.filter((task) => {
        const q = searchQuery.toLowerCase()
        const matchesSearch = !q || task.title.toLowerCase().includes(q) || task.id.toLowerCase().includes(q)
        const matchesPriority = !selectedPriority || task.priority === selectedPriority
        const matchesAssignee = !selectedAssignee || task.assignee.name === selectedAssignee
        return matchesSearch && matchesPriority && matchesAssignee
      }),
    }))
  }, [columns, searchQuery, selectedPriority, selectedAssignee])

  const totalTasks = React.useMemo(() => columns.reduce((sum, col) => sum + col.tasks.length, 0), [columns])

  function toggleCollapse(columnId: string) {
    setCollapsedColumns((prev) => {
      const next = new Set(prev)
      if (next.has(columnId)) next.delete(columnId)
      else next.add(columnId)
      return next
    })
  }

  function addComment(task: KanbanTask, text: string) {
    commitColumns((cols) => {
      const target = findTaskById(cols, task.id)
      if (target) {
        target.commentItems = [
          ...target.commentItems,
          {
            id: `c${Date.now()}`,
            author: 'Admin User',
            authorColor: 'bg-chart-1/15 text-chart-1',
            text,
            time: 'Just now',
          },
        ]
      }
    })
  }

  function moveTask(task: KanbanTask, targetColumnId: string) {
    commitColumns((cols) => {
      const sourceCol = cols.find((c) => c.tasks.some((t) => t.id === task.id))
      const targetCol = cols.find((c) => c.id === targetColumnId)
      if (!sourceCol || !targetCol || sourceCol.id === targetColumnId) return
      const taskIndex = sourceCol.tasks.findIndex((t) => t.id === task.id)
      if (taskIndex === -1) return
      const removed = sourceCol.tasks.splice(taskIndex, 1)
      if (removed[0]) targetCol.tasks.push(removed[0])
    })
  }

  function openTaskDetail(task: KanbanTask) {
    setDetailTask(task)
    setDetailOpen(true)
  }

  function onDragStart(event: React.DragEvent, taskId: string) {
    draggedTaskRef.current = taskId
    setDraggedTask(taskId)
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('text/plain', taskId)
    }
  }

  function resetDrag() {
    draggedTaskRef.current = null
    dragOverColumnRef.current = null
    dropTargetIndexRef.current = -1
    setDraggedTask(null)
    setDragOverColumn(null)
    setDropTargetIndex(-1)
    lastDragEndRef.current = Date.now()
  }

  function onDrop() {
    const dragged = draggedTaskRef.current
    const overColumn = dragOverColumnRef.current
    if (!dragged || !overColumn) {
      resetDrag()
      return
    }

    commitColumns((cols) => {
      let sourceColIdx = -1
      let taskIdx = -1
      for (let c = 0; c < cols.length; c++) {
        const col = cols[c]
        if (!col) continue
        const tIdx = col.tasks.findIndex((t) => t.id === dragged)
        if (tIdx !== -1) {
          sourceColIdx = c
          taskIdx = tIdx
          break
        }
      }
      const targetColIdx = cols.findIndex((c) => c.id === overColumn)
      if (sourceColIdx === -1 || targetColIdx === -1) return

      const sourceCol = cols[sourceColIdx]
      const targetCol = cols[targetColIdx]
      if (!sourceCol || !targetCol) return

      const [task] = sourceCol.tasks.splice(taskIdx, 1)
      if (!task) return

      let insertAt = dropTargetIndexRef.current
      if (insertAt < 0) insertAt = targetCol.tasks.length
      if (sourceColIdx === targetColIdx && taskIdx < insertAt) insertAt--

      targetCol.tasks.splice(insertAt, 0, task)
    })
    resetDrag()
  }

  function onCardClick(task: KanbanTask) {
    if (Date.now() - lastDragEndRef.current < 200) return
    openTaskDetail(task)
  }

  function onCardDragOver(event: React.DragEvent, columnId: string, taskIndex: number) {
    dragOverColumnRef.current = columnId
    setDragOverColumn(columnId)
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
    const midY = rect.top + rect.height / 2
    const idx = event.clientY < midY ? taskIndex : taskIndex + 1
    dropTargetIndexRef.current = idx
    setDropTargetIndex(idx)
  }

  function onLaneDragOver(_event: React.DragEvent, columnId: string, taskCount: number) {
    dragOverColumnRef.current = columnId
    setDragOverColumn(columnId)
    dropTargetIndexRef.current = taskCount
    setDropTargetIndex(taskCount)
  }

  function openAddTask(columnId: string) {
    setAddTaskColumnId(columnId)
    setAddTaskOpen(true)
  }

  function onCreateTask(columnId: string, tasks: KanbanTask[]) {
    commitColumns((cols) => {
      const col = cols.find((c) => c.id === columnId)
      if (col) col.tasks.push(...tasks)
    })
  }

  return (
    <div
      ref={kanbanEl}
      data-slot="kanban-board"
      className="kanban-page flex h-[calc(100dvh-3.5rem-3rem)] flex-col overflow-hidden lg:h-[calc(100dvh-3.5rem-3rem)]"
    >
      {!hideHeader && (
        <div className="mb-3 shrink-0">
          <PageHeader>
            <div className="flex items-start justify-between gap-4">
              <PageHeaderHeading title={title ?? ''} description={description ?? ''} />
              <div className="flex shrink-0 items-center gap-2">
                <Badge variant="secondary" className="font-mono text-xs tabular-nums">
                  {totalTasks} tasks
                </Badge>
                <Button size="sm" onClick={() => openAddTask(defaultColumnId)}>
                  <Plus className="size-4" />
                  Add Task
                </Button>
              </div>
            </div>
          </PageHeader>
        </div>
      )}

      {!hideToolbar && (
        <KanbanToolbar
          searchQuery={searchQuery}
          selectedPriority={selectedPriority}
          selectedAssignee={selectedAssignee}
          viewMode={viewMode}
          onSearchQueryChange={setSearchQuery}
          onSelectedPriorityChange={setSelectedPriority}
          onSelectedAssigneeChange={setSelectedAssignee}
          onViewModeChange={setViewMode}
        />
      )}

      {viewMode === 'board' ? (
        <div className="kanban-board relative flex min-h-0 flex-1 items-start gap-3 overflow-auto pb-3">
          {filteredColumns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              collapsed={collapsedColumns.has(column.id)}
              draggedTask={draggedTask}
              dragOverColumn={dragOverColumn}
              dropTargetIndex={dropTargetIndex}
              allColumns={columns}
              onToggleCollapse={toggleCollapse}
              onAddTask={openAddTask}
              onCardClick={onCardClick}
              onCardQuickView={openTaskDetail}
              onDragStart={onDragStart}
              onDragEnd={resetDrag}
              onCardDragOver={onCardDragOver}
              onLaneDragOver={onLaneDragOver}
              onDrop={onDrop}
            />
          ))}
        </div>
      ) : (
        <KanbanListView
          columns={filteredColumns}
          allColumns={columns}
          onTaskClick={openTaskDetail}
          onMoveTask={moveTask}
        />
      )}

      <KanbanTaskSheet
        open={detailOpen}
        task={detailTask}
        columns={columns}
        onOpenChange={setDetailOpen}
        onMoveTask={moveTask}
        onAddComment={addComment}
      />

      <KanbanAddTaskDialog
        open={addTaskOpen}
        columns={columns}
        initialColumnId={addTaskColumnId}
        onOpenChange={setAddTaskOpen}
        onCreate={onCreateTask}
      />

      <style>{`
        .kanban-board {
          scrollbar-width: thin;
          scrollbar-color: hsl(var(--border)) transparent;
        }
        .kanban-board::-webkit-scrollbar {
          height: 6px;
          width: 6px;
        }
        .kanban-board::-webkit-scrollbar-thumb {
          background-color: hsl(var(--border));
          border-radius: 3px;
        }
        .kanban-board::-webkit-scrollbar-corner {
          background: transparent;
        }
        .kanban-card {
          animation: card-in 0.25s ease-out both;
        }
        @keyframes card-in {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
        }
        .kanban-card:hover .kanban-accent {
          box-shadow: 0 0 3px currentColor;
        }
        .kanban-lane {
          min-height: 60px;
        }
        .kanban-list {
          scrollbar-width: thin;
          scrollbar-color: hsl(var(--border)) transparent;
        }
        .kanban-list::-webkit-scrollbar {
          height: 6px;
          width: 6px;
        }
        .kanban-list::-webkit-scrollbar-thumb {
          background-color: hsl(var(--border));
          border-radius: 3px;
        }
      `}</style>
    </div>
  )
}

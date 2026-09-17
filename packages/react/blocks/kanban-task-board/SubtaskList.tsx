'use client'

import { cn } from '@/lib/utils'
import { type KanbanColumn as KanbanColumnType, type KanbanTask, findTaskById, getTaskColumn } from '@/lib/use-kanban'

export function SubtaskList({
  subtaskIds,
  columns,
  compact = false,
}: {
  subtaskIds: string[]
  columns: KanbanColumnType[]
  compact?: boolean
}) {
  const subtasks = subtaskIds
    .map((id) => {
      const task = findTaskById(columns, id)
      const column = getTaskColumn(columns, id)
      return task ? { task, column } : null
    })
    .filter(Boolean) as { task: KanbanTask; column: KanbanColumnType | undefined }[]

  const doneCount = subtasks.filter((s) => s.column?.id === 'done').length
  const percent = subtasks.length > 0 ? Math.round((doneCount / subtasks.length) * 100) : 0

  if (!subtasks.length) {
    return (
      <p data-slot="kanban-board" className="text-muted-foreground text-xs">
        No subtasks yet.
      </p>
    )
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-muted-foreground text-xs tabular-nums">
          {doneCount}/{subtasks.length} done
        </span>
        <span className="text-muted-foreground text-xs font-medium tabular-nums">{percent}%</span>
      </div>
      <div className="bg-muted mb-3 h-1.5 overflow-hidden rounded-full">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            doneCount === subtasks.length ? 'bg-success' : 'bg-primary',
          )}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className={compact ? 'space-y-0.5' : 'space-y-1'}>
        {subtasks.map(({ task, column }) => (
          <a
            key={task.id}
            href={`/dashboard/kanban/${task.id}`}
            className={cn(
              'group/subtask flex items-center gap-2 rounded-md transition-colors',
              compact ? 'px-1 py-1' : 'px-1.5 py-1.5',
              'hover:bg-muted/50',
            )}
          >
            <span className={cn('size-1.5 shrink-0 rounded-full', column?.dotColor ?? 'bg-muted-foreground')} />
            <span className={cn('text-muted-foreground/70 shrink-0 font-mono text-xs')}>{task.id}</span>
            <span
              className={cn(
                'min-w-0 flex-1 truncate',
                compact ? 'text-xs' : 'text-sm',
                column?.id === 'done' ? 'text-muted-foreground line-through' : 'text-foreground',
              )}
            >
              {task.title}
            </span>
            <span
              className={cn(
                'shrink-0 rounded-md px-1.5 py-0.5 text-xs font-medium',
                column?.color ?? 'text-muted-foreground',
              )}
            >
              {column?.title ?? 'Unknown'}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}

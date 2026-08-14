'use client'

import * as React from 'react'
import { MoreHorizontal, MessageSquare, Paperclip, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { type KanbanColumn as KanbanColumnType, type KanbanTask, priorityConfig, getTaskColumn } from '@/lib/use-kanban'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { TagBadge } from './TagBadge'
import { SubtaskProgress } from './SubtaskProgress'
import { DueDateBadge } from './DueDateBadge'
import { UserAvatar } from './UserAvatar'

export function KanbanCard({
  task,
  isDone,
  columns,
  onClick,
  onQuickView,
}: {
  task: KanbanTask
  isDone: boolean
  columns: KanbanColumnType[]
  onClick?: (task: KanbanTask) => void
  onQuickView?: (task: KanbanTask) => void
}) {
  const subtasksDone = React.useMemo(() => {
    if (!columns || !task.subtaskIds.length) return 0
    return task.subtaskIds.filter((id) => getTaskColumn(columns, id)?.id === 'done').length
  }, [columns, task.subtaskIds])

  return (
    <div
      data-slot="kanban-board"
      className={cn(
        'kanban-card group/card bg-card relative cursor-grab rounded-lg border p-3 transition-all duration-150',
        'hover:border-border hover:shadow-md active:scale-[0.97] active:cursor-grabbing',
        isDone ? 'opacity-75 hover:opacity-100' : '',
      )}
      onClick={() => onClick?.(task)}
    >
      <div
        className={cn(
          'kanban-accent absolute top-3 bottom-3 left-0 w-[1.5px] rounded-full transition-all duration-150',
          priorityConfig[task.priority].bg,
          task.priority === 'low' ? 'opacity-40' : task.priority === 'medium' ? 'opacity-60' : 'opacity-90',
        )}
      />

      <div className="mb-1 flex items-center justify-between pl-2">
        <span className="text-muted-foreground/70 font-mono text-xs">{task.id}</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              aria-label="Card options"
              variant="ghost"
              size="icon"
              className="text-muted-foreground -mr-1 size-6 opacity-0 transition-opacity group-hover/card:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation()
                onQuickView?.(task)
              }}
            >
              Quick view
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={`/dashboard/kanban/${task.id}`} className="gap-2">
                <ExternalLink className="size-3.5" />
                Open detail
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Move to...</DropdownMenuItem>
            <DropdownMenuItem>Assign to...</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p
        className={cn(
          'mb-2 pl-2 text-sm leading-snug font-medium',
          isDone ? 'decoration-muted-foreground/40 line-through' : '',
        )}
      >
        {task.title}
      </p>

      {task.tags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1 pl-2">
          {task.tags.map((tag) => (
            <TagBadge key={tag.label} label={tag.label} color={tag.color} />
          ))}
        </div>
      )}

      {task.subtaskIds.length > 0 && (
        <div className="mb-2 pl-2">
          <SubtaskProgress done={subtasksDone} total={task.subtaskIds.length} />
        </div>
      )}

      <div className="flex items-center gap-2 pl-2">
        {task.dueDate && <DueDateBadge dueDate={task.dueDate} variant="chip" />}

        {task.commentItems.length > 0 && (
          <div className="text-muted-foreground/70 flex items-center gap-1 text-xs">
            <MessageSquare className="size-3" />
            {task.commentItems.length}
          </div>
        )}

        {task.fileItems.length > 0 && (
          <div className="text-muted-foreground/70 flex items-center gap-1 text-xs">
            <Paperclip className="size-3" />
            {task.fileItems.length}
          </div>
        )}

        <div className="ml-auto">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <UserAvatar name={task.assignee.name} color={task.assignee.color} size="xs" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                {task.assignee.name}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}

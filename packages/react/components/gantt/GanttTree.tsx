'use client'

import * as React from 'react'
import { Flag } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGantt } from './Gantt'
import type { GanttTask } from './types'

export interface GanttTreeProps extends React.HTMLAttributes<HTMLDivElement> {
  showAssignee?: boolean
  showPriority?: boolean
  onTaskClick?: (task: GanttTask) => void
}

const priorityColors: Record<string, string> = {
  urgent: 'text-destructive',
  high: 'text-amber-500',
  medium: 'text-primary',
  low: 'text-muted-foreground/60',
}

function calculateDays(startDate: string, endDate: string) {
  const diff = new Date(endDate).getTime() - new Date(startDate).getTime()
  const days = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  return `${days}d`
}

export const GanttTree = React.forwardRef<HTMLDivElement, GanttTreeProps>(
  ({ className, showAssignee = true, showPriority = true, onTaskClick: propOnTaskClick, ...props }, ref) => {
    const { treeWidth, headerHeight, rowHeight, tasks, onTaskClick: ctxOnTaskClick } = useGantt()
    const handleTaskClick = propOnTaskClick ?? ctxOnTaskClick

    return (
      <div
        ref={ref}
        data-uipkge=""
        data-slot="gantt-tree"
        style={{ width: `${treeWidth}px` }}
        className={cn(
          'border-border bg-card flex shrink-0 flex-col border-r transition-[width] select-none',
          className,
        )}
        {...props}
      >
        <div
          style={{ height: `${headerHeight}px` }}
          className="border-border bg-muted/20 text-muted-foreground flex items-center justify-between border-b px-3 text-xs font-semibold tracking-wider uppercase"
        >
          <span className="flex-1 truncate">Deliverable</span>
          {showPriority ? <span className="w-12 shrink-0 text-center">Pri</span> : null}
          <span className="w-16 shrink-0 text-right">Duration</span>
        </div>

        <div className="divide-border/40 flex-1 divide-y overflow-y-auto">
          {tasks.map((task) => (
            <div
              key={task.id}
              style={{ height: `${rowHeight}px` }}
              className={cn(
                'group/row text-foreground hover:bg-muted/40 flex cursor-pointer items-center justify-between px-3 text-xs transition-colors',
                task.isGroup && 'bg-muted/10 font-semibold',
              )}
              onClick={() => handleTaskClick?.(task)}
            >
              <div className="flex min-w-0 flex-1 items-center gap-1.5 pr-2">
                {task.parentId ? <span className="w-4 shrink-0" /> : null}

                {task.status ? (
                  <span
                    className={cn(
                      'size-2 shrink-0 rounded-full',
                      task.status === 'done' && 'bg-emerald-500 ring-2 ring-emerald-500/20',
                      task.status === 'in-progress' && 'bg-primary ring-primary/20 ring-2',
                      task.status === 'at-risk' && 'bg-amber-500 ring-2 ring-amber-500/20',
                      task.status === 'todo' && 'bg-muted-foreground/40',
                      task.status === 'blocked' && 'bg-destructive ring-destructive/20 ring-2',
                    )}
                  />
                ) : null}

                <span className="truncate font-medium">{task.name}</span>
              </div>

              {showPriority ? (
                <div className="flex w-12 shrink-0 items-center justify-center">
                  {task.priority ? <Flag className={cn('size-3', priorityColors[task.priority])} /> : null}
                </div>
              ) : null}

              <div className="text-muted-foreground w-16 shrink-0 text-right font-mono text-xs">
                {task.isMilestone ? (
                  <span className="text-xs font-semibold text-amber-500">Milestone</span>
                ) : (
                  <span>{calculateDays(task.startDate, task.endDate)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
)

GanttTree.displayName = 'GanttTree'

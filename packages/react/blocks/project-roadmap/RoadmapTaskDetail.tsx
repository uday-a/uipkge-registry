'use client'

import * as React from 'react'
import { Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import type { GanttTask } from '@/components/ui/gantt'

export interface RoadmapTaskDetailProps {
  task: GanttTask | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RoadmapTaskDetail({ task, open, onOpenChange }: RoadmapTaskDetailProps) {
  if (!task) return null

  const getStatusBadge = () => {
    switch (task.status) {
      case 'done':
        return { label: 'Completed', variant: 'outline' as const, className: 'text-emerald-600 border-emerald-500/30' }
      case 'in-progress':
        return { label: 'In Progress', variant: 'default' as const, className: '' }
      case 'blocked':
        return { label: 'Blocked', variant: 'destructive' as const, className: '' }
      default:
        return { label: 'To Do', variant: 'secondary' as const, className: '' }
    }
  }

  const badge = getStatusBadge()

  return (
    <Sheet data-slot="project-roadmap" open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="border-border space-y-2 border-b pb-4">
          <div className="flex items-center gap-2">
            <Badge variant={badge.variant} className={badge.className}>
              {badge.label}
            </Badge>
            {task.isMilestone ? (
              <Badge variant="outline" className="border-amber-500/30 text-amber-500">
                Milestone
              </Badge>
            ) : null}
          </div>
          <SheetTitle className="text-foreground text-lg font-semibold">{task.name}</SheetTitle>
          <SheetDescription className="text-muted-foreground text-xs">
            Task ID: <span className="font-mono">{task.id}</span>
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 py-5 text-sm">
          <div className="space-y-1.5">
            <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Schedule</span>
            <div className="text-foreground flex items-center gap-2 font-mono text-xs">
              <Calendar className="text-muted-foreground size-4" />
              <span>{task.startDate}</span>
              <span>&rarr;</span>
              <span>{task.endDate}</span>
            </div>
          </div>

          {task.progress != null ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium tracking-wider uppercase">Completion</span>
                <span className="font-mono font-bold">{task.progress}%</span>
              </div>
              <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                <div
                  style={{ width: `${task.progress}%` }}
                  className="bg-primary h-full rounded-full transition-all duration-300"
                />
              </div>
            </div>
          ) : null}

          {task.assignee ? (
            <div className="space-y-1.5">
              <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">Owner</span>
              <div className="flex items-center gap-2.5">
                <div className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-full text-xs font-medium">
                  {task.assignee.initials || task.assignee.name.charAt(0)}
                </div>
                <span className="text-foreground text-sm font-medium">{task.assignee.name}</span>
              </div>
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}

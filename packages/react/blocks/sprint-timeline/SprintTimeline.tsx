'use client'

import * as React from 'react'
import { Clock, Target, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Gantt, GanttTree, GanttTimeline, type GanttTask } from '@/components/ui/gantt'

export interface SprintTimelineProps {
  sprintName?: string
  startDate?: string
  endDate?: string
}

const defaultSprintTasks: GanttTask[] = [
  {
    id: 'sp-1',
    name: 'Gantt Component Specs & Tokens',
    startDate: '2026-08-10',
    endDate: '2026-08-13',
    progress: 100,
    status: 'done',
    priority: 'high',
    assignee: { name: 'Sarah Connor', initials: 'SC' },
  },
  {
    id: 'sp-2',
    name: 'Vue 3.5 SFC Implementation',
    startDate: '2026-08-12',
    endDate: '2026-08-18',
    progress: 90,
    status: 'in-progress',
    priority: 'urgent',
    dependencies: ['sp-1'],
    assignee: { name: 'Marcus Rivera', initials: 'MR' },
  },
  {
    id: 'sp-3',
    name: 'React 19 Parity Mirror',
    startDate: '2026-08-14',
    endDate: '2026-08-19',
    progress: 80,
    status: 'in-progress',
    priority: 'high',
    dependencies: ['sp-1'],
    assignee: { name: 'Priya Nair', initials: 'PN' },
  },
  {
    id: 'sp-4',
    name: 'Mid-Sprint Review & Demo',
    startDate: '2026-08-17',
    endDate: '2026-08-17',
    isMilestone: true,
    status: 'done',
  },
  {
    id: 'sp-5',
    name: 'Composed Roadmap & Sprint Blocks',
    startDate: '2026-08-18',
    endDate: '2026-08-22',
    progress: 40,
    status: 'in-progress',
    priority: 'medium',
    dependencies: ['sp-2', 'sp-3'],
    assignee: { name: 'Sundar Krishnan', initials: 'SK' },
  },
  {
    id: 'sp-6',
    name: 'Sprint Retrospective & Release',
    startDate: '2026-08-24',
    endDate: '2026-08-24',
    isMilestone: true,
    status: 'todo',
    dependencies: ['sp-5'],
  },
]

export function SprintTimeline({
  sprintName = 'Sprint 42: UI Registry 2.3',
  startDate = '2026-08-10',
  endDate = '2026-08-24',
}: SprintTimelineProps) {
  const [tasks] = React.useState<GanttTask[]>(defaultSprintTasks)
  const completedPoints = 28
  const totalPoints = 35
  const daysRemaining = 6

  return (
    <div
      data-uipkge=""
      data-slot="sprint-timeline"
      className="border-border bg-card space-y-5 rounded-xl border p-5 shadow-xs"
    >
      <div className="border-border/60 flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-primary border-primary/30">
              <Zap className="mr-1 size-3" />
              Active Sprint
            </Badge>
            <span className="text-muted-foreground font-mono text-xs">
              {startDate} &rarr; {endDate}
            </span>
          </div>
          <h3 className="text-foreground text-lg font-bold">{sprintName}</h3>
        </div>

        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="flex items-center gap-1.5">
            <Target className="text-muted-foreground size-4" />
            <span>
              {completedPoints} / {totalPoints} Story Points
            </span>
          </div>
          <div className="flex items-center gap-1.5 font-semibold text-amber-500">
            <Clock className="size-4" />
            <span>{daysRemaining} Days Left</span>
          </div>
        </div>
      </div>

      <Gantt tasks={tasks} scale="day" rowHeight={38} treeWidth={260} className="h-72 border-none shadow-none">
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <GanttTree showPriority={true} />
          <GanttTimeline showTodayLine={true} showDependencies={true} />
        </div>
      </Gantt>
    </div>
  )
}

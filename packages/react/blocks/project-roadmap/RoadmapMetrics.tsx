'use client'

import * as React from 'react'
import { CheckCircle2, Clock, AlertCircle, Milestone } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import type { GanttTask } from '@/components/ui/gantt'

export interface RoadmapMetricsProps {
  tasks: GanttTask[]
}

export function RoadmapMetrics({ tasks }: RoadmapMetricsProps) {
  const total = tasks.length
  const completed = tasks.filter((t) => t.status === 'done').length
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length
  const milestones = tasks.filter((t) => t.isMilestone).length
  const progress = total === 0 ? 0 : Math.round(tasks.reduce((acc, t) => acc + (t.progress ?? 0), 0) / total)

  return (
    <div data-slot="roadmap-metrics" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Card className="bg-card/50 border-border/80 shadow-none">
        <CardContent className="flex items-center justify-between p-3.5">
          <div>
            <p className="text-muted-foreground text-xs font-medium">Overall Progress</p>
            <p className="text-foreground mt-0.5 font-mono text-xl font-bold">{progress}%</p>
          </div>
          <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full">
            <Clock className="size-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border/80 shadow-none">
        <CardContent className="flex items-center justify-between p-3.5">
          <div>
            <p className="text-muted-foreground text-xs font-medium">In Progress</p>
            <p className="text-foreground mt-0.5 font-mono text-xl font-bold">{inProgress}</p>
          </div>
          <div className="flex size-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
            <AlertCircle className="size-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border/80 shadow-none">
        <CardContent className="flex items-center justify-between p-3.5">
          <div>
            <p className="text-muted-foreground text-xs font-medium">Completed</p>
            <p className="text-foreground mt-0.5 font-mono text-xl font-bold">{completed}</p>
          </div>
          <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <CheckCircle2 className="size-4" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border/80 shadow-none">
        <CardContent className="flex items-center justify-between p-3.5">
          <div>
            <p className="text-muted-foreground text-xs font-medium">Milestones</p>
            <p className="text-foreground mt-0.5 font-mono text-xl font-bold">{milestones}</p>
          </div>
          <div className="flex size-8 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
            <Milestone className="size-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

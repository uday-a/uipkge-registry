import type { GanttTask } from '@/components/ui/gantt'

export interface RoadmapProject {
  id: string
  name: string
  description?: string
  tasks: GanttTask[]
}

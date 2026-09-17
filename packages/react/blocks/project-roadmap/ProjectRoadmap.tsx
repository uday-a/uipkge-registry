'use client'

import * as React from 'react'
import { Plus, Search, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, InputGroup, InputGroupAddon } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Gantt,
  GanttHeader,
  GanttTree,
  GanttTimeline,
  type GanttTask,
  type GanttScale,
  type GanttTaskStatus,
  type GanttTaskPriority,
} from '@/components/ui/gantt'
import { RoadmapMetrics } from './RoadmapMetrics'
import { RoadmapTaskDetail } from './RoadmapTaskDetail'
import { RoadmapAddTaskDialog } from './RoadmapAddTaskDialog'

export interface ProjectRoadmapProps {
  initialTasks?: GanttTask[]
  title?: string
  description?: string
}

const defaultTasks: GanttTask[] = [
  {
    id: 'task-1',
    name: 'System Architecture & Database Schema',
    startDate: '2026-08-01',
    endDate: '2026-08-08',
    progress: 100,
    status: 'done',
    priority: 'high',
    assignee: { name: 'Sarah Connor', initials: 'SC' },
  },
  {
    id: 'task-2',
    name: 'Auth, RBAC & Multi-Tenant Session Engine',
    startDate: '2026-08-06',
    endDate: '2026-08-16',
    progress: 85,
    status: 'in-progress',
    priority: 'urgent',
    assignee: { name: 'Marcus Rivera', initials: 'MR' },
  },
  {
    id: 'task-3',
    name: 'Real-time WebSocket Notification Bus',
    startDate: '2026-08-12',
    endDate: '2026-08-22',
    progress: 50,
    status: 'in-progress',
    priority: 'high',
    assignee: { name: 'Priya Nair', initials: 'PN' },
  },
  {
    id: 'task-4',
    name: 'Alpha Core API Release Milestone',
    startDate: '2026-08-23',
    endDate: '2026-08-23',
    isMilestone: true,
    status: 'todo',
    priority: 'urgent',
  },
  {
    id: 'task-5',
    name: 'Stripe Billing & Invoicing Integration',
    startDate: '2026-08-24',
    endDate: '2026-09-04',
    progress: 15,
    status: 'todo',
    priority: 'medium',
    assignee: { name: 'Sundar Krishnan', initials: 'SK' },
  },
  {
    id: 'task-6',
    name: 'End-to-End Playwright Automated Testing',
    startDate: '2026-08-28',
    endDate: '2026-09-08',
    progress: 0,
    status: 'todo',
    priority: 'low',
    assignee: { name: 'Diane Cho', initials: 'DC' },
  },
  {
    id: 'task-7',
    name: 'Production Cloudflare Pages Deployment',
    startDate: '2026-09-10',
    endDate: '2026-09-10',
    isMilestone: true,
    status: 'todo',
  },
]

export function ProjectRoadmap({
  initialTasks = defaultTasks,
  title = 'Engineering Q3 Deliverables',
  description = 'Track roadmap work breakdown, sprint milestones, and cross-team dependencies.',
}: ProjectRoadmapProps) {
  const [tasks, setTasks] = React.useState<GanttTask[]>([...initialTasks])
  const [searchQuery, setSearchQuery] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [assigneeFilter, setAssigneeFilter] = React.useState('all')
  const [scale, setScale] = React.useState<GanttScale>('day')

  const [selectedTask, setSelectedTask] = React.useState<GanttTask | null>(null)
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [addDialogOpen, setAddDialogOpen] = React.useState(false)

  const filteredTasks = React.useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch = !searchQuery || t.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || t.status === statusFilter
      const matchesAssignee = assigneeFilter === 'all' || t.assignee?.name === assigneeFilter
      return matchesSearch && matchesStatus && matchesAssignee
    })
  }, [tasks, searchQuery, statusFilter, assigneeFilter])

  const handleTaskClick = (task: GanttTask) => {
    setSelectedTask(task)
    setSheetOpen(true)
  }

  const handleAddTask = (newTask: GanttTask) => {
    setTasks((prev) => [...prev, newTask])
  }

  const handleStatusChange = (task: GanttTask, status: GanttTaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status, progress: status === 'done' ? 100 : t.progress } : t)),
    )
  }

  const handlePriorityChange = (task: GanttTask, priority: GanttTaskPriority) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, priority } : t)))
  }

  const handleDuplicate = (task: GanttTask) => {
    const cloned: GanttTask = {
      ...task,
      id: `task-${Date.now()}`,
      name: `${task.name} (Copy)`,
    }
    setTasks((prev) => [...prev, cloned])
  }

  const handleDelete = (task: GanttTask) => {
    setTasks((prev) => prev.filter((t) => t.id !== task.id))
  }

  return (
    <div data-uipkge="" data-slot="project-roadmap" className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
          <p className="text-muted-foreground mt-0.5 text-sm">{description}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button aria-label="Download attachment" variant="outline" size="sm">
            <Download className="mr-1 size-3.5" />
            Export
          </Button>
          <Button size="sm" onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-1 size-3.5" />
            Add Task
          </Button>
        </div>
      </div>

      <RoadmapMetrics tasks={tasks} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex max-w-lg flex-1 flex-wrap items-center gap-2">
          <InputGroup size="small" className="w-56">
            <InputGroupAddon>
              <Search className="size-3.5" />
            </InputGroupAddon>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter tasks by name..."
            />
          </InputGroup>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="done">Completed</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
            </SelectContent>
          </Select>

          <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
            <SelectTrigger className="h-8 w-36 text-xs">
              <SelectValue placeholder="All Assignees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assignees</SelectItem>
              <SelectItem value="Sarah Connor">Sarah Connor</SelectItem>
              <SelectItem value="Marcus Rivera">Marcus Rivera</SelectItem>
              <SelectItem value="Priya Nair">Priya Nair</SelectItem>
              <SelectItem value="Sundar Krishnan">Sundar Krishnan</SelectItem>
              <SelectItem value="Diane Cho">Diane Cho</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="text-muted-foreground font-mono text-xs">
          Showing <span className="text-foreground font-bold">{filteredTasks.length}</span> of {tasks.length}{' '}
          deliverables
          <span className="text-muted-foreground/60 ml-2">(Right-click task for quick actions)</span>
        </p>
      </div>

      <Gantt tasks={filteredTasks} scale={scale} onScaleChange={setScale} className="h-[480px]">
        <GanttHeader title={title} />
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <GanttTree onTaskClick={handleTaskClick} />
          <GanttTimeline onTaskClick={handleTaskClick} />
        </div>
      </Gantt>

      <RoadmapTaskDetail open={sheetOpen} onOpenChange={setSheetOpen} task={selectedTask} />
      <RoadmapAddTaskDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onAddTask={handleAddTask} />
    </div>
  )
}

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus, Search, Download } from 'lucide-vue-next'
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
import RoadmapMetrics from './RoadmapMetrics.vue'
import RoadmapTaskDetail from './RoadmapTaskDetail.vue'
import RoadmapAddTaskDialog from './RoadmapAddTaskDialog.vue'

interface Props {
  initialTasks?: GanttTask[]
  title?: string
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Engineering Q3 Deliverables',
  description: 'Track roadmap work breakdown, sprint milestones, and cross-team dependencies.',
  initialTasks: () => [
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
  ],
})

const tasks = ref<GanttTask[]>([...props.initialTasks])
const searchQuery = ref('')
const statusFilter = ref('all')
const assigneeFilter = ref('all')
const scale = ref<GanttScale>('day')

const selectedTask = ref<GanttTask | null>(null)
const sheetOpen = ref(false)
const addDialogOpen = ref(false)

const filteredTasks = computed(() => {
  return tasks.value.filter((t) => {
    const matchesSearch = !searchQuery.value || t.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'all' || t.status === statusFilter.value
    const matchesAssignee = assigneeFilter.value === 'all' || t.assignee?.name === assigneeFilter.value
    return matchesSearch && matchesStatus && matchesAssignee
  })
})

function handleTaskClick(task: GanttTask) {
  selectedTask.value = task
  sheetOpen.value = true
}

function handleAddTask(newTask: GanttTask) {
  tasks.value.push(newTask)
}

function handleStatusChange(task: GanttTask, status: GanttTaskStatus) {
  const target = tasks.value.find((t) => t.id === task.id)
  if (target) {
    target.status = status
    if (status === 'done') target.progress = 100
  }
}

function handlePriorityChange(task: GanttTask, priority: GanttTaskPriority) {
  const target = tasks.value.find((t) => t.id === task.id)
  if (target) target.priority = priority
}

function handleDuplicate(task: GanttTask) {
  const cloned: GanttTask = {
    ...task,
    id: `task-${Date.now()}`,
    name: `${task.name} (Copy)`,
  }
  tasks.value.push(cloned)
}

function handleDelete(task: GanttTask) {
  tasks.value = tasks.value.filter((t) => t.id !== task.id)
}
</script>

<template>
  <div data-uipkge data-slot="project-roadmap" class="space-y-6">
    <!-- Section Top Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-foreground text-xl font-bold tracking-tight sm:text-2xl">{{ title }}</h2>
        <p class="text-muted-foreground mt-0.5 text-sm">{{ description }}</p>
      </div>

      <div class="flex items-center gap-2">
        <Button aria-label="Download attachment" variant="outline" size="sm">
          <Download class="mr-1 size-3.5" />
          Export
        </Button>
        <Button size="sm" @click="addDialogOpen = true">
          <Plus class="mr-1 size-3.5" />
          Add Task
        </Button>
      </div>
    </div>

    <!-- Summary Metrics -->
    <RoadmapMetrics :tasks="tasks" />

    <!-- Filters & Action Bar -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex max-w-lg flex-1 flex-wrap items-center gap-2">
        <InputGroup size="small" class="w-56">
          <InputGroupAddon>
            <Search class="size-3.5" />
          </InputGroupAddon>
          <Input v-model="searchQuery" placeholder="Filter tasks by name..." />
        </InputGroup>

        <Select v-model="statusFilter">
          <SelectTrigger class="h-8 w-32 text-xs">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="done">Completed</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
          </SelectContent>
        </Select>

        <Select v-model="assigneeFilter">
          <SelectTrigger class="h-8 w-36 text-xs">
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

      <p class="text-muted-foreground font-mono text-xs">
        Showing <span class="text-foreground font-bold">{{ filteredTasks.length }}</span> of
        {{ tasks.length }} deliverables
        <span class="text-muted-foreground/60 ml-2">(Right-click task for quick actions)</span>
      </p>
    </div>

    <!-- Main Interactive Gantt Workspace with Right-Click Context Actions -->
    <Gantt :tasks="filteredTasks" :scale="scale" class="h-[480px]">
      <GanttHeader :title="title" />
      <div class="flex min-h-0 flex-1 overflow-hidden">
        <GanttTree @click="handleTaskClick" />
        <GanttTimeline @task-click="handleTaskClick" />
      </div>
    </Gantt>

    <!-- Task Detail Drawer -->
    <RoadmapTaskDetail v-model:open="sheetOpen" :task="selectedTask" />

    <!-- Add Task Modal Dialog -->
    <RoadmapAddTaskDialog v-model:open="addDialogOpen" @add-task="handleAddTask" />
  </div>
</template>

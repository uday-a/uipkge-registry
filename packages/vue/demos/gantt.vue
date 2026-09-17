<script setup lang="ts">
import { ref } from "vue";
import {
  Gantt,
  GanttHeader,
  GanttTree,
  GanttTimeline,
  type GanttTask,
} from "@/components/ui/gantt";
import { Badge } from "@/components/ui/badge";

const sampleTasks = ref<GanttTask[]>([
  {
    id: "t-1",
    name: "Discovery & System Architecture",
    startDate: "2026-08-01",
    endDate: "2026-08-08",
    progress: 100,
    status: "done",
    priority: "high",
    assignee: { name: "Sarah Connor", initials: "SC" },
  },
  {
    id: "t-2",
    name: "Design Tokens & Component Specs",
    startDate: "2026-08-06",
    endDate: "2026-08-16",
    progress: 85,
    status: "in-progress",
    priority: "urgent",
    assignee: { name: "Marcus Rivera", initials: "MR" },
  },
  {
    id: "t-3",
    name: "Core Primitives Implementation",
    startDate: "2026-08-12",
    endDate: "2026-08-24",
    progress: 50,
    status: "in-progress",
    priority: "high",
    dependencies: ["t-2"],
    assignee: { name: "Priya Nair", initials: "PN" },
  },
  {
    id: "t-4",
    name: "Alpha Registry Release",
    startDate: "2026-08-25",
    endDate: "2026-08-25",
    isMilestone: true,
    status: "todo",
    priority: "urgent",
    dependencies: ["t-3"],
  },
  {
    id: "t-5",
    name: "End-to-End Testing & Verification",
    startDate: "2026-08-26",
    endDate: "2026-09-06",
    progress: 10,
    status: "todo",
    priority: "medium",
    dependencies: ["t-4"],
    assignee: { name: "Sundar Krishnan", initials: "SK" },
  },
  {
    id: "t-6",
    name: "Production Deployment",
    startDate: "2026-09-08",
    endDate: "2026-09-08",
    isMilestone: true,
    status: "todo",
    dependencies: ["t-5"],
  },
]);

// Hierarchical Group Tasks
const groupTasks = ref<GanttTask[]>([
  {
    id: "grp-1",
    name: "Phase 1: Foundation",
    startDate: "2026-08-01",
    endDate: "2026-08-18",
    isGroup: true,
    progress: 90,
  },
  {
    id: "sub-1",
    parentId: "grp-1",
    name: "Design System Tokens",
    startDate: "2026-08-01",
    endDate: "2026-08-09",
    progress: 100,
    status: "done",
  },
  {
    id: "sub-2",
    parentId: "grp-1",
    name: "Headless Primitive Setup",
    startDate: "2026-08-08",
    endDate: "2026-08-18",
    progress: 80,
    status: "in-progress",
  },
  {
    id: "grp-2",
    name: "Phase 2: Productization",
    startDate: "2026-08-19",
    endDate: "2026-09-05",
    isGroup: true,
    progress: 25,
  },
  {
    id: "sub-3",
    parentId: "grp-2",
    name: "Composed Dashboard Blocks",
    startDate: "2026-08-19",
    endDate: "2026-08-29",
    progress: 40,
    status: "in-progress",
  },
  {
    id: "sub-4",
    parentId: "grp-2",
    name: "Documentation Island Previews",
    startDate: "2026-08-28",
    endDate: "2026-09-05",
    progress: 0,
    status: "todo",
  },
]);

// Statuses
const statusTasks = ref<GanttTask[]>([
  {
    id: "s-1",
    name: "Security Audit & Pen-Testing",
    startDate: "2026-08-02",
    endDate: "2026-08-10",
    status: "done",
    progress: 100,
  },
  {
    id: "s-2",
    name: "Database Migration to Postgres",
    startDate: "2026-08-08",
    endDate: "2026-08-20",
    status: "in-progress",
    progress: 65,
  },
  {
    id: "s-3",
    name: "Payment Gateway Webhook Sync",
    startDate: "2026-08-14",
    endDate: "2026-08-26",
    status: "at-risk",
    progress: 30,
  },
  {
    id: "s-4",
    name: "SSO SAML Enterprise Auth",
    startDate: "2026-08-18",
    endDate: "2026-08-30",
    status: "blocked",
    progress: 15,
  },
  {
    id: "s-5",
    name: "Analytics Telemetry Pipeline",
    startDate: "2026-08-25",
    endDate: "2026-09-05",
    status: "todo",
    progress: 0,
  },
]);

const selectedTask = ref<GanttTask | null>(null);
</script>

<template>
  <!-- Story 1: Default Project Timeline -->
  <Story
    title="Interactive Project Timeline"
    description="Multi-scale project timeline with task tree, duration counters, progress fill, and scale switcher."
  >
    <Gantt :tasks="sampleTasks" scale="day" class="h-96">
      <GanttHeader title="Product Engineering Q3" />
      <div class="flex min-h-0 flex-1 overflow-hidden">
        <GanttTree />
        <GanttTimeline />
      </div>
    </Gantt>
  </Story>

  <!-- Story 2: Hierarchical Groups & Subtasks -->
  <Story
    title="Parent Deliverables & Subtask Rollups"
    description="Collapsible group deliverables with nested child deliverables and summary completion brackets."
  >
    <Gantt :tasks="groupTasks" scale="day" class="h-96">
      <GanttHeader title="Multi-Phase Project Breakdown" />
      <div class="flex min-h-0 flex-1 overflow-hidden">
        <GanttTree />
        <GanttTimeline />
      </div>
    </Gantt>
  </Story>

  <!-- Story 3: Critical Path & Dependency Linking -->
  <Story
    title="Dependencies & Critical Path"
    description="Tasks linked with dashed directional SVG bezier connections showing prerequisite blockers."
  >
    <Gantt :tasks="sampleTasks" scale="day" class="h-96">
      <GanttHeader title="Task Prerequisites & Handoffs" />
      <div class="flex min-h-0 flex-1 overflow-hidden">
        <GanttTree />
        <GanttTimeline :show-dependencies="true" />
      </div>
    </Gantt>
  </Story>

  <!-- Story 4: Week Scale Zoom -->
  <Story
    title="Week Scale View"
    description="Aggregated 7-day columns for high-level sprint planning and long-term milestones."
  >
    <Gantt :tasks="sampleTasks" scale="week" class="h-80">
      <GanttHeader title="Sprint Overview (Week Scale)" />
      <div class="flex min-h-0 flex-1 overflow-hidden">
        <GanttTree />
        <GanttTimeline />
      </div>
    </Gantt>
  </Story>

  <!-- Story 5: Month Scale View -->
  <Story
    title="Month Scale View"
    description="Quarterly and annual overview for executive roadmaps and cross-team alignment."
  >
    <Gantt :tasks="sampleTasks" scale="month" class="h-80">
      <GanttHeader title="Quarterly Strategic Goals" />
      <div class="flex min-h-0 flex-1 overflow-hidden">
        <GanttTree />
        <GanttTimeline />
      </div>
    </Gantt>
  </Story>

  <!-- Story 6: Health & Status Color Hierarchy -->
  <Story
    title="Health & Status Colors"
    description="Calibrated status colors for Completed (Green), In Progress (Brand), At Risk (Amber), and Blocked (Destructive)."
  >
    <Gantt :tasks="statusTasks" scale="day" class="h-80">
      <GanttHeader title="System Health & Operational Status" />
      <div class="flex min-h-0 flex-1 overflow-hidden">
        <GanttTree />
        <GanttTimeline />
      </div>
    </Gantt>
  </Story>

  <!-- Story 7: Compact Mini Widget -->
  <Story
    title="Compact Mini Widget"
    description="Dense 32px row height and slim tree width designed for dashboard sidebars and summary cards."
  >
    <Gantt
      :tasks="sampleTasks.slice(0, 4)"
      scale="day"
      :row-height="32"
      :tree-width="220"
      class="h-64"
    >
      <GanttHeader title="Active Sprint" :show-scale-switcher="false" />
      <div class="flex min-h-0 flex-1 overflow-hidden">
        <GanttTree :show-priority="false" />
        <GanttTimeline />
      </div>
    </Gantt>
  </Story>

  <!-- Story 8: Interactive Task Click Inspector -->
  <Story
    title="Reactive Task Selection"
    description="Clicking any deliverable bar or tree row emits a task-click event to inspect task details."
  >
    <div class="space-y-4">
      <Gantt
        :tasks="sampleTasks"
        scale="day"
        class="h-80"
        @task-click="selectedTask = $event"
      >
        <GanttHeader title="Click any task to inspect details" />
        <div class="flex min-h-0 flex-1 overflow-hidden">
          <GanttTree />
          <GanttTimeline />
        </div>
      </Gantt>

      <div
        v-if="selectedTask"
        class="border-border bg-card flex items-center justify-between rounded-lg border p-4"
      >
        <div>
          <div class="flex items-center gap-2">
            <span class="text-muted-foreground font-mono text-xs">{{
              selectedTask.id
            }}</span>
            <Badge variant="secondary">{{ selectedTask.status }}</Badge>
          </div>
          <p class="text-foreground mt-1 text-sm font-semibold">
            {{ selectedTask.name }}
          </p>
          <p class="text-muted-foreground text-xs">
            {{ selectedTask.startDate }} &rarr; {{ selectedTask.endDate }}
          </p>
        </div>
        <div class="text-right">
          <p class="text-muted-foreground text-xs">Progress</p>
          <p class="text-primary font-mono text-lg font-bold">
            {{ selectedTask.progress ?? 0 }}%
          </p>
        </div>
      </div>
    </div>
  </Story>
</template>

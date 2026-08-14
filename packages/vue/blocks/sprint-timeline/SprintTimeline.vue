<script setup lang="ts">
import { computed, ref } from 'vue'
import { Clock, Zap, Target } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Gantt, GanttTree, GanttTimeline, type GanttTask } from '@/components/ui/gantt'

interface Props {
  sprintName?: string
  startDate?: string
  endDate?: string
}

const props = withDefaults(defineProps<Props>(), {
  sprintName: 'Sprint 42: UI Registry 2.3',
  startDate: '2026-08-10',
  endDate: '2026-08-24',
})

const sprintTasks = ref<GanttTask[]>([
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
])

const completedPoints = computed(() => 28)
const totalPoints = computed(() => 35)
const daysRemaining = computed(() => 6)
</script>

<template>
  <div data-uipkge data-slot="sprint-timeline" class="border-border bg-card space-y-5 rounded-xl border p-5 shadow-xs">
    <!-- Sprint Header Info -->
    <div class="border-border/60 flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <Badge variant="outline" class="text-primary border-primary/30">
            <Zap class="mr-1 size-3" />
            Active Sprint
          </Badge>
          <span class="text-muted-foreground font-mono text-xs">{{ startDate }} &rarr; {{ endDate }}</span>
        </div>
        <h3 class="text-foreground text-lg font-bold">{{ sprintName }}</h3>
      </div>

      <div class="flex items-center gap-4 font-mono text-xs">
        <div class="flex items-center gap-1.5">
          <Target class="text-muted-foreground size-4" />
          <span>{{ completedPoints }} / {{ totalPoints }} Story Points</span>
        </div>
        <div class="flex items-center gap-1.5 font-semibold text-amber-500">
          <Clock class="size-4" />
          <span>{{ daysRemaining }} Days Left</span>
        </div>
      </div>
    </div>

    <!-- Sprint Gantt Grid -->
    <Gantt :tasks="sprintTasks" scale="day" :row-height="38" :tree-width="260" class="h-72 border-none shadow-none">
      <div class="flex min-h-0 flex-1 overflow-hidden">
        <GanttTree :show-priority="true" />
        <GanttTimeline :show-today-line="true" :show-dependencies="true" />
      </div>
    </Gantt>
  </div>
</template>

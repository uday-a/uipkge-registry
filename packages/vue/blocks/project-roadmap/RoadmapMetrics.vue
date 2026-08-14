<script setup lang="ts">
import { computed } from 'vue'
import { CheckCircle2, Clock, AlertCircle, Milestone } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import type { GanttTask } from '@/components/ui/gantt'

const props = defineProps<{
  tasks: GanttTask[]
}>()

const total = computed(() => props.tasks.length)
const completed = computed(() => props.tasks.filter((t) => t.status === 'done').length)
const inProgress = computed(() => props.tasks.filter((t) => t.status === 'in-progress').length)
const milestones = computed(() => props.tasks.filter((t) => t.isMilestone).length)
const progress = computed(() => {
  if (total.value === 0) return 0
  const sum = props.tasks.reduce((acc, t) => acc + (t.progress ?? 0), 0)
  return Math.round(sum / total.value)
})
</script>

<template>
  <div data-slot="roadmap-metrics" class="grid grid-cols-2 gap-3 sm:grid-cols-4">
    <Card class="bg-card/50 border-border/80 shadow-none">
      <CardContent class="flex items-center justify-between p-3.5">
        <div>
          <p class="text-muted-foreground text-xs font-medium">Overall Progress</p>
          <p class="text-foreground mt-0.5 font-mono text-xl font-bold">{{ progress }}%</p>
        </div>
        <div class="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-full">
          <Clock class="size-4" />
        </div>
      </CardContent>
    </Card>

    <Card class="bg-card/50 border-border/80 shadow-none">
      <CardContent class="flex items-center justify-between p-3.5">
        <div>
          <p class="text-muted-foreground text-xs font-medium">In Progress</p>
          <p class="text-foreground mt-0.5 font-mono text-xl font-bold">{{ inProgress }}</p>
        </div>
        <div class="flex size-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
          <AlertCircle class="size-4" />
        </div>
      </CardContent>
    </Card>

    <Card class="bg-card/50 border-border/80 shadow-none">
      <CardContent class="flex items-center justify-between p-3.5">
        <div>
          <p class="text-muted-foreground text-xs font-medium">Completed</p>
          <p class="text-foreground mt-0.5 font-mono text-xl font-bold">{{ completed }}</p>
        </div>
        <div class="flex size-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
          <CheckCircle2 class="size-4" />
        </div>
      </CardContent>
    </Card>

    <Card class="bg-card/50 border-border/80 shadow-none">
      <CardContent class="flex items-center justify-between p-3.5">
        <div>
          <p class="text-muted-foreground text-xs font-medium">Milestones</p>
          <p class="text-foreground mt-0.5 font-mono text-xl font-bold">{{ milestones }}</p>
        </div>
        <div class="flex size-8 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
          <Milestone class="size-4" />
        </div>
      </CardContent>
    </Card>
  </div>
</template>

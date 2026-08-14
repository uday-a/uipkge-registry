<script setup lang="ts">
import { computed } from 'vue'
import { Calendar } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import type { GanttTask } from '@/components/ui/gantt'

const props = defineProps<{
  task: GanttTask | null
  open: boolean
}>()

const emits = defineEmits<{
  (e: 'update:open', val: boolean): void
}>()

const statusBadge = computed(() => {
  if (!props.task?.status) return { label: 'Active', variant: 'secondary' as const }
  switch (props.task.status) {
    case 'done':
      return { label: 'Completed', variant: 'outline' as const, class: 'text-emerald-600 border-emerald-500/30' }
    case 'in-progress':
      return { label: 'In Progress', variant: 'default' as const }
    case 'blocked':
      return { label: 'Blocked', variant: 'destructive' as const }
    default:
      return { label: 'To Do', variant: 'secondary' as const }
  }
})
</script>

<template>
  <Sheet data-slot="project-roadmap" :open="open" @update:open="$emit('update:open', $event)">
    <SheetContent v-if="task" class="sm:max-w-md">
      <SheetHeader class="border-border space-y-2 border-b pb-4">
        <div class="flex items-center gap-2">
          <Badge :variant="statusBadge.variant" :class="statusBadge.class">
            {{ statusBadge.label }}
          </Badge>
          <Badge v-if="task.isMilestone" variant="outline" class="border-amber-500/30 text-amber-500">
            Milestone
          </Badge>
        </div>
        <SheetTitle class="text-foreground text-lg font-semibold">
          {{ task.name }}
        </SheetTitle>
        <SheetDescription class="text-muted-foreground text-xs">
          Task ID: <span class="font-mono">{{ task.id }}</span>
        </SheetDescription>
      </SheetHeader>

      <div class="space-y-5 py-5 text-sm">
        <!-- Date Schedule -->
        <div class="space-y-1.5">
          <span class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Schedule</span>
          <div class="text-foreground flex items-center gap-2 font-mono text-xs">
            <Calendar class="text-muted-foreground size-4" />
            <span>{{ task.startDate }}</span>
            <span>&rarr;</span>
            <span>{{ task.endDate }}</span>
          </div>
        </div>

        <!-- Progress -->
        <div v-if="task.progress != null" class="space-y-1.5">
          <div class="flex items-center justify-between text-xs">
            <span class="text-muted-foreground font-medium tracking-wider uppercase">Completion</span>
            <span class="font-mono font-bold">{{ task.progress }}%</span>
          </div>
          <div class="bg-muted h-2 w-full overflow-hidden rounded-full">
            <div
              :style="{ width: `${task.progress}%` }"
              class="bg-primary h-full rounded-full transition-all duration-300"
            />
          </div>
        </div>

        <!-- Assignee -->
        <div v-if="task.assignee" class="space-y-1.5">
          <span class="text-muted-foreground text-xs font-medium tracking-wider uppercase">Owner</span>
          <div class="flex items-center gap-2.5">
            <div
              class="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-full text-xs font-medium"
            >
              {{ task.assignee.initials || task.assignee.name.charAt(0) }}
            </div>
            <span class="text-foreground text-sm font-medium">{{ task.assignee.name }}</span>
          </div>
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>

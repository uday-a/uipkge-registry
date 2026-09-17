<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { inject } from 'vue'
import { ChevronRight, ChevronDown, Flag } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

interface Props {
  showAssignee?: boolean
  showPriority?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  showAssignee: true,
  showPriority: true,
})

const context = inject<any>('ganttContext')

const priorityColors: Record<string, string> = {
  urgent: 'text-destructive',
  high: 'text-amber-500',
  medium: 'text-primary',
  low: 'text-muted-foreground/60',
}

function calculateDays(startDate: string, endDate: string) {
  const diff = new Date(endDate).getTime() - new Date(startDate).getTime()
  const days = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  return `${days}d`
}
</script>

<template>
  <div
    data-uipkge
    data-slot="gantt-tree"
    :style="{ width: `${context?.treeWidth.value ?? 300}px` }"
    :class="cn('border-border bg-card flex shrink-0 flex-col border-r transition-[width] select-none', props.class)"
  >
    <!-- Column Headers -->
    <div
      :style="{ height: `${context?.headerHeight.value ?? 48}px` }"
      class="border-border bg-muted/20 text-muted-foreground flex items-center justify-between border-b px-3 text-xs font-semibold tracking-wider uppercase"
    >
      <span class="flex-1 truncate">Deliverable</span>
      <span v-if="showPriority" class="w-12 shrink-0 text-center">Pri</span>
      <span class="w-16 shrink-0 text-right">Duration</span>
    </div>

    <!-- Rows List -->
    <div class="divide-border/40 flex-1 divide-y overflow-y-auto">
      <div
        v-for="task in context?.tasks.value ?? []"
        :key="task.id"
        :style="{ height: `${context?.rowHeight.value ?? 40}px` }"
        :class="
          cn(
            'group/row text-foreground hover:bg-muted/40 flex cursor-pointer items-center justify-between px-3 text-xs transition-colors',
            task.isGroup && 'bg-muted/10 font-semibold',
          )
        "
        @click="context?.onTaskClick(task)"
      >
        <!-- Task Name & Chevron / Indent -->
        <div class="flex min-w-0 flex-1 items-center gap-1.5 pr-2">
          <button
            v-if="task.isGroup || (task.children && task.children.length > 0)"
            type="button"
            class="text-muted-foreground hover:text-foreground flex size-4 shrink-0 items-center justify-center rounded-xs p-0.5"
            @click.stop="context?.toggleExpand?.(task.id)"
          >
            <ChevronDown v-if="task.isExpanded !== false" class="size-3" />
            <ChevronRight v-else class="size-3" />
          </button>
          <span v-else-if="task.parentId" class="w-4 shrink-0" />

          <!-- Status Indicator Dot -->
          <span
            v-if="task.status"
            :class="[
              'size-2 shrink-0 rounded-full',
              task.status === 'done' && 'bg-emerald-500 ring-2 ring-emerald-500/20',
              task.status === 'in-progress' && 'bg-primary ring-primary/20 ring-2',
              task.status === 'at-risk' && 'bg-amber-500 ring-2 ring-amber-500/20',
              task.status === 'todo' && 'bg-muted-foreground/40',
              task.status === 'blocked' && 'bg-destructive ring-destructive/20 ring-2',
            ]"
          />

          <span class="truncate font-medium">{{ task.name }}</span>
        </div>

        <!-- Priority Flag -->
        <div v-if="showPriority" class="flex w-12 shrink-0 items-center justify-center">
          <Flag v-if="task.priority" :class="cn('size-3', priorityColors[task.priority])" />
        </div>

        <!-- Duration / Due Date Tag -->
        <div class="text-muted-foreground w-16 shrink-0 text-right font-mono text-xs">
          <span v-if="task.isMilestone" class="text-xs font-semibold text-amber-500"> Milestone </span>
          <span v-else>
            {{ calculateDays(task.startDate, task.endDate) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

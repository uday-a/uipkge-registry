<script setup lang="ts">
import { ref } from 'vue'
import KanbanBoard from '@/components/blocks/kanban-task-board/KanbanBoard.vue'
import SimpleKanban, { type SimpleKanbanColumn } from '@/components/blocks/kanban-task-board/SimpleKanban.vue'
import { createInitialColumns } from '../../../../../packages/registry-vue/bootstrap/kanban-data/kanbanData'

const simpleColumns = ref<SimpleKanbanColumn[]>([
  {
    id: 'backlog',
    title: 'Backlog',
    dotColor: 'bg-slate-400 dark:bg-slate-500',
    items: [
      {
        id: 'sk-1',
        title: 'Cross-platform auth synchronization',
        description: 'Implement token refresh rotation across mobile and web clients.',
        date: 'May 15 - Jun 2, 2026',
        priority: 'high',
        tag: 'Auth',
        assignee: { name: 'Alice Chen', initials: 'AC' },
      },
      {
        id: 'sk-2',
        title: 'Scale multi-region edge caching',
        description: 'Benchmark Cloudflare worker cache hit ratios for static registry files.',
        date: 'Jun 22 - Jul 10, 2026',
        priority: 'medium',
        tag: 'Infra',
        assignee: { name: 'Dan Ruiz', initials: 'DR' },
      },
      {
        id: 'sk-3',
        title: 'Extensible drag & drop plugin architecture',
        date: 'Jul 28 - Aug 14, 2026',
        priority: 'low',
        tag: 'Core',
      },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    dotColor: 'bg-amber-500',
    items: [
      {
        id: 'sk-4',
        title: 'Real-time telemetry event streaming',
        description: 'Wire SSE endpoints for instant live preview updates.',
        date: 'May 16 - Jun 9, 2026',
        priority: 'urgent',
        tag: 'Realtime',
        assignee: { name: 'Sarah Miller', initials: 'SM' },
      },
      {
        id: 'sk-5',
        title: 'OKLCH theme token harmonizer',
        description: 'Calibrate contrast ratios across light and dark modes.',
        date: 'Apr 26 - May 20, 2026',
        priority: 'high',
        tag: 'Design',
        assignee: { name: 'Leo Vance', initials: 'LV' },
      },
    ],
  },
  {
    id: 'review',
    title: 'In Review',
    dotColor: 'bg-purple-500',
    items: [
      {
        id: 'sk-6',
        title: 'Astro island SSR hydration benchmark',
        description: 'Verify sub-50ms TTFB across dual-framework demo islands.',
        date: 'Aug 3 - Aug 18, 2026',
        priority: 'medium',
        tag: 'Performance',
        assignee: { name: 'Alice Chen', initials: 'AC' },
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    dotColor: 'bg-emerald-500',
    items: [
      {
        id: 'sk-7',
        title: 'Sub-pixel border and shadow layering',
        description: 'Refined neutral borders matching Linear & Raycast standards.',
        date: 'Mar 10 - Apr 12, 2026',
        priority: 'low',
        tag: 'Craft',
        assignee: { name: 'Dan Ruiz', initials: 'DR' },
      },
      {
        id: 'sk-8',
        title: 'Zero-config JSON registry endpoint schema',
        date: 'Feb 14 - Mar 2, 2026',
        priority: 'high',
        tag: 'Registry',
      },
    ],
  },
])

const columns = ref(createInitialColumns())
</script>

<template>
  <Story
    title="Simple Kanban"
    description="Clean, lightweight drag-and-drop board with column status indicators, item counts, date ranges, tags, assignee avatars, and inline task creation — inspired by Kibo UI."
  >
    <div class="bg-background/50 overflow-hidden rounded-xl border p-4">
      <SimpleKanban v-model:columns="simpleColumns" />
    </div>
  </Story>

  <Story
    title="Full-Featured Enterprise Board"
    description="Complete kanban surface with priority badges, assignees, tags, due dates, subtask progress, comment/file counts, list/board view switch, task detail sheet, and full add-task dialog."
  >
    <div class="h-[600px] overflow-hidden rounded-lg border p-4">
      <KanbanBoard v-model:columns="columns" :lock-parent-scroll="false" />
    </div>
  </Story>
</template>

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'project-roadmap',
  type: 'registry:block',
  categories: ['productivity', 'dashboard', 'data'],
  framework: 'vue',
  description:
    'Full interactive project roadmap and deliverables surface: Gantt timeline with multi-scale zooming, work breakdown task tree, overall progress metrics, search and status/assignee filters, task detail slide-over Sheet, and Add Task modal dialog.',
  files: [
    { path: 'ProjectRoadmap.vue', target: 'components/blocks/project-roadmap/ProjectRoadmap.vue' },
    { path: 'RoadmapMetrics.vue', target: 'components/blocks/project-roadmap/RoadmapMetrics.vue' },
    { path: 'RoadmapTaskDetail.vue', target: 'components/blocks/project-roadmap/RoadmapTaskDetail.vue' },
    { path: 'RoadmapAddTaskDialog.vue', target: 'components/blocks/project-roadmap/RoadmapAddTaskDialog.vue' },
    { path: 'types.ts', target: 'components/blocks/project-roadmap/types.ts' },
    { path: 'index.ts', target: 'components/blocks/project-roadmap/index.ts' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/gantt.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/sheet.json',
    'https://uipkge.dev/r/checkbox.json',
    'https://uipkge.dev/r/label.json',
  ],
})

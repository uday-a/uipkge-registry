import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'gantt',
  type: 'registry:ui',
  categories: ['data-display'],
  framework: 'svelte',
  description:
    'Interactive Gantt chart primitive with multi-scale timeline (day/week/month/year), collapsible task tree, progress fill, milestone markers, dependency lines, and right-click GanttContextMenu.',
  files: [
    { path: 'Gantt.svelte', target: 'components/ui/gantt/Gantt.svelte' },
    { path: 'GanttHeader.svelte', target: 'components/ui/gantt/GanttHeader.svelte' },
    { path: 'GanttTree.svelte', target: 'components/ui/gantt/GanttTree.svelte' },
    { path: 'GanttTimeline.svelte', target: 'components/ui/gantt/GanttTimeline.svelte' },
    { path: 'GanttBar.svelte', target: 'components/ui/gantt/GanttBar.svelte' },
    { path: 'GanttMilestone.svelte', target: 'components/ui/gantt/GanttMilestone.svelte' },
    { path: 'GanttContextMenu.svelte', target: 'components/ui/gantt/GanttContextMenu.svelte' },
    { path: 'context.ts', target: 'components/ui/gantt/context.ts' },
    { path: 'types.ts', target: 'components/ui/gantt/types.ts' },
    { path: 'index.ts', target: 'components/ui/gantt/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  registryDependencies: ['https://uipkge.dev/r/button.json', 'https://uipkge.dev/r/context-menu.json'],
})

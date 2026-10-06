import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'gantt',
  type: 'registry:ui',
  categories: ['data-display'],
  framework: 'angular',
  description:
    'Interactive Gantt chart primitive with multi-scale timeline (day/week/month/year), collapsible task tree, progress fill, milestone markers, dependency lines, and right-click GanttContextMenu.',
  files: [
    { path: 'gantt.component.ts', target: 'components/ui/gantt/gantt.component.ts' },
    { path: 'types.ts', target: 'components/ui/gantt/types.ts' },
    { path: 'index.ts', target: 'components/ui/gantt/index.ts' },
  ],
  dependencies: ['lucide-angular'],
  registryDependencies: ['https://uipkge.dev/r/button.json', 'https://uipkge.dev/r/context-menu.json'],
})

import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'gantt-chart',
  type: 'registry:ui',
  categories: ['chart'],
  description: 'React mirror of @uipkge/gantt-chart — see the Vue registry item for the canonical description.',
  files: [
    { path: 'GanttChart.tsx', target: 'components/ui/charts/gantt-chart/GanttChart.tsx' },
    { path: 'index.ts', target: 'components/ui/charts/gantt-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
    { path: '../shared.tsx', target: 'components/ui/charts/shared.tsx' },
  ],
  dependencies: ['echarts', 'echarts-for-react'],
  registryDependencies: [],
})

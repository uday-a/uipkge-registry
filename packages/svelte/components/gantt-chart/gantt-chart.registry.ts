import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'gantt-chart',
  type: 'registry:ui',
  categories: ['chart'],
  framework: 'svelte',
  description:
    'Gantt chart around Apache ECharts custom series. Date-range bars on a time axis with per-task progress shading. Theme-aware via registry tokens.',
  files: [
    { path: 'GanttChart.svelte', target: 'components/ui/charts/gantt-chart/GanttChart.svelte' },
    { path: 'index.ts', target: 'components/ui/charts/gantt-chart/index.ts' },
    { path: 'useChartTheme.svelte.ts', target: 'components/ui/charts/useChartTheme.svelte.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

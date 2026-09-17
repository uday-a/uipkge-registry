import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'gantt-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Gantt chart around Apache ECharts custom series. Date-range bars on a time axis with per-task progress shading. Theme-aware via registry tokens.',
  files: [
    { path: 'GanttChart.vue', target: 'components/ui/charts/gantt-chart/GanttChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/gantt-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: [],
})

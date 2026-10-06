import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'gantt-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Gantt chart around Apache ECharts custom series. Date-range bars on a time axis with per-task progress shading. Theme-aware via registry tokens.',
  files: [
    { path: 'gantt-chart.component.ts', target: 'components/ui/charts/gantt-chart/gantt-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/gantt-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

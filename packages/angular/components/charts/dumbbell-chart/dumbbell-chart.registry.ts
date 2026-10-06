import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'dumbbell-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Dumbbell chart around Apache ECharts custom series. Before/after dots joined per category for change comparison. Theme-aware via registry tokens.',
  files: [
    { path: 'dumbbell-chart.component.ts', target: 'components/ui/charts/dumbbell-chart/dumbbell-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/dumbbell-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

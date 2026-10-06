import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'violin-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Violin chart around Apache ECharts custom series. Gaussian-KDE density halves with quartile box, median dot, and whiskers per group. Theme-aware via registry tokens.',
  files: [
    { path: 'violin-chart.component.ts', target: 'components/ui/charts/violin-chart/violin-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/violin-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'error-bar-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Error-bar chart around Apache ECharts custom series. Mean bars with confidence-interval whiskers and caps. Theme-aware via registry tokens.',
  files: [
    {
      path: 'error-bar-chart.component.ts',
      target: 'components/ui/charts/error-bar-chart/error-bar-chart.component.ts',
    },
    { path: 'index.ts', target: 'components/ui/charts/error-bar-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'donut-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Donut chart wrapper around Apache ECharts. Ring chart with center total, legend and item tooltips. Theme-aware via registry tokens.',
  files: [
    { path: 'donut-chart.component.ts', target: 'components/ui/charts/donut-chart/donut-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/donut-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

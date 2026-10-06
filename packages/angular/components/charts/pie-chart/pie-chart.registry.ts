import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'pie-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Pie chart wrapper around Apache ECharts. Category share with slice labels, legend and item tooltips. Theme-aware via registry tokens.',
  files: [
    { path: 'pie-chart.component.ts', target: 'components/ui/charts/pie-chart/pie-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/pie-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

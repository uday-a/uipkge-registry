import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'parallel-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Parallel coordinates wrapper around Apache ECharts. Plots high-dimensional rows as polylines across N axes — useful for spotting correlations and outlier clusters.',
  files: [
    { path: 'parallel-chart.component.ts', target: 'components/ui/charts/parallel-chart/parallel-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/parallel-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'bar-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Bar chart wrapper around Apache ECharts. Vertical, horizontal, grouped, stacked, and negative-value variants. Theme-aware via registry tokens.',
  files: [
    { path: 'bar-chart.component.ts', target: 'components/ui/charts/bar-chart/bar-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/bar-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

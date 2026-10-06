import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'boxplot-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Box-and-whisker plot wrapper around Apache ECharts. Five-number summary (min, Q1, median, Q3, max) per category. Vertical or horizontal.',
  files: [
    { path: 'boxplot-chart.component.ts', target: 'components/ui/charts/boxplot-chart/boxplot-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/boxplot-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

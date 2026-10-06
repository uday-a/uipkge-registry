import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'boxplot-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Box-and-whisker plot wrapper around Apache ECharts. Five-number summary (min, Q1, median, Q3, max) per category. Vertical or horizontal.',
  files: [
    { path: 'BoxplotChart.svelte', target: 'components/ui/boxplot-chart/BoxplotChart.svelte' },
    { path: 'chart-theme.svelte.ts', target: 'components/ui/boxplot-chart/chart-theme.svelte.ts' },
    { path: 'index.ts', target: 'components/ui/boxplot-chart/index.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

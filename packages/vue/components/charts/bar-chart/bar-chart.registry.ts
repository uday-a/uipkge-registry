import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'bar-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Bar chart wrapper around Apache ECharts. Vertical, horizontal, grouped, stacked, and negative-value variants. Theme-aware via registry tokens.',
  files: [
    { path: 'BarChart.vue', target: 'components/ui/charts/bar-chart/BarChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/bar-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: [],
})

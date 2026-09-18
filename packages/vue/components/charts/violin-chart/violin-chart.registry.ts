import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'violin-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Violin chart around Apache ECharts custom series. Gaussian-KDE density halves with quartile box, median dot, and whiskers per group. Theme-aware via registry tokens.',
  files: [
    { path: 'ViolinChart.vue', target: 'components/ui/charts/violin-chart/ViolinChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/violin-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: [],
})

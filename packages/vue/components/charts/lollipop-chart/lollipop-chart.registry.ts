import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'lollipop-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Lollipop chart around Apache ECharts. Thin stems with dot endpoints and value labels. Theme-aware via registry tokens.',
  files: [
    { path: 'LollipopChart.vue', target: 'components/ui/charts/lollipop-chart/LollipopChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/lollipop-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: [],
})

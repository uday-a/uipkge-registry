import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'bubble-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Bubble chart around Apache ECharts. XY scatter with a third dimension encoded in bubble area. Theme-aware via registry tokens.',
  files: [
    { path: 'BubbleChart.vue', target: 'components/ui/charts/bubble-chart/BubbleChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/bubble-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: [],
})

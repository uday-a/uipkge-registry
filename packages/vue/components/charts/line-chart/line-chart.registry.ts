import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'line-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Line chart wrapper around Apache ECharts. Smooth/stepped/dashed lines, multi-series, point markers. Theme-aware via registry tokens.',
  files: [
    { path: 'LineChart.vue', target: 'components/ui/charts/line-chart/LineChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/line-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: [],
})

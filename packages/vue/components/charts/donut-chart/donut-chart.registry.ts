import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'donut-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Donut chart wrapper around Apache ECharts. Full and half (semicircle) types, adjustable ring thickness down to a filled pie, rounded segments, gaps, and a centre KPI total. Theme-aware via registry tokens.',
  files: [
    { path: 'DonutChart.vue', target: 'components/ui/charts/donut-chart/DonutChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/donut-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'radar-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Radar (spider) chart wrapper around Apache ECharts. Multi-series with optional fill. Theme-aware via registry tokens.',
  files: [
    { path: 'RadarChart.vue', target: 'components/ui/charts/radar-chart/RadarChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/radar-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: [],
})

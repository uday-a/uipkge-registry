import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'bar-race-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Animated bar-race chart around Apache ECharts. Auto-advancing ranked frames with smooth resort transitions. Theme-aware via registry tokens.',
  files: [
    { path: 'BarRaceChart.vue', target: 'components/ui/charts/bar-race-chart/BarRaceChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/bar-race-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: [],
})

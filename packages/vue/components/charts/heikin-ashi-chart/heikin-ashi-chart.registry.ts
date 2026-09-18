import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'heikin-ashi-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Heikin-Ashi chart around Apache ECharts. OHLC is averaged candle-over-candle in the wrapper so trends read as uninterrupted bull/bear runs. Theme-aware via registry tokens.',
  files: [
    { path: 'HeikinAshiChart.vue', target: 'components/ui/charts/heikin-ashi-chart/HeikinAshiChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/heikin-ashi-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'candlestick-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'OHLC candlestick wrapper around Apache ECharts. Bullish/bearish coloring from registry tokens, optional data-zoom slider, axis-cross pointer.',
  files: [
    { path: 'CandlestickChart.vue', target: 'components/ui/charts/candlestick-chart/CandlestickChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/candlestick-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: [],
})

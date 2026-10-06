import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'candlestick-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'OHLC candlestick wrapper around Apache ECharts. Bullish/bearish coloring from registry tokens, optional data-zoom slider, axis-cross pointer.',
  files: [
    { path: 'CandlestickChart.svelte', target: 'components/ui/candlestick-chart/CandlestickChart.svelte' },
    { path: 'chart-theme.ts', target: 'components/ui/candlestick-chart/chart-theme.ts' },
    { path: 'index.ts', target: 'components/ui/candlestick-chart/index.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

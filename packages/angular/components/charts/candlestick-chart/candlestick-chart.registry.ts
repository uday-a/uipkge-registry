import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'candlestick-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'OHLC candlestick wrapper around Apache ECharts. Bullish/bearish coloring from registry tokens, optional data-zoom slider, axis-cross pointer.',
  files: [
    {
      path: 'candlestick-chart.component.ts',
      target: 'components/ui/charts/candlestick-chart/candlestick-chart.component.ts',
    },
    { path: 'index.ts', target: 'components/ui/charts/candlestick-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'heikin-ashi-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Heikin-Ashi chart around Apache ECharts. OHLC is averaged candle-over-candle in the wrapper so trends read as uninterrupted bull/bear runs. Theme-aware via registry tokens.',
  files: [
    {
      path: 'heikin-ashi-chart.component.ts',
      target: 'components/ui/charts/heikin-ashi-chart/heikin-ashi-chart.component.ts',
    },
    { path: 'index.ts', target: 'components/ui/charts/heikin-ashi-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

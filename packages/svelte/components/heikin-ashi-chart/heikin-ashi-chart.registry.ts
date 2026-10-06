import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'heikin-ashi-chart',
  type: 'registry:ui',
  categories: ['chart'],
  framework: 'svelte',
  description:
    'Heikin-Ashi chart around Apache ECharts. OHLC is averaged candle-over-candle in the wrapper so trends read as uninterrupted bull/bear runs. Theme-aware via registry tokens.',
  files: [
    { path: 'HeikinAshiChart.svelte', target: 'components/ui/heikin-ashi-chart/HeikinAshiChart.svelte' },
    { path: 'chart-theme.ts', target: 'components/ui/heikin-ashi-chart/chart-theme.ts' },
    { path: 'index.ts', target: 'components/ui/heikin-ashi-chart/index.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'histogram-chart',
  type: 'registry:ui',
  categories: ['chart'],
  framework: 'svelte',
  description:
    'Histogram wrapper around Apache ECharts. Auto-bins raw values or renders pre-binned counts with zero-gap bars and a highlighted peak. Theme-aware via registry tokens.',
  files: [
    { path: 'HistogramChart.svelte', target: 'components/ui/histogram-chart/HistogramChart.svelte' },
    { path: 'chart-theme.ts', target: 'components/ui/histogram-chart/chart-theme.ts' },
    { path: 'index.ts', target: 'components/ui/histogram-chart/index.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

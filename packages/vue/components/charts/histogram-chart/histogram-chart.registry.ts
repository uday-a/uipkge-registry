import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'histogram-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Histogram wrapper around Apache ECharts. Auto-bins raw values or renders pre-binned counts with zero-gap bars and a highlighted peak. Theme-aware via registry tokens.',
  files: [
    { path: 'HistogramChart.vue', target: 'components/ui/charts/histogram-chart/HistogramChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/histogram-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'waterfall-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Waterfall chart wrapper around Apache ECharts. Signed deltas accumulate from a transparent base, positives in teal and negatives in orange, with an optional computed Total bar. Theme-aware via registry tokens.',
  files: [
    { path: 'WaterfallChart.vue', target: 'components/ui/charts/waterfall-chart/WaterfallChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/waterfall-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: [],
})

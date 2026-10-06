import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'waterfall-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Waterfall chart wrapper around Apache ECharts. Signed deltas accumulate from a transparent base, positives in teal and negatives in orange, with an optional computed Total bar. Theme-aware via registry tokens.',
  files: [
    { path: 'WaterfallChart.svelte', target: 'components/ui/waterfall-chart/WaterfallChart.svelte' },
    { path: 'index.ts', target: 'components/ui/waterfall-chart/index.ts' },
    { path: 'useChartTheme.svelte.ts', target: 'components/ui/waterfall-chart/useChartTheme.svelte.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

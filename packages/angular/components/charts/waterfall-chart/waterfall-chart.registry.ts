import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'waterfall-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Waterfall chart wrapper around Apache ECharts. Signed deltas accumulate from a transparent base, positives in teal and negatives in orange, with an optional computed Total bar. Theme-aware via registry tokens.',
  files: [
    {
      path: 'waterfall-chart.component.ts',
      target: 'components/ui/charts/waterfall-chart/waterfall-chart.component.ts',
    },
    { path: 'index.ts', target: 'components/ui/charts/waterfall-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

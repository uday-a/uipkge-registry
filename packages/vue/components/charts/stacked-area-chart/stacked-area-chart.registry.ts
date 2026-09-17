import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'stacked-area-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Stacked area chart around Apache ECharts. Absolute or 100% stream stacking with smooth curves. Theme-aware via registry tokens.',
  files: [
    { path: 'StackedAreaChart.vue', target: 'components/ui/charts/stacked-area-chart/StackedAreaChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/stacked-area-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: [],
})

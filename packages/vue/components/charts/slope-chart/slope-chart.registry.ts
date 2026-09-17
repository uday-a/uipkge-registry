import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'slope-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Slope and bump chart around Apache ECharts. Rank or value lines across two (slope) or many (bump) points with end labels. Theme-aware via registry tokens.',
  files: [
    { path: 'SlopeChart.vue', target: 'components/ui/charts/slope-chart/SlopeChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/slope-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'treemap-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Treemap wrapper around Apache ECharts. Hierarchical area-by-value visualization with nested and color-by-value variants. Theme-aware via registry tokens.',
  files: [
    { path: 'TreemapChart.vue', target: 'components/ui/charts/treemap-chart/TreemapChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/treemap-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: [],
})

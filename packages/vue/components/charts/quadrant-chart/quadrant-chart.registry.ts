import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'quadrant-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Quadrant (2×2 matrix) chart around Apache ECharts. Median-split scatter with labelled strategy quadrants. Theme-aware via registry tokens.',
  files: [
    { path: 'QuadrantChart.vue', target: 'components/ui/charts/quadrant-chart/QuadrantChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/quadrant-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: [],
})

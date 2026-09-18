import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'population-pyramid-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Population pyramid (mirrored bar) chart around Apache ECharts. Back-to-back horizontal bars with absolute-value labels. Theme-aware via registry tokens.',
  files: [
    {
      path: 'PopulationPyramidChart.vue',
      target: 'components/ui/charts/population-pyramid-chart/PopulationPyramidChart.vue',
    },
    { path: 'index.ts', target: 'components/ui/charts/population-pyramid-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: [],
})

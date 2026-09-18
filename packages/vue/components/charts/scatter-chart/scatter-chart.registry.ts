import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'scatter-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Scatter / bubble chart wrapper around Apache ECharts. Optional point sizing and categorical coloring. Theme-aware via registry tokens.',
  files: [
    { path: 'ScatterChart.vue', target: 'components/ui/charts/scatter-chart/ScatterChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/scatter-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: [],
})

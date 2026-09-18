import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'polar-bar-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Radial bar chart on the ECharts polar coordinate system. Categories around the radius axis with rounded caps. Theme-aware via registry tokens.',
  files: [
    { path: 'PolarBarChart.vue', target: 'components/ui/charts/polar-bar-chart/PolarBarChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/polar-bar-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: [],
})

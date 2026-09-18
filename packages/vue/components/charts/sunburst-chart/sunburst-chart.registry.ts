import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'sunburst-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Sunburst wrapper around Apache ECharts. Concentric-ring hierarchical share visualization — pairs naturally with treemap for comparison.',
  files: [
    { path: 'SunburstChart.vue', target: 'components/ui/charts/sunburst-chart/SunburstChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/sunburst-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: [],
})

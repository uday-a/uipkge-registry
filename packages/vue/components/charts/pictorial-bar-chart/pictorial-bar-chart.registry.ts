import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'pictorial-bar-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Pictorial bar chart around Apache ECharts. Repeated symbols fill to the value with a configurable symbol shape. Theme-aware via registry tokens.',
  files: [
    { path: 'PictorialBarChart.vue', target: 'components/ui/charts/pictorial-bar-chart/PictorialBarChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/pictorial-bar-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: [],
})

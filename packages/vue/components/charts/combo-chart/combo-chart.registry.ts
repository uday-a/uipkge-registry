import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'combo-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Combo bar + line chart with dual axes around Apache ECharts. Bars on the left axis, smooth lines on the right axis, shared legend. Theme-aware via registry tokens.',
  files: [
    { path: 'ComboChart.vue', target: 'components/ui/charts/combo-chart/ComboChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/combo-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: [],
})

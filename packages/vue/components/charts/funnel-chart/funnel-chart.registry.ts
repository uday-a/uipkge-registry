import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'funnel-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Funnel chart wrapper around Apache ECharts. Conversion-stage visualization with inverted and percentage-label variants. Theme-aware via registry tokens.',
  files: [
    { path: 'FunnelChart.vue', target: 'components/ui/charts/funnel-chart/FunnelChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/funnel-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: [],
})

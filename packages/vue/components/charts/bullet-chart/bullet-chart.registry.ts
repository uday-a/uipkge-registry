import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'bullet-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Bullet chart for KPI vs target around Apache ECharts. Qualitative background bands, a foreground actual bar, and a target marker per row. Theme-aware via registry tokens.',
  files: [
    { path: 'BulletChart.vue', target: 'components/ui/charts/bullet-chart/BulletChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/bullet-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'gauge-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Gauge / speedometer wrapper around Apache ECharts. Threshold-banded stoplight (teal/amber/red), progress-ring, and multi-needle variants. Theme-aware via registry tokens.',
  files: [
    { path: 'GaugeChart.vue', target: 'components/ui/charts/gauge-chart/GaugeChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/gauge-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: [],
})

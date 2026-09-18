import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'control-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Control (SPC) chart around Apache ECharts. Run line with auto-computed mean ± 2σ limits; out-of-spec points turn red. Theme-aware via registry tokens.',
  files: [
    { path: 'ControlChart.vue', target: 'components/ui/charts/control-chart/ControlChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/control-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: [],
})

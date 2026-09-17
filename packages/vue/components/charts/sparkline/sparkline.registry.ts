import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'sparkline',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Inline micro-chart for KPI tiles. Line, area, bar, and win/loss variants. Theme-aware via registry tokens.',
  files: [
    { path: 'Sparkline.vue', target: 'components/ui/charts/sparkline/Sparkline.vue' },
    { path: 'index.ts', target: 'components/ui/charts/sparkline/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: [],
})

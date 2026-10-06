import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'combo-chart',
  type: 'registry:ui',
  categories: ['chart'],
  framework: 'svelte',
  description:
    'Combo bar + line chart with dual axes around Apache ECharts. Bars on the left axis, smooth lines on the right axis, shared legend. Theme-aware via registry tokens.',
  files: [
    { path: 'ComboChart.svelte', target: 'components/ui/combo-chart/ComboChart.svelte' },
    { path: 'useChartTheme.ts', target: 'components/ui/combo-chart/useChartTheme.ts' },
    { path: 'index.ts', target: 'components/ui/combo-chart/index.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

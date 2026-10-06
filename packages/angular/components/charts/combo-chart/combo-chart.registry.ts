import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'combo-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Combo bar + line chart with dual axes around Apache ECharts. Bars on the left axis, smooth lines on the right axis, shared legend. Theme-aware via registry tokens.',
  files: [
    { path: 'combo-chart.component.ts', target: 'components/ui/charts/combo-chart/combo-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/combo-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

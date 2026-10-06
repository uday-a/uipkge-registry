import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'gauge-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Gauge chart wrapper around Apache ECharts. Single-value dial with progress arc and animated detail readout. Theme-aware via registry tokens.',
  files: [
    { path: 'gauge-chart.component.ts', target: 'components/ui/charts/gauge-chart/gauge-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/gauge-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

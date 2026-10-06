import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'bar-race-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Animated bar-race chart around Apache ECharts. Auto-advancing ranked frames with smooth resort transitions. Theme-aware via registry tokens.',
  files: [
    { path: 'bar-race-chart.component.ts', target: 'components/ui/charts/bar-race-chart/bar-race-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/bar-race-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

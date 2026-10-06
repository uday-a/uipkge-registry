import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'bubble-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Bubble chart around Apache ECharts. XY scatter with a third dimension encoded in bubble area. Theme-aware via registry tokens.',
  files: [
    { path: 'bubble-chart.component.ts', target: 'components/ui/charts/bubble-chart/bubble-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/bubble-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

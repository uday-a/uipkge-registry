import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'radar-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Radar chart wrapper around Apache ECharts. Multi-axis spider plot for profile comparison. Theme-aware via registry tokens.',
  files: [
    { path: 'radar-chart.component.ts', target: 'components/ui/charts/radar-chart/radar-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/radar-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'line-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Line chart wrapper around Apache ECharts. Smooth/stepped/dashed lines, multi-series, point markers. Theme-aware via registry tokens.',
  files: [
    { path: 'line-chart.component.ts', target: 'components/ui/charts/line-chart/line-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/line-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'area-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Area chart wrapper around Apache ECharts. Smooth/stacked fills, multi-series, point markers. Theme-aware via registry tokens.',
  files: [
    { path: 'area-chart.component.ts', target: 'components/ui/charts/area-chart/area-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/area-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'treemap-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Treemap chart wrapper around Apache ECharts. Nested rectangles sized by value with breadcrumb navigation. Theme-aware via registry tokens.',
  files: [
    { path: 'treemap-chart.component.ts', target: 'components/ui/charts/treemap-chart/treemap-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/treemap-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

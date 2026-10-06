import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'sunburst-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Sunburst wrapper around Apache ECharts. Concentric-ring hierarchical share visualization — pairs naturally with treemap for comparison.',
  files: [
    { path: 'sunburst-chart.component.ts', target: 'components/ui/charts/sunburst-chart/sunburst-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/sunburst-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

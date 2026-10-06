import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'sankey-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Sankey chart wrapper around Apache ECharts. Flow diagram with gradient links and adjacency focus. Theme-aware via registry tokens.',
  files: [
    { path: 'sankey-chart.component.ts', target: 'components/ui/charts/sankey-chart/sankey-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/sankey-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

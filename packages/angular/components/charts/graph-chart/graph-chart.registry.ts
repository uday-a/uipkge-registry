import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'graph-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Network / graph chart wrapper around Apache ECharts. Force-directed, circular, or manual layouts; directed or undirected edges; optional category coloring. Useful for service maps, social graphs, knowledge bases.',
  files: [
    { path: 'graph-chart.component.ts', target: 'components/ui/charts/graph-chart/graph-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/graph-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

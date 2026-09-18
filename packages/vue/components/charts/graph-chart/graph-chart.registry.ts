import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'graph-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Network / graph chart wrapper around Apache ECharts. Force-directed, circular, or manual layouts; directed or undirected edges; optional category coloring. Useful for service maps, social graphs, knowledge bases.',
  files: [
    { path: 'GraphChart.vue', target: 'components/ui/charts/graph-chart/GraphChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/graph-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: [],
})

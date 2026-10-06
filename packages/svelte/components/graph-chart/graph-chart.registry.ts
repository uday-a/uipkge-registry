import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'graph-chart',
  type: 'registry:ui',
  categories: ['chart'],
  framework: 'svelte',
  description:
    'Network / graph chart wrapper around Apache ECharts. Force-directed, circular, or manual layouts; directed or undirected edges; optional category coloring. Useful for service maps, social graphs, knowledge bases.',
  files: [
    { path: 'GraphChart.svelte', target: 'components/ui/charts/graph-chart/GraphChart.svelte' },
    { path: 'index.ts', target: 'components/ui/charts/graph-chart/index.ts' },
    { path: 'useChartTheme.svelte.ts', target: 'components/ui/charts/useChartTheme.svelte.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

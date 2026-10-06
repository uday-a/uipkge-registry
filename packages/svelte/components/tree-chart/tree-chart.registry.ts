import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'tree-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Hierarchical tree wrapper around Apache ECharts. Orthogonal (LR/TB/RL/BT) or radial layout, optional roam, focus-on-hover for descendants.',
  files: [
    { path: 'TreeChart.svelte', target: 'components/ui/tree-chart/TreeChart.svelte' },
    { path: 'chart-theme.ts', target: 'components/ui/tree-chart/chart-theme.ts' },
    { path: 'index.ts', target: 'components/ui/tree-chart/index.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

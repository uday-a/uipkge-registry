import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'tree-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Hierarchical tree wrapper around Apache ECharts. Orthogonal (LR/TB/RL/BT) or radial layout, optional roam, focus-on-hover for descendants.',
  files: [
    { path: 'TreeChart.vue', target: 'components/ui/charts/tree-chart/TreeChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/tree-chart/index.ts' },
    { path: '../useChartTheme.ts', target: 'components/ui/charts/useChartTheme.ts' },
  ],
  dependencies: ['echarts', 'vue-echarts'],
  registryDependencies: [],
})

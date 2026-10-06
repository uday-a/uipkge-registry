import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'tree-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Hierarchical tree wrapper around Apache ECharts. Orthogonal (LR/TB/RL/BT) or radial layout, optional roam, focus-on-hover for descendants.',
  files: [
    { path: 'tree-chart.component.ts', target: 'components/ui/charts/tree-chart/tree-chart.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/tree-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

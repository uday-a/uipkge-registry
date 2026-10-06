import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'treemap-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Treemap wrapper around Apache ECharts. Hierarchical area-by-value visualization with nested and color-by-value variants. Theme-aware via registry tokens.',
  files: [
    { path: 'TreemapChart.svelte', target: 'components/ui/treemap-chart/TreemapChart.svelte' },
    { path: 'chart-theme.ts', target: 'components/ui/treemap-chart/chart-theme.ts' },
    { path: 'index.ts', target: 'components/ui/treemap-chart/index.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

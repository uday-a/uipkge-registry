import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'sankey-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Sankey flow diagram wrapper around Apache ECharts. Visualizes value flows between named nodes (channels, stages, sources). Gradient links + theme-aware tokens.',
  files: [
    { path: 'SankeyChart.svelte', target: 'components/ui/sankey-chart/SankeyChart.svelte' },
    { path: 'index.ts', target: 'components/ui/sankey-chart/index.ts' },
    { path: 'chart-theme.ts', target: 'components/ui/sankey-chart/chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

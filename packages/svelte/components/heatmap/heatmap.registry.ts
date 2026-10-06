import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'heatmap',
  type: 'registry:ui',
  categories: ['chart'],
  framework: 'svelte',
  description: 'Grid heatmap wrapper around Apache ECharts with visualMap color ramp. Theme-aware via registry tokens.',
  files: [
    { path: 'Heatmap.svelte', target: 'components/ui/heatmap/Heatmap.svelte' },
    { path: 'chart-theme.ts', target: 'components/ui/heatmap/chart-theme.ts' },
    { path: 'index.ts', target: 'components/ui/heatmap/index.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

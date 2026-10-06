import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'bubble-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Bubble chart around Apache ECharts. XY scatter with a third dimension encoded in bubble area. Theme-aware via registry tokens.',
  files: [
    { path: 'BubbleChart.svelte', target: 'components/ui/bubble-chart/BubbleChart.svelte' },
    { path: 'chart-theme.ts', target: 'components/ui/bubble-chart/chart-theme.ts' },
    { path: 'index.ts', target: 'components/ui/bubble-chart/index.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

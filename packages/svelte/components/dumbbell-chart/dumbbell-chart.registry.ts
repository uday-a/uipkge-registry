import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'dumbbell-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Dumbbell chart around Apache ECharts custom series. Before/after dots joined per category for change comparison. Theme-aware via registry tokens.',
  files: [
    { path: 'DumbbellChart.svelte', target: 'components/ui/dumbbell-chart/DumbbellChart.svelte' },
    { path: 'index.ts', target: 'components/ui/dumbbell-chart/index.ts' },
    { path: 'chart-theme.ts', target: 'components/ui/dumbbell-chart/chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

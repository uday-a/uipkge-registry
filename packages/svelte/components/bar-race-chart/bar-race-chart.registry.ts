import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'bar-race-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Animated bar-race chart around Apache ECharts. Auto-advancing ranked frames with smooth resort transitions. Theme-aware via registry tokens.',
  files: [
    { path: 'BarRaceChart.svelte', target: 'components/ui/bar-race-chart/BarRaceChart.svelte' },
    { path: 'chart-theme.svelte.ts', target: 'components/ui/bar-race-chart/chart-theme.svelte.ts' },
    { path: 'index.ts', target: 'components/ui/bar-race-chart/index.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

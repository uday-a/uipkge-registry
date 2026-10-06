import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'slope-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Slope and bump chart around Apache ECharts. Rank or value lines across two (slope) or many (bump) points with end labels. Theme-aware via registry tokens.',
  files: [
    { path: 'SlopeChart.svelte', target: 'components/ui/slope-chart/SlopeChart.svelte' },
    { path: 'index.ts', target: 'components/ui/slope-chart/index.ts' },
    { path: 'useChartTheme.ts', target: 'components/ui/slope-chart/useChartTheme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

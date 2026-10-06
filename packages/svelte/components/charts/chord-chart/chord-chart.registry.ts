import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'chord-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Chord diagram around Apache ECharts. Circular nodes with weighted ribbons and adjacency focus. ECharts is driven directly (init + ResizeObserver autoresize, no wrapper dependency) and themed via registry tokens.',
  files: [
    { path: 'ChordChart.svelte', target: 'components/ui/charts/chord-chart/ChordChart.svelte' },
    { path: 'index.ts', target: 'components/ui/charts/chord-chart/index.ts' },
    { path: '../useChartTheme.svelte.ts', target: 'components/ui/charts/useChartTheme.svelte.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

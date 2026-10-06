import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'quadrant-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Quadrant (2×2 matrix) chart around Apache ECharts. Median-split scatter with labelled strategy quadrants. Theme-aware via registry tokens.',
  files: [
    { path: 'QuadrantChart.svelte', target: 'components/ui/quadrant-chart/QuadrantChart.svelte' },
    { path: 'index.ts', target: 'components/ui/quadrant-chart/index.ts' },
    { path: 'useChartTheme.svelte.ts', target: 'components/ui/quadrant-chart/useChartTheme.svelte.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

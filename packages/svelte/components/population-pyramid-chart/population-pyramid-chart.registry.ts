import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'population-pyramid-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Population pyramid (mirrored bar) chart around Apache ECharts. Back-to-back horizontal bars with absolute-value labels. Theme-aware via registry tokens.',
  files: [
    {
      path: 'PopulationPyramidChart.svelte',
      target: 'components/ui/population-pyramid-chart/PopulationPyramidChart.svelte',
    },
    { path: 'index.ts', target: 'components/ui/population-pyramid-chart/index.ts' },
    { path: 'useChartTheme.svelte.ts', target: 'components/ui/population-pyramid-chart/useChartTheme.svelte.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

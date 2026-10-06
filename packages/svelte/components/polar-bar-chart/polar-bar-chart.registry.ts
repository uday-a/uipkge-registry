import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'polar-bar-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Radial bar chart on the ECharts polar coordinate system. Categories around the radius axis with rounded caps. Theme-aware via registry tokens.',
  files: [
    { path: 'PolarBarChart.svelte', target: 'components/ui/polar-bar-chart/PolarBarChart.svelte' },
    { path: 'index.ts', target: 'components/ui/polar-bar-chart/index.ts' },
    { path: 'useChartTheme.svelte.ts', target: 'components/ui/polar-bar-chart/useChartTheme.svelte.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

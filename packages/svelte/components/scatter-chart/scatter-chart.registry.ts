import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'scatter-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Scatter / bubble chart wrapper around Apache ECharts. Optional point sizing and categorical coloring. Theme-aware via registry tokens.',
  files: [
    { path: 'ScatterChart.svelte', target: 'components/ui/scatter-chart/ScatterChart.svelte' },
    { path: 'index.ts', target: 'components/ui/scatter-chart/index.ts' },
    { path: 'chart-theme.ts', target: 'components/ui/scatter-chart/chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

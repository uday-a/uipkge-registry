import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'gauge-chart',
  type: 'registry:ui',
  categories: ['chart'],
  framework: 'svelte',
  description:
    'Gauge / speedometer wrapper around Apache ECharts. Threshold-banded stoplight (teal/amber/red), progress-ring, and multi-needle variants. Theme-aware via registry tokens.',
  files: [
    { path: 'GaugeChart.svelte', target: 'components/ui/charts/gauge-chart/GaugeChart.svelte' },
    { path: 'index.ts', target: 'components/ui/charts/gauge-chart/index.ts' },
    { path: 'useChartTheme.svelte.ts', target: 'components/ui/charts/useChartTheme.svelte.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'funnel-chart',
  type: 'registry:ui',
  categories: ['chart'],
  framework: 'svelte',
  description:
    'Funnel chart wrapper around Apache ECharts. Conversion-stage visualization with inverted and percentage-label variants. Theme-aware via registry tokens.',
  files: [
    { path: 'FunnelChart.svelte', target: 'components/ui/charts/funnel-chart/FunnelChart.svelte' },
    { path: 'index.ts', target: 'components/ui/charts/funnel-chart/index.ts' },
    { path: 'useChartTheme.svelte.ts', target: 'components/ui/charts/useChartTheme.svelte.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

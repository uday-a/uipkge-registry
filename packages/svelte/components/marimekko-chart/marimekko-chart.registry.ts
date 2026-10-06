import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'marimekko-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Marimekko (mosaic) chart around Apache ECharts custom series. Column widths encode column totals, stacked segments encode within-column shares, with in-canvas labels. Theme-aware via registry tokens.',
  files: [
    { path: 'MarimekkoChart.svelte', target: 'components/ui/marimekko-chart/MarimekkoChart.svelte' },
    { path: 'index.ts', target: 'components/ui/marimekko-chart/index.ts' },
    { path: 'useChartTheme.ts', target: 'components/ui/marimekko-chart/useChartTheme.ts' },
  ],
  // No vue-echarts equivalent: the component drives echarts.init directly
  // with a ResizeObserver autoresize.
  dependencies: ['echarts'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'nightingale-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Nightingale (rose) chart around Apache ECharts. Radius-encoded pie with rounded segments. Theme-aware via registry tokens.',
  files: [
    { path: 'NightingaleChart.svelte', target: 'components/ui/nightingale-chart/NightingaleChart.svelte' },
    { path: 'index.ts', target: 'components/ui/nightingale-chart/index.ts' },
    { path: 'useChartTheme.ts', target: 'components/ui/nightingale-chart/useChartTheme.ts' },
  ],
  // No vue-echarts equivalent: the component drives echarts.init directly
  // with a ResizeObserver autoresize.
  dependencies: ['echarts'],
  registryDependencies: [],
})

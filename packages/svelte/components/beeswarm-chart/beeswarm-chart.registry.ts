import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'beeswarm-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Beeswarm (jittered strip) plot around Apache ECharts. One dot per observation grouped on rows with deterministic jitter. Theme-aware via registry tokens.',
  files: [
    { path: 'BeeswarmChart.svelte', target: 'components/ui/beeswarm-chart/BeeswarmChart.svelte' },
    { path: 'chart-theme.svelte.ts', target: 'components/ui/beeswarm-chart/chart-theme.svelte.ts' },
    { path: 'index.ts', target: 'components/ui/beeswarm-chart/index.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

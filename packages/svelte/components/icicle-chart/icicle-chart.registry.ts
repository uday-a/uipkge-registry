import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'icicle-chart',
  type: 'registry:ui',
  categories: ['chart'],
  framework: 'svelte',
  description:
    'Icicle (partition) chart around Apache ECharts custom series — ECharts ships no icicle series, so this partitions one rect per node top-down with in-canvas labels. Theme-aware via registry tokens.',
  files: [
    { path: 'IcicleChart.svelte', target: 'components/ui/icicle-chart/IcicleChart.svelte' },
    { path: 'chart-theme.ts', target: 'components/ui/icicle-chart/chart-theme.ts' },
    { path: 'index.ts', target: 'components/ui/icicle-chart/index.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

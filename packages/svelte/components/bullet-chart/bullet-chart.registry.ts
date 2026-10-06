import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'bullet-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Bullet chart for KPI vs target around Apache ECharts. Qualitative background bands, a foreground actual bar, and a target marker per row. Theme-aware via registry tokens.',
  files: [
    { path: 'BulletChart.svelte', target: 'components/ui/bullet-chart/BulletChart.svelte' },
    { path: 'chart-theme.ts', target: 'components/ui/bullet-chart/chart-theme.ts' },
    { path: 'index.ts', target: 'components/ui/bullet-chart/index.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

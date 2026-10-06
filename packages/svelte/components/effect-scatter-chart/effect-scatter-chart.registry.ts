import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'effect-scatter-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Effect scatter chart with ripple animation around Apache ECharts. Highlights live points and alerts with a configurable ripple period. Theme-aware via registry tokens.',
  files: [
    { path: 'EffectScatterChart.svelte', target: 'components/ui/effect-scatter-chart/EffectScatterChart.svelte' },
    { path: 'index.ts', target: 'components/ui/effect-scatter-chart/index.ts' },
    { path: 'chart-theme.ts', target: 'components/ui/effect-scatter-chart/chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

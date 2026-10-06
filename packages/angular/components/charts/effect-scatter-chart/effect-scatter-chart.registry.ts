import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'effect-scatter-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Effect scatter chart with ripple animation around Apache ECharts. Highlights live points and alerts with a configurable ripple period. Theme-aware via registry tokens.',
  files: [
    {
      path: 'effect-scatter-chart.component.ts',
      target: 'components/ui/charts/effect-scatter-chart/effect-scatter-chart.component.ts',
    },
    { path: 'index.ts', target: 'components/ui/charts/effect-scatter-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

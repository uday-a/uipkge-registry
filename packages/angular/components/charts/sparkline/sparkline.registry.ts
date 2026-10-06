import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'sparkline',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Inline micro-chart for KPI tiles. Line, area, bar, and win/loss variants. Theme-aware via registry tokens.',
  files: [
    { path: 'sparkline.component.ts', target: 'components/ui/charts/sparkline/sparkline.component.ts' },
    { path: 'index.ts', target: 'components/ui/charts/sparkline/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

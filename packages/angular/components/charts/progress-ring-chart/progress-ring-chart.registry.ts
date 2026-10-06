import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'progress-ring-chart',
  type: 'registry:ui',
  framework: 'angular',
  categories: ['chart'],
  description:
    'Progress ring gauge as dependency-free SVG. Single or concentric rings with a centre summary. Picks up chart tokens via CSS variables.',
  files: [
    {
      path: 'progress-ring-chart.component.ts',
      target: 'components/ui/charts/progress-ring-chart/progress-ring-chart.component.ts',
    },
    { path: 'index.ts', target: 'components/ui/charts/progress-ring-chart/index.ts' },
    { path: '../use-chart-theme.ts', target: 'components/ui/charts/use-chart-theme.ts' },
  ],
  dependencies: ['echarts'],
  registryDependencies: [],
})

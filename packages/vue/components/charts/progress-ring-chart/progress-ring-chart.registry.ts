import { defineRegistryItem } from '../../../lib/define-registry'

export default defineRegistryItem({
  name: 'progress-ring-chart',
  type: 'registry:ui',
  framework: 'vue',
  categories: ['chart'],
  description:
    'Progress ring gauge as dependency-free SVG. Single or concentric rings with a centre summary. Picks up chart tokens via CSS variables.',
  files: [
    { path: 'ProgressRingChart.vue', target: 'components/ui/charts/progress-ring-chart/ProgressRingChart.vue' },
    { path: 'index.ts', target: 'components/ui/charts/progress-ring-chart/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

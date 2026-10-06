import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'progress-ring-chart',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Progress ring gauge as dependency-free SVG. Single or concentric rings with a centre summary. Picks up chart tokens via CSS variables.',
  files: [
    { path: 'ProgressRingChart.svelte', target: 'components/ui/progress-ring-chart/ProgressRingChart.svelte' },
    { path: 'index.ts', target: 'components/ui/progress-ring-chart/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

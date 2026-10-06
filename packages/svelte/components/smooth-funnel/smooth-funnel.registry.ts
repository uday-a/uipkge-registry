import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'smooth-funnel',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Smoothly tapering SVG funnel with cubic-bezier transitions between stages. Pure SVG (no ECharts). Each stage is colored independently and shows its own percent pill; a minHeight floor keeps tail stages visible at tiny percents.',
  files: [
    { path: 'SmoothFunnel.svelte', target: 'components/ui/smooth-funnel/SmoothFunnel.svelte' },
    { path: 'index.ts', target: 'components/ui/smooth-funnel/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

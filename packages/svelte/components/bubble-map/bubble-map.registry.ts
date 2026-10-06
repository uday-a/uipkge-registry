import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'bubble-map',
  type: 'registry:ui',
  framework: 'svelte',
  categories: ['chart'],
  description:
    'Proportional symbol bubble map as dependency-free SVG. Eliminates geographic landmass distortion by scaling circle areas to continuous quantitative values with mathematical square-root radius normalization, pulsating concentric ripple rings, multi-tier size legend, and interactive hover cards.',
  files: [
    { path: 'BubbleMap.svelte', target: 'components/ui/bubble-map/BubbleMap.svelte' },
    { path: 'index.ts', target: 'components/ui/bubble-map/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  registryDependencies: ['https://uipkge.dev/r/map.json'],
})

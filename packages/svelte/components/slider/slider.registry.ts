import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'slider',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'svelte',
  description:
    'Single-thumb slider — pick a value within a range. Optional tick marks, step size, and inline value display.',
  files: [
    { path: 'Slider.svelte', target: 'components/ui/slider/Slider.svelte' },
    { path: 'index.ts', target: 'components/ui/slider/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

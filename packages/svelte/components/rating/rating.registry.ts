import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'rating',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'svelte',
  description:
    'Star (or custom icon) rating control — pick a value from 1 to N. Read-only mode for displaying review averages, with half-step support.',
  files: [
    { path: 'Rating.svelte', target: 'components/ui/rating/Rating.svelte' },
    { path: 'index.ts', target: 'components/ui/rating/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

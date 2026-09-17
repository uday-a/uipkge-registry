import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'rating',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'vue',
  description:
    'Star (or custom icon) rating control — pick a value from 1 to N. Read-only mode for displaying review averages, with half-step support.',
  files: [
    { path: 'Rating.vue', target: 'components/ui/rating/Rating.vue' },
    { path: 'index.ts', target: 'components/ui/rating/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

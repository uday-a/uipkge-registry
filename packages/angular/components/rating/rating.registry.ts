import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'rating',
  type: 'registry:ui',
  categories: ['form'],
  framework: 'angular',
  description:
    'Star rating control (radiogroup of star buttons) with half-star support, keyboard control, clearable selection, tooltips, read-only display, sizes, densities and variants.',
  files: [
    { path: 'rating.component.ts', target: 'components/ui/rating/rating.component.ts' },
    { path: 'index.ts', target: 'components/ui/rating/index.ts' },
  ],
  dependencies: [],
  registryDependencies: ['https://uipkge.dev/r/popper.json'],
})

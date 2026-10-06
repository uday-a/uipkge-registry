import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'card',
  type: 'registry:ui',
  categories: ['layout'],
  framework: 'angular',
  description:
    'Bordered container with an opinionated header / content / footer layout. Use it as the wrapper around any self-contained block of content — settings panels, dashboard tiles, list cells.',
  files: [
    { path: 'card.component.ts', target: 'components/ui/card/card.component.ts' },
    { path: 'card.variants.ts', target: 'components/ui/card/card.variants.ts' },
    { path: 'index.ts', target: 'components/ui/card/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: [],
})

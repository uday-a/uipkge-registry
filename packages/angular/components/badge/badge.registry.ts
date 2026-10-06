import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'badge',
  type: 'registry:ui',
  categories: ['data-display'],
  framework: 'angular',
  description:
    'Small inline label for status, counts, or tags. Seven variants: default, secondary, destructive, outline, success, warning, info.',
  files: [
    { path: 'badge.component.ts', target: 'components/ui/badge/badge.component.ts' },
    { path: 'badge.variants.ts', target: 'components/ui/badge/badge.variants.ts' },
    { path: 'index.ts', target: 'components/ui/badge/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: [],
})

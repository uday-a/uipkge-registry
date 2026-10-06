import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'button',
  type: 'registry:ui',
  categories: ['control'],
  framework: 'angular',
  description:
    'Interactive button component with variants (default, destructive, outline, secondary, ghost, link), sizes, and standalone Angular API.',
  files: [
    { path: 'button.component.ts', target: 'components/ui/button/button.component.ts' },
    { path: 'button-group.component.ts', target: 'components/ui/button/button-group.component.ts' },
    { path: 'button.variants.ts', target: 'components/ui/button/button.variants.ts' },
    { path: 'index.ts', target: 'components/ui/button/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: [],
})

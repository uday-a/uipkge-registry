import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'fab',
  type: 'registry:ui',
  categories: ['control', 'navigation'],
  framework: 'vue',
  description:
    'Floating action button — a fixed or absolute positioned circular button for the primary screen action. Supports an icon (default), an extended label variant, mini/large sizes, four color variants, six anchor positions, and a disabled state.',
  files: [
    { path: 'Fab.vue', target: 'components/ui/fab/Fab.vue' },
    { path: 'fab.variants.ts', target: 'components/ui/fab/fab.variants.ts' },
    { path: 'index.ts', target: 'components/ui/fab/index.ts' },
  ],
  dependencies: ['class-variance-authority', 'reka-ui'],
  registryDependencies: [],
})

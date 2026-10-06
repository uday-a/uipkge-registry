import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'button',
  type: 'registry:ui',
  categories: ['control'],
  framework: 'svelte',
  description:
    'Interactive button component with variants (default, destructive, outline, secondary, ghost, link), sizes, and composite ButtonGroup container for segmented toolbars and split buttons.',
  files: [
    { path: 'Button.svelte', target: 'components/ui/button/Button.svelte' },
    { path: 'ButtonGroup.svelte', target: 'components/ui/button/ButtonGroup.svelte' },
    { path: 'button.variants.ts', target: 'components/ui/button/button.variants.ts' },
    { path: 'index.ts', target: 'components/ui/button/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: [],
})

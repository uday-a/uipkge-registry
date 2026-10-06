import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'icon-box',
  type: 'registry:ui',
  categories: ['data-display'],
  framework: 'svelte',
  description:
    'Icon container primitive with calibrated sizes (2xs to xl), surface variants (solid, outline, subtle, primary, muted), and 2.5D layered IconStack for empty states and feature hero cards.',
  files: [
    { path: 'IconBox.svelte', target: 'components/ui/icon-box/IconBox.svelte' },
    { path: 'IconStack.svelte', target: 'components/ui/icon-box/IconStack.svelte' },
    { path: 'index.ts', target: 'components/ui/icon-box/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

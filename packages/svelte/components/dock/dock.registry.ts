import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'dock',
  type: 'registry:ui',
  categories: ['navigation'],
  framework: 'svelte',
  description:
    'macOS-style dock menu with magnification on hover. Items expand as the cursor approaches using a cosine bell curve. Supports an items array (icon + label + handler), magnification scale, base size, tooltips on hover, click handlers, and an active state indicator.',
  files: [
    { path: 'Dock.svelte', target: 'components/ui/dock/Dock.svelte' },
    { path: 'index.ts', target: 'components/ui/dock/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

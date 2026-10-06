import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'kbd',
  type: 'registry:ui',
  categories: ['data-display'],
  framework: 'svelte',
  description:
    'Inline keyboard-key indicator — renders a single key or shortcut in monospace with a subtle bordered chip.',
  files: [
    { path: 'Kbd.svelte', target: 'components/ui/kbd/Kbd.svelte' },
    { path: 'index.ts', target: 'components/ui/kbd/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

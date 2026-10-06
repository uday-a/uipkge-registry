import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'scroll-area',
  type: 'registry:ui',
  categories: ['layout'],
  framework: 'svelte',
  description:
    'Custom scrollbar that always renders the same way across OSes (no flashing native scrollbars on Windows). Use for sidebars, dropdown content, and any overflow region you want to feel consistent.',
  files: [
    { path: 'ScrollArea.svelte', target: 'components/ui/scroll-area/ScrollArea.svelte' },
    { path: 'ScrollBar.svelte', target: 'components/ui/scroll-area/ScrollBar.svelte' },
    { path: 'index.ts', target: 'components/ui/scroll-area/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

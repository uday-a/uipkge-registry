import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'link',
  type: 'registry:ui',
  categories: ['navigation'],
  framework: 'svelte',
  description:
    'Styled anchor with external-link handling (target/rel auto-applied for http(s) hrefs). Supports underline variants (always/hover/none), color variants (default/primary/muted), disabled state, left/right icon snippets, size variants, and child-snippet composition.',
  files: [
    { path: 'Link.svelte', target: 'components/ui/link/Link.svelte' },
    { path: 'link.variants.ts', target: 'components/ui/link/link.variants.ts' },
    { path: 'index.ts', target: 'components/ui/link/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: [],
})

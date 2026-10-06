import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'highlight',
  type: 'registry:ui',
  categories: ['display', 'utility'],
  framework: 'svelte',
  description:
    'Highlights matching substrings in text for search results. Supports string or regex queries, case-sensitive and whole-word matching, custom highlight tag, and a max-highlight cap.',
  files: [
    { path: 'Highlight.svelte', target: 'components/ui/highlight/Highlight.svelte' },
    { path: 'index.ts', target: 'components/ui/highlight/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

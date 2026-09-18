import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'highlight',
  type: 'registry:ui',
  categories: ['display', 'utility'],
  description:
    'Highlights matching substrings in text for search results. Supports string or regex queries, case-sensitive and whole-word matching, custom highlight tag, and a max-highlight cap.',
  files: [
    { path: 'Highlight.tsx', target: 'components/ui/highlight/Highlight.tsx' },
    { path: 'index.ts', target: 'components/ui/highlight/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

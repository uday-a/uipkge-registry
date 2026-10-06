import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'highlight',
  type: 'registry:ui',
  categories: ['display', 'utility'],
  framework: 'angular',
  description:
    'Highlights matching substrings in text for search results. Supports string or regex queries, case-sensitive and whole-word matching, custom highlight tag, and a max-highlight cap.',
  files: [
    { path: 'highlight.component.ts', target: 'components/ui/highlight/highlight.component.ts' },
    { path: 'index.ts', target: 'components/ui/highlight/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

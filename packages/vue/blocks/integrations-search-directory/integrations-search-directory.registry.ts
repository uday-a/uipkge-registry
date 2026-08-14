import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'integrations-search-directory',
  title: 'Integrations — Search Directory',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Searchable integration directory: a live filter field above category-grouped rows carrying a monogram, blurb, and auth type, with an empty state when nothing matches.',
  framework: 'vue',
  files: [{ path: 'IntegrationsSearchDirectory.vue', target: 'components/blocks/IntegrationsSearchDirectory.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

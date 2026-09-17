import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'resources-category-grid',
  title: 'Resources — Category Grid',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Resource library grouped into categories, each card listing its three most recent entries with kind and read time, over a link to the full archive.',
  framework: 'vue',
  files: [{ path: 'ResourcesCategoryGrid.vue', target: 'components/blocks/ResourcesCategoryGrid.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

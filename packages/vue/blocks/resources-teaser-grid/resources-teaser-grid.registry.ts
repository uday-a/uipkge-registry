import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'resources-teaser-grid',
  title: 'Resources Teaser Grid',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Blog and resources teaser: one featured article spanning two columns with kind badge and read time, beside a stacked list of four recent pieces, closing on a view-all link row.',
  framework: 'vue',
  files: [{ path: 'ResourcesTeaserGrid.vue', target: 'components/blocks/ResourcesTeaserGrid.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

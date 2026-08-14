import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'footer-developer-dense-grid',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Dense developer footer with multi-column categorized links, live operational status beacon, and social triggers.',
  framework: 'vue',
  files: [{ path: 'FooterDeveloperDenseGrid.vue', target: 'components/blocks/FooterDeveloperDenseGrid.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: ['https://uipkge.dev/r/badge.json', 'https://uipkge.dev/r/button.json'],
})

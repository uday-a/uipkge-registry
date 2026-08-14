import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'footer-minimal-row',
  title: 'Footer — Minimal Row',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Single-row footer carrying the wordmark, a short inline link list, social icons, and the copyright line, for pages that should end quietly.',
  framework: 'vue',
  files: [{ path: 'FooterMinimalRow.vue', target: 'components/blocks/FooterMinimalRow.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: ['https://uipkge.dev/r/button.json', 'https://uipkge.dev/r/separator.json'],
})

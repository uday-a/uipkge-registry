import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'footer-sitemap-dense',
  title: 'Footer — Dense Sitemap',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Sitemap-style footer with six tightly-set link columns, a region and currency selector row, compliance marks, and a status indicator reporting live uptime.',
  framework: 'vue',
  files: [{ path: 'FooterSitemapDense.vue', target: 'components/blocks/FooterSitemapDense.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

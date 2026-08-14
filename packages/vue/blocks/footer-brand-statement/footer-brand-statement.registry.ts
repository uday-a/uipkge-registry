import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'footer-brand-statement',
  title: 'Footer — Brand Statement',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Footer led by an oversized brand statement and mission line, with three link columns set beneath it and a legal row carrying certifications and a contact address.',
  framework: 'vue',
  files: [{ path: 'FooterBrandStatement.vue', target: 'components/blocks/FooterBrandStatement.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

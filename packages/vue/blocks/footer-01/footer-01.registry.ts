import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'footer-01',
  title: 'Multi-Column Footer',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Site footer with brand mark + newsletter form on the left and four link columns (Product / Company / Resources / Legal) on the right. Separator divides into a copyright + social icon row. Each link is spelled out inline so copy lives in one place.',
  framework: 'vue',
  files: [{ path: 'Footer01.vue', target: 'components/blocks/Footer01.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'faq-two-column',
  title: 'FAQ — Two Column',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Frequently asked questions split across two columns of independent accordions, so a long answer in one column never pushes the questions beside it out of alignment.',
  framework: 'vue',
  files: [{ path: 'FaqTwoColumn.vue', target: 'components/blocks/FaqTwoColumn.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/accordion.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
  ],
})

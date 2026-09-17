import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'cta-01',
  title: 'Conversion CTA',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Interactive developer CTA section with live framework switcher, interactive CLI installation terminal, 1-click clipboard copy, and production guarantees.',
  framework: 'vue',
  files: [{ path: 'Cta01.vue', target: 'components/blocks/Cta01.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

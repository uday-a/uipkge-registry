import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'feature-full-bleed-rows',
  title: 'Features — Full-Bleed Rows',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Alternating full-bleed feature bands on contrasting surfaces, each pairing a headline and supporting detail with an edge-to-edge visual that runs past the container.',
  framework: 'vue',
  files: [{ path: 'FeatureFullBleedRows.vue', target: 'components/blocks/FeatureFullBleedRows.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

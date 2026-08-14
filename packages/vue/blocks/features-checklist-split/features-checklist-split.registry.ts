import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'features-checklist-split',
  title: 'Features — Checklist Split',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Two-column feature section pairing a sticky pitch column with a dense two-up checklist of capabilities, each line carrying a short qualifier rather than a marketing adjective.',
  framework: 'vue',
  files: [{ path: 'FeaturesChecklistSplit.vue', target: 'components/blocks/FeaturesChecklistSplit.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

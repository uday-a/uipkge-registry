import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'how-it-works-before-after',
  title: 'How It Works — Before & After',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Two-column process contrast setting the old workflow against the new one step for step, with matched row heights so the saving at each stage reads at a glance.',
  framework: 'vue',
  files: [{ path: 'HowItWorksBeforeAfter.vue', target: 'components/blocks/HowItWorksBeforeAfter.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

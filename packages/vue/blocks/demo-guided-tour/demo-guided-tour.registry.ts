import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'demo-guided-tour',
  title: 'Demo — Guided Tour',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Step-through product tour where next and previous move a highlight across a mocked interface, with a step counter and a skip control.',
  framework: 'vue',
  files: [{ path: 'DemoGuidedTour.vue', target: 'components/blocks/DemoGuidedTour.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

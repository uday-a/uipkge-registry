import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'how-it-works-tabbed-steps',
  title: 'How It Works — Tabbed Steps',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Step explainer where a vertical tab list of stages swaps a paired detail panel showing the action, the expected result, and a primitive-built screen for that step.',
  framework: 'vue',
  files: [{ path: 'HowItWorksTabbedSteps.vue', target: 'components/blocks/HowItWorksTabbedSteps.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})

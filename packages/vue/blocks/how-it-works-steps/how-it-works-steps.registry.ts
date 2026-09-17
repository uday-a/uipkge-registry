import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'how-it-works-steps',
  title: 'How It Works — Three Steps',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Horizontal three-step explainer with numbered markers on a connector rail, per-step icon, body copy, and a time estimate, closing on a primary + ghost CTA row.',
  framework: 'vue',
  files: [{ path: 'HowItWorksSteps.vue', target: 'components/blocks/HowItWorksSteps.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: ['https://uipkge.dev/r/badge.json', 'https://uipkge.dev/r/button.json'],
})

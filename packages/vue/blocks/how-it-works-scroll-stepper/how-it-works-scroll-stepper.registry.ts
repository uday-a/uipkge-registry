import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'how-it-works-scroll-stepper',
  title: 'How It Works — Scroll Stepper',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Scroll-driven walkthrough where a sticky progress rail tracks which step is in view while the step copy scrolls past, falling back to a plain list without IntersectionObserver.',
  framework: 'vue',
  files: [{ path: 'HowItWorksScrollStepper.vue', target: 'components/blocks/HowItWorksScrollStepper.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
  ],
})

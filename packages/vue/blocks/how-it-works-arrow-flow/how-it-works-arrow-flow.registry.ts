import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'how-it-works-arrow-flow',
  title: 'How It Works — Arrow Flow',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Four-stage horizontal flow joined by drawn SVG arrows, each stage carrying an icon tile, a short label, and the artefact it produces, wrapping to a vertical rail on narrow screens.',
  framework: 'vue',
  files: [{ path: 'HowItWorksArrowFlow.vue', target: 'components/blocks/HowItWorksArrowFlow.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})

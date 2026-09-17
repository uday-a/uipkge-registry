import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'hero-bento-preview-grid',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Asymmetric 3-column bento hero section with interactive OKLCH palette customizer, dual-framework parity toggle, bundle bloat calculator, and edge latency telemetry.',
  framework: 'vue',
  files: [{ path: 'HeroBentoPreviewGrid.vue', target: 'components/blocks/HeroBentoPreviewGrid.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})

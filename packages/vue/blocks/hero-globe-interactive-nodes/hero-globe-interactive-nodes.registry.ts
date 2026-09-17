import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'hero-globe-interactive-nodes',
  type: 'registry:block',
  categories: ['hero', 'marketing'],
  framework: 'vue',
  description: 'Global edge latency simulation hero with interactive PoP node inspection and real-time telemetry.',
  files: [
    {
      path: 'HeroGlobeInteractiveNodes.vue',
      target: 'components/blocks/hero-globe-interactive-nodes/HeroGlobeInteractiveNodes.vue',
    },
    { path: 'index.ts', target: 'components/blocks/hero-globe-interactive-nodes/index.ts' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/utils.json',
  ],
})

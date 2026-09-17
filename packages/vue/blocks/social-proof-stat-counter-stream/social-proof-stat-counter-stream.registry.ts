import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'social-proof-stat-counter-stream',
  type: 'registry:block',
  categories: ['marketing', 'feature'],
  framework: 'vue',
  description:
    'Live infrastructure telemetry and animated metric counter stream with real-time global edge round-trip latency ticker.',
  files: [
    {
      path: 'SocialProofStatCounterStream.vue',
      target: 'components/blocks/social-proof-stat-counter-stream/SocialProofStatCounterStream.vue',
    },
    { path: 'index.ts', target: 'components/blocks/social-proof-stat-counter-stream/index.ts' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/utils.json',
  ],
})

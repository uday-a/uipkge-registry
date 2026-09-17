import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'social-proof-video-wall',
  type: 'registry:block',
  categories: ['marketing', 'feature'],
  framework: 'vue',
  description:
    'Engineering case study and video testimonial wall with playback simulation, category filtering, and metric highlights.',
  files: [
    { path: 'SocialProofVideoWall.vue', target: 'components/blocks/social-proof-video-wall/SocialProofVideoWall.vue' },
    { path: 'index.ts', target: 'components/blocks/social-proof-video-wall/index.ts' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/utils.json',
  ],
})

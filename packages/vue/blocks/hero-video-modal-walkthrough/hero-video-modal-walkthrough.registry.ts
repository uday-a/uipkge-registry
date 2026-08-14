import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'hero-video-modal-walkthrough',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Product walkthrough hero section with interactive video modal player, chapter timestamps navigation, playback speed controls, and social proof.',
  framework: 'vue',
  files: [{ path: 'HeroVideoModalWalkthrough.vue', target: 'components/blocks/HeroVideoModalWalkthrough.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'hero-video-modal-walkthrough',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Product walkthrough hero section with interactive video modal player, chapter timestamps navigation, playback speed controls, and social proof.',
  files: [{ path: 'HeroVideoModalWalkthrough.tsx', target: 'components/blocks/HeroVideoModalWalkthrough.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})

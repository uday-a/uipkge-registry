import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'hero-waitlist-glow',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'High-conversion early access waitlist hero with role tracks, dynamic live queue spot generator, launch countdown clock, and referral booster.',
  framework: 'vue',
  files: [{ path: 'HeroWaitlistGlow.vue', target: 'components/blocks/HeroWaitlistGlow.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
  ],
})

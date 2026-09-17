import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'hero-01',
  title: 'Metric Showcase Hero',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Two-column hero with badge eyebrow, large headline, supporting copy, primary + outline CTAs, social proof row, and a collage of three rotated KPI cards (active users / uptime / onboarding queue) on the right.',
  framework: 'vue',
  files: [{ path: 'Hero01.vue', target: 'components/blocks/Hero01.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})

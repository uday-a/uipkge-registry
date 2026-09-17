import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'testimonial-social-cards',
  title: 'Testimonial — Social Cards',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Masonry of social-post style endorsements with handle, avatar, timestamp, body copy, and engagement counts, formatted as posts rather than polished marketing quotes.',
  framework: 'vue',
  files: [{ path: 'TestimonialSocialCards.vue', target: 'components/blocks/TestimonialSocialCards.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})

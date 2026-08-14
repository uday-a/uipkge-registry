import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'testimonial-social-cards',
  title: 'Testimonial — Social Cards',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Masonry of social-post style endorsements with handle, avatar, timestamp, body copy, and engagement counts, formatted as posts rather than polished marketing quotes.',
  files: [{ path: 'TestimonialSocialCards.tsx', target: 'components/blocks/TestimonialSocialCards.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})

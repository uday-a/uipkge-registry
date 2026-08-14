import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'testimonial-masonry-verified-grid',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Masonry grid of verified engineer endorsements with role filters, star ratings, avatar badges, and quantifiable impact metrics.',
  files: [
    { path: 'TestimonialMasonryVerifiedGrid.tsx', target: 'components/blocks/TestimonialMasonryVerifiedGrid.tsx' },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})

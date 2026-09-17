import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'ratings-review-badges',
  title: 'Ratings & Review Badges',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Third-party proof strip: four review-platform cards with star rating, score out of five, review count, and a category award line, over a rating-distribution bar and a verified-reviews footnote.',
  files: [{ path: 'RatingsReviewBadges.tsx', target: 'components/blocks/RatingsReviewBadges.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

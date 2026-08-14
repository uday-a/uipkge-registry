import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'ratings-star-summary',
  title: 'Ratings — Star Summary',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Aggregate rating summary pairing a large score and partial-star row with a per-star distribution and the review count each bar represents.',
  files: [{ path: 'RatingsStarSummary.tsx', target: 'components/blocks/RatingsStarSummary.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

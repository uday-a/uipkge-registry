import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'ratings-award-wall',
  title: 'Ratings — Award Wall',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Grid of third-party awards, each naming the awarding body, the category, and the period it covers, so a badge wall stays checkable rather than decorative.',
  files: [{ path: 'RatingsAwardWall.tsx', target: 'components/blocks/RatingsAwardWall.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

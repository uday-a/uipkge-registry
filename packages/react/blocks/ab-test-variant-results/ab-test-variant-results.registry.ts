import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'ab-test-variant-results',
  type: 'registry:block',
  categories: ['analytics', 'marketing', 'dashboard'],
  description:
    'Optimizely and Statsig style A/B test statistical significance scorecard and conversion delta comparison. Features experiment status header, 4 primary experiment metrics cards, variants comparison table with statistical verdicts, and conversion funnel step drop-off comparison.',
  files: [{ path: 'AbTestVariantResults.tsx', target: 'components/blocks/AbTestVariantResults.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'feature-segmented-compare',
  title: 'Features — Segmented Compare',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Segmented control switching one feature section between two operating modes, with the capability list, constraints, and a recommendation line changing per mode.',
  files: [{ path: 'FeatureSegmentedCompare.tsx', target: 'components/blocks/FeatureSegmentedCompare.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/toggle-group.json',
  ],
})

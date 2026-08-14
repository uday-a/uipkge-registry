import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'feature-comparison-slider',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Interactive architecture comparison slider workbench contrasting Monolithic npm packages against UIPKGE unbundled code ownership.',
  files: [{ path: 'FeatureComparisonSlider.tsx', target: 'components/blocks/FeatureComparisonSlider.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})

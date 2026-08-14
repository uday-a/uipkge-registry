import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'pricing-feature-addon-builder',
  type: 'registry:block',
  categories: ['pricing', 'marketing'],
  framework: 'react',
  description:
    'Interactive add-on pricing calculator with tier bundling, seat scaling, and real-time invoice generation.',
  files: [
    {
      path: 'PricingFeatureAddonBuilder.tsx',
      target: 'components/blocks/pricing-feature-addon-builder/PricingFeatureAddonBuilder.tsx',
    },
    { path: 'index.ts', target: 'components/blocks/pricing-feature-addon-builder/index.ts' },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/utils.json',
  ],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'pricing-feature-tier-slider',
  type: 'registry:block',
  categories: ['pricing', 'marketing'],
  framework: 'react',
  description:
    'Continuous MAU and usage scale pricing slider with dynamic tier calculation and annual discount toggle.',
  files: [
    {
      path: 'PricingFeatureTierSlider.tsx',
      target: 'components/blocks/pricing-feature-tier-slider/PricingFeatureTierSlider.tsx',
    },
    { path: 'index.ts', target: 'components/blocks/pricing-feature-tier-slider/index.ts' },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/utils.json',
  ],
})

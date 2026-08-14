import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'pricing-feature-tier-slider',
  type: 'registry:block',
  categories: ['pricing', 'marketing'],
  framework: 'vue',
  description:
    'Continuous MAU and usage scale pricing slider with dynamic tier calculation and annual discount toggle.',
  files: [
    {
      path: 'PricingFeatureTierSlider.vue',
      target: 'components/blocks/pricing-feature-tier-slider/PricingFeatureTierSlider.vue',
    },
    { path: 'index.ts', target: 'components/blocks/pricing-feature-tier-slider/index.ts' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/utils.json',
  ],
})

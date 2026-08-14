import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'feature-comparison-slider',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Interactive architecture comparison slider workbench contrasting Monolithic npm packages against UIPKGE unbundled code ownership.',
  framework: 'vue',
  files: [{ path: 'FeatureComparisonSlider.vue', target: 'components/blocks/FeatureComparisonSlider.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})

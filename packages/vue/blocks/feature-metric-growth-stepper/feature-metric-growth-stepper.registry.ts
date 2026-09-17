import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'feature-metric-growth-stepper',
  type: 'registry:block',
  categories: ['feature', 'marketing'],
  framework: 'vue',
  description:
    'Interactive scale progression workbench showing infrastructure capacity from Seed to Global Enterprise.',
  files: [
    {
      path: 'FeatureMetricGrowthStepper.vue',
      target: 'components/blocks/feature-metric-growth-stepper/FeatureMetricGrowthStepper.vue',
    },
    { path: 'index.ts', target: 'components/blocks/feature-metric-growth-stepper/index.ts' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/utils.json',
  ],
})

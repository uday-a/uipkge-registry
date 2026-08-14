import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'feature-visual-changelog-diff',
  type: 'registry:block',
  categories: ['feature', 'marketing'],
  framework: 'vue',
  description: 'Visual semantic git changelog with unified code diff highlighting and commit verification.',
  files: [
    {
      path: 'FeatureVisualChangelogDiff.vue',
      target: 'components/blocks/feature-visual-changelog-diff/FeatureVisualChangelogDiff.vue',
    },
    { path: 'index.ts', target: 'components/blocks/feature-visual-changelog-diff/index.ts' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/utils.json',
  ],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'feature-visual-changelog-diff',
  type: 'registry:block',
  categories: ['feature', 'marketing'],
  framework: 'react',
  description: 'Visual semantic git changelog with unified code diff highlighting and commit verification.',
  files: [
    {
      path: 'FeatureVisualChangelogDiff.tsx',
      target: 'components/blocks/feature-visual-changelog-diff/FeatureVisualChangelogDiff.tsx',
    },
    { path: 'index.ts', target: 'components/blocks/feature-visual-changelog-diff/index.ts' },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/utils.json',
  ],
})

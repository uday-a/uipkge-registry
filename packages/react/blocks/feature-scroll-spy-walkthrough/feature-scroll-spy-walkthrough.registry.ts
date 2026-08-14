import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'feature-scroll-spy-walkthrough',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Step-by-step 4-phase developer workflow progression with sticky live code terminal sandbox and instant stage inspector.',
  files: [{ path: 'FeatureScrollSpyWalkthrough.tsx', target: 'components/blocks/FeatureScrollSpyWalkthrough.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})

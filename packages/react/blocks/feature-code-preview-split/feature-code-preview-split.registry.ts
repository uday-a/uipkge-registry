import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'feature-code-preview-split',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Split-pane developer workbench featuring live code generation across Vue 3.5, React 19, and Tailwind v4 tokens synchronized with an interactive component canvas.',
  files: [{ path: 'FeatureCodePreviewSplit.tsx', target: 'components/blocks/FeatureCodePreviewSplit.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})

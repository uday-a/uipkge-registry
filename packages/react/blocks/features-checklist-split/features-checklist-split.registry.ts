import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'features-checklist-split',
  title: 'Features — Checklist Split',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Two-column feature section pairing a sticky pitch column with a dense two-up checklist of capabilities, each line carrying a short qualifier rather than a marketing adjective.',
  files: [{ path: 'FeaturesChecklistSplit.tsx', target: 'components/blocks/FeaturesChecklistSplit.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

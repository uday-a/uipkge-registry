import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'feature-drag-drop-organizer',
  type: 'registry:block',
  categories: ['feature', 'marketing'],
  framework: 'react',
  description:
    'Interactive dashboard block layout organizer with position reordering, visibility toggling, and JSON schema export.',
  files: [
    {
      path: 'FeatureDragDropOrganizer.tsx',
      target: 'components/blocks/feature-drag-drop-organizer/FeatureDragDropOrganizer.tsx',
    },
    { path: 'index.ts', target: 'components/blocks/feature-drag-drop-organizer/index.ts' },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/utils.json',
  ],
})

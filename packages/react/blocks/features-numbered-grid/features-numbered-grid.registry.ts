import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'features-numbered-grid',
  title: 'Features — Numbered Grid',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Six-cell feature grid drawn with one-pixel dividers instead of cards, each cell led by a monospace ordinal, an icon, a title, and two lines of supporting copy.',
  files: [{ path: 'FeaturesNumberedGrid.tsx', target: 'components/blocks/FeaturesNumberedGrid.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: ['https://uipkge.dev/r/badge.json', 'https://uipkge.dev/r/button.json'],
})

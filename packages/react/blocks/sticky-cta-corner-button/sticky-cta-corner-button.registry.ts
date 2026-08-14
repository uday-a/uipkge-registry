import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'sticky-cta-corner-button',
  title: 'Sticky CTA — Corner Button',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Compact corner action that expands on hover or focus to reveal its label, staying out of the content column on narrow screens.',
  files: [{ path: 'StickyCtaCornerButton.tsx', target: 'components/blocks/StickyCtaCornerButton.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: ['https://uipkge.dev/r/badge.json', 'https://uipkge.dev/r/button.json'],
})

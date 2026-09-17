import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'cta-split-panel',
  title: 'CTA — Split Panel',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Two-path closing section splitting self-serve from sales-assisted, each side stating who it suits and what happens next so the choice is not a guess.',
  files: [{ path: 'CtaSplitPanel.tsx', target: 'components/blocks/CtaSplitPanel.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

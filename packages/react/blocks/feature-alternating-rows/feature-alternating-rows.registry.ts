import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'feature-alternating-rows',
  title: 'Feature Deep-Dive — Alternating Rows',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Classic zig-zag feature deep-dive: three full-width rows alternating copy and visual, each with an eyebrow, headline, checklist, inline link, and a bordered preview panel built from real primitives.',
  files: [{ path: 'FeatureAlternatingRows.tsx', target: 'components/blocks/FeatureAlternatingRows.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'feature-vertical-tabs-pane',
  title: 'Features — Vertical Tabs',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Vertical feature tabs where each trigger carries a title and one-line summary, swapping a wide preview pane built from primitives without changing the panel height.',
  files: [{ path: 'FeatureVerticalTabsPane.tsx', target: 'components/blocks/FeatureVerticalTabsPane.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})

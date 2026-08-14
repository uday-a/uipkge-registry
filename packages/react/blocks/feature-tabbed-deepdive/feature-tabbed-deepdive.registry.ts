import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'feature-tabbed-deepdive',
  title: 'Features — Tabbed Deep-Dive',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'One feature examined from three angles behind tabs, each panel carrying its own explanation, a constraint the reader should know, and a matching detail panel.',
  files: [{ path: 'FeatureTabbedDeepdive.tsx', target: 'components/blocks/FeatureTabbedDeepdive.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})

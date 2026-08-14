import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'security-data-flow',
  title: 'Security — Data Flow',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Diagram of what crosses the boundary and what does not: three labelled zones joined by drawn arrows, with a legend separating metadata from customer rows.',
  files: [{ path: 'SecurityDataFlow.tsx', target: 'components/blocks/SecurityDataFlow.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

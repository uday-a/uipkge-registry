import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'integrations-featured-pairs',
  title: 'Integrations — Featured Pairs',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Three promoted integrations, each a card pairing the service with what the connection actually does, the three setup steps it takes, and its live connection state.',
  files: [{ path: 'IntegrationsFeaturedPairs.tsx', target: 'components/blocks/IntegrationsFeaturedPairs.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

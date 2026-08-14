import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'resources-featured-list',
  title: 'Resources — Featured List',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Editorial resource layout pairing one featured long-read with a numbered list of further reading, each entry carrying its kind, date, and read time.',
  files: [{ path: 'ResourcesFeaturedList.tsx', target: 'components/blocks/ResourcesFeaturedList.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

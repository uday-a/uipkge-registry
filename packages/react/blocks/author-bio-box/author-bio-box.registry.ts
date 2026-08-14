import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'author-bio-box',
  type: 'registry:block',
  categories: ['media', 'marketing'],
  description:
    'Editorial author signature card with avatar, verified badge, social links row, recent articles list, and interactive RSS subscribe button.',
  files: [{ path: 'AuthorBioBox.tsx', target: 'components/blocks/AuthorBioBox.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

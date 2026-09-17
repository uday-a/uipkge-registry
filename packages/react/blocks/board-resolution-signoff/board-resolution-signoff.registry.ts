import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'board-resolution-signoff',
  type: 'registry:block',
  categories: ['legal', 'governance', 'app'],
  description:
    'Corporate board meeting minutes and unanimous written consent resolution with director voting tallies, legal recitals, and digital signature signoff execution.',
  files: [{ path: 'BoardResolutionSignoff.tsx', target: 'components/blocks/BoardResolutionSignoff.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

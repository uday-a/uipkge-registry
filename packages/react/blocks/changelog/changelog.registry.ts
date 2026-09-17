import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'changelog',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Release-notes timeline in a SectionCard: Subscribe header action, version groups with a monospace tag, Latest badge and right-aligned date, and entries pairing a typed badge (New / Improved / Fixed / Breaking) with a title and optional description along a continuous border-l rail with dot markers. Pass `releases` to replace the stub; first entry is treated as latest unless a release sets `latest`.',
  files: [{ path: 'Changelog.tsx', target: 'components/blocks/Changelog.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/section-card.json',
  ],
})

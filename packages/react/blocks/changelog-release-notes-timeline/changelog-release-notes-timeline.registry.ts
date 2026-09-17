import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'changelog-release-notes-timeline',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Developer changelog timeline with interactive version filters, categorical changes (features, improvements, fixes), and commit hash links.',
  files: [{ path: 'ChangelogReleaseNotesTimeline.tsx', target: 'components/blocks/ChangelogReleaseNotesTimeline.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})

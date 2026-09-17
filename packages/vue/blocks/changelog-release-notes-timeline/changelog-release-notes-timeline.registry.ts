import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'changelog-release-notes-timeline',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Developer changelog timeline with interactive version filters, categorical changes (features, improvements, fixes), and commit hash links.',
  framework: 'vue',
  files: [{ path: 'ChangelogReleaseNotesTimeline.vue', target: 'components/blocks/ChangelogReleaseNotesTimeline.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})

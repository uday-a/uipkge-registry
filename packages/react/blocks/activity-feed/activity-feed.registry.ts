import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'activity-feed',
  type: 'registry:block',
  categories: ['productivity', 'dashboard'],
  framework: 'react',
  description:
    'Record activity as a Timeline of avatar rows. Each row is spelled out inline — actor, verb, optional comment, relative time. Edit the rows after install; no items wrapper.',
  files: [{ path: 'ActivityFeed.tsx', target: 'components/blocks/ActivityFeed.tsx' }],
  dependencies: [],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/relative-time.json',
    'https://uipkge.dev/r/section-card.json',
    'https://uipkge.dev/r/timeline.json',
  ],
})

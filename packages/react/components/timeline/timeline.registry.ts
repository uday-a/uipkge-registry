import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'timeline',
  type: 'registry:ui',
  categories: ['data-display'],
  description:
    'Vertical or horizontal sequence of events with connectors and node markers. Statuses (pending, current, completed, failed) tint the connector. Use for activity feeds, audit logs, and progress tracking.',
  files: [
    { path: 'timeline.tsx', target: 'components/ui/timeline/timeline.tsx' },
    { path: 'context.ts', target: 'components/ui/timeline/context.ts' },
    { path: 'timeline.variants.ts', target: 'components/ui/timeline/timeline.variants.ts' },
    { path: 'index.ts', target: 'components/ui/timeline/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'timeline',
  type: 'registry:ui',
  categories: ['data-display'],
  framework: 'angular',
  description:
    'Vertical or horizontal sequence of events with auto-indexed items, dot / icon / avatar / outline markers and connector lines (none after the last item). Statuses (default, current, success, warning, error, info, muted) tint the marker and optionally the connector; align=center alternates sides. Use for activity feeds, audit logs, and progress tracking.',
  files: [
    { path: 'timeline.component.ts', target: 'components/ui/timeline/timeline.component.ts' },
    { path: 'timeline.variants.ts', target: 'components/ui/timeline/timeline.variants.ts' },
    { path: 'index.ts', target: 'components/ui/timeline/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: [],
})

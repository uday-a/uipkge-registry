import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'timeline',
  type: 'registry:ui',
  categories: ['data-display'],
  framework: 'svelte',
  description:
    'Vertical or horizontal sequence of events with connectors and node markers. Statuses (pending, current, completed, failed) tint the connector. Use for activity feeds, audit logs, and progress tracking.',
  files: [
    { path: 'Timeline.svelte', target: 'components/ui/timeline/Timeline.svelte' },
    { path: 'TimelineItem.svelte', target: 'components/ui/timeline/TimelineItem.svelte' },
    { path: 'TimelineMedia.svelte', target: 'components/ui/timeline/TimelineMedia.svelte' },
    { path: 'TimelineSeparator.svelte', target: 'components/ui/timeline/TimelineSeparator.svelte' },
    { path: 'TimelineContent.svelte', target: 'components/ui/timeline/TimelineContent.svelte' },
    { path: 'TimelineHeader.svelte', target: 'components/ui/timeline/TimelineHeader.svelte' },
    { path: 'TimelineTitle.svelte', target: 'components/ui/timeline/TimelineTitle.svelte' },
    { path: 'TimelineDescription.svelte', target: 'components/ui/timeline/TimelineDescription.svelte' },
    { path: 'TimelineDate.svelte', target: 'components/ui/timeline/TimelineDate.svelte' },
    { path: 'context.svelte.ts', target: 'components/ui/timeline/context.svelte.ts' },
    { path: 'timeline.variants.ts', target: 'components/ui/timeline/timeline.variants.ts' },
    { path: 'index.ts', target: 'components/ui/timeline/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: [],
})

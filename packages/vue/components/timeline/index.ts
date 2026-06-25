export { default as Timeline } from './Timeline.vue'
export { default as TimelineItem } from './TimelineItem.vue'
export { default as TimelineMedia } from './TimelineMedia.vue'
export { default as TimelineSeparator } from './TimelineSeparator.vue'
export { default as TimelineContent } from './TimelineContent.vue'
export { default as TimelineTitle } from './TimelineTitle.vue'
export { default as TimelineDescription } from './TimelineDescription.vue'
export { default as TimelineDate } from './TimelineDate.vue'

export type { TimelineDirection, TimelineAlign, TimelineSide, TimelineStatus, TimelineDensity } from './context'

// Re-export variant API from the sibling file (kept separate to avoid the
// Component.vue <-> index.ts circular import that broke dev SSR for Card).
export { timelineMediaVariants, type TimelineMediaVariantsProps, type TimelineMediaVariant } from './timeline.variants'

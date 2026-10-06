export { default as Timeline, type TimelineProps } from './Timeline.svelte'
export { default as TimelineItem, type TimelineItemProps, type TimelineItemRenderArgs } from './TimelineItem.svelte'
export { default as TimelineMedia, type TimelineMediaProps } from './TimelineMedia.svelte'
export { default as TimelineSeparator, type TimelineSeparatorProps } from './TimelineSeparator.svelte'
export { default as TimelineContent, type TimelineContentProps } from './TimelineContent.svelte'
export { default as TimelineHeader, type TimelineHeaderProps } from './TimelineHeader.svelte'
export { default as TimelineTitle, type TimelineTitleProps } from './TimelineTitle.svelte'
export { default as TimelineDescription, type TimelineDescriptionProps } from './TimelineDescription.svelte'
export { default as TimelineDate, type TimelineDateProps } from './TimelineDate.svelte'

export type {
  TimelineDirection,
  TimelineAlign,
  TimelineSide,
  TimelineStatus,
  TimelineDensity,
} from './context.svelte'

// Re-export variant API from the sibling file (kept separate to avoid the
// Component <-> index.ts circular import that broke dev SSR for Card).
export {
  timelineMediaVariants,
  type TimelineMediaVariantsProps,
  type TimelineMediaVariant,
} from './timeline.variants'

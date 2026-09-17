export {
  Timeline,
  TimelineItem,
  TimelineMedia,
  TimelineSeparator,
  TimelineContent,
  TimelineHeader,
  TimelineTitle,
  TimelineDescription,
  TimelineDate,
  type TimelineProps,
  type TimelineItemProps,
  type TimelineItemRenderProps,
  type TimelineMediaProps,
  type TimelineSeparatorProps,
  type TimelineTitleProps,
} from "./timeline";

export type {
  TimelineDirection,
  TimelineAlign,
  TimelineSide,
  TimelineStatus,
  TimelineDensity,
} from "./context";

// Re-export variant API from the sibling file (kept separate to avoid the
// component <-> index circular import that broke dev SSR for Card).
export {
  timelineMediaVariants,
  type TimelineMediaVariantsProps,
  type TimelineMediaVariant,
} from "./timeline.variants";

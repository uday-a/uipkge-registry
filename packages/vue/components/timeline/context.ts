import type { InjectionKey, Ref } from "vue";

export type TimelineDirection = "vertical" | "horizontal";
export type TimelineAlign = "start" | "center";
export type TimelineSide = "left" | "right" | "top" | "bottom";
export type TimelineStatus =
  "default" | "current" | "success" | "warning" | "error" | "info" | "muted";
export type TimelineDensity = "compact" | "default" | "comfortable";

export interface TimelineContext {
  direction: Ref<TimelineDirection>;
  align: Ref<TimelineAlign>;
  side: Ref<TimelineSide>;
  density: Ref<TimelineDensity>;
  itemIds: Ref<symbol[]>;
  register: (id: symbol) => void;
  unregister: (id: symbol) => void;
}

export const TIMELINE_CONTEXT: InjectionKey<TimelineContext> =
  Symbol("TimelineContext");

export interface TimelineItemContext {
  index: Ref<number>;
  isFirst: Ref<boolean>;
  isLast: Ref<boolean>;
  side: Ref<TimelineSide>;
  status: Ref<TimelineStatus>;
  direction: Ref<TimelineDirection>;
  density: Ref<TimelineDensity>;
}

export const TIMELINE_ITEM_CONTEXT: InjectionKey<TimelineItemContext> = Symbol(
  "TimelineItemContext",
);

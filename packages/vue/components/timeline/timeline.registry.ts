import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "timeline",
  type: "registry:ui",
  categories: ["data-display"],
  framework: "vue",
  description:
    "Vertical or horizontal sequence of events with connectors and node markers. Statuses (pending, current, completed, failed) tint the connector. Use for activity feeds, audit logs, and progress tracking.",
  files: [
    { path: "Timeline.vue", target: "components/ui/timeline/Timeline.vue" },
    {
      path: "TimelineItem.vue",
      target: "components/ui/timeline/TimelineItem.vue",
    },
    {
      path: "TimelineMedia.vue",
      target: "components/ui/timeline/TimelineMedia.vue",
    },
    {
      path: "TimelineSeparator.vue",
      target: "components/ui/timeline/TimelineSeparator.vue",
    },
    {
      path: "TimelineContent.vue",
      target: "components/ui/timeline/TimelineContent.vue",
    },
    {
      path: "TimelineTitle.vue",
      target: "components/ui/timeline/TimelineTitle.vue",
    },
    {
      path: "TimelineDescription.vue",
      target: "components/ui/timeline/TimelineDescription.vue",
    },
    {
      path: "TimelineDate.vue",
      target: "components/ui/timeline/TimelineDate.vue",
    },
    { path: "context.ts", target: "components/ui/timeline/context.ts" },
    {
      path: "timeline.variants.ts",
      target: "components/ui/timeline/timeline.variants.ts",
    },
    { path: "index.ts", target: "components/ui/timeline/index.ts" },
  ],
  dependencies: ["class-variance-authority"],
  registryDependencies: [],
});

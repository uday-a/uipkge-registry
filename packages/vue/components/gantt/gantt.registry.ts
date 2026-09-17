import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "gantt",
  type: "registry:ui",
  categories: ["data-display"],
  framework: "vue",
  description:
    "Interactive Gantt chart primitive with multi-scale timeline (day/week/month/year), collapsible task tree, progress fill, milestone markers, dependency lines, and right-click GanttContextMenu.",
  files: [
    { path: "Gantt.vue", target: "components/ui/gantt/Gantt.vue" },
    { path: "GanttHeader.vue", target: "components/ui/gantt/GanttHeader.vue" },
    { path: "GanttTree.vue", target: "components/ui/gantt/GanttTree.vue" },
    {
      path: "GanttTimeline.vue",
      target: "components/ui/gantt/GanttTimeline.vue",
    },
    { path: "GanttBar.vue", target: "components/ui/gantt/GanttBar.vue" },
    {
      path: "GanttMilestone.vue",
      target: "components/ui/gantt/GanttMilestone.vue",
    },
    {
      path: "GanttContextMenu.vue",
      target: "components/ui/gantt/GanttContextMenu.vue",
    },
    { path: "types.ts", target: "components/ui/gantt/types.ts" },
    { path: "index.ts", target: "components/ui/gantt/index.ts" },
  ],
  dependencies: ["lucide-vue-next"],
  registryDependencies: [
    "https://uipkge.dev/r/button.json",
    "https://uipkge.dev/r/context-menu.json",
  ],
});

import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "gantt",
  type: "registry:ui",
  categories: ["data-display"],
  description:
    "Interactive Gantt chart primitive with multi-scale timeline (day/week/month/year), collapsible task tree, progress fill, milestone markers, dependency lines, and right-click GanttContextMenu.",
  files: [
    { path: "Gantt.tsx", target: "components/ui/gantt/Gantt.tsx" },
    { path: "GanttHeader.tsx", target: "components/ui/gantt/GanttHeader.tsx" },
    { path: "GanttTree.tsx", target: "components/ui/gantt/GanttTree.tsx" },
    {
      path: "GanttTimeline.tsx",
      target: "components/ui/gantt/GanttTimeline.tsx",
    },
    { path: "GanttBar.tsx", target: "components/ui/gantt/GanttBar.tsx" },
    {
      path: "GanttMilestone.tsx",
      target: "components/ui/gantt/GanttMilestone.tsx",
    },
    {
      path: "GanttContextMenu.tsx",
      target: "components/ui/gantt/GanttContextMenu.tsx",
    },
    { path: "types.ts", target: "components/ui/gantt/types.ts" },
    { path: "index.ts", target: "components/ui/gantt/index.ts" },
  ],
  dependencies: ["lucide-react"],
  registryDependencies: [
    "https://uipkge.dev/r/button.json",
    "https://uipkge.dev/r/context-menu.json",
  ],
});

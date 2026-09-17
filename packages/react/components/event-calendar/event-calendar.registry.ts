import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "event-calendar",
  type: "registry:ui",
  categories: ["productivity", "dashboard"],
  description:
    "Full-featured event calendar primitive supporting month, week, day, work-week, and category/resource views, timed interval grids with collision clustering, all-day header, live current-time indicator, and customizable event templates.",
  files: [
    {
      path: "event-calendar.tsx",
      target: "components/ui/event-calendar/event-calendar.tsx",
    },
    {
      path: "event-calendar.variants.ts",
      target: "components/ui/event-calendar/event-calendar.variants.ts",
    },
    {
      path: "date-utils.ts",
      target: "components/ui/event-calendar/date-utils.ts",
    },
    { path: "types.ts", target: "components/ui/event-calendar/types.ts" },
    { path: "index.ts", target: "components/ui/event-calendar/index.ts" },
  ],
  dependencies: ["lucide-react", "class-variance-authority"],
  registryDependencies: [
    "https://uipkge.dev/r/button.json",
    "https://uipkge.dev/r/popover.json",
  ],
});

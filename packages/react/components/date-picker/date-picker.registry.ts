import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "date-picker",
  type: "registry:ui",
  categories: ["date-time"],
  description:
    "Form date control: trigger + popover + Calendar/RangeCalendar + optional time. Single/multiple/range, week/month/quarter/year pickers, presets, confirm mode, min/max and disabled dates. For an always-visible grid, use Calendar instead.",
  files: [
    {
      path: "date-picker.tsx",
      target: "components/ui/date-picker/date-picker.tsx",
    },
    {
      path: "date-picker-utils.ts",
      target: "components/ui/date-picker/date-picker-utils.ts",
    },
    { path: "index.ts", target: "components/ui/date-picker/index.ts" },
  ],
  dependencies: ["lucide-react", "react-day-picker"],
  registryDependencies: [
    "https://uipkge.dev/r/button.json",
    "https://uipkge.dev/r/calendar.json",
    "https://uipkge.dev/r/popover.json",
    "https://uipkge.dev/r/range-calendar.json",
    "https://uipkge.dev/r/time-picker.json",
  ],
});

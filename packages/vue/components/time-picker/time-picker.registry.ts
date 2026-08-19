import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "time-picker",
  type: "registry:ui",
  categories: ["date-time"],
  framework: "vue",
  description:
    "Standalone time input — hours, minutes, optional seconds, and 12h/24h modes. Pairs with Date Picker for full datetime entry.",
  files: [
    {
      path: "TimeColumns.vue",
      target: "components/ui/time-picker/TimeColumns.vue",
    },
    {
      path: "TimePicker.vue",
      target: "components/ui/time-picker/TimePicker.vue",
    },
    {
      path: "TimeRangePicker.vue",
      target: "components/ui/time-picker/TimeRangePicker.vue",
    },
    { path: "index.ts", target: "components/ui/time-picker/index.ts" },
  ],
  dependencies: ["lucide-vue-next"],
  registryDependencies: [
    "https://uipkge.dev/r/button.json",
    "https://uipkge.dev/r/popover.json",
    "https://uipkge.dev/r/scroll-area.json",
  ],
});

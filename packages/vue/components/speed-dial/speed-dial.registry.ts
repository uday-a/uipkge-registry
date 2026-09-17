import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "speed-dial",
  type: "registry:ui",
  categories: ["control", "navigation"],
  framework: "vue",
  description:
    "Expanding floating action button that reveals a list of secondary action buttons. Supports click or hover triggers, four expansion directions (up/down/left/right), staggered entrance animation, a configurable main FAB icon, and close-on-action. Built on the fab and popover primitives.",
  files: [
    { path: "SpeedDial.vue", target: "components/ui/speed-dial/SpeedDial.vue" },
    { path: "index.ts", target: "components/ui/speed-dial/index.ts" },
  ],
  dependencies: ["lucide-vue-next"],
  registryDependencies: [
    "https://uipkge.dev/r/fab.json",
    "https://uipkge.dev/r/popover.json",
  ],
});

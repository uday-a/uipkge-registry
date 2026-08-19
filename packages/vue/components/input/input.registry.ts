import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "input",
  type: "registry:ui",
  categories: ["control"],
  framework: "vue",
  description:
    "Text input — single-line. Three sizes, three variants (outlined / filled / borderless), error / warning status, prefix / suffix (string, icon, or slot), addonBefore / addonAfter, allow-clear, password toggle, char count, and composite InputGroup with addons and action buttons.",
  files: [
    { path: "Input.vue", target: "components/ui/input/Input.vue" },
    { path: "InputGroup.vue", target: "components/ui/input/InputGroup.vue" },
    {
      path: "InputGroupAddon.vue",
      target: "components/ui/input/InputGroupAddon.vue",
    },
    {
      path: "InputGroupButton.vue",
      target: "components/ui/input/InputGroupButton.vue",
    },
    { path: "index.ts", target: "components/ui/input/index.ts" },
  ],
  dependencies: ["@vueuse/core", "lucide-vue-next"],
  registryDependencies: [],
});

import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "radio-group",
  type: "registry:ui",
  categories: ["form"],
  framework: "vue",
  description:
    "Single-selection group of radio inputs. Vertical or horizontal layout, optional descriptions per item, and full keyboard navigation. Pair with Form for validation messages.",
  files: [
    {
      path: "RadioGroup.vue",
      target: "components/ui/radio-group/RadioGroup.vue",
    },
    {
      path: "RadioGroupItem.vue",
      target: "components/ui/radio-group/RadioGroupItem.vue",
    },
    {
      path: "RadioButton.vue",
      target: "components/ui/radio-group/RadioButton.vue",
    },
    { path: "index.ts", target: "components/ui/radio-group/index.ts" },
  ],
  dependencies: ["@vueuse/core", "lucide-vue-next", "reka-ui"],
  registryDependencies: [],
});

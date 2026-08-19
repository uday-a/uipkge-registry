import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "number-field",
  type: "registry:ui",
  categories: ["form"],
  framework: "vue",
  description:
    "Numeric input with stepper buttons, min/max bounds, step size, and decimal precision. Use for quantities, prices, and any field that should be a number rather than free text.",
  files: [
    {
      path: "NumberField.vue",
      target: "components/ui/number-field/NumberField.vue",
    },
    {
      path: "NumberFieldContent.vue",
      target: "components/ui/number-field/NumberFieldContent.vue",
    },
    {
      path: "NumberFieldContext.ts",
      target: "components/ui/number-field/NumberFieldContext.ts",
    },
    {
      path: "NumberFieldDecrement.vue",
      target: "components/ui/number-field/NumberFieldDecrement.vue",
    },
    {
      path: "NumberFieldIncrement.vue",
      target: "components/ui/number-field/NumberFieldIncrement.vue",
    },
    {
      path: "NumberFieldInput.vue",
      target: "components/ui/number-field/NumberFieldInput.vue",
    },
    { path: "index.ts", target: "components/ui/number-field/index.ts" },
  ],
  dependencies: ["@vueuse/core", "lucide-vue-next", "reka-ui"],
  registryDependencies: [],
});

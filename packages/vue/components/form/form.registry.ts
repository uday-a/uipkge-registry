import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "form",
  type: "registry:ui",
  categories: ["form"],
  framework: "vue",
  description:
    "Zod-first form block built on TanStack Vue Form. Wires field labels, descriptions, error messages, and validation together; bind a field once and the rest is automatic.",
  files: [
    { path: "Form.vue", target: "components/ui/form/Form.vue" },
    { path: "FormActions.vue", target: "components/ui/form/FormActions.vue" },
    { path: "FormControl.vue", target: "components/ui/form/FormControl.vue" },
    {
      path: "FormDescription.vue",
      target: "components/ui/form/FormDescription.vue",
    },
    { path: "FormField.vue", target: "components/ui/form/FormField.vue" },
    {
      path: "FormFieldInner.vue",
      target: "components/ui/form/FormFieldInner.vue",
    },
    { path: "FormItem.vue", target: "components/ui/form/FormItem.vue" },
    { path: "FormLabel.vue", target: "components/ui/form/FormLabel.vue" },
    { path: "FormMessage.vue", target: "components/ui/form/FormMessage.vue" },
    { path: "FormSection.vue", target: "components/ui/form/FormSection.vue" },
    { path: "FormStatus.vue", target: "components/ui/form/FormStatus.vue" },
    { path: "index.ts", target: "components/ui/form/index.ts" },
    { path: "injectionKeys.ts", target: "components/ui/form/injectionKeys.ts" },
    { path: "types.ts", target: "components/ui/form/types.ts" },
    { path: "useFormField.ts", target: "components/ui/form/useFormField.ts" },
  ],
  dependencies: ["reka-ui", "@tanstack/vue-form", "lucide-vue-next"],
  registryDependencies: ["https://uipkge.dev/r/label.json"],
});

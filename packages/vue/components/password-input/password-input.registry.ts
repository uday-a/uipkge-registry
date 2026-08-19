import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "password-input",
  type: "registry:ui",
  categories: ["control", "form"],
  framework: "vue",
  description:
    "Password input with show/hide toggle (Eye/EyeOff) and optional strength meter (weak/fair/good/strong with colored bar). Supports min length display, disabled, placeholder, and size variants.",
  files: [
    {
      path: "PasswordInput.vue",
      target: "components/ui/password-input/PasswordInput.vue",
    },
    {
      path: "password-input.variants.ts",
      target: "components/ui/password-input/password-input.variants.ts",
    },
    { path: "index.ts", target: "components/ui/password-input/index.ts" },
  ],
  dependencies: ["class-variance-authority", "lucide-vue-next"],
  registryDependencies: [],
});

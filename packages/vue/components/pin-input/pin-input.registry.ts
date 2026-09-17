import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "pin-input",
  type: "registry:ui",
  categories: ["form"],
  framework: "vue",
  description:
    "One-time-code input — N separate boxes that auto-advance and accept paste. Use for SMS verification, 2FA, and short numeric codes. Length, masking, and per-slot status all configurable.",
  files: [
    { path: "PinInput.vue", target: "components/ui/pin-input/PinInput.vue" },
    {
      path: "PinInputGroup.vue",
      target: "components/ui/pin-input/PinInputGroup.vue",
    },
    {
      path: "PinInputSeparator.vue",
      target: "components/ui/pin-input/PinInputSeparator.vue",
    },
    {
      path: "PinInputSlot.vue",
      target: "components/ui/pin-input/PinInputSlot.vue",
    },
    { path: "index.ts", target: "components/ui/pin-input/index.ts" },
  ],
  dependencies: ["@vueuse/core", "lucide-vue-next", "reka-ui"],
  registryDependencies: [],
});

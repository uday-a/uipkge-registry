import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "phone",
  type: "registry:ui",
  categories: ["display", "media"],
  framework: "vue",
  description:
    "Front device frames for iPhone 17 Pro and Galaxy S26 Ultra. Real chassis aspect ratios (71.9×150 / 78.1×163.6), Dynamic Island / punch-hole, side buttons, status bar, home indicator / gesture bar, and official finish colors. Slot in any screen content.",
  files: [
    { path: "Phone.vue", target: "components/ui/phone/Phone.vue" },
    { path: "index.ts", target: "components/ui/phone/index.ts" },
  ],
  dependencies: [],
  registryDependencies: [],
});

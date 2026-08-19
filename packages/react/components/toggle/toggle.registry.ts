import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "toggle",
  type: "registry:ui",
  categories: ["action"],
  description:
    'On/off button (different from Switch — this is shaped like a button and lives in toolbars). Three sizes, two variants. Use inside Toggle Group or standalone for "press to enable" buttons like bold / italic.',
  files: [
    { path: "toggle.tsx", target: "components/ui/toggle/toggle.tsx" },
    {
      path: "toggle.variants.ts",
      target: "components/ui/toggle/toggle.variants.ts",
    },
    { path: "index.ts", target: "components/ui/toggle/index.ts" },
  ],
  dependencies: ["class-variance-authority", "@radix-ui/react-toggle"],
  registryDependencies: [],
});

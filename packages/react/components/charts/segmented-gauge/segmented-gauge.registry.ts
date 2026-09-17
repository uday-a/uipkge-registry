import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "segmented-gauge",
  type: "registry:ui",
  categories: ["chart"],
  description: "React mirror of @uipkge/segmented-gauge.",
  files: [
    {
      path: "SegmentedGauge.tsx",
      target: "components/ui/charts/segmented-gauge/SegmentedGauge.tsx",
    },
    {
      path: "index.ts",
      target: "components/ui/charts/segmented-gauge/index.ts",
    },
  ],
  dependencies: [],
  registryDependencies: [],
});

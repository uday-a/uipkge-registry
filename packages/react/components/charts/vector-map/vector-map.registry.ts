import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "vector-map",
  type: "registry:ui",
  categories: ["chart"],
  description:
    "React mirror of @uipkge/vector-map — see the Vue registry item for the canonical description.",
  files: [
    {
      path: "VectorMap.tsx",
      target: "components/ui/charts/vector-map/VectorMap.tsx",
    },
    { path: "index.ts", target: "components/ui/charts/vector-map/index.ts" },
  ],
  dependencies: ["mapbox-gl", "lucide-react"],
  registryDependencies: ["https://uipkge.dev/r/map.json"],
});

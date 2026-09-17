import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "route-flow-map",
  type: "registry:ui",
  framework: "vue",
  categories: ["chart"],
  description:
    "Global route and flight corridor flow map as pure dependency-free SVG. Renders great-circle Bezier curved arcs with traveling aircraft or data pulses via native SVG motion, origin and destination telemetry hubs, and hover inspection cards.",
  files: [
    {
      path: "RouteFlowMap.vue",
      target: "components/ui/charts/route-flow-map/RouteFlowMap.vue",
    },
    {
      path: "index.ts",
      target: "components/ui/charts/route-flow-map/index.ts",
    },
  ],
  dependencies: ["lucide-vue-next"],
  registryDependencies: ["https://uipkge.dev/r/map.json"],
});

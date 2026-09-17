import { defineRegistryItem } from "../../../lib/define-registry";

export default defineRegistryItem({
  name: "theme-river",
  type: "registry:ui",
  categories: ["chart"],
  description:
    "React mirror of @uipkge/theme-river — see the Vue registry item for the canonical description.",
  files: [
    {
      path: "ThemeRiver.tsx",
      target: "components/ui/charts/theme-river/ThemeRiver.tsx",
    },
    { path: "index.ts", target: "components/ui/charts/theme-river/index.ts" },
    {
      path: "../useChartTheme.ts",
      target: "components/ui/charts/useChartTheme.ts",
    },
    { path: "../shared.tsx", target: "components/ui/charts/shared.tsx" },
  ],
  dependencies: ["echarts", "echarts-for-react"],
  registryDependencies: [],
});

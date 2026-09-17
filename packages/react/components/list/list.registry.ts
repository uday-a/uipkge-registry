import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "list",
  type: "registry:ui",
  categories: ["data-display"],
  description:
    "List and Item row primitives with List, ListItem, ListItemMedia, ListItemContent, ListItemTitle, ListItemDescription, ListItemActions, and ListSubheader for structured rows, settings lists, and feeds.",
  files: [
    { path: "list.tsx", target: "components/ui/list/list.tsx" },
    { path: "index.ts", target: "components/ui/list/index.ts" },
  ],
  dependencies: [],
  registryDependencies: [],
});

import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "resizable",
  type: "registry:ui",
  categories: ["layout"],
  description:
    "Drag-to-resize panel layout — horizontal or vertical splits with persistent sizes. Use for IDE-style sidebars, split views, and any layout the user should be able to reshape.",
  files: [
    { path: "resizable.tsx", target: "components/ui/resizable/resizable.tsx" },
    { path: "index.ts", target: "components/ui/resizable/index.ts" },
  ],
  // Pinned to v2: v4 renamed the exports (Group/Panel/Separator); this code
  // uses the stable shadcn-standard v2 API (PanelGroup/Panel/PanelResizeHandle).
  dependencies: ["lucide-react", "react-resizable-panels"],
  registryDependencies: [],
});

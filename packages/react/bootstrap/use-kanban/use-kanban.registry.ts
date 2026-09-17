import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "use-kanban",
  type: "registry:hook",
  description:
    "Types (KanbanTask, KanbanColumn, CommentItem, FileItem), configs (priorityConfig with icons, assignee colour palette, tagPresets, fileIconMap), and helpers (getInitials, getDueStatus, formatDueDate, findTaskById, getTaskColumn). Shipped as a sibling to the kanban-board block so all the kanban files import the same types and assignee/tag presets.",
  files: [{ path: "useKanban.ts", target: "lib/use-kanban.ts" }],
  dependencies: ["lucide-react"],
  registryDependencies: [],
});

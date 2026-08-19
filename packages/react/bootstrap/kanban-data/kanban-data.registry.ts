import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "kanban-data",
  type: "registry:lib",
  description:
    "Seed columns for the kanban-board block. Five HR-themed columns (Backlog / To Do / In Progress / In Review / Done) with ~26 tasks across them, complete with assignees, tags, due dates, subtasks, comments, and files. Swap with your own fetcher when wiring to a real backend -- the consumer page just imports `createInitialColumns()` and binds the returned array to the kanban board.",
  files: [{ path: "kanbanData.ts", target: "lib/kanban-data.ts" }],
  dependencies: [],
  registryDependencies: ["https://uipkge.dev/r/use-kanban.json"],
});

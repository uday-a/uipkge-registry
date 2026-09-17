import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "use-board",
  type: "registry:hook",
  title: "useBoard — DnD + insertion-index state for the Board primitive",
  categories: ["hooks", "data"],
  description:
    "State + handlers for the `@uipkge/board` compositional primitive. Returns a `state` (draggingId / dragOverLaneId / justMovedId), `handlers` to bind on lanes and cards (onDragStart / onLaneDragOver / onLaneDragLeave / onLaneDrop / onDragEnd), and an imperative `moveItem(itemId, toLaneId, toIndex?)` — used by keyboard navigation, undo, or server-pushed updates. Drop math computes the insertion index from pointer Y vs each card's bounding-box midpoint. An `accepts` predicate gives consumers a per-lane veto. The hook doesn't mutate your lanes data directly — it calls `onLanesChange(next)` and emits `onChange({ itemId, from, to, index })` so you stay in control of the canonical store (useState, Zustand, server). Imports the Board's shared types from `@/components/ui/board/context` so `shadcn add @uipkge/board` and `shadcn add @uipkge/use-board` produce a typed, drop-in pairing.",
  files: [{ path: "useBoard.ts", target: "lib/use-board.ts" }],
  dependencies: [],
  registryDependencies: ["https://uipkge.dev/r/board.json"],
});

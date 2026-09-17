import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "board",
  type: "registry:ui",
  title: "Board — compositional kanban / sortable-list primitive",
  categories: ["data", "layout"],
  description:
    "Six small composable components for any board / kanban / sortable-list surface — opinionated about drop targeting and animation, agnostic about layout, data, and chrome. Drop `<Board>` around a grid of `<BoardLane>` columns; nest `<BoardLaneHeader>`, `<BoardLaneBody>`, `<BoardLaneEmpty>`, and `<BoardCard>` items inside each lane. State lives in a sibling `useBoard()` hook (insertion-index drop math, keyboard a11y, accept predicate). Cards use native HTML5 drag-and-drop (draggable + onDragStart / onLaneDragOver / onLaneDrop) — the lane components emit drag events up to the consumer, which threads them through useBoard and feeds the resulting state back in as props. Three-level React context (board → lane → card) mirrors the Timeline / Card sub-component pattern.",
  files: [
    { path: "board.tsx", target: "components/ui/board/board.tsx" },
    {
      path: "board.variants.ts",
      target: "components/ui/board/board.variants.ts",
    },
    { path: "context.ts", target: "components/ui/board/context.ts" },
    { path: "index.ts", target: "components/ui/board/index.ts" },
  ],
  dependencies: ["class-variance-authority"],
  registryDependencies: ["https://uipkge.dev/r/motion-list.json"],
});

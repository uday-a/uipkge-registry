import { defineRegistryItem } from "../../lib/define-registry";

export default defineRegistryItem({
  name: "board",
  type: "registry:ui",
  title: "Board — compositional kanban / sortable-list primitive",
  categories: ["data", "layout"],
  framework: "vue",
  description:
    "Six small composable components for any board / kanban / sortable-list surface — opinionated about drop targeting and animation, agnostic about layout, data, and chrome. Drop `<Board>` around a grid of `<BoardLane>` columns; slot `<BoardLaneHeader>`, `<BoardLaneBody>`, `<BoardLaneEmpty>`, and `<BoardCard>` items inside each lane. State lives in the sibling `useBoard()` hook (insertion-index drop math, keyboard a11y, accept predicate). Animation comes from the `motion-list` motion preset by default — enter / leave / move all share one settle curve so a card travelling between two lanes reads as one continuous motion. Mirrors the Timeline / Card sub-component pattern (three-level context injection: board → lane → card). The current monolithic `@uipkge/kanban-board` block can be rebuilt on top of this primitive — Board is the layer underneath, kanban-board is one opinionated assembly.",
  files: [
    { path: "Board.vue", target: "components/ui/board/Board.vue" },
    { path: "BoardLane.vue", target: "components/ui/board/BoardLane.vue" },
    {
      path: "BoardLaneHeader.vue",
      target: "components/ui/board/BoardLaneHeader.vue",
    },
    {
      path: "BoardLaneBody.vue",
      target: "components/ui/board/BoardLaneBody.vue",
    },
    {
      path: "BoardLaneEmpty.vue",
      target: "components/ui/board/BoardLaneEmpty.vue",
    },
    { path: "BoardCard.vue", target: "components/ui/board/BoardCard.vue" },
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

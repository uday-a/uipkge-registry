import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'use-board',
  type: 'registry:hook',
  title: 'useBoard — DnD + insertion-index state for the Board primitive',
  categories: ['hooks', 'data'],
  framework: 'vue',
  description:
    "State + handlers for the `@uipkge/board` compositional primitive. Returns a reactive `state` (draggingId / dragOverLaneId / justMovedId), `handlers` to bind on lanes and cards (onDragStart / onLaneDragOver / onLaneDragLeave / onLaneDrop / onDragEnd), and an imperative `moveItem(itemId, toLaneId, toIndex?)` — used by keyboard navigation, undo, or server-pushed updates. Drop math computes the insertion index from pointer Y vs each card's bounding-box midpoint. An `accepts` predicate gives consumers a per-lane veto. The composable doesn't mutate your lanes data directly — it emits `onChange({ itemId, from, to, index })` so you stay in control of the canonical store (Pinia, Drizzle, server). Imports the Board's shared types from `@/components/ui/board/context` so `npx shadcn-vue add @uipkge/board` and `npx shadcn-vue add @uipkge/use-board` produce a typed, drop-in pairing.",
  files: [{ path: 'useBoard.ts', target: '~/app/composables/useBoard.ts' }],
  dependencies: [],
  registryDependencies: ['https://uipkge.dev/r/board.json'],
})

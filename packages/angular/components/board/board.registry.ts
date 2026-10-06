import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'board',
  type: 'registry:ui',
  categories: ['data', 'layout'],
  framework: 'angular',
  description:
    'Six small composable components for any board / kanban / sortable-list surface — opinionated about drop targeting and animation, agnostic about layout, data, and chrome. Drop `<Board>` around a grid of `<BoardLane>` columns; slot `<BoardLaneHeader>`, `<BoardLaneBody>`, `<BoardLaneEmpty>`, and `<BoardCard>` items inside each lane. Like React, the primitive owns no data: pass your board state (draggingId, dragOverLaneId, selection, moveItem, lane / card registries) as inputs; cards handle keyboard grab + arrow moves and multi-select clicks, lanes emit laneDragOver / laneDrop / laneDragLeave. Animation comes from the `motion-list` motion preset by default — enter / leave / move all share one settle curve so a card travelling between two lanes reads as one continuous motion. Mirrors the Timeline / Card sub-component pattern (three-level context injection: board → lane → card). The current monolithic `@uipkge/kanban-board` block can be rebuilt on top of this primitive — Board is the layer underneath, kanban-board is one opinionated assembly.',
  files: [
    { path: 'board.component.ts', target: 'components/ui/board/board.component.ts' },
    { path: 'board.variants.ts', target: 'components/ui/board/board.variants.ts' },
    { path: 'index.ts', target: 'components/ui/board/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'board',
  type: 'registry:ui',
  title: 'Board — compositional kanban / sortable-list primitive',
  categories: ['data', 'layout'],
  framework: 'svelte',
  description:
    'Six small composable components for any board / kanban / sortable-list surface — opinionated about drop targeting and animation, agnostic about layout, data, and chrome. Drop `<Board>` around a grid of `<BoardLane>` columns; slot `<BoardLaneHeader>`, `<BoardLaneBody>`, `<BoardLaneEmpty>`, and `<BoardCard>` items inside each lane. State lives in a sibling board state helper (insertion-index drop math, keyboard a11y, accept predicate). Mirrors the Timeline / Card sub-component pattern (three-level context: board → lane → card).',
  files: [
    { path: 'Board.svelte', target: 'components/ui/board/Board.svelte' },
    { path: 'BoardLane.svelte', target: 'components/ui/board/BoardLane.svelte' },
    { path: 'BoardLaneHeader.svelte', target: 'components/ui/board/BoardLaneHeader.svelte' },
    { path: 'BoardLaneBody.svelte', target: 'components/ui/board/BoardLaneBody.svelte' },
    { path: 'BoardLaneEmpty.svelte', target: 'components/ui/board/BoardLaneEmpty.svelte' },
    { path: 'BoardCard.svelte', target: 'components/ui/board/BoardCard.svelte' },
    { path: 'board.variants.ts', target: 'components/ui/board/board.variants.ts' },
    { path: 'context.ts', target: 'components/ui/board/context.ts' },
    { path: 'index.ts', target: 'components/ui/board/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: [],
})

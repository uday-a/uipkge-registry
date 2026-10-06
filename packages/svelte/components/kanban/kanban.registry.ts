import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'kanban',
  type: 'registry:ui',
  categories: ['data-display', 'layout'],
  description:
    'Composable compound Kanban primitive for building board, pipeline, and agile workflows with tactile card drag-and-drop mechanics.',
  framework: 'svelte',
  files: [
    { path: 'Kanban.svelte', target: 'components/ui/kanban/Kanban.svelte' },
    { path: 'KanbanBoard.svelte', target: 'components/ui/kanban/KanbanBoard.svelte' },
    { path: 'KanbanColumn.svelte', target: 'components/ui/kanban/KanbanColumn.svelte' },
    { path: 'KanbanColumnHeader.svelte', target: 'components/ui/kanban/KanbanColumnHeader.svelte' },
    { path: 'KanbanColumnDot.svelte', target: 'components/ui/kanban/KanbanColumnDot.svelte' },
    { path: 'KanbanColumnTitle.svelte', target: 'components/ui/kanban/KanbanColumnTitle.svelte' },
    { path: 'KanbanColumnCount.svelte', target: 'components/ui/kanban/KanbanColumnCount.svelte' },
    { path: 'KanbanColumnAdd.svelte', target: 'components/ui/kanban/KanbanColumnAdd.svelte' },
    { path: 'KanbanColumnBody.svelte', target: 'components/ui/kanban/KanbanColumnBody.svelte' },
    { path: 'KanbanColumnEmpty.svelte', target: 'components/ui/kanban/KanbanColumnEmpty.svelte' },
    { path: 'KanbanCard.svelte', target: 'components/ui/kanban/KanbanCard.svelte' },
    { path: 'KanbanCardHeader.svelte', target: 'components/ui/kanban/KanbanCardHeader.svelte' },
    { path: 'KanbanCardTitle.svelte', target: 'components/ui/kanban/KanbanCardTitle.svelte' },
    { path: 'KanbanCardDescription.svelte', target: 'components/ui/kanban/KanbanCardDescription.svelte' },
    { path: 'KanbanCardFooter.svelte', target: 'components/ui/kanban/KanbanCardFooter.svelte' },
    { path: 'context.ts', target: 'components/ui/kanban/context.ts' },
    { path: 'kanban.variants.ts', target: 'components/ui/kanban/kanban.variants.ts' },
    { path: 'index.ts', target: 'components/ui/kanban/index.ts' },
  ],
  dependencies: ['class-variance-authority', '@lucide/svelte'],
  registryDependencies: [],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'kanban',
  type: 'registry:ui',
  categories: ['data-display', 'layout'],
  description:
    'Composable compound Kanban primitive for building board, pipeline, and agile workflows with tactile card drag-and-drop mechanics.',
  framework: 'vue',
  files: [
    { path: 'Kanban.vue', target: 'components/ui/kanban/Kanban.vue' },
    { path: 'KanbanBoard.vue', target: 'components/ui/kanban/KanbanBoard.vue' },
    { path: 'KanbanColumn.vue', target: 'components/ui/kanban/KanbanColumn.vue' },
    { path: 'KanbanColumnHeader.vue', target: 'components/ui/kanban/KanbanColumnHeader.vue' },
    { path: 'KanbanColumnDot.vue', target: 'components/ui/kanban/KanbanColumnDot.vue' },
    { path: 'KanbanColumnTitle.vue', target: 'components/ui/kanban/KanbanColumnTitle.vue' },
    { path: 'KanbanColumnCount.vue', target: 'components/ui/kanban/KanbanColumnCount.vue' },
    { path: 'KanbanColumnAdd.vue', target: 'components/ui/kanban/KanbanColumnAdd.vue' },
    { path: 'KanbanColumnBody.vue', target: 'components/ui/kanban/KanbanColumnBody.vue' },
    { path: 'KanbanColumnEmpty.vue', target: 'components/ui/kanban/KanbanColumnEmpty.vue' },
    { path: 'KanbanCard.vue', target: 'components/ui/kanban/KanbanCard.vue' },
    { path: 'KanbanCardHeader.vue', target: 'components/ui/kanban/KanbanCardHeader.vue' },
    { path: 'KanbanCardTitle.vue', target: 'components/ui/kanban/KanbanCardTitle.vue' },
    { path: 'KanbanCardDescription.vue', target: 'components/ui/kanban/KanbanCardDescription.vue' },
    { path: 'KanbanCardFooter.vue', target: 'components/ui/kanban/KanbanCardFooter.vue' },
    { path: 'context.ts', target: 'components/ui/kanban/context.ts' },
    { path: 'kanban.variants.ts', target: 'components/ui/kanban/kanban.variants.ts' },
    { path: 'index.ts', target: 'components/ui/kanban/index.ts' },
  ],
  dependencies: ['class-variance-authority', 'lucide-vue-next'],
  registryDependencies: ['https://uipkge.dev/r/utils.json'],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'kanban',
  type: 'registry:ui',
  categories: ['data-display', 'layout'],
  framework: 'angular',
  description:
    'Composable compound Kanban primitive for building board, pipeline, and agile workflows with tactile card drag-and-drop mechanics.',
  files: [
    { path: 'kanban.component.ts', target: 'components/ui/kanban/kanban.component.ts' },
    { path: 'kanban.variants.ts', target: 'components/ui/kanban/kanban.variants.ts' },
    { path: 'index.ts', target: 'components/ui/kanban/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: [],
})

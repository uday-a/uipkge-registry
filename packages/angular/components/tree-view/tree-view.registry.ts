import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'tree-view',
  type: 'registry:ui',
  categories: ['data-display'],
  framework: 'angular',
  description:
    'Indented tree of expandable nodes — file browsers, taxonomy editors, nested settings. Elbow connectors, checkbox support, and full keyboard navigation.',
  files: [
    { path: 'tree-view.component.ts', target: 'components/ui/tree-view/tree-view.component.ts' },
    { path: 'index.ts', target: 'components/ui/tree-view/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

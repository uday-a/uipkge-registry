import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'json-tree-view',
  type: 'registry:ui',
  categories: ['display', 'data'],
  framework: 'angular',
  description:
    'Collapsible JSON tree viewer with color-coded value types, click-to-copy, live search/filter, and expand/collapse-all controls. Renders objects, arrays, and primitives with configurable depth and contained scrolling.',
  files: [
    { path: 'json-tree-view.component.ts', target: 'components/ui/json-tree-view/json-tree-view.component.ts' },
    { path: 'types.ts', target: 'components/ui/json-tree-view/types.ts' },
    { path: 'index.ts', target: 'components/ui/json-tree-view/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

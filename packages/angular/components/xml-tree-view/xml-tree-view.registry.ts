import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'xml-tree-view',
  type: 'registry:ui',
  categories: ['display', 'data'],
  framework: 'angular',
  description:
    'Collapsible XML tree viewer with color-coded tags and attributes, click-to-copy, live search/filter, and expand/collapse-all controls. Parses XML strings into elements, text, comments, and CDATA.',
  files: [
    { path: 'xml-tree-view.component.ts', target: 'components/ui/xml-tree-view/xml-tree-view.component.ts' },
    { path: 'index.ts', target: 'components/ui/xml-tree-view/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

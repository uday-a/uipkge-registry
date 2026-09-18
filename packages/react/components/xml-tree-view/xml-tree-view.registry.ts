import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'xml-tree-view',
  type: 'registry:ui',
  categories: ['display', 'data'],
  description:
    'Collapsible XML tree viewer with color-coded tags and attributes, click-to-copy, live search/filter, and expand/collapse-all controls. Parses XML strings and renders elements, text, comments, and CDATA with contained scrolling.',
  files: [
    { path: 'XmlTreeView.tsx', target: 'components/ui/xml-tree-view/XmlTreeView.tsx' },
    { path: 'XmlTreeNode.tsx', target: 'components/ui/xml-tree-view/XmlTreeNode.tsx' },
    { path: 'types.ts', target: 'components/ui/xml-tree-view/types.ts' },
    { path: 'index.ts', target: 'components/ui/xml-tree-view/index.ts' },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [],
})

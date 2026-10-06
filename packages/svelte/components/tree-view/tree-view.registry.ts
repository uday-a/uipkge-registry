import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'tree-view',
  type: 'registry:ui',
  categories: ['data-display'],
  framework: 'svelte',
  description:
    'Indented tree of expandable nodes — file browsers, taxonomy editors, nested settings. Discord-style elbow connectors, lazy-load branches, and full keyboard navigation.',
  files: [
    { path: 'TreeView.svelte', target: 'components/ui/tree-view/TreeView.svelte' },
    { path: 'TreeViewNode.svelte', target: 'components/ui/tree-view/TreeViewNode.svelte' },
    { path: 'context.ts', target: 'components/ui/tree-view/context.ts' },
    { path: 'types.ts', target: 'components/ui/tree-view/types.ts' },
    { path: 'index.ts', target: 'components/ui/tree-view/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  registryDependencies: [],
})

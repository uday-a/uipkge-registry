import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'resizable',
  type: 'registry:ui',
  categories: ['layout'],
  framework: 'svelte',
  description:
    'Drag-to-resize panel layout — horizontal or vertical splits with persistent sizes. Use for IDE-style sidebars, split views, and any layout the user should be able to reshape.',
  files: [
    { path: 'ResizableHandle.svelte', target: 'components/ui/resizable/ResizableHandle.svelte' },
    { path: 'ResizablePanel.svelte', target: 'components/ui/resizable/ResizablePanel.svelte' },
    { path: 'ResizablePanelGroup.svelte', target: 'components/ui/resizable/ResizablePanelGroup.svelte' },
    { path: 'index.ts', target: 'components/ui/resizable/index.ts' },
  ],
  dependencies: ['@lucide/svelte'],
  registryDependencies: [],
})

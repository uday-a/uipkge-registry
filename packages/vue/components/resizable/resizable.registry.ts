import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'resizable',
  type: 'registry:ui',
  categories: ['layout'],
  framework: 'vue',
  description:
    'Drag-to-resize panel layout — horizontal or vertical splits with persistent sizes. Use for IDE-style sidebars, split views, and any layout the user should be able to reshape.',
  files: [
    { path: 'ResizableHandle.vue', target: 'components/ui/resizable/ResizableHandle.vue' },
    { path: 'ResizablePanel.vue', target: 'components/ui/resizable/ResizablePanel.vue' },
    { path: 'ResizablePanelGroup.vue', target: 'components/ui/resizable/ResizablePanelGroup.vue' },
    { path: 'index.ts', target: 'components/ui/resizable/index.ts' },
  ],
  dependencies: ['@vueuse/core', 'lucide-vue-next', 'reka-ui'],
  registryDependencies: [],
})

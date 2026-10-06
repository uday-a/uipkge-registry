import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'resizable',
  type: 'registry:ui',
  categories: ['layout'],
  framework: 'angular',
  description:
    'Drag-to-resize panel layout (react-resizable-panels semantics): horizontal or vertical splits with min / max / collapsible constraints, keyboard resizing on the separator and optional autoSaveId persistence. Use for IDE-style sidebars, split views, and any layout the user should be able to reshape.',
  files: [
    { path: 'resizable.component.ts', target: 'components/ui/resizable/resizable.component.ts' },
    { path: 'index.ts', target: 'components/ui/resizable/index.ts' },
  ],
  dependencies: [],
  registryDependencies: [],
})

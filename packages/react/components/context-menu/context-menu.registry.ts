import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'context-menu',
  type: 'registry:ui',
  categories: ['overlay'],
  description:
    'Right-click menu — same primitives as Dropdown Menu but triggered by `contextmenu` events. Drop on any element you want to attach row actions, file-system style operations, or copy/paste menus to.',
  files: [
    { path: 'context-menu.tsx', target: 'components/ui/context-menu/context-menu.tsx' },
    { path: 'index.ts', target: 'components/ui/context-menu/index.ts' },
  ],
  dependencies: ['@radix-ui/react-context-menu', 'lucide-react'],
  registryDependencies: [],
})

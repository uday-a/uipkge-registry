import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'menubar',
  type: 'registry:ui',
  categories: ['navigation'],
  description:
    'Top-level menu bar — File / Edit / View — for desktop-style apps. Same primitives as Dropdown Menu but laid out horizontally and keyboard-navigable across siblings (left/right arrows).',
  files: [
    { path: 'menubar.tsx', target: 'components/ui/menubar/menubar.tsx' },
    { path: 'index.ts', target: 'components/ui/menubar/index.ts' },
  ],
  dependencies: ['@radix-ui/react-menubar', 'lucide-react'],
  registryDependencies: [],
})

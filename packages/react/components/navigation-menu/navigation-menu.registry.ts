import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'navigation-menu',
  type: 'registry:ui',
  categories: ['navigation'],
  description:
    'Top-of-page horizontal navigation with hover/click triggered megamenus. Use for marketing sites and product navs that need rich content — featured links, mini-cards, and submenu columns.',
  files: [
    { path: 'navigation-menu.tsx', target: 'components/ui/navigation-menu/navigation-menu.tsx' },
    { path: 'navigation-menu.variants.ts', target: 'components/ui/navigation-menu/navigation-menu.variants.ts' },
    { path: 'index.ts', target: 'components/ui/navigation-menu/index.ts' },
  ],
  dependencies: ['@radix-ui/react-navigation-menu', 'class-variance-authority', 'lucide-react'],
  registryDependencies: [],
})

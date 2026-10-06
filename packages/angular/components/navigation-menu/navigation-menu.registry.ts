import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'navigation-menu',
  type: 'registry:ui',
  categories: ['navigation'],
  framework: 'angular',
  description:
    'Top-of-page horizontal navigation with hover/click triggered megamenus. Use for marketing sites and product navs that need rich content — featured links, mini-cards, and submenu columns. Radix NavigationMenu behaviour: hover delays, a shared viewport that sizes to the open panel, directional slide motion, and keyboard navigation.',
  files: [
    { path: 'navigation-menu.component.ts', target: 'components/ui/navigation-menu/navigation-menu.component.ts' },
    { path: 'navigation-menu.variants.ts', target: 'components/ui/navigation-menu/navigation-menu.variants.ts' },
    {
      path: 'navigation-menu-content.variants.ts',
      target: 'components/ui/navigation-menu/navigation-menu-content.variants.ts',
    },
    { path: 'index.ts', target: 'components/ui/navigation-menu/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: ['https://uipkge.dev/r/popper.json'],
})

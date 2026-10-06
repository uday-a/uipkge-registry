import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'navigation-menu',
  type: 'registry:ui',
  categories: ['navigation'],
  framework: 'svelte',
  description:
    'Top-of-page horizontal navigation with hover/click triggered megamenus. Use for marketing sites and product navs that need rich content — featured links, mini-cards, and submenu columns.',
  files: [
    { path: 'NavigationMenu.svelte', target: 'components/ui/navigation-menu/NavigationMenu.svelte' },
    { path: 'NavigationMenuContent.svelte', target: 'components/ui/navigation-menu/NavigationMenuContent.svelte' },
    {
      path: 'NavigationMenuContext.ts',
      target: 'components/ui/navigation-menu/NavigationMenuContext.ts',
    },
    {
      path: 'navigation-menu-content.variants.ts',
      target: 'components/ui/navigation-menu/navigation-menu-content.variants.ts',
    },
    { path: 'NavigationMenuIndicator.svelte', target: 'components/ui/navigation-menu/NavigationMenuIndicator.svelte' },
    { path: 'NavigationMenuItem.svelte', target: 'components/ui/navigation-menu/NavigationMenuItem.svelte' },
    { path: 'NavigationMenuLink.svelte', target: 'components/ui/navigation-menu/NavigationMenuLink.svelte' },
    { path: 'NavigationMenuList.svelte', target: 'components/ui/navigation-menu/NavigationMenuList.svelte' },
    { path: 'NavigationMenuTrigger.svelte', target: 'components/ui/navigation-menu/NavigationMenuTrigger.svelte' },
    { path: 'NavigationMenuViewport.svelte', target: 'components/ui/navigation-menu/NavigationMenuViewport.svelte' },
    { path: 'navigation-menu.variants.ts', target: 'components/ui/navigation-menu/navigation-menu.variants.ts' },
    { path: 'index.ts', target: 'components/ui/navigation-menu/index.ts' },
  ],
  dependencies: ['@lucide/svelte', 'class-variance-authority'],
  // Hand-rolled menu state + shared viewport with runes (no bits-ui in the
  // Svelte registry yet); behaviour mirrors the reka-ui backed Vue twin:
  // hover/click triggers, delay + skip-delay, arrows/Escape, viewport and
  // per-item flyout modes.
  registryDependencies: [],
})

export { default as NavigationMenu, type NavigationMenuProps } from './NavigationMenu.svelte'
export { default as NavigationMenuContent, type NavigationMenuContentProps } from './NavigationMenuContent.svelte'
export { default as NavigationMenuIndicator, type NavigationMenuIndicatorProps } from './NavigationMenuIndicator.svelte'
export { default as NavigationMenuItem, type NavigationMenuItemProps } from './NavigationMenuItem.svelte'
export { default as NavigationMenuLink, type NavigationMenuLinkProps } from './NavigationMenuLink.svelte'
export { default as NavigationMenuList, type NavigationMenuListProps } from './NavigationMenuList.svelte'
export { default as NavigationMenuTrigger, type NavigationMenuTriggerProps } from './NavigationMenuTrigger.svelte'
export { default as NavigationMenuViewport, type NavigationMenuViewportProps } from './NavigationMenuViewport.svelte'

// Re-export variant API from the sibling files (kept separate to avoid the
// Component <-> index circular import that broke dev SSR for Card).
export { navigationMenuTriggerStyle } from './navigation-menu.variants'
export { navigationMenuContentVariants } from './navigation-menu-content.variants'

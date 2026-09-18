export { default as NavigationMenu } from './NavigationMenu.vue'
export { default as NavigationMenuContent } from './NavigationMenuContent.vue'
export { default as NavigationMenuIndicator } from './NavigationMenuIndicator.vue'
export { default as NavigationMenuItem } from './NavigationMenuItem.vue'
export { default as NavigationMenuLink } from './NavigationMenuLink.vue'
export { default as NavigationMenuList } from './NavigationMenuList.vue'
export { default as NavigationMenuTrigger } from './NavigationMenuTrigger.vue'
export { default as NavigationMenuViewport } from './NavigationMenuViewport.vue'

// Re-export variant API from the sibling file (kept separate to avoid the
// Component.vue <-> index.ts circular import that broke dev SSR for Card).
export { navigationMenuTriggerStyle } from './navigation-menu.variants'
export { navigationMenuContentVariants } from './navigation-menu-content.variants'

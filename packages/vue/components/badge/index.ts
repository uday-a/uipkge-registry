export { default as Badge } from './Badge.vue'

// Re-export variant API from the sibling file (kept separate to avoid the
// Component.vue <-> index.ts circular import that broke dev SSR for Card).
export { badgeVariants, type BadgeVariants } from './badge.variants'

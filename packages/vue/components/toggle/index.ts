export { default as Toggle } from './Toggle.vue'

// Re-export variant API from the sibling file (kept separate to avoid the
// Component.vue <-> index.ts circular import that broke dev SSR for Card).
export { toggleVariants, type ToggleVariants } from './toggle.variants'

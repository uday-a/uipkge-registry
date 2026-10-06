export { default as Toggle, type ToggleProps } from './Toggle.svelte'

// Re-export variant API from the sibling file (kept separate to avoid the
// Component <-> index.ts circular import that broke dev SSR for Card).
export { toggleVariants, type ToggleVariants } from './toggle.variants'

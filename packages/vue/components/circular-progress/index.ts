export { default as CircularProgress } from './CircularProgress.vue'

// Re-export variant API from the sibling file (kept separate to avoid the
// CircularProgress.vue <-> index.ts circular import that broke dev SSR for Card).
export { circularProgressVariants, type CircularProgressVariants } from './circular-progress.variants'

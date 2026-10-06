export { default as CircularProgress, type CircularProgressProps } from './CircularProgress.svelte'

// Re-export variant API from the sibling file (kept separate to avoid the
// CircularProgress.svelte <-> index.ts circular import that broke dev SSR for Card).
export { circularProgressVariants, type CircularProgressVariants } from './circular-progress.variants'

export { default as ProgressLinear, type ProgressLinearProps } from './ProgressLinear.svelte'

// Re-export variant API from the sibling file (kept separate to avoid the
// ProgressLinear.svelte <-> index.ts circular import that broke dev SSR).
export { progressLinearVariants, type ProgressLinearVariants } from './progress-linear.variants'

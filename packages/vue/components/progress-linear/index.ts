export { default as ProgressLinear } from './ProgressLinear.vue'

// Re-export variant API from the sibling file (kept separate to avoid the
// ProgressLinear.vue <-> index.ts circular import that broke dev SSR).
export { progressLinearVariants, type ProgressLinearVariants } from './progress-linear.variants'

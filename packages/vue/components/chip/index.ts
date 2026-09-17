export { default as Chip } from './Chip.vue'
export { default as ChipGroup } from './ChipGroup.vue'

// Re-export variant API from the sibling file (kept separate to avoid the
// Component.vue <-> index.ts circular import that broke dev SSR for Card).
export { chipVariants, type ChipVariants } from './chip.variants'

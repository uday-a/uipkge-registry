export { default as Chip, type ChipProps } from './Chip.svelte'
export {
  default as ChipGroup,
  type ChipGroupProps,
  type ChipGroupSlotArgs,
  type ChipGroupRenderProps,
} from './ChipGroup.svelte'

// Re-export variant API from the sibling file (kept separate to avoid the
// Chip.svelte <-> index.ts circular import that broke dev SSR for Card).
export { chipVariants, type ChipVariants } from './chip.variants'

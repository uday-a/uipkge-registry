export { default as Alert, type AlertProps } from './Alert.svelte'
export { default as AlertDescription, type AlertDescriptionProps } from './AlertDescription.svelte'
export { default as AlertTitle, type AlertTitleProps } from './AlertTitle.svelte'

// Re-export variant API from the sibling file (kept separate to avoid the
// Alert.svelte <-> index.ts circular import that broke dev SSR for Card).
export { alertVariants, type AlertVariants } from './alert.variants'

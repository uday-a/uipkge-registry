export { default as Alert } from "./Alert.vue";
export { default as AlertDescription } from "./AlertDescription.vue";
export { default as AlertTitle } from "./AlertTitle.vue";

// Re-export variant API from the sibling file (kept separate to avoid the
// Alert.vue <-> index.ts circular import that broke dev SSR for Card).
export { alertVariants, type AlertVariants } from "./alert.variants";

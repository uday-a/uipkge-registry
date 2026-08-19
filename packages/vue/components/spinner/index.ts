export { default as Spinner } from "./Spinner.vue";

// Re-export variant API from the sibling file (kept separate to avoid the
// Component.vue <-> index.ts circular import that broke dev SSR for Card).
export { spinnerVariants, type SpinnerVariants } from "./spinner.variants";

export { default as BackTop } from "./BackTop.vue";

// Re-export variant API from the sibling file (kept separate to avoid the
// BackTop.vue <-> index.ts circular import that broke dev SSR for Card).
export { backTopVariants, type BackTopVariants } from "./back-top.variants";

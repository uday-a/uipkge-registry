export { default as Card } from './Card.vue'
export { default as CardAction } from './CardAction.vue'
export { default as CardContent } from './CardContent.vue'
export { default as CardDescription } from './CardDescription.vue'
export { default as CardFooter } from './CardFooter.vue'
export { default as CardHeader } from './CardHeader.vue'
export { default as CardTitle } from './CardTitle.vue'

// Re-export variant API from the sibling file (kept separate to avoid the
// Card.vue <-> index.ts circular import that broke dev SSR).
export { cardVariants, type CardVariants } from './card.variants'

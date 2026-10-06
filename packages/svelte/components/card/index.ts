export { default as Card, type CardProps } from './Card.svelte'
export { default as CardAction, type CardActionProps } from './CardAction.svelte'
export { default as CardContent, type CardContentProps } from './CardContent.svelte'
export { default as CardDescription, type CardDescriptionProps } from './CardDescription.svelte'
export { default as CardFooter, type CardFooterProps } from './CardFooter.svelte'
export { default as CardHeader, type CardHeaderProps } from './CardHeader.svelte'
export { default as CardTitle, type CardTitleProps } from './CardTitle.svelte'

// Re-export variant API from the sibling file (kept separate to avoid the
// Card.svelte <-> index.ts circular import that broke dev SSR in Vue).
export { cardVariants, type CardVariants } from './card.variants'

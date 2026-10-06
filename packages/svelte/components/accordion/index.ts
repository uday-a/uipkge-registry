export { default as Accordion, type AccordionProps } from './Accordion.svelte'
export { default as AccordionContent, type AccordionContentProps } from './AccordionContent.svelte'
export { default as AccordionHeader, type AccordionHeaderProps } from './AccordionHeader.svelte'
export { default as AccordionItem, type AccordionItemProps } from './AccordionItem.svelte'
export { default as AccordionTrigger, type AccordionTriggerProps } from './AccordionTrigger.svelte'

// Re-export variant API from the sibling file (kept separate to avoid the
// Component.svelte <-> index.ts circular import that broke dev SSR for Card).
export {
  accordionVariants,
  accordionItemVariants,
  accordionTriggerVariants,
  type AccordionVariants,
  type AccordionItemVariants,
  type AccordionTriggerVariants,
} from './accordion.variants'

export { default as Accordion } from "./Accordion.vue";
export { default as AccordionContent } from "./AccordionContent.vue";
export { default as AccordionHeader } from "./AccordionHeader.vue";
export { default as AccordionItem } from "./AccordionItem.vue";
export { default as AccordionTrigger } from "./AccordionTrigger.vue";

// Re-export variant API from the sibling file (kept separate to avoid the
// Component.vue <-> index.ts circular import that broke dev SSR for Card).
export {
  accordionVariants,
  accordionItemVariants,
  accordionTriggerVariants,
  type AccordionVariants,
  type AccordionItemVariants,
  type AccordionTriggerVariants,
} from "./accordion.variants";

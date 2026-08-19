export {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from "./accordion";

// Re-export variant API from the sibling file (kept separate to avoid an
// import cycle and to give consumers a stable `accordionVariants` path).
export {
  accordionVariants,
  accordionItemVariants,
  accordionTriggerVariants,
  type AccordionVariants,
  type AccordionItemVariants,
  type AccordionTriggerVariants,
} from "./accordion.variants";

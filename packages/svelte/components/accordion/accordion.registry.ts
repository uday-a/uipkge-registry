import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'accordion',
  type: 'registry:ui',
  categories: ['disclosure'],
  framework: 'svelte',
  description:
    'Vertically stacked, collapsible panels — one or many open at a time. Use for FAQs, settings groups, and any place where space is tight but content needs to stay browsable. Hand-rolled runes state with WAI-ARIA keyboard support (arrows/Home/End), smooth animation, controlled or uncontrolled value.',
  files: [
    { path: 'Accordion.svelte', target: 'components/ui/accordion/Accordion.svelte' },
    { path: 'AccordionContent.svelte', target: 'components/ui/accordion/AccordionContent.svelte' },
    { path: 'AccordionHeader.svelte', target: 'components/ui/accordion/AccordionHeader.svelte' },
    { path: 'AccordionItem.svelte', target: 'components/ui/accordion/AccordionItem.svelte' },
    { path: 'AccordionTrigger.svelte', target: 'components/ui/accordion/AccordionTrigger.svelte' },
    { path: 'accordion.variants.ts', target: 'components/ui/accordion/accordion.variants.ts' },
    { path: 'context.ts', target: 'components/ui/accordion/context.ts' },
    { path: 'index.ts', target: 'components/ui/accordion/index.ts' },
  ],
  dependencies: ['class-variance-authority', '@lucide/svelte'],
  registryDependencies: [],
})

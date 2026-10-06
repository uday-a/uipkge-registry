import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'accordion',
  type: 'registry:ui',
  categories: ['disclosure'],
  framework: 'angular',
  description:
    'Vertically stacked, collapsible panels — one or many open at a time. Use for FAQs, settings groups, and any place where space is tight but content needs to stay browsable. Radix Accordion behaviour: single / multiple, collapsible, arrow-key navigation between triggers, and a measured --radix-accordion-content-height for the open / close animation.',
  files: [
    { path: 'accordion.component.ts', target: 'components/ui/accordion/accordion.component.ts' },
    { path: 'accordion.variants.ts', target: 'components/ui/accordion/accordion.variants.ts' },
    { path: 'index.ts', target: 'components/ui/accordion/index.ts' },
  ],
  dependencies: ['class-variance-authority'],
  registryDependencies: ['https://uipkge.dev/r/popper.json'],
})

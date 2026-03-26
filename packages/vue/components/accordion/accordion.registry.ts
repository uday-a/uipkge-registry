import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'accordion',
  type: 'registry:ui',
  categories: ['disclosure'],
  framework: 'vue',
  description:
    'Vertically stacked, collapsible panels — one or many open at a time. Use for FAQs, settings groups, and any place where space is tight but content needs to stay browsable. Built on reka-ui with smooth animation and full keyboard support.',
  files: [
    { path: 'Accordion.vue', target: 'components/ui/accordion/Accordion.vue' },
    { path: 'AccordionContent.vue', target: 'components/ui/accordion/AccordionContent.vue' },
    { path: 'AccordionHeader.vue', target: 'components/ui/accordion/AccordionHeader.vue' },
    { path: 'AccordionItem.vue', target: 'components/ui/accordion/AccordionItem.vue' },
    { path: 'AccordionTrigger.vue', target: 'components/ui/accordion/AccordionTrigger.vue' },
    { path: 'accordion.variants.ts', target: 'components/ui/accordion/accordion.variants.ts' },
    { path: 'index.ts', target: 'components/ui/accordion/index.ts' },
  ],
  dependencies: ['@vueuse/core', 'class-variance-authority', 'lucide-vue-next', 'reka-ui'],
  registryDependencies: [],
})

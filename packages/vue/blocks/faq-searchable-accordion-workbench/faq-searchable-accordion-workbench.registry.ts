import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'faq-searchable-accordion-workbench',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Searchable FAQ workbench with real-time query filtering, category switcher, collapsible accordions, and community support links.',
  framework: 'vue',
  files: [
    { path: 'FaqSearchableAccordionWorkbench.vue', target: 'components/blocks/FaqSearchableAccordionWorkbench.vue' },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
  ],
})

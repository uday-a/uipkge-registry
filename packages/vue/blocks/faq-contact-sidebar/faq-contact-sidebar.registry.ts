import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'faq-contact-sidebar',
  title: 'FAQ — With Contact Sidebar',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Accordion of answers beside a sticky support card offering a named contact, response-time expectation, and a link to the docs, for the questions a page cannot pre-empt.',
  framework: 'vue',
  files: [{ path: 'FaqContactSidebar.vue', target: 'components/blocks/FaqContactSidebar.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/accordion.json',
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

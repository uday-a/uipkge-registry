import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'testimonial-logo-quote-row',
  title: 'Testimonial — Logo & Quote Row',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Three-up inline row pairing each customer wordmark with a one-sentence quote and a compact attribution line, for pages that need proof without a full testimonial block.',
  framework: 'vue',
  files: [{ path: 'TestimonialLogoQuoteRow.vue', target: 'components/blocks/TestimonialLogoQuoteRow.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: ['https://uipkge.dev/r/avatar.json', 'https://uipkge.dev/r/separator.json'],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'testimonial-single-featured',
  title: 'Testimonial — Single Featured',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'One large pull quote given the full section: oversized text, attribution with avatar and role, the customer wordmark, and a supporting result metric beside it.',
  framework: 'vue',
  files: [{ path: 'TestimonialSingleFeatured.vue', target: 'components/blocks/TestimonialSingleFeatured.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

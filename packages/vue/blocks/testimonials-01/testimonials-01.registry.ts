import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'testimonials-01',
  title: 'Customer Testimonials',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Interactive customer case study and ROI telemetry workbench with industry filters, verified customer metrics, tech stack tags, and autoplay navigation.',
  framework: 'vue',
  files: [{ path: 'Testimonials01.vue', target: 'components/blocks/Testimonials01.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

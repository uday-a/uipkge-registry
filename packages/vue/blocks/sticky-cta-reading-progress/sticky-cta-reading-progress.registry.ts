import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'sticky-cta-reading-progress',
  title: 'Sticky CTA — Reading Progress',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Sticky bottom bar that doubles as a reading-progress indicator, revealing partway down a long page and reporting how much of it remains.',
  framework: 'vue',
  files: [{ path: 'StickyCtaReadingProgress.vue', target: 'components/blocks/StickyCtaReadingProgress.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

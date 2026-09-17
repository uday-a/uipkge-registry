import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'coming-soon',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Interactive launch and maintenance workbench with high-impact countdown, VIP early access waitlist queue allocator, live launch roadmap progress tracker, and feature sneak-peek previews.',
  framework: 'vue',
  files: [{ path: 'ComingSoon.vue', target: 'components/blocks/ComingSoon.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

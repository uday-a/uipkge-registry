import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'cta-split-panel',
  title: 'CTA — Split Panel',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Two-path closing section splitting self-serve from sales-assisted, each side stating who it suits and what happens next so the choice is not a guess.',
  framework: 'vue',
  files: [{ path: 'CtaSplitPanel.vue', target: 'components/blocks/CtaSplitPanel.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

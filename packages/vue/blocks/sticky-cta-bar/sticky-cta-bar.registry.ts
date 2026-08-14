import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'sticky-cta-bar',
  title: 'Sticky CTA Bar',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Scroll-triggered bottom CTA bar that reveals past a threshold, carrying an offer line, inline social proof, primary + ghost actions, and a dismiss control that stays dismissed for the session.',
  framework: 'vue',
  files: [{ path: 'StickyCtaBar.vue', target: 'components/blocks/StickyCtaBar.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

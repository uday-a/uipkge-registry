import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'exit-intent-offer',
  title: 'Exit Intent — Offer',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Dialog triggered when the pointer leaves toward the browser chrome, offering an extended trial once per session, with a dismissal that is remembered.',
  framework: 'vue',
  files: [{ path: 'ExitIntentOffer.vue', target: 'components/blocks/ExitIntentOffer.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

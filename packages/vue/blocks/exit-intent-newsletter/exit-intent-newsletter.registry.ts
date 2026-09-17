import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'exit-intent-newsletter',
  title: 'Exit Intent — Newsletter',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Exit-intent dialog capturing an email for the monthly notes rather than pushing a discount, with the last issue named so the ask is concrete.',
  framework: 'vue',
  files: [{ path: 'ExitIntentNewsletter.vue', target: 'components/blocks/ExitIntentNewsletter.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

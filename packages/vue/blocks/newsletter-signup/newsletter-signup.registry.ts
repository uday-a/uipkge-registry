import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'newsletter-signup',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Engineering dispatch and release radar workbench with channel tracks (Architecture, Releases, Security), live archive previews, and subscriber metrics.',
  framework: 'vue',
  files: [{ path: 'NewsletterSignup.vue', target: 'components/blocks/NewsletterSignup.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

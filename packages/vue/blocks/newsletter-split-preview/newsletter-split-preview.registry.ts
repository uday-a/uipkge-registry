import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'newsletter-split-preview',
  title: 'Newsletter — Split with Preview',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Signup section pairing the pitch and form with a preview of the last issue — subject line, date, and opening paragraph — so the reader sees what they are subscribing to.',
  framework: 'vue',
  files: [{ path: 'NewsletterSplitPreview.vue', target: 'components/blocks/NewsletterSplitPreview.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

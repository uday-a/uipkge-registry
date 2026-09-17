import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'newsletter-inline-band',
  title: 'Newsletter — Inline Band',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Slim full-width signup band with an inline field, submit button, subscriber count as proof, and a status line that reserves its own row so confirming never shifts the layout.',
  framework: 'vue',
  files: [{ path: 'NewsletterInlineBand.vue', target: 'components/blocks/NewsletterInlineBand.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/input.json',
  ],
})

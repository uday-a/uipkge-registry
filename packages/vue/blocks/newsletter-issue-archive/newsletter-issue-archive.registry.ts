import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'newsletter-issue-archive',
  type: 'registry:block',
  categories: ['media', 'marketing', 'app'],
  description:
    'Substack and Beehiiv style publication archive with issue numbers, read times, subscriber counts, category filtering, search, featured issue spotlight, and subscribe flow.',
  framework: 'vue',
  files: [
    {
      path: 'NewsletterIssueArchive.vue',
      target: 'components/blocks/NewsletterIssueArchive.vue',
    },
  ],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

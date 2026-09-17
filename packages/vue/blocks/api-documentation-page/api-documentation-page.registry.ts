import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'api-documentation-page',
  type: 'registry:block',
  categories: ['devops', 'app'],
  description:
    'Stripe and Mintlify style two-pane API documentation reference page with HTTP method badge, endpoint path, headers, request parameter tables with nested schema hints, response attributes, interactive multi-language code snippets (cURL, Node.js, Python, Go, Ruby), and status response tabs with copy actions.',
  framework: 'vue',
  files: [{ path: 'ApiDocumentationPage.vue', target: 'components/blocks/ApiDocumentationPage.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})

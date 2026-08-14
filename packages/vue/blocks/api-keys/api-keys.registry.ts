import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'api-keys',
  type: 'registry:block',
  categories: ['security', 'dashboard', 'data'],
  description:
    'Developer API-key manager in a SectionCard. Self-contained stateful block with stub keys, reveal/copy/revoke row actions, an empty state, and a create-key dialog.',
  framework: 'vue',
  files: [{ path: 'ApiKeys.vue', target: 'components/blocks/ApiKeys.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/section-card.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/dialog.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/badge.json',
  ],
})

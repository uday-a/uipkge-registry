import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'knowledge-base-hub',
  type: 'registry:block',
  categories: ['media', 'support', 'marketing'],
  description:
    'Self-serve help center and customer documentation hub with hero search, quick topic pills, category cards grid, trending articles, and community support banner.',
  framework: 'vue',
  files: [{ path: 'KnowledgeBaseHub.vue', target: 'components/blocks/KnowledgeBaseHub.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
  ],
})

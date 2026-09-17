import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'use-cases-role-cards',
  title: 'Use Cases — Role Cards',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Grid of role cards, each stating the job to be done, the first week of work, and the metric that role is measured on, so a reader can self-select without a tab interaction.',
  framework: 'vue',
  files: [{ path: 'UseCasesRoleCards.vue', target: 'components/blocks/UseCasesRoleCards.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

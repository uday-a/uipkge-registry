import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'role-matrix',
  type: 'registry:block',
  categories: ['security', 'dashboard', 'data'],
  description:
    'Roles × permissions grid grouped by resource: checkbox cells with tri-state column headers (toggle a whole role), per-resource grant summaries, horizontal scroll for many roles, and a read-only mode. v-model mirrors the full grants map; stub data covers users, billing and content.',
  framework: 'vue',
  files: [{ path: 'RoleMatrix.vue', target: 'components/blocks/RoleMatrix.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/checkbox.json',
    'https://uipkge.dev/r/section-card.json',
    'https://uipkge.dev/r/table.json',
  ],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'employee-org-chart-tree',
  type: 'registry:block',
  categories: ['hr', 'app'],
  description:
    'Interactive organizational hierarchy tree with manager reporting lines, team counts, multi-level expandable branches, department filter pills, employee search, and an employee profile quick info drawer.',
  framework: 'vue',
  files: [{ path: 'EmployeeOrgChartTree.vue', target: 'components/blocks/EmployeeOrgChartTree.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

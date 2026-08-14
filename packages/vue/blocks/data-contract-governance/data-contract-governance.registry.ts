import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'data-contract-governance',
  type: 'registry:block',
  categories: ['devops', 'dashboard', 'app', 'data'],
  description:
    'PayPal and OpenDataContract style Data Contracts specification editor, breaking change validator, and producer/consumer SLA agreements dashboard with YAML inspector, schema field explorer, live breaking change linter, and registered consumer status.',
  framework: 'vue',
  files: [{ path: 'DataContractGovernance.vue', target: 'components/blocks/DataContractGovernance.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})

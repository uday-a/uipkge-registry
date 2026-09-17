import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'use-cases-industry-grid',
  title: 'Use Cases — Industry Grid',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Filterable industry use-case grid: segment chips narrow a six-card grid in place, each card carrying an icon, industry label, outcome headline, proof metric, and a quiet read-more link.',
  framework: 'vue',
  files: [{ path: 'UseCasesIndustryGrid.vue', target: 'components/blocks/UseCasesIndustryGrid.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/toggle-group.json',
  ],
})

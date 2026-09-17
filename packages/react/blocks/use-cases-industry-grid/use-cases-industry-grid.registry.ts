import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'use-cases-industry-grid',
  title: 'Use Cases — Industry Grid',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Filterable industry use-case grid: segment chips narrow a six-card grid in place, each card carrying an icon, industry label, outcome headline, proof metric, and a quiet read-more link.',
  files: [{ path: 'UseCasesIndustryGrid.tsx', target: 'components/blocks/UseCasesIndustryGrid.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/toggle-group.json',
  ],
})

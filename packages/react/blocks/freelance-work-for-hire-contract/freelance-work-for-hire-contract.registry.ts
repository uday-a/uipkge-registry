import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'freelance-work-for-hire-contract',
  type: 'registry:block',
  categories: ['legal', 'finance', 'app', 'contracts'],
  framework: 'react',
  description:
    'Independent contractor Master Services Agreement (MSA) with work-for-hire IP assignment, payment milestones, kill fee clauses, and electronic signature workflow.',
  files: [
    {
      path: 'FreelanceWorkForHireContract.tsx',
      target: 'components/blocks/FreelanceWorkForHireContract.tsx',
    },
  ],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})

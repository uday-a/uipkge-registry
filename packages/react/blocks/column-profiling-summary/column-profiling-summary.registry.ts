import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'column-profiling-summary',
  type: 'registry:block',
  categories: ['devops', 'dashboard', 'analytics', 'data'],
  description:
    'Pandas Profiling and ydata style exploratory data analysis (EDA) column profiling summary with dataset metrics, distribution histograms, quantile box plots, and categorical frequency breakdowns.',
  files: [{ path: 'ColumnProfilingSummary.tsx', target: 'components/blocks/ColumnProfilingSummary.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})

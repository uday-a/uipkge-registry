import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'sql-query-notebook',
  type: 'registry:block',
  categories: ['devops', 'app'],
  description:
    'Hex, Deepnote, and Jupyter style SQL analytical query notebook with documentation cells, executable Snowflake SQL editor with syntax coloring, live tabular results grid, CSV export, and chart visualization.',
  files: [{ path: 'SqlQueryNotebook.tsx', target: 'components/blocks/SqlQueryNotebook.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
    'https://uipkge.dev/r/tabs.json',
  ],
})

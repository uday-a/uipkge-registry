import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'database-schema-viewer',
  type: 'registry:block',
  categories: ['devops', 'app'],
  description:
    'Visual database schema inspector and SQL query previewer with cluster health header, table navigation sidebar with row counts, columns metadata table (data types, nullability, defaults, PK/FK indicators), foreign keys diagram, B-Tree indexes, and syntax-styled DDL preview with copy actions.',
  files: [{ path: 'DatabaseSchemaViewer.tsx', target: 'components/blocks/DatabaseSchemaViewer.tsx' }],
  dependencies: ['lucide-react'],
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

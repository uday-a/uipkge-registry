import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'schema-drift-alert-board',
  type: 'registry:block',
  categories: ['devops', 'dashboard', 'app', 'analytics', 'data'],
  description:
    'Automated data warehouse schema drift and structural anomaly detector with downstream blast radius impact analysis, interactive multi-tier lineage graph, schema mutation contract diffs, and remediation workflows.',
  files: [{ path: 'SchemaDriftAlertBoard.tsx', target: 'components/blocks/SchemaDriftAlertBoard.tsx' }],
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

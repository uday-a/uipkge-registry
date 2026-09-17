import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'cdc-replication-stream',
  type: 'registry:block',
  categories: ['devops', 'app'],
  description:
    'Debezium and Fivetran style Change Data Capture (CDC) replication monitor and binlog sync pipeline with live telemetry metrics, table operation breakdowns, and real-time before/after row diff streaming.',
  files: [{ path: 'CdcReplicationStream.tsx', target: 'components/blocks/CdcReplicationStream.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})

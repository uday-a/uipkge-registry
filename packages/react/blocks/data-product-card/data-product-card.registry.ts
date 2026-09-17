import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'data-product-card',
  type: 'registry:block',
  categories: ['devops', 'app', 'data', 'analytics'],
  description:
    'Data Mesh architectural Data Product Card (DPC) featuring SLA compliance health, multi-modal output ports (Snowflake, Kafka, GraphQL, Parquet S3), domain ownership, consumer counts, and access request triggers.',
  files: [{ path: 'DataProductCard.tsx', target: 'components/blocks/DataProductCard.tsx' }],
  dependencies: ['lucide-react'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

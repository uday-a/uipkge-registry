import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'feature-store-registry',
  type: 'registry:block',
  categories: ['ai', 'app', 'devops'],
  description:
    'Feast and Tecton style machine learning feature store registry with entity definitions, low-latency Redis online cache status, Snowflake batch source lineage, feature schema inspection table, throughput metrics, and Python Feast feature view code generator.',
  files: [{ path: 'FeatureStoreRegistry.tsx', target: 'components/blocks/FeatureStoreRegistry.tsx' }],
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

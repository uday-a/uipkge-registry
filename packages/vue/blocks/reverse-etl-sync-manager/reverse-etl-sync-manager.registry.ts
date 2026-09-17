import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'reverse-etl-sync-manager',
  type: 'registry:block',
  categories: ['devops', 'app', 'analytics', 'data'],
  description:
    'Census and Hightouch style Reverse ETL sync manager and data activation pipeline for synchronizing Snowflake data warehouse marts to SaaS destinations (Salesforce CRM and HubSpot) with live telemetry cards, schema field mapping matrix, and sync run history log.',
  framework: 'vue',
  files: [{ path: 'ReverseEtlSyncManager.vue', target: 'components/blocks/ReverseEtlSyncManager.vue' }],
  dependencies: ['lucide-vue-next'],
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

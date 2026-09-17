import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'integrations-connector-status',
  title: 'Integrations — Connector Status',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'Connector health table listing each integration with its auth method, sync cadence, last successful run, and a status pill, plus a summary band counting healthy and degraded connectors.',
  framework: 'vue',
  files: [{ path: 'IntegrationsConnectorStatus.vue', target: 'components/blocks/IntegrationsConnectorStatus.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})

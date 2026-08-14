import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'audit-event-stream',
  type: 'registry:block',
  categories: ['devops', 'app'],
  description:
    'Real-time live streaming audit log viewer and security telemetry feed with status indicators, stream pause/resume controls, regex and keyword log filtering, severity badges, expandable JSON payload inspectors, and ingestion telemetry stats.',
  framework: 'vue',
  files: [{ path: 'AuditEventStream.vue', target: 'components/blocks/AuditEventStream.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

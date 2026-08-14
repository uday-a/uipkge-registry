import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'triage-queue-dashboard',
  type: 'registry:block',
  categories: ['healthcare', 'app'],
  description:
    'Emergency Department (ED) and Urgent Care patient acuity triage queue and room allocation board: live unit header, 4 ESI overview cards with target wait thresholds, searchable patient queue table with vitals snapshot, assigned room, attending care team, and quick clinical actions.',
  framework: 'vue',
  files: [{ path: 'TriageQueueDashboard.vue', target: 'components/blocks/TriageQueueDashboard.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/avatar.json',
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/dropdown-menu.json',
    'https://uipkge.dev/r/input.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/table.json',
  ],
})

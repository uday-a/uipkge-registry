import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'status-monitoring',
  type: 'registry:block',
  categories: ['devops', 'dashboard', 'analytics'],
  description:
    'Uptime page. Banner derives All systems operational / Degraded performance / Partial outage from the newest day of each service. Per-service rows render a 90-segment day bar (success/warning/destructive/info/muted per status) with hover tooltips and a right-aligned uptime percentage, followed by an incident timeline with severity badges. Pass `services` (name + days array of up/degraded/down/maintenance/none) and `incidents` to replace the stubs.',
  framework: 'vue',
  files: [
    { path: 'StatusMonitoring.vue', target: 'components/blocks/status-monitoring/StatusMonitoring.vue' },
    { path: 'page.vue', target: 'app/pages/status-monitoring-demo.vue' },
  ],
  dependencies: [],
  registryDependencies: ['https://uipkge.dev/r/badge.json', 'https://uipkge.dev/r/section-card.json'],
})

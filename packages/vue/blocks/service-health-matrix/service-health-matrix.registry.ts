import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'service-health-matrix',
  type: 'registry:block',
  categories: ['devops', 'dashboard'],
  description:
    'Statuspage and BetterStack style global region latency & infrastructure health matrix with overall operational status banner, 6-region latency grid with sparklines, 90-day core service uptime bars, and incident history timeline.',
  framework: 'vue',
  files: [{ path: 'ServiceHealthMatrix.vue', target: 'components/blocks/ServiceHealthMatrix.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/separator.json',
  ],
})

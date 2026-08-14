import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'hero-saas-metrics-dashboard',
  type: 'registry:block',
  categories: ['marketing'],
  description:
    'High-impact SaaS hero section with interactive timeframe filtering, live revenue and workload KPIs, and dynamic telemetry area chart.',
  framework: 'vue',
  files: [{ path: 'HeroSaasMetricsDashboard.vue', target: 'components/blocks/HeroSaasMetricsDashboard.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
  ],
})

import { defineRegistryItem } from '../../lib/define-registry'

export default defineRegistryItem({
  name: 'model-token-cost-optimizer',
  type: 'registry:block',
  categories: ['ai', 'analytics', 'dashboard'],
  description:
    'Helicone and Portkey style AI gateway telemetry, semantic caching hit rates, model routing savings, and latency metrics dashboard with token spend analytics, model allocation breakdown, and active cost optimization rules.',
  framework: 'vue',
  files: [{ path: 'ModelTokenCostOptimizer.vue', target: 'components/blocks/ModelTokenCostOptimizer.vue' }],
  dependencies: ['lucide-vue-next'],
  registryDependencies: [
    'https://uipkge.dev/r/badge.json',
    'https://uipkge.dev/r/button.json',
    'https://uipkge.dev/r/card.json',
    'https://uipkge.dev/r/progress.json',
    'https://uipkge.dev/r/select.json',
    'https://uipkge.dev/r/separator.json',
    'https://uipkge.dev/r/switch.json',
    'https://uipkge.dev/r/table.json',
  ],
})
